import nodemailer from 'nodemailer';
import prisma from "../db/index.js";

// Configure your email transporter
const transporter = nodemailer.createTransport({
  // Configure your email service
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Send invoice email
export async function sendInvoiceEmail(req, res) {
  try {
    const { paymentId, planName, planType, amount, date, email, userType } = req.body;
    
    // Get user details from database
    const user = userType === 'student' 
      ? await prisma.student.findUnique({ where: { email } })
      : await prisma.institute.findUnique({ where: { email } });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Create email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Nextute Payment Receipt',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://yourwebsite.com/logo.png" alt="Nextute Logo" style="max-width: 150px;">
            <h2 style="color: #2D7A67;">Payment Receipt</h2>
          </div>
          
          <div style="margin-bottom: 20px;">
            <p>Dear ${user.name},</p>
            <p>Thank you for your payment. Here are your transaction details:</p>
          </div>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <p><strong>Payment ID:</strong> ${paymentId}</p>
            <p><strong>Plan:</strong> ${planName} (${planType})</p>
            <p><strong>Amount:</strong> ₹${amount}</p>
            <p><strong>Date:</strong> ${date}</p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #666;">
            <p>If you have any questions, please contact our support team.</p>
            <p>&copy; ${new Date().getFullYear()} Nextute. All rights reserved.</p>
          </div>
        </div>
      `,
    };
    
    // Send email
    await transporter.sendMail(mailOptions);
    
    // Save invoice to database
    await prisma.payment.create({
      data: {
        paymentId,
        amount,
        planName,
        planType,
        userId: user.id,
        userType,
      },
    });
    
    res.status(200).json({ message: 'Invoice email sent successfully' });
  } catch (error) {
    console.error('Error sending invoice email:', error);
    res.status(500).json({ message: 'Error sending invoice email', error: error.message });
  }
};

// Update user subscription
export async function updateUserSubscription (req, res) {
  try {
    const { planId, planName, billingCycle, paymentId, amount, userId, userType } = req.body;
    
    if (userType === 'student') {
      await prisma.student.update({
        where: { id: userId },
        data: {
          subscription: {
            planId,
            planName,
            billingCycle,
            startDate: new Date(),
            endDate: billingCycle === 'monthly' 
              ? new Date(new Date().setMonth(new Date().getMonth() + 1))
              : new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            status: 'active',
          },
        },
      });
    } else if (userType === 'institute') {
      // Similar update for institute
    }
    
    res.status(200).json({ message: 'Subscription updated successfully' });
  } catch (error) {
    console.error('Error updating subscription:', error);
    res.status(500).json({ message: 'Error updating subscription', error: error.message });
  }
};