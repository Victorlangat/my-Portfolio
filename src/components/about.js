import React from 'react';
import './about.css';

const About = () => {
    const skills = [
        'UI/UX Design',
        'Web Development',
        'Frontend',
        'Responsive Design',
        'Javascript',
        'React',
        'Node.js',
        'CSS'
    ];

    return (
        <section className='about' id='about'>
            <div className='container'>
                <div className='about-content'>
                    <div className='about-text'>
                        <h2>About <span className='ME'>Me</span></h2>
                        <p>
                            I'm a creative proffesional with 3+ years of experience in web design and development, I am flexible and include modern technology such as AI in my development process to ensure a sure and tested. <br/>
                            <span className='about-me-highlight'>I love crafting digital experiences that are both beautiful and functional.</span>

                        </p>
                        <p>
                            My approach combines both technical expertise and an eye for design detail, resulting in solutions that not only work well but also delight the users
                        </p>
                        <div className='skills'>
                            {skills.map((skill, index) => (
                                <span key={index} className='skill'>
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className='about-image'>
                        <img               src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="profile" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;