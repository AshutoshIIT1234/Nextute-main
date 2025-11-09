import Razorpay from 'razorpay';
import crypto from 'crypto';
import prisma from '../db/index.js';
import { sendEmail } from '../utils/emailSender.js';

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order for mentorship booking
export const createMentorshipOrder = async (req, res) => {
  try {
    const { mentorId, mentorName, amount, studentId } = req.body;

    const options = {
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: `mentor_${mentorId}_${Date.now()}`,
      notes: {
        mentorId,
        mentorName,
        studentId,
      },
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message,
    });
  }
};

// Verify Razorpay payment
export const verifyMentorshipPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      mentorId,
      mentorName,
      studentId,
      studentEmail,
      studentName,
      amount,
    } = req.body;

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      // Payment is verified, save booking to database
      const booking = await prisma.mentorshipBooking.create({
        data: {
          mentorId: parseInt(mentorId),
          mentorName,
          studentId,
          studentEmail: studentEmail || '',
          studentName: studentName || '',
          amount: parseFloat(amount),
          paymentId: razorpay_payment_id,
          orderId: razorpay_order_id,
          status: 'confirmed',
          bookingDate: new Date(),
        },
      });

      // Get mentor's Calendly link
      const mentor = await prisma.mentor.findUnique({
        where: { id: parseInt(mentorId) },
        select: { calendlyLink: true },
      });

      const calendlyLink = mentor?.calendlyLink || 'https://calendly.com/nextuteedtech/30min';

      // Send confirmation email with Calendly link
      if (studentEmail && studentName) {
        const emailSubject = `Mentorship Booking Confirmed - ${mentorName}`;
        const emailBody = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background: linear-gradient(135deg, #2D7B67, #1F4C56); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Nextute</h1>
              <p style="color: #E0F2F1; margin: 10px 0 0 0; font-size: 16px;">Mentorship Program</p>
            </div>
            
            <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h2 style="color: #2D7B67; margin-top: 0;">🎉 Booking Confirmed!</h2>
              
              <p style="color: #333; font-size: 16px; line-height: 1.6;">
                Dear ${studentName},
              </p>
              
              <p style="color: #333; font-size: 16px; line-height: 1.6;">
                Your mentorship session with <strong>${mentorName}</strong> has been successfully booked!
              </p>
              
              <div style="background-color: #E8F5E9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2D7B67;">
                <h3 style="color: #2D7B67; margin-top: 0;">Booking Details:</h3>
                <p style="margin: 8px 0; color: #333;"><strong>Mentor:</strong> ${mentorName}</p>
                <p style="margin: 8px 0; color: #333;"><strong>Amount Paid:</strong> ₹${amount}</p>
                <p style="margin: 8px 0; color: #333;"><strong>Payment ID:</strong> ${razorpay_payment_id}</p>
                <p style="margin: 8px 0; color: #333;"><strong>Booking Date:</strong> ${new Date().toLocaleDateString('en-IN')}</p>
              </div>
              
              <div style="background: linear-gradient(135deg, #4CAF50, #2D7B67); padding: 25px; border-radius: 8px; margin: 25px 0; text-align: center;">
                <h3 style="color: white; margin-top: 0; font-size: 20px;">📅 Next Step: Schedule Your Session</h3>
                <p style="color: #E0F2F1; margin: 15px 0; font-size: 15px;">
                  Click the button below to schedule your 30-minute mentorship session with ${mentorName} at your convenient time.
                </p>
                <a href="${calendlyLink}" 
                   style="display: inline-block; background-color: white; color: #2D7B67; padding: 15px 40px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 16px; margin-top: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  Schedule Now on Calendly
                </a>
              </div>
              
              <div style="background-color: #FFF3E0; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #FF9800;">
                <p style="margin: 0; color: #E65100; font-size: 14px;">
                  <strong>⚠️ Important:</strong> Please schedule your session within 7 days to ensure availability.
                </p>
              </div>
              
              <p style="color: #666; font-size: 14px; line-height: 1.6; margin-top: 25px;">
                If you have any questions or need assistance, feel free to reach out to us at 
                <a href="mailto:contact@nextute.com" style="color: #2D7B67; text-decoration: none;">contact@nextute.com</a>
              </p>
              
              <p style="color: #666; font-size: 14px; line-height: 1.6;">
                We're excited to help you on your learning journey!
              </p>
              
              <p style="color: #666; font-size: 14px; margin-top: 25px;">
                Best regards,<br>
                <strong style="color: #2D7B67;">Team Nextute</strong>
              </p>
            </div>
            
            <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
              <p style="margin: 5px 0;">© ${new Date().getFullYear()} Nextute EdTech Pvt. Ltd. All rights reserved.</p>
              <p style="margin: 5px 0;">Patna, Bihar</p>
            </div>
          </div>
        `;

        try {
          await sendEmail(studentEmail, emailSubject, emailBody);
          console.log(`✅ Confirmation email sent to ${studentEmail}`);
        } catch (emailError) {
          console.error('❌ Failed to send confirmation email:', emailError);
          // Don't fail the payment verification if email fails
        }
      }

      res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        booking,
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid signature',
      });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message,
    });
  }
};

// Get all mentors
export const getAllMentors = async (req, res) => {
  try {
    const { filter } = req.query;

    let mentors = await prisma.mentor.findMany({
      select: {
        id: true,
        name: true,
        expertise: true,
        description: true,
        image: true,
        studentsCount: true,
        rating: true,
        isAvailable: true,
        calendlyLink: true,
      },
      where: {
        isAvailable: true,
      },
      orderBy: {
        studentsCount: 'desc',
      },
    });

    // Apply filter if provided
    if (filter && filter !== 'all') {
      if (filter === 'iit') {
        mentors = mentors.filter(m => m.expertise.toLowerCase().includes('iit'));
      } else if (filter === 'neet') {
        mentors = mentors.filter(m => 
          m.expertise.toLowerCase().includes('aiims') || 
          m.expertise.toLowerCase().includes('jipmer') ||
          m.expertise.toLowerCase().includes('afmc') ||
          m.expertise.toLowerCase().includes('mamc') ||
          m.expertise.toLowerCase().includes('kgmu') ||
          m.expertise.toLowerCase().includes('mbbs')
        );
      }
    }

    res.status(200).json({
      success: true,
      mentors,
      count: mentors.length,
    });
  } catch (error) {
    console.error('Error fetching mentors:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch mentors',
      error: error.message,
    });
  }
};

// Get mentor by ID
export const getMentorById = async (req, res) => {
  try {
    const { id } = req.params;

    const mentor = await prisma.mentor.findUnique({
      where: { id: parseInt(id) },
    });

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: 'Mentor not found',
      });
    }

    res.status(200).json({
      success: true,
      mentor,
    });
  } catch (error) {
    console.error('Error fetching mentor:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch mentor',
      error: error.message,
    });
  }
};
