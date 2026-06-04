const workshops = [
  {
    emoji: '🍫',
    title: 'סדנת פרלינים',
    subtitle: 'Pralines Workshop',
    description:
      'צרו פרלינים מושלמים מאפס — ציפויי שוקולד, גנאשים עשירים ומילויים מגוונים. תצאו עם קופסת מתנה שעשיתן בידיים שלכן.',
    duration: '~2.5 שעות',
    participants: 'קבוצה קטנה',
    highlight: true,
  },
  {
    emoji: '🍹',
    title: 'סדנת קוקטיילים ושוקולד',
    subtitle: 'Cocktails & Chocolate',
    description:
      'שילוב מנצח — שוקולד וקוקטיילים. תכינו יחד קוקטיילים מיוחדים ופרלינים תואמים, לחוויה חושית שלא תשכחו.',
    duration: '~2.5 שעות',
    participants: 'קבוצה קטנה',
    highlight: false,
  },
  {
    emoji: '👯',
    title: 'ערב צוות / חברות',
    subtitle: 'Team Building & Girls Night',
    description:
      'סדנה מגבשת לצוותים, ערבי רווקות, ימי הולדת ומפגשי חברות. מותאמת אישית לקבוצה שלכן — מגיעות ועוזבות עם חיוך.',
    duration: 'לפי בחירה',
    participants: 'עד 15 משתתפות',
    highlight: false,
  },
  {
    emoji: '💑',
    title: 'סדנה לזוגות',
    subtitle: 'Couples Workshop',
    description:
      'דייט אחר. תכינו יחד פרלינים ותגלו מה קורה כששניים יוצרים שוקולד ביחד. כיף, מתוק, ובלתי נשכח.',
    duration: '~2 שעות',
    participants: 'לזוגות',
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
            ✦ &nbsp; מה תוכלו למצוא &nbsp; ✦
          </p>
          <h2 className="section-heading text-choco-50">הסדנאות</h2>
          <div className="ornament-divider max-w-sm mx-auto mt-4">
            <span className="text-choco-400 text-base">❧</span>
          </div>
          <p className="font-assistant text-choco-300 mt-4 text-base max-w-xl mx-auto">
            בואו לחוות יחד את הקסם בסדנת שוקולד ייחודית ומלאת הנאה
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
