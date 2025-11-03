import React from 'react';
import './hero.css';

const Hero = () => {
    return (
        <section className='hero' id='home'>
            <div className='container'>
                <div className='hero-container'>
                    <h1>Hi I'm <span className='highlight'>Victor James Langat</span></h1>

                    <p>
                        I'm a passionate Designer and Developer, creating mordern digital experiences.
                        I specialize in creating sleek, user-friendly interfaces with clean organised code.
                    </p>
                    <div className='hero-btns'>
                        <a href="#work" className='btn'>View My Work</a>
                        <a href="#contact" className='btn-btn-outline'>Get In Touch</a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;