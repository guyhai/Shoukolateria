import { google } from 'googleapis'

export interface BookingData {
  name: string
  phone: string
  date: string
  timeSlot: string
  participants: string
  notes?: string
}

export async function createCalendarEvent(booking: BookingData): Promise<string> {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/calendar'],
  })

  const calendar = google.calendar({ version: 'v3', auth })

  const startDateTime = buildDateTime(booking.date, booking.timeSlot)
  const endDateTime = new Date(startDateTime.getTime() + 2 * 60 * 60 * 1000)

  const response = await calendar.events.insert({
    calendarId: process.env.GOOGLE_CALENDAR_ID!,
    requestBody: {
      summary: `🍫 סדנת שוקולד | ${booking.name}`,
      description: [
        `שם: ${booking.name}`,
        `טלפון: ${booking.phone}`,
        `מספר משתתפות: ${booking.participants}`,
        booking.notes ? `הערות: ${booking.notes}` : '',
        '',
        'נרשמה דרך האתר — יש לאשר ולתאם תשלום בטלפון.',
      ]
        .filter(Boolean)
        .join('\n'),
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: 'Asia/Jerusalem',
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: 'Asia/Jerusalem',
      },
      location: 'ליד שוק לווינסקי, תל אביב',
      status: 'tentative',
    },
  })

  return response.data.id ?? ''
}

function buildDateTime(date: string, timeSlot: string): Date {
  const timeMap: Record<string, string> = {
    morning: '10:00',
    afternoon: '14:00',
    evening: '18:00',
  }
  const time = timeMap[timeSlot] ?? '10:00'
  return new Date(`${date}T${time}:00+03:00`)
}
