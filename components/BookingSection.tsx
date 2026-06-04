'use client'

import { useState } from 'react'

const timeSlots = [
  { value: 'morning', label: 'בוקר (10:00)' },
  { value: 'afternoon', label: 'אחר הצהריים (14:00)' },
  { value: 'evening', label: 'ערב (18:00)' },
]

const today = new Date().toISOString().split('T')[0]

const ROMI_PHONE = '972528992000'

function buildWhatsAppMessage(data: {
  name: string
  phone: string
  date: string
  timeSlot: string
  participants: string
  notes: string
}) {
  const timeLabel = timeSlots.find((s) => s.value === data.timeSlot)?.label ?? data.timeSlot
  const parts = [
    '🍫 *בקשת הרשמה לסדנת שוקולד*',
    '',
    `*שם:* ${data.name}`,
    `*טלפון:* ${data.phone}`,
    `*תאריך מועדף:* ${data.date}`,
    `*שעה:* ${timeLabel}`,
    `*מספר משתתפות:* ${data.participants}`,
  ]
  if (data.notes) parts.push(`*הערות:* ${data.notes}`)
  const lines = parts.join('\n')

  return encodeURIComponent(lines)
}

export default function BookingSection() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
      date: (form.elements.namedItem('date') as HTMLInputElement).value,
      timeSlot: (form.elements.namedItem('timeSlot') as HTMLSelectElement).value,
      participants: (form.elements.namedItem('participants') as HTMLSelectElement).value,
      notes: (form.elements.namedItem('notes') as HTMLTextAreaElement).value,
    }

    const msg = buildWhatsAppMessage(data)
    window.open(`https://wa.me/${ROMI_PHONE}?text=${msg}`, '_blank')
    setSubmitted(true)
  }

  return (
    <section id="booking" className="py-24 px-6 bg-choco-50 section-dots-bg">
      <div className="max-w-xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <p className="font-assistant text-choco-400 tracking-[0.35em] text-xs uppercase mb-3">
            ✦ &nbsp; שמרי מקום &nbsp; ✦
          </p>
          <h2 className="section-heading text-choco-900">הרשמה לסדנה</h2>
          <div className="ornament-divider max-w-sm mx-auto mt-4">
            <span className="text-choco-400 text-base">❧</span>
          </div>
          <p className="font-assistant text-choco-600 mt-4 text-sm leading-relaxed">
            מלאי את הטופס — הפרטים יישלחו ישירות לרומי בוואטסאפ.
            <br />
            היא תחזור אליך לאישור ולתיאום התשלום.
          </p>
        </div>

        {submitted ? (
          <SuccessMessage onReset={() => setSubmitted(false)} />
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white border-2 border-choco-200 p-8 md:p-10 shadow-xl space-y-5"
          >
            {/* Name */}
            <div>
              <label className="block font-assistant font-semibold text-choco-800 text-sm mb-1.5">
                שם מלא <span className="text-choco-400">*</span>
              </label>
              <input
                name="name"
                type="text"
                required
                minLength={2}
                placeholder="איך קוראים לך?"
                className="input-field"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block font-assistant font-semibold text-choco-800 text-sm mb-1.5">
                מספר טלפון <span className="text-choco-400">*</span>
              </label>
              <input
                name="phone"
                type="tel"
                required
                placeholder="05X-XXXXXXX"
                pattern="[0-9\-+\s]{9,15}"
                className="input-field"
                dir="ltr"
              />
            </div>

            {/* Date + time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-assistant font-semibold text-choco-800 text-sm mb-1.5">
                  תאריך מועדף <span className="text-choco-400">*</span>
                </label>
                <input
                  name="date"
                  type="date"
                  required
                  min={today}
                  className="input-field"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block font-assistant font-semibold text-choco-800 text-sm mb-1.5">
                  שעה מועדפת <span className="text-choco-400">*</span>
                </label>
                <select name="timeSlot" required className="input-field appearance-none cursor-pointer">
                  {timeSlots.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Participants */}
            <div>
              <label className="block font-assistant font-semibold text-choco-800 text-sm mb-1.5">
                מספר משתתפות <span className="text-choco-400">*</span>
              </label>
              <select name="participants" required className="input-field appearance-none cursor-pointer">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n} משתתפת{n === 1 ? '' : 'ות'}
                  </option>
                ))}
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block font-assistant font-semibold text-choco-800 text-sm mb-1.5">
                הערות מיוחדות
              </label>
              <textarea
                name="notes"
                rows={3}
                placeholder="אלרגיות, אירוע מיוחד, בקשות..."
                className="input-field resize-none"
              />
            </div>

            <button type="submit" className="btn-primary w-full text-center flex items-center justify-center gap-3">
              <WhatsAppIcon />
              שלחי הרשמה לרומי
            </button>

            <p className="font-assistant text-choco-400 text-xs text-center leading-relaxed">
              הטופס יפתח את וואטסאפ עם הפרטים מוכנים לשליחה.
              <br />
              התשלום מתבצע טלפונית לאחר האישור.
            </p>
          </form>
        )}
      </div>
    </section>
  )
}

function WhatsAppIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

function SuccessMessage({ onReset }: { onReset: () => void }) {
  return (
    <div className="bg-white border-2 border-choco-400 p-10 text-center shadow-xl vintage-frame">
      <div className="text-5xl mb-6">🍫</div>
      <h3 className="font-playfair text-2xl text-choco-800 mb-4">הוואטסאפ נפתח! ✦</h3>
      <p className="font-assistant text-choco-600 text-base leading-relaxed mb-6">
        הפרטים שלך מוכנים — רק לחצי שלח בוואטסאפ.
        <br />
        רומי תחזור אליך בהקדם לאישור המקום.
      </p>
      <button onClick={onReset} className="btn-outline text-sm">
        הרשמה נוספת
      </button>
    </div>
  )
}
