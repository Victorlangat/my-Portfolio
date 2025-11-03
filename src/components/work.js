import React, { useState } from 'react';
import './work.css';

const Work = () => {
  const [projects] = useState([
    {
      id: 1,
      title: 'E-Commerce Platform',
      description: 'A modern e-commerce solution with seamless user experience and secure payment integration.',
      image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      liveLink: '#',
      githubLink: '#'
    },
    {
      id: 2,
      title: 'Mobile App UI',
      description: 'Clean and intuitive mobile application interface designed for optimal user engagement.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      liveLink: '#',
      caseStudy: '#'
    },
    {
      id: 3,
      title: 'Dashboard Design',
      description: 'Analytics dashboard with data visualization components and interactive elements.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      liveLink: '#',
      githubLink: '#'
    }
  ]);

  return (
    <section className="work" id="work">
      <div className="container">
        <h2>My Work</h2>
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
                  <a href={project.liveLink} className="work-link">Live Demo</a>
                  {project.githubLink && (
                    <a href={project.githubLink} className="work-link">GitHub</a>
                  )}
                  {project.caseStudy && (
                    <a href={project.caseStudy} className="work-link">Case Study</a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Work;