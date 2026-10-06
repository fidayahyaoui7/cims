const nodemailer = require('nodemailer');

// Create a test account if in development
let transporter;

if (process.env.NODE_ENV === 'production') {
  // Production email configuration
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
} else {
  // Development email configuration (ethereal.email)
  transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: process.env.ETHEREAL_EMAIL || 'test@example.com',
      pass: process.env.ETHEREAL_PASSWORD || 'test123',
    },
  });
}

/**
 * Send verification email to user
 * @param {string} to - Recipient email address
 * @param {string} token - Verification token
 */
async function sendVerificationEmail(to, token) {
  const verificationUrl = `${process.env.APP_URL || 'http://localhost:3000'}/verify-email?token=${token}`;
  
  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME || 'Medical App'}" <${process.env.EMAIL_FROM || 'noreply@medicalapp.com'}>`,
    to,
    subject: 'Verify Your Email Address',
    html: `
      <h2>Welcome to Medical App!</h2>
      <p>Thank you for registering. Please verify your email address by clicking the link below:</p>
      <p>
        <a href="${verificationUrl}" style="
          display: inline-block;
          padding: 10px 20px;
          background-color: #4CAF50;
          color: white;
          text-decoration: none;
          border-radius: 4px;
          margin: 10px 0;
        ">
          Verify Email Address
        </a>
      </p>
      <p>Or copy and paste this link into your browser:</p>
      <p>${verificationUrl}</p>
      <p>This link will expire in 24 hours.</p>
      <p>If you didn't create an account, you can safely ignore this email.</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    
    // In development, log the preview URL
    if (process.env.NODE_ENV !== 'production') {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
    
    return info;
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
}

/**
 * Send password reset email
 * @param {string} to - Recipient email address
 * @param {string} token - Password reset token
 */
async function sendPasswordResetEmail(to, token) {
  const resetUrl = `${process.env.APP_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
  
  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME || 'Medical App'}" <${process.env.EMAIL_FROM || 'noreply@medicalapp.com'}>`,
    to,
    subject: 'Password Reset Request',
    html: `
      <h2>Reset Your Password</h2>
      <p>You requested to reset your password. Click the button below to set a new password:</p>
      <p>
        <a href="${resetUrl}" style="
          display: inline-block;
          padding: 10px 20px;
          background-color: #2196F3;
          color: white;
          text-decoration: none;
          border-radius: 4px;
          margin: 10px 0;
        ">
          Reset Password
        </a>
      </p>
      <p>Or copy and paste this link into your browser:</p>
      <p>${resetUrl}</p>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request a password reset, you can safely ignore this email.</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    
    // In development, log the preview URL
    if (process.env.NODE_ENV !== 'production') {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
    
    return info;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
}

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
};
