import { sendEmail } from '../utils/emailSender.js';

export const submitCareerApplication = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      institution,
      course,
      year,
      expertise,
      linkedin,
      coverLetter
    } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !institution || !course || !year || !expertise || !coverLetter) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be filled'
      });
    }

    // Email to admin
    const adminEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
          New Mentor Application Received
        </h2>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1f2937; margin-top: 0;">Applicant Information</h3>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4b5563;">Name:</td>
              <td style="padding: 8px 0;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4b5563;">Email:</td>
              <td style="padding: 8px 0;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4b5563;">Phone:</td>
              <td style="padding: 8px 0;">${phone}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4b5563;">Institution:</td>
              <td style="padding: 8px 0;">${institution}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4b5563;">Course/Branch:</td>
              <td style="padding: 8px 0;">${course}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4b5563;">Current Year:</td>
              <td style="padding: 8px 0;">${year}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4b5563;">Subject Expertise:</td>
              <td style="padding: 8px 0;">${expertise}</td>
            </tr>
            ${linkedin ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4b5563;">LinkedIn:</td>
              <td style="padding: 8px 0;"><a href="${linkedin}" style="color: #2563eb;">${linkedin}</a></td>
            </tr>
            ` : ''}
          </table>
        </div>

        <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1f2937; margin-top: 0;">Cover Letter</h3>
          <p style="color: #4b5563; line-height: 1.6; white-space: pre-wrap;">${coverLetter}</p>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
          <p>This application was submitted through the Nextute Careers page.</p>
          <p>Please review and contact the applicant at <a href="mailto:${email}" style="color: #2563eb;">${email}</a></p>
        </div>
      </div>
    `;

    // Email to applicant (confirmation)
    const applicantEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
          Application Received - Nextute Mentor Program
        </h2>
        
        <p style="color: #4b5563; line-height: 1.6;">Dear ${name},</p>
        
        <p style="color: #4b5563; line-height: 1.6;">
          Thank you for applying to become a mentor at Nextute! We have received your application and our team will review it shortly.
        </p>

        <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #22c55e;">
          <h3 style="color: #166534; margin-top: 0;">✓ Application Summary</h3>
          <ul style="color: #4b5563; line-height: 1.8;">
            <li><strong>Institution:</strong> ${institution}</li>
            <li><strong>Course:</strong> ${course}</li>
            <li><strong>Year:</strong> ${year}</li>
            <li><strong>Expertise:</strong> ${expertise}</li>
          </ul>
        </div>

        <p style="color: #4b5563; line-height: 1.6;">
          We typically review applications within 3-5 business days. If your profile matches our requirements, 
          we'll reach out to you for the next steps.
        </p>

        <p style="color: #4b5563; line-height: 1.6;">
          If you have any questions, feel free to reply to this email.
        </p>

        <p style="color: #4b5563; line-height: 1.6;">
          Best regards,<br>
          <strong>The Nextute Team</strong>
        </p>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; text-align: center;">
          <p>Nextute EdTech Pvt. Ltd. | Patna, Bihar</p>
          <p>Email: contact@nextute.com</p>
        </div>
      </div>
    `;

    // Send email to admin
    await sendEmail({
      to: process.env.EMAIL_USER || 'nextuteedtech@gmail.com',
      subject: `New Mentor Application - ${name} (${institution})`,
      html: adminEmailContent
    });

    // Send confirmation email to applicant
    await sendEmail({
      to: email,
      subject: 'Application Received - Nextute Mentor Program',
      html: applicantEmailContent
    });

    res.status(200).json({
      success: true,
      message: 'Application submitted successfully! Check your email for confirmation.'
    });

  } catch (error) {
    console.error('Error submitting career application:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit application. Please try again later.'
    });
  }
};
