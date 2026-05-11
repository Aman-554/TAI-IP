import nodemailer from 'nodemailer';

const createTransporter = () =>
  nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_PORT === '465',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

/**
 * Send a password reset email with a tokenised link.
 */
export const sendResetPasswordEmail = async (toEmail, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"QuizVerse 🎓" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Reset your QuizVerse password',
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:auto;padding:32px;background:#1a1a2e;color:#fff;border-radius:12px">
        <h2 style="color:#a855f7">🔐 Password Reset Request</h2>
        <p>You requested a password reset. Click the button below to set a new password. The link expires in <strong>10 minutes</strong>.</p>
        <a href="${resetUrl}" style="display:inline-block;margin:24px 0;padding:14px 28px;background:linear-gradient(to right,#7c3aed,#db2777);color:#fff;border-radius:8px;text-decoration:none;font-weight:bold">
          Reset Password
        </a>
        <p style="color:#aaa;font-size:13px">If you didn't request this, you can safely ignore this email.</p>
        <hr style="border-color:#333;margin:24px 0"/>
        <p style="color:#666;font-size:12px">QuizVerse — Test your knowledge every day</p>
      </div>
    `,
  });
};

/**
 * Send a welcome email after successful registration.
 */
export const sendWelcomeEmail = async (toEmail, username) => {
  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"QuizVerse 🎓" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `Welcome to QuizVerse, ${username}! 🎉`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:auto;padding:32px;background:#1a1a2e;color:#fff;border-radius:12px">
        <h2 style="color:#a855f7">Welcome aboard, ${username}! ⚡</h2>
        <p>You're now part of QuizVerse — the ultimate knowledge challenge platform.</p>
        <a href="${process.env.FRONTEND_URL}/dashboard" style="display:inline-block;margin:24px 0;padding:14px 28px;background:linear-gradient(to right,#7c3aed,#db2777);color:#fff;border-radius:8px;text-decoration:none;font-weight:bold">
          Start Quizzing →
        </a>
        <p style="color:#666;font-size:12px">QuizVerse — Test your knowledge every day</p>
      </div>
    `,
  });
};
