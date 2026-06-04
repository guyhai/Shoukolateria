export default function About() {
  return (
    <section id="about" className="py-24 px-6 bg-choco-50 section-dots-bg">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="font-assistant text-choco-400 tracking-[0.35em] text-xs uppercase mb-3">
            ✦ &nbsp; הסיפור שלנו &nbsp; ✦
          </p>
          <h2 className="section-heading text-choco-900">על השוקולדריה</h2>
          <div className="ornament-divider max-w-sm mx-auto mt-4">
            <span className="text-choco-400 text-base">❧</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image placeholder */}
          <div className="order-2 md:order-1">
            <div
              className="aspect-[4/5] bg-choco-200 flex items-center justify-center vintage-frame"
              style={{ minHeight: '360px' }}
            >
              <div className="text-center text-choco-500 p-8">
                <svg className="w-16 h-16 mx-auto mb-4 opacity-40" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                </svg>
                <p className="font-assistant text-sm">תמונה תתעדכן בקרוב</p>
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="order-1 md:order-2 space-y-6">
            <h3 className="font-playfair text-3xl text-choco-800 leading-snug">
              המקום שבו שוקולד הופך לאמנות
            </h3>

            <p className="font-assistant text-choco-700 text-base leading-relaxed">
              השוקולדריה נולדה מתוך אהבה עמוקה לשוקולד ולאמנות היצירה.
              בלב שכונת לווינסקי הצבעונית — שוק הספרים, הבשמים והטעמים — פתחנו
              את הדלתות לסדנאות שוקולד אינטימיות ומרגשות.
            </p>

            <p className="font-assistant text-choco-700 text-base leading-relaxed">
              כל סדנה היא מסע חושי: ריחות קקאו, מרקמים שנמסים בין האצבעות,
              וסוד קטן שלוקחים הביתה — טראפלים, טבליות, ובונבונים שעשיתן
              בידיים שלכן.
            </p>

            <p className="font-assistant text-choco-700 text-base leading-relaxed">
              הסדנאות מתקיימות בבית, בקבוצות קטנות ומפנקות,
              כי האמנו שחוויה אמיתית נולדת מהקרבה.
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-3 pt-2">
              {['קבוצות קטנות', 'חומרי גלם איכותיים', 'ליד שוק לווינסקי', 'לכל רמות ההכרה'].map(
                (tag) => (
                  <span
                    key={tag}
                    className="bg-choco-100 border border-choco-300 text-choco-700
                               font-assistant text-xs px-4 py-1.5 tracking-wide"
                  >
                    {tag}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
