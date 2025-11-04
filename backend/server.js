const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Constants
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Email Configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

const transporter = createTransporter();

// Email Template
const createEmailTemplate = (name, email, subject, message) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0ea5e9;">New Contact Form Submission</h2>
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px;">
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <div style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #0ea5e9;">
          ${message.replace(/\n/g, '<br>')}
        </div>
      </div>
      <p style="color: #64748b; font-size: 12px; margin-top: 20px;">
        This message was sent from your portfolio website contact form.
      </p>
    </div>
  `;
};

// Validation Middleware
const validateContactForm = (req, res, next) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ 
      error: 'All fields are required' 
    });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ 
      error: 'Please provide a valid email address' 
    });
  }

  next();
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Routes
app.post('/api/contact', validateContactForm, async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `Portfolio Contact: ${subject}`,
      html: createEmailTemplate(name, email, subject, message)
    };

    await transporter.sendMail(mailOptions);

    console.log('Contact form submission received:', { 
      name, 
      email, 
      subject: subject.substring(0, 50) 
    });

    res.status(200).json({ 
      success: true,
      message: 'Email sent successfully! I will get back to you soon.' 
    });

  } catch (error) {
    console.error('Email sending error:', error);
    
    res.status(500).json({ 
      success: false,
      error: 'Failed to send email. Please try again later.' 
    });
  }
});

app.get('/api/email-test', async (req, res) => {
  try {
    await transporter.verify();
    
    res.json({ 
      success: true,
      status: 'Email service is configured correctly',
      service: 'Gmail SMTP'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: `Email configuration error: ${error.message}` 
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ 
    success: true,
    status: 'Server is healthy',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    service: 'Portfolio Backend API'
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Start server
const startServer = () => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running in ${NODE_ENV} mode on port ${PORT}`);
    console.log(`📍 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`📧 Email Test: http://localhost:${PORT}/api/email-test`);
    
    if (NODE_ENV === 'development') {
      console.log(`🔗 Contact Endpoint: http://localhost:${PORT}/api/contact`);
    }
  });
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Initialize server
startServer();