import { google } from 'googleapis';
import { User, Booking } from '../models/index.js';
import { encrypt, decrypt } from './cypto.js';

export async function addEventToGoogleCalendar(booking, user) {
  if (!user.googleRefreshToken) {
    console.log(`User ${user.userId} has not linked Google Calendar.`);
    return null;
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  // Decrypt tokens
  const accessToken = decrypt(user.googleAccessToken);
  const refreshToken = decrypt(user.googleRefreshToken);

  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
    expiry_date: user.googleTokenExpiry
  });

  // Listen for automatic token refresh and update database
  oauth2Client.on('tokens', async (newTokens) => {
    const updateData = { googleAccessToken: encrypt(newTokens.access_token) };
    if (newTokens.expiry_date) {
      updateData.googleTokenExpiry = newTokens.expiry_date;
    }
    await User.update(updateData, { where: { userId: user.userId } });
  });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const event = {
    summary: booking.title,
    description: booking.purpose || 'Room Booking Approved',
    location: `Room: ${booking.roomName || 'Reserved Room'}`,
    start: {
      dateTime: new Date(booking.startTime).toISOString(),
      timeZone: 'Asia/Bangkok', // Default local time zone
    },
    end: {
      dateTime: new Date(booking.endTime).toISOString(),
      timeZone: 'Asia/Bangkok',
    },
  };

  try {
    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    });
    
    // Store googleEventId on the booking
    await Booking.update({ googleEventId: response.data.id }, { where: { bookingId: booking.bookingId } });
    console.log(`Successfully created Google Calendar Event with ID: ${response.data.id}`);
    return response.data.id;
  } catch (error) {
    console.error('Failed to create Google Calendar Event:', error);
    return null;
  }
}
