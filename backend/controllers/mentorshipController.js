import Razorpay from 'razorpay';
import crypto from 'crypto';
import prisma from '../db/index.js';

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
          amount: parseFloat(amount),
          paymentId: razorpay_payment_id,
          orderId: razorpay_order_id,
          status: 'confirmed',
          bookingDate: new Date(),
        },
      });

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
