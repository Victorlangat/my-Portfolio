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

// Projects data file
const projectsFile = path.join(__dirname, 'data', 'projects.json');

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Initialize projects file if it doesn't exist
if (!fs.existsSync(projectsFile)) {
  fs.writeFileSync(projectsFile, JSON.stringify([]));
}

// Helper functions for projects
const readProjects = () => {
  try {
    const data = fs.readFileSync(projectsFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading projects:', error);
    return [];
  }
};

const writeProjects = (projects) => {
  try {
    fs.writeFileSync(projectsFile, JSON.stringify(projects, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing projects:', error);
    return false;
  }
};

// Email configuration
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

// Projects API Routes
app.get('/api/projects', (req, res) => {
  try {
    const projects = readProjects();
    res.json({
      success: true,
      projects: projects
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch projects'
    });
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

    const projects = readProjects();
    const newProject = {
      id: Date.now().toString(),
      title,
      description,
      image,
      liveLink: liveLink || '',
      githubLink: githubLink || '',
      caseStudy: caseStudy || '',
      createdAt: new Date().toISOString()
    };

    projects.push(newProject);
    
    if (writeProjects(projects)) {
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
    
    const projects = readProjects();
    const projectIndex = projects.findIndex(p => p.id === id);
    
    if (projectIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    projects[projectIndex] = {
      ...projects[projectIndex],
      title,
      description,
      image,
      liveLink: liveLink || '',
      githubLink: githubLink || '',
      caseStudy: caseStudy || '',
      updatedAt: new Date().toISOString()
    };

    if (writeProjects(projects)) {
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
    const projects = readProjects();
    const filteredProjects = projects.filter(p => p.id !== id);
    
    if (projects.length === filteredProjects.length) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    if (writeProjects(filteredProjects)) {
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

// Contact endpoint
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

// Test endpoints
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
    environment: process.env.NODE_ENV || 'development',
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
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📧 Email Test: http://localhost:${PORT}/api/email-test`);
  console.log(`📁 Projects API: http://localhost:${PORT}/api/projects`);
});