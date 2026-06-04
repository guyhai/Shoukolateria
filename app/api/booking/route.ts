import { NextResponse } from 'next/server'
import { createCalendarEvent, type BookingData } from '@/lib/calendar'

export async function POST(request: Request) {
  let body: BookingData & Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { name, phone, date, timeSlot, participants } = body

  if (!name || !phone || !date || !timeSlot || !participants) {
    return NextResponse.json({ error: 'חסרים שדות חובה' }, { status: 400 })
  }

  const booking: BookingData = {
    name: String(name),
    phone: String(phone),
    date: String(date),
    timeSlot: String(timeSlot),
    participants: String(participants),
    notes: body.notes ? String(body.notes) : undefined,
  }

  const calendarConfigured =
    process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY && process.env.GOOGLE_CALENDAR_ID

  if (calendarConfigured) {
    try {
      await createCalendarEvent(booking)
    } catch (err) {
      console.error('Google Calendar error:', err)
      return NextResponse.json(
        { error: 'שגיאה בשמירת הבקשה. נסי שוב מאוחר יותר.' },
        { status: 500 }
      )
    }
  } else {
    // Fallback: log the booking so it's not lost
    console.log('📋 New booking (Calendar not configured):', JSON.stringify(booking, null, 2))
  }

  return NextResponse.json({ success: true })
}
