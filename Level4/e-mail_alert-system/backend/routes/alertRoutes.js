const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const twilio = require('twilio');

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Configure Nodemailer transporter (Gmail example)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// POST: /api/send-alert
router.post('/send-alert', async (req, res) => {
  try {
    // Extract form data from request body
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        error: 'All fields (name, email, subject, message) are required',
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address',
      });
    }

    // 1. SEND EMAIL using Nodemailer
    const emailContent = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
      <hr>
      <p><small>Sent from Email Alert System</small></p>
    `;

    const mailOptions = {
      from: `"Contact Form" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `📧 New Contact: ${subject}`,
      html: emailContent,
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully');

    // 2. SEND WHATSAPP ALERT using Twilio
    const whatsappMessage = `🔔 *New Email Received!*\n\n👤 *Name:* ${name}\n📧 *Email:* ${email}\n📌 *Subject:* ${subject}\n💬 *Message:* ${message.substring(0, 100)}${message.length > 100 ? '...' : ''}`;

    await twilioClient.messages.create({
      body: whatsappMessage,
      from: process.env.TWILIO_WHATSAPP_FROM,
      to: process.env.TWILIO_WHATSAPP_TO,
    });
    console.log('✅ WhatsApp notification sent successfully');

    // Send success response back to frontend
    res.status(200).json({
      success: true,
      message: 'Email sent and WhatsApp notification delivered!',
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    // Send error response
    res.status(500).json({
      success: false,
      error: 'Failed to send alerts. Please try again later.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

module.exports = router;