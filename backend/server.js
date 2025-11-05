const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Data directory setup
const dataDir = path.join(__dirname, 'data');
const projectsFile = path.join(dataDir, 'projects.json');
const contactsFile = path.join(dataDir, 'contacts.json');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Initialize data files
if (!fs.existsSync(projectsFile)) {
  fs.writeFileSync(projectsFile, JSON.stringify([]));
}
if (!fs.existsSync(contactsFile)) {
  fs.writeFileSync(contactsFile, JSON.stringify([]));
}

// Helper functions
const readJSONFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
    return [];
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return [];
  }
};

const writeJSONFile = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
    return false;
  }
};

// Email configuration
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('📧 Email credentials not found. Using console logging mode.');
    return {
      sendMail: (mailOptions) => {
        console.log('📨 EMAIL WOULD BE SENT:');
        console.log('To:', mailOptions.to);
        console.log('Subject:', mailOptions.subject);
        console.log('From:', mailOptions.from);
        console.log('Message:', mailOptions.html);
        console.log('---');
        return Promise.resolve({
          messageId: 'console-' + Date.now(),
          response: 'Email logged to console'
        });
      },
      verify: () => Promise.resolve(true)
    };
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

const transporter = createTransporter();

// Email template
const createEmailTemplate = (name, email, subject, message) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; border-radius: 10px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #9fa91f, #b3d465); color: white; padding: 30px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">🎯 New Portfolio Message</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">From your portfolio website</p>
      </div>
      
      <div style="padding: 30px;">
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #9fa91f;">
          <p style="margin: 5px 0;"><strong>👤 Name:</strong> ${name}</p>
          <p style="margin: 5px 0;"><strong>📧 Email:</strong> <a href="mailto:${email}" style="color: #9fa91f;">${email}</a></p>
          <p style="margin: 5px 0;"><strong>📝 Subject:</strong> ${subject}</p>
          <p style="margin: 5px 0;"><strong>🕒 Time:</strong> ${new Date().toLocaleString()}</p>
        </div>
        
        <div style="background: white; padding: 25px; border-radius: 8px; border: 1px solid #e2e8f0;">
          <h3 style="color: #9fa91f; margin-top: 0;">Message:</h3>
          <div style="white-space: pre-line; line-height: 1.6; color: #374151;">${message}</div>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="mailto:${email}" style="background: #9fa91f; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
            ✉️ Reply to ${name}
          </a>
        </div>
      </div>
      
      <div style="text-align: center; padding: 20px; color: #64748b; font-size: 12px; border-top: 1px solid #e2e8f0;">
        <p>Sent from your portfolio contact form • ${new Date().getFullYear()}</p>
      </div>
    </div>
  `;
};

// Validation
const validateContactForm = (req, res, next) => {
  const { name, email, subject, message } = req.body;

  if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
    return res.status(400).json({ 
      success: false,
      error: 'All fields are required' 
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      success: false,
      error: 'Please provide a valid email address' 
    });
  }

  if (message.length > 2000) {
    return res.status(400).json({
      success: false,
      error: 'Message is too long. Please keep it under 2000 characters.'
    });
  }

  next();
};

// Contact API
app.post('/api/contact', validateContactForm, async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Save contact to file
    const contactData = {
      id: Date.now(),
      name,
      email,
      subject,
      message: message.substring(0, 2000),
      timestamp: new Date().toISOString(),
      ip: req.ip || req.connection.remoteAddress
    };

    const contacts = readJSONFile(contactsFile);
    contacts.push(contactData);
    writeJSONFile(contactsFile, contacts);

    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USER || 'portfolio@yoursite.com',
      to: process.env.EMAIL_USER || 'your-email@example.com',
      subject: `📧 Portfolio: ${subject}`,
      html: createEmailTemplate(name, email, subject, message),
      replyTo: email
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('✅ Contact received:', { name, email, subject });

    res.json({ 
      success: true,
      message: 'Thank you! Your message has been sent successfully. I will get back to you soon.',
      messageId: info.messageId
    });

  } catch (error) {
    console.error('❌ Contact error:', error);
    res.json({ 
      success: true,
      message: 'Thank you! Your message has been received. I will get back to you soon.',
      note: 'Message saved (email service temporarily unavailable)'
    });
  }
});

// Projects API
app.get('/api/projects', (req, res) => {
  try {
    const projects = readJSONFile(projectsFile);
    res.json({ success: true, projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch projects' });
  }
});

app.post('/api/projects', (req, res) => {
  try {
    const { title, description, image, liveLink, githubLink, caseStudy } = req.body;
    
    if (!title || !description || !image) {
      return res.status(400).json({
        success: false,
        error: 'Title, description, and image are required'
      });
    }

    const projects = readJSONFile(projectsFile);
    const newProject = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      image: image.trim(),
      liveLink: (liveLink || '').trim(),
      githubLink: (githubLink || '').trim(),
      caseStudy: (caseStudy || '').trim(),
      createdAt: new Date().toISOString()
    };

    projects.push(newProject);
    
    if (writeJSONFile(projectsFile, projects)) {
      res.status(201).json({
        success: true,
        project: newProject,
        message: 'Project created successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to save project'
      });
    }
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create project'
    });
  }
});

app.put('/api/projects/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, image, liveLink, githubLink, caseStudy } = req.body;
    
    const projects = readJSONFile(projectsFile);
    const projectIndex = projects.findIndex(p => p.id === id);
    
    if (projectIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    projects[projectIndex] = {
      ...projects[projectIndex],
      title: title.trim(),
      description: description.trim(),
      image: image.trim(),
      liveLink: (liveLink || '').trim(),
      githubLink: (githubLink || '').trim(),
      caseStudy: (caseStudy || '').trim(),
      updatedAt: new Date().toISOString()
    };

    if (writeJSONFile(projectsFile, projects)) {
      res.json({
        success: true,
        project: projects[projectIndex],
        message: 'Project updated successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to update project'
      });
    }
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update project'
    });
  }
});

app.delete('/api/projects/:id', (req, res) => {
  try {
    const { id } = req.params;
    const projects = readJSONFile(projectsFile);
    const filteredProjects = projects.filter(p => p.id !== id);
    
    if (projects.length === filteredProjects.length) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    if (writeJSONFile(projectsFile, filteredProjects)) {
      res.json({
        success: true,
        message: 'Project deleted successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to delete project'
      });
    }
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete project'
    });
  }
});

// Contacts API (for admin)
app.get('/api/contacts', (req, res) => {
  try {
    const contacts = readJSONFile(contactsFile);
    res.json({
      success: true,
      contacts: contacts.reverse()
    });
  } catch (error) {
    console.error('Error reading contacts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch contacts'
    });
  }
});

// Test endpoints
app.get('/api/email-test', async (req, res) => {
  try {
    const hasCredentials = !!(process.env.EMAIL_USER && process.env.EMAIL_PASS);
    
    if (!hasCredentials) {
      return res.json({
        success: true,
        status: 'Console Mode',
        message: 'Email credentials not configured. Messages will be logged to console.',
        configured: false
      });
    }

    await transporter.verify();
    
    res.json({ 
      success: true,
      status: 'Email service is configured correctly',
      service: 'Gmail SMTP',
      configured: true
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: `Email configuration error: ${error.message}`,
      configured: false
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ 
    success: true,
    status: 'Server is healthy',
    timestamp: new Date().toISOString(),
    services: {
      email: !!(process.env.EMAIL_USER && process.env.EMAIL_PASS),
      projects: true,
      contacts: true
    }
  });
});

// Error handling
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📧 Email Test: http://localhost:${PORT}/api/email-test`);
  
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('⚠️  Email credentials not configured');
    console.log('📝 Messages will be logged to console instead');
  } else {
    console.log('✅ Email service configured');
  }
});