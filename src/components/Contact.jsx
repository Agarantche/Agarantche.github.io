import Magnetic from './Magnetic.jsx'

export default function Contact() {
  return (
    <section id="contact" data-section className="contact">
      <div className="container">
        <h2 className="giant-word">
          Let’s talk<span className="dot">.</span>
        </h2>
        <div className="contact-inner">
          <p className="contact-line">
            I’m looking for a software engineering internship — somewhere I can
            ship, break, fix, and learn from people better than me. If that’s
            your team, my inbox is triaged by my own software. It’ll get read.
          </p>
          <Magnetic>
            <a
              className="contact-btn"
              href="mailto:adamgarantche612@gmail.com"
              data-cursor="say hi"
            >
              adamgarantche612@gmail.com
            </a>
          </Magnetic>
          <div className="contact-alt">
            <a href="https://github.com/Agarantche" target="_blank" rel="noopener noreferrer" data-cursor="visit">GITHUB ↗</a>
            <a href="https://www.linkedin.com/in/adam-garantche" target="_blank" rel="noopener noreferrer" data-cursor="visit">LINKEDIN ↗</a>
          </div>
        </div>
      </div>
    </section>
  )
}
