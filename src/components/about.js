import React from 'react';
import myImage from './myimage.jpg'; // Add this import
import './about.css';

const About = () => {
  const skills = [
    'UI/UX Design',
    'Web Development',
    'Frontend',
    'Responsive Design',
    'JavaScript',
    'React',
    'Node.js',
    'CSS'
  ];

  return (
    <section className="about light-section" id="about">
      <div className="container">
        <div className="about-content">
          <div className="about-text">
            <h2>About Me</h2>
            <p>
              I'm a creative professional with 5+ years of experience in web design 
              and development. I love crafting digital experiences that are both 
              beautiful and functional.
            </p>
            <p>
              My approach combines technical expertise with an eye for design, 
              resulting in solutions that not only work well but also delight users.
            </p>
            <div className="skills">
              {skills.map((skill, index) => (
                <span key={index} className="skill">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div className="about-image">
            <img src={myImage} alt="profile" /> {/* Use the imported image */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;