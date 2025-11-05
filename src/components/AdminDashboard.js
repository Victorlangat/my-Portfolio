import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [loading, setLoading] = useState(false);
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
    const isAuthenticated = localStorage.getItem('adminAuthenticated');
    if (!isAuthenticated) {
      navigate('/admin');
      return;
    }
    fetchProjects();
  }, [navigate]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/projects');
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setProjects(data.projects);
        }
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      // Fallback to localStorage
      const localProjects = JSON.parse(localStorage.getItem('portfolioProjects')) || [];
      setProjects(localProjects);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingProject 
        ? `http://localhost:5000/api/projects/${editingProject.id}`
        : 'http://localhost:5000/api/projects';
      
      const method = editingProject ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        await fetchProjects(); // Refresh the projects list
        resetForm();
        alert(editingProject ? 'Project updated successfully!' : 'Project added successfully!');
      } else {
        alert(result.error || 'Failed to save project');
      }
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Failed to save project. Please try again.');
      
      // Fallback to localStorage
      const newProject = {
        id: editingProject ? editingProject.id : Date.now().toString(),
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
      alert('Project saved locally (backend unavailable)');
    } finally {
      setLoading(false);
    }
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

  const deleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (response.ok && result.success) {
        await fetchProjects(); // Refresh the projects list
        alert('Project deleted successfully!');
      } else {
        alert(result.error || 'Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      
      // Fallback to localStorage
      const updatedProjects = projects.filter(project => project.id !== projectId);
      setProjects(updatedProjects);
      localStorage.setItem('portfolioProjects', JSON.stringify(updatedProjects));
      alert('Project deleted locally (backend unavailable)');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    navigate('/'); // Redirect to homepage
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
              disabled={loading}
            >
              Add New Project
            </button>
            <button 
              className="btn btn-outline"
              onClick={handleLogout}
              disabled={loading}
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
                <button className="close-btn" onClick={resetForm} disabled={loading}>×</button>
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
                    disabled={loading}
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
                    disabled={loading}
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
                    disabled={loading}
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
                    disabled={loading}
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
                    disabled={loading}
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
                    disabled={loading}
                  />
                </div>

                <div className="form-actions">
                  <button type="button" className="btn btn-outline" onClick={resetForm} disabled={loading}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : (editingProject ? 'Update Project' : 'Add Project')}
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
          
          {loading && projects.length === 0 ? (
            <div className="loading">
              <p>Loading projects...</p>
            </div>
          ) : projects.length === 0 ? (
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
                        disabled={loading}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn-delete"
                        onClick={() => deleteProject(project.id)}
                        disabled={loading}
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