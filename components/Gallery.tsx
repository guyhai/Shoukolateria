const placeholders = Array.from({ length: 6 }, (_, i) => i + 1)

export default function Gallery() {
  return (
    <section id="gallery" className="py-24 px-6 bg-choco-950">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-14">
          <p className="font-assistant text-choco-400 tracking-[0.35em] text-xs uppercase mb-3">
            ✦ &nbsp; רגעים מהסדנאות &nbsp; ✦
          </p>
          <h2 className="section-heading text-choco-50">גלריה</h2>
          <div className="ornament-divider max-w-sm mx-auto mt-4">
            <span className="text-choco-400 text-base">❧</span>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {placeholders.map((n) => (
            <div
              key={n}
              className="aspect-square bg-choco-800 border border-choco-700 flex items-center justify-center
                         hover:border-choco-400 transition-colors duration-300 group overflow-hidden"
            >
              <div className="text-center text-choco-600 group-hover:text-choco-400 transition-colors p-4">
                <svg
                  className="w-10 h-10 mx-auto mb-2 opacity-40"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                </svg>
                <p className="font-assistant text-xs opacity-50">תמונה {n}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="font-assistant text-choco-600 text-center text-sm mt-8">
          תמונות יתווספו בקרוב ✦
        </p>
      </div>
    </section>
  )
}
