const workshops = [
  {
    emoji: '🍫',
    title: 'סדנת טראפלס',
    subtitle: 'Truffles Workshop',
    description:
      'צרו טראפלים עשירים ומפתים עם מגוון ציפויים וגנאשים. מתאים לכל רמה, יוצאת עם קופסת מתנה מלאה.',
    duration: '~2.5 שעות',
    participants: 'עד 8 משתתפות',
    highlight: true,
  },
  {
    emoji: '🍬',
    title: 'סדנת בונבונים',
    subtitle: 'Bonbons Workshop',
    description:
      'עולם הבונבונים המדויקים — ציפוי שוקולד, מילויים מגוונים ועיצוב בסגנון פטיסרי צרפתי. חוויה מדיטטיבית ומפנקת.',
    duration: '~3 שעות',
    participants: 'עד 6 משתתפות',
    highlight: false,
  },
  {
    emoji: '🍫',
    title: 'סדנת טבליות',
    subtitle: 'Chocolate Tablets',
    description:
      'עצבו טבליות שוקולד ייחודיות עם פירות, אגוזים, עשבי תיבול ופרחים אכילים. כל טבלה — יצירה אחרת.',
    duration: '~2 שעות',
    participants: 'עד 10 משתתפות',
    highlight: false,
  },
  {
    emoji: '🎁',
    title: 'ערב גיבשושית / bachelorette',
    subtitle: 'Girls Night',
    description:
      'חבילה מיוחדת לאירועים פרטיים — ערבי רווקות, ימי הולדת, ומפגשי חברות. מותאם אישית לפי הרצון.',
    duration: 'לפי בחירה',
    participants: 'עד 12 משתתפות',
    highlight: false,
  },
]

export default function Workshops() {
  return (
    <section id="workshops" className="py-24 px-6 bg-choco-900">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="font-assistant text-choco-400 tracking-[0.35em] text-xs uppercase mb-3">
            ✦ &nbsp; מה עושים אצלנו &nbsp; ✦
          </p>
          <h2 className="section-heading text-choco-50">הסדנאות שלנו</h2>
          <div className="ornament-divider max-w-sm mx-auto mt-4">
            <span className="text-choco-400 text-base">❧</span>
          </div>
          <p className="font-assistant text-choco-300 mt-4 text-base max-w-xl mx-auto">
            כל סדנה היא חוויה מלאה — תבואי עם סקרנות ותצאי עם מיומנות וגאווה.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {workshops.map((w) => (
            <div
              key={w.title}
              className={`relative flex flex-col p-6 border-2 transition-transform duration-300 hover:-translate-y-1
                ${
                  w.highlight
                    ? 'border-choco-400 bg-choco-800 shadow-lg shadow-choco-400/20'
                    : 'border-choco-700 bg-choco-950/60 hover:border-choco-500'
                }`}
            >
              {w.highlight && (
                <span className="absolute -top-3 right-4 bg-choco-400 text-choco-950 font-assistant font-bold text-xs px-3 py-0.5 tracking-widest uppercase">
                  פופולרי
                </span>
              )}

              <div className="text-3xl mb-4">{w.emoji}</div>

              <h3 className="font-playfair text-xl text-choco-50 mb-1">{w.title}</h3>
              <p className="font-assistant text-choco-500 text-xs tracking-wider uppercase mb-4">
                {w.subtitle}
              </p>

              <p className="font-assistant text-choco-300 text-sm leading-relaxed flex-1 mb-6">
                {w.description}
              </p>

              <div className="border-t border-choco-700 pt-4 space-y-1">
                <p className="font-assistant text-choco-400 text-xs">⏱ {w.duration}</p>
                <p className="font-assistant text-choco-400 text-xs">👥 {w.participants}</p>
              </div>

              <a
                href="#booking"
                className="mt-5 btn-primary text-xs py-2 px-4 text-center"
              >
                הרשמה
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
