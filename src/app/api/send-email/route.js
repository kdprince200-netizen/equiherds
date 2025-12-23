import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { userName, userEmail, phNumber, purpose, date, callDuration, time, question, hostEmail } = body;
    
    if (!userName || !userEmail || !purpose) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Forward the request to the external SMTP service
    const response = await fetch('https://www.equiherds.com/smtp-api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userName,
        userEmail,
        phNumber,
        purpose,
        date,
        callDuration,
        time,
        question,
        hostEmail: hostEmail || "Info@equiherds.com"
      }),
    });

    if (!response.ok) {
      throw new Error(`SMTP service responded with status: ${response.status}`);
    }

    const result = await response.json();
    
    return NextResponse.json(
      { message: 'Email sent successfully', data: result },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error sending email:', error);
    
    return NextResponse.json(
      { error: 'Failed to send email', details: error.message },
      { status: 500 }
    );
  }
}
