import React, { useState, useEffect } from 'react';
import './work.css';

const Work = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // Fetch projects from backend or localStorage
    const savedProjects = JSON.parse(localStorage.getItem('portfolioProjects')) || [];
    setProjects(savedProjects);
  }, []);

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
                    <a href={project.liveLink} className="work-link" target="_blank" rel="noopener noreferrer">
                      Live Demo
                    </a>
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