'use client'

import { useState } from 'react'

type FormState = 'idle' | 'loading' | 'success' | 'error'

const timeSlots = [
  { value: 'morning', label: 'בוקר (10:00)' },
  { value: 'afternoon', label: 'אחר הצהריים (14:00)' },
  { value: 'evening', label: 'ערב (18:00)' },
]

const today = new Date().toISOString().split('T')[0]

export default function BookingSection() {
  const [state, setState] = useState<FormState>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState('loading')
    setErrorMsg('')

    const form = e.currentTarget
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
      date: (form.elements.namedItem('date') as HTMLInputElement).value,
      timeSlot: (form.elements.namedItem('timeSlot') as HTMLSelectElement).value,
      participants: (form.elements.namedItem('participants') as HTMLSelectElement).value,
      notes: (form.elements.namedItem('notes') as HTMLTextAreaElement).value,
    }

    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error ?? 'שגיאה לא ידועה')
      }

      setState('success')
      form.reset()
    } catch (err) {
      setState('error')
      setErrorMsg(err instanceof Error ? err.message : 'אירעה שגיאה. נסי שוב.')
    }
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
            השאירי פרטים ורומי תחזור אליך לאישור ולתיאום התשלום.
          </p>
        </div>

        {state === 'success' ? (
          <SuccessMessage />
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

            {/* Error */}
            {state === 'error' && (
              <p className="font-assistant text-red-600 text-sm bg-red-50 border border-red-200 px-4 py-2">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={state === 'loading'}
              className="btn-primary w-full text-center disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {state === 'loading' ? 'שולחת...' : 'שלחי בקשת הרשמה ✦'}
            </button>

            <p className="font-assistant text-choco-400 text-xs text-center leading-relaxed">
              לאחר ההרשמה נחזור אליך לאישור המקום ותיאום התשלום. <br />
              התשלום מתבצע טלפונית בלבד.
            </p>
          </form>
        )}
      </div>
    </section>
  )
}

function SuccessMessage() {
  return (
    <div className="bg-white border-2 border-choco-400 p-10 text-center shadow-xl vintage-frame">
      <div className="text-5xl mb-6">🍫</div>
      <h3 className="font-playfair text-2xl text-choco-800 mb-4">קיבלנו! תודה רבה ✦</h3>
      <p className="font-assistant text-choco-600 text-base leading-relaxed mb-6">
        ההרשמה שלך נקלטה בהצלחה.
        <br />
        נחזור אליך בהקדם לאישור המקום ותיאום התשלום.
      </p>
      <p className="font-assistant text-choco-400 text-sm">
        מחכות לראות אותך! 🤎
      </p>
    </div>
  )
}
