import Statement from './Statement.jsx'

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
            { t: 'By day I keep a university’s computers alive at the ' },
            { t: 'ITS helpdesk', key: true },
            { t: '. By night I build ' },
            { t: 'full-stack apps', key: true },
            { t: ' with React, Next.js and Node, wire ' },
            { t: 'AI into real products', key: true },
            { t: ', and chase datasets around with Python.' },
          ]}
        />

        <Statement
          segments={[
            { t: 'I like the part where an idea becomes a repo, the repo becomes a ' },
            { t: 'deploy', key: true },
            { t: ', and the deploy becomes something a stranger can actually use. You can watch that happen on ' },
            { t: 'GitHub', key: true, href: 'https://github.com/Agarantche' },
            { t: '.' },
          ]}
        />
      </div>
    </section>
  )
}
