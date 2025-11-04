import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    liveLink: '',
    githubLink: '',
    caseStudy: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('adminAuthenticated');
    if (!isAuthenticated) {
      navigate('/admin');
      return;
    }

    // Load projects
    const savedProjects = JSON.parse(localStorage.getItem('portfolioProjects')) || [];
    setProjects(savedProjects);
  }, [navigate]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newProject = {
      id: editingProject ? editingProject.id : Date.now(),
      ...formData
    };

    let updatedProjects;
    if (editingProject) {
      updatedProjects = projects.map(project =>
        project.id === editingProject.id ? newProject : project
      );
    } else {
      updatedProjects = [...projects, newProject];
    }

    setProjects(updatedProjects);
    localStorage.setItem('portfolioProjects', JSON.stringify(updatedProjects));
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image: '',
      liveLink: '',
      githubLink: '',
      caseStudy: ''
    });
    setEditingProject(null);
    setShowForm(false);
  };

  const editProject = (project) => {
    setFormData(project);
    setEditingProject(project);
    setShowForm(true);
  };

  const deleteProject = (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      const updatedProjects = projects.filter(project => project.id !== projectId);
      setProjects(updatedProjects);
      localStorage.setItem('portfolioProjects', JSON.stringify(updatedProjects));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    navigate('/admin');
  };

  return (
    <div className="admin-dashboard">
      <div className="container">
        <div className="admin-header">
          <div>
            <h1>Portfolio Admin Dashboard</h1>
            <p className="admin-subtitle">Manage your portfolio projects</p>
          </div>
          <div className="admin-actions">
            <button 
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              Add New Project
            </button>
            <button 
              className="btn btn-outline"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>

        {showForm && (
          <div className="project-form-overlay">
            <div className="project-form">
              <div className="form-header">
                <h2>{editingProject ? 'Edit Project' : 'Add New Project'}</h2>
                <button className="close-btn" onClick={resetForm}>×</button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Project Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Image URL *</label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Live Demo URL</label>
                  <input
                    type="url"
                    name="liveLink"
                    value={formData.liveLink}
                    onChange={handleInputChange}
                    placeholder="https://your-project.com"
                  />
                </div>

                <div className="form-group">
                  <label>GitHub Repository URL</label>
                  <input
                    type="url"
                    name="githubLink"
                    value={formData.githubLink}
                    onChange={handleInputChange}
                    placeholder="https://github.com/yourusername/project"
                  />
                </div>

                <div className="form-group">
                  <label>Case Study URL</label>
                  <input
                    type="url"
                    name="caseStudy"
                    value={formData.caseStudy}
                    onChange={handleInputChange}
                    placeholder="https://your-blog.com/case-study"
                  />
                </div>

                <div className="form-actions">
                  <button type="button" className="btn btn-outline" onClick={resetForm}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingProject ? 'Update Project' : 'Add Project'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="projects-list">
          <div className="projects-header">
            <h3>Current Projects ({projects.length})</h3>
            <p>Projects will appear on your main portfolio page</p>
          </div>
          {projects.length === 0 ? (
            <div className="no-projects">
              <p>No projects added yet. Click "Add New Project" to get started!</p>
            </div>
          ) : (
            <div className="projects-grid">
              {projects.map(project => (
                <div key={project.id} className="project-card">
                  <div className="project-card-image">
                    <img src={project.image} alt={project.title} />
                  </div>
                  <div className="project-card-content">
                    <h4>{project.title}</h4>
                    <p>{project.description}</p>
                    <div className="project-card-actions">
                      <button 
                        className="btn-edit"
                        onClick={() => editProject(project)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn-delete"
                        onClick={() => deleteProject(project.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;