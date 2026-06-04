export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 50% 60%, #3D1C02 0%, #160C01 100%)',
      }}
    >
      {/* Subtle polka-dot texture */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle, #C68642 1.5px, transparent 1.5px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Decorative corner ornaments */}
      <Ornament className="absolute top-8 right-8 text-choco-400 opacity-50" />
      <Ornament className="absolute top-8 left-8 text-choco-400 opacity-50 scale-x-[-1]" />
      <Ornament className="absolute bottom-8 right-8 text-choco-400 opacity-50 rotate-180 scale-x-[-1]" />
      <Ornament className="absolute bottom-8 left-8 text-choco-400 opacity-50 rotate-180" />

      {/* Main content */}
      <div className="relative z-10 text-center px-6 py-24 max-w-3xl mx-auto">
        {/* Pre-title */}
        <p className="font-assistant text-choco-400 tracking-[0.4em] text-xs uppercase mb-6">
          ✦ &nbsp; סדנאות פרלינים וקוקטיילים &nbsp; ✦
        </p>

        {/* Vintage frame around main heading */}
        <div className="vintage-frame p-8 md:p-12 mb-10 bg-choco-950/40">
          <h1 className="font-playfair text-5xl md:text-7xl lg:text-8xl text-choco-50 leading-none mb-4">
            הַשּׁוּקוֹלְדָיָה
          </h1>
          <div className="ornament-divider mx-auto max-w-xs">
            <span className="text-choco-400 text-lg">✦</span>
          </div>
          <p className="font-playfair italic text-choco-300 text-xl md:text-2xl mt-4">
            Ha-Shukoldaya
          </p>
        </div>

        {/* Tagline */}
        <p className="font-assistant text-choco-100 text-lg md:text-xl leading-relaxed mb-2">
          אצל רומי, בבית, ליד שוק לווינסקי
        </p>
        <p className="font-assistant text-choco-300 text-base mb-10">
          השוק 34, תל אביב &nbsp;·&nbsp; קבוצות קטנות &nbsp;·&nbsp; ⭐ 5.0 Google
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a href="#booking" className="btn-primary">
            הרשמי לסדנה הבאה
          </a>
          <a href="#workshops" className="btn-outline text-choco-200 border-choco-200 hover:bg-choco-200 hover:text-choco-900">
            הסדנאות שלנו
          </a>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-choco-50 to-transparent" />
    </section>
  )
}

function Ornament({ className }: { className?: string }) {
  return (
    <svg
      className={`w-16 h-16 ${className}`}
      viewBox="0 0 64 64"
      fill="currentColor"
    >
      <path d="M32 4 L36 28 L60 32 L36 36 L32 60 L28 36 L4 32 L28 28 Z" fillOpacity="0.6" />
      <path d="M32 16 L34 28 L46 32 L34 36 L32 48 L30 36 L18 32 L30 28 Z" />
    </svg>
  )
}
