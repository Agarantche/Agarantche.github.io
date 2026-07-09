import Statement from './Statement.jsx'

const SKILLS = [
  'Java', 'Python', 'JavaScript/TS', 'C', 'SQL',
  'React', 'Next.js', 'Vite', 'Node/Express', 'Supabase',
  'pandas', 'Plotly', 'Git', 'REST APIs', 'OAuth',
]

export default function About() {
  return (
    <section id="about" data-section>
      <div className="container">
        <h2 className="giant-word">
          Now<span className="dot">.</span>
        </h2>

        <Statement
          segments={[
            { t: "I'm Adam — a " },
            { t: 'Computer Science student', key: true },
            { t: ' at Otterbein University, class of 2027, who would rather ' },
            { t: 'ship something real', key: true },
            { t: ' than ace another toy example.' },
          ]}
        />

        <Statement
          segments={[
            { t: 'By day I’m an ' },
            { t: 'IT technician', key: true },
            { t: ' for a 3,000-person campus — front-line support, testing software before it rolls out to everyone, writing the docs people actually read, and shepherding a fleet of laptops through ' },
            { t: 'Intune and Autopilot', key: true },
            { t: '. I’ve also made phishing-awareness materials, so no, I will not be clicking that link.' },
          ]}
        />

        <Statement
          segments={[
            { t: 'By night I build ' },
            { t: 'full-stack apps', key: true },
            { t: ' with React, Next.js and Node, wire ' },
            { t: 'AI into real products', key: true },
            { t: ', and chase datasets around with Python. I like the part where an idea becomes a repo, the repo becomes a deploy, and the deploy becomes something a stranger can use. You can watch that happen on ' },
            { t: 'GitHub', key: true, href: 'https://github.com/Agarantche' },
            { t: '.' },
          ]}
        />

        <p className="skills-line" aria-label="Technical skills">
          {SKILLS.map((s, i) => (
            <span key={s}>
              {s}
              {i < SKILLS.length - 1 && <span className="sep" aria-hidden="true"> · </span>}
            </span>
          ))}
        </p>
      </div>
    </section>
  )
}
