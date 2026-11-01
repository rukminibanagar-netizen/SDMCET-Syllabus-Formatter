const nodemailer = require('nodemailer');

function createTransporter() {
  const user = process.env.ADMIN_EMAIL || 'rukminibanagar@gmail.com';
  const pass = process.env.ADMIN_EMAIL_PASS || 'sdmcetAdmin2014';

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user,
      pass,
    },
  });
}

async function sendApprovalEmail(user) {
  const adminEmail = process.env.ADMIN_EMAIL || 'rukminibanagar@gmail.com';
  const loginUrl = process.env.CLIENT_LOGIN_URL || 'http://localhost:5173/login';

  const transporter = createTransporter();

  const mailOptions = {
    from: `"SDMCET Syllabus Formatter Portal" <${adminEmail}>`,
    to: user.email,
    subject: 'Account Approved - SDMCET Syllabus Formatter Portal',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; color: #1e293b;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #ea580c; font-size: 20px; font-weight: bold; margin: 0;">SDM College of Engineering & Technology, Dharwad</h1>
          <p style="color: #64748b; font-size: 13px; margin: 4px 0 0 0;">Autonomous Curriculum Engineering Portal</p>
        </div>
        <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #065f46; font-size: 16px; margin: 0 0 6px 0;">Account Approved</h2>
          <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #1e293b;">Dear <strong>${user.name}</strong>, your faculty account has been reviewed and <strong>approved</strong> by the administrator.</p>
        </div>
        <p style="font-size: 14px; line-height: 1.6; color: #334155;">
          You can now log in to the portal using your registered institutional email: <strong>${user.email}</strong>.
        </p>
        ${user.department ? `<p style="font-size: 13px; color: #64748b;">Department: <strong>${user.department}</strong></p>` : ''}
        <div style="text-align: center; margin: 28px 0;">
          <a href="${loginUrl}" style="background-color: #ea580c; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block;">Log In to Portal</a>
        </div>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0;">
          This is an automated notification from SDMCET Syllabus Formatter Portal.<br/>
          If you have questions, contact the administrator at <a href="mailto:${adminEmail}" style="color: #ea580c;">${adminEmail}</a>.
        </p>
      </div>
    `,
    text: `Dear ${user.name},\n\nYour faculty account for the SDMCET Syllabus Formatter Portal has been approved by the administrator.\n\nYou can now log in at ${loginUrl} using your email (${user.email}).\n\nSDM College of Engineering & Technology, Dharwad`,
  };

  return await transporter.sendMail(mailOptions);
}

module.exports = { sendApprovalEmail };
