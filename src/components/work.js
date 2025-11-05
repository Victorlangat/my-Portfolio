import React, { useState, useEffect } from 'react';
import './work.css';

const Work = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/projects');
      
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setProjects(data.projects);
      } else {
        setError(data.error || 'Failed to load projects');
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Unable to load projects. Please try again later.');
      
      // Fallback to localStorage if backend is unavailable
      const localProjects = JSON.parse(localStorage.getItem('portfolioProjects')) || [];
      setProjects(localProjects);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="work gradient-section" id="work">
        <div className="container">
          <h2>My Work</h2>
          <div className="loading">
            <p>Loading projects...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error && projects.length === 0) {
    return (
      <section className="work gradient-section" id="work">
        <div className="container">
          <h2>My Work</h2>
          <div className="error">
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="work gradient-section" id="work">
      <div className="container">
        <h2>My Work</h2>
        {projects.length === 0 ? (
          <div className="no-projects">
            <p>No projects added yet. Check back soon!</p>
          </div>
        ) : (
          <div className="work-grid">
            {projects.map(project => (
              <div key={project.id} className="work-item">
                <div className="work-img">
                  <img src={project.image} alt={project.title} />
                </div>
                <div className="work-info">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="work-links">
                    {project.liveLink && (
                      <a href={project.liveLink} className="work-link" target="_blank" rel="noopener noreferrer">
                        Live Demo
                      </a>
                    )}
                    {project.githubLink && (
                      <a href={project.githubLink} className="work-link" target="_blank" rel="noopener noreferrer">
                        GitHub
                      </a>
                    )}
                    {project.caseStudy && (
                      <a href={project.caseStudy} className="work-link" target="_blank" rel="noopener noreferrer">
                        Case Study
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Work;