import apper from "https://cdn.apper.io/actions/apper-actions.js";

apper.serve(async (req) => {
  try {
    // Validate request method
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Method not allowed. Use POST.'
        }),
        {
          status: 405,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Parse request body
    let requestBody;
    try {
      requestBody = await req.json();
    } catch (parseError) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid JSON in request body'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Validate required fields
    const { type, to, data } = requestBody;
    
    if (!type || !to || !data) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Missing required fields: type, to, and data are required'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid email format'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Get Resend API key
    const resendApiKey = await apper.getSecret('RESEND_API_KEY');
    if (!resendApiKey) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Email service not configured'
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Generate email content based on type
    let subject, htmlContent;
    
    switch (type) {
      case 'welcome':
        subject = 'Welcome to Gather - Let\'s Get Started!';
        htmlContent = generateWelcomeEmail(data);
        break;
        
      case 'registration_confirmation':
        subject = `Registration Confirmed: ${data.eventTitle}`;
        htmlContent = generateRegistrationEmail(data);
        break;
        
      case 'event_reminder':
        subject = `Reminder: ${data.eventTitle} is coming up!`;
        htmlContent = generateReminderEmail(data);
        break;
        
      case 'waitlist_confirmation':
        subject = `Waitlist Confirmed: ${data.eventTitle}`;
        htmlContent = generateWaitlistEmail(data);
        break;
        
      default:
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Invalid notification type'
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          }
        );
    }

    // Send email using Resend
    const emailData = {
      from: 'Gather Events <notifications@gather-events.com>',
      to: [to],
      subject: subject,
      html: htmlContent
    };

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Failed to send email',
          details: errorData.message || 'Unknown error occurred'
        }),
        {
          status: 502,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const result = await response.json();
    
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Email sent successfully',
        emailId: result.id
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Internal server error',
        details: error.message
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
});

// Email template generators
function generateWelcomeEmail(data) {
  const { userName, userEmail } = data;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Gather</title>
      <style>
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 0; background-color: #F7F8FC; }
        .container { max-width: 600px; margin: 0 auto; background-color: #FFFFFF; }
        .header { background: linear-gradient(135deg, #5B4FE8 0%, #7C69EF 100%); padding: 40px 32px; text-align: center; }
        .header h1 { color: #FFFFFF; margin: 0; font-size: 28px; font-weight: 700; }
        .content { padding: 40px 32px; }
        .greeting { font-size: 20px; font-weight: 600; color: #1A1A2E; margin-bottom: 16px; }
        .message { color: #4A5568; line-height: 1.6; margin-bottom: 24px; }
        .cta-button { display: inline-block; background: #5B4FE8; color: #FFFFFF; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
        .features { background: #F7F8FC; padding: 24px; border-radius: 12px; margin: 24px 0; }
        .feature { display: flex; align-items: flex-start; margin-bottom: 16px; }
        .feature-icon { background: #5B4FE8; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px; font-size: 12px; }
        .footer { background: #1A1A2E; color: #A0AEC0; padding: 24px 32px; text-align: center; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Gather</h1>
        </div>
        <div class="content">
          <div class="greeting">Hello ${userName}!</div>
          <div class="message">
            Welcome to Gather, where amazing events come to life! We're thrilled to have you join our community of event enthusiasts.
          </div>
          <div class="message">
            Your account has been successfully created with the email address: <strong>${userEmail}</strong>
          </div>
          
          <a href="https://gather-events.com/events" class="cta-button">Explore Events</a>
          
          <div class="features">
            <div class="feature">
              <div class="feature-icon">🎉</div>
              <div>
                <strong>Discover Events:</strong> Find exciting events in your area and interests
              </div>
            </div>
            <div class="feature">
              <div class="feature-icon">📅</div>
              <div>
                <strong>Easy Registration:</strong> Sign up for events with just a few clicks
              </div>
            </div>
            <div class="feature">
              <div class="feature-icon">✨</div>
              <div>
                <strong>Create Events:</strong> Host your own events and build your community
              </div>
            </div>
          </div>
          
          <div class="message">
            Ready to get started? Browse our featured events or create your first event today!
          </div>
        </div>
        <div class="footer">
          <p>© 2024 Gather Events. Making connections through amazing experiences.</p>
          <p>This email was sent to ${userEmail}.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateRegistrationEmail(data) {
  const { userName, eventTitle, eventDate, eventTime, eventLocation, status, registrationId } = data;
  
  const statusMessage = status === 'confirmed' 
    ? 'Your registration has been confirmed!' 
    : 'You\'ve been added to the waitlist.';
    
  const statusIcon = status === 'confirmed' ? '✅' : '⏳';
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Registration Confirmed</title>
      <style>
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 0; background-color: #F7F8FC; }
        .container { max-width: 600px; margin: 0 auto; background-color: #FFFFFF; }
        .header { background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%); padding: 40px 32px; text-align: center; }
        .header h1 { color: #FFFFFF; margin: 0; font-size: 28px; font-weight: 700; }
        .content { padding: 40px 32px; }
        .status-badge { background: ${status === 'confirmed' ? '#4CAF50' : '#FF9800'}; color: white; padding: 8px 16px; border-radius: 20px; display: inline-block; margin-bottom: 24px; font-weight: 600; }
        .event-card { background: #F7F8FC; border: 2px solid #E2E8F0; border-radius: 12px; padding: 24px; margin: 24px 0; }
        .event-title { font-size: 22px; font-weight: 700; color: #1A1A2E; margin-bottom: 16px; }
        .event-detail { display: flex; align-items: center; margin-bottom: 12px; color: #4A5568; }
        .event-icon { margin-right: 12px; font-size: 16px; }
        .message { color: #4A5568; line-height: 1.6; margin-bottom: 24px; }
        .footer { background: #1A1A2E; color: #A0AEC0; padding: 24px 32px; text-align: center; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${statusIcon} Registration ${status === 'confirmed' ? 'Confirmed' : 'Waitlisted'}</h1>
        </div>
        <div class="content">
          <div class="status-badge">${statusMessage}</div>
          
          <div class="message">
            Hi ${userName},
          </div>
          
          <div class="message">
            ${status === 'confirmed' 
              ? `Great news! Your registration for "${eventTitle}" has been confirmed. We can't wait to see you there!`
              : `Thank you for your interest in "${eventTitle}". You've been added to the waitlist and we'll notify you if a spot becomes available.`
            }
          </div>
          
          <div class="event-card">
            <div class="event-title">${eventTitle}</div>
            <div class="event-detail">
              <span class="event-icon">📅</span>
              <span>${eventDate}</span>
            </div>
            <div class="event-detail">
              <span class="event-icon">⏰</span>
              <span>${eventTime}</span>
            </div>
            <div class="event-detail">
              <span class="event-icon">📍</span>
              <span>${eventLocation}</span>
            </div>
            <div class="event-detail">
              <span class="event-icon">🎫</span>
              <span>Registration ID: ${registrationId}</span>
            </div>
          </div>
          
          <div class="message">
            ${status === 'confirmed'
              ? 'Please save this email as confirmation of your registration. We recommend adding this event to your calendar.'
              : 'We\'ll send you an email notification if your status changes from waitlist to confirmed.'
            }
          </div>
        </div>
        <div class="footer">
          <p>© 2024 Gather Events. Making connections through amazing experiences.</p>
          <p>Questions? Reply to this email or contact our support team.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateReminderEmail(data) {
  const { userName, eventTitle, eventDate, eventTime, eventLocation, daysUntilEvent } = data;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Event Reminder</title>
      <style>
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 0; background-color: #F7F8FC; }
        .container { max-width: 600px; margin: 0 auto; background-color: #FFFFFF; }
        .header { background: linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%); padding: 40px 32px; text-align: center; }
        .header h1 { color: #FFFFFF; margin: 0; font-size: 28px; font-weight: 700; }
        .content { padding: 40px 32px; }
        .countdown { background: #FF6B6B; color: white; padding: 16px; border-radius: 12px; text-align: center; margin: 24px 0; }
        .countdown-number { font-size: 36px; font-weight: 700; }
        .countdown-text { font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }
        .event-card { background: #F7F8FC; border: 2px solid #E2E8F0; border-radius: 12px; padding: 24px; margin: 24px 0; }
        .event-title { font-size: 22px; font-weight: 700; color: #1A1A2E; margin-bottom: 16px; }
        .event-detail { display: flex; align-items: center; margin-bottom: 12px; color: #4A5568; }
        .event-icon { margin-right: 12px; font-size: 16px; }
        .message { color: #4A5568; line-height: 1.6; margin-bottom: 24px; }
        .cta-button { display: inline-block; background: #FF6B6B; color: #FFFFFF; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
        .footer { background: #1A1A2E; color: #A0AEC0; padding: 24px 32px; text-align: center; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⏰ Event Reminder</h1>
        </div>
        <div class="content">
          <div class="message">
            Hi ${userName},
          </div>
          
          <div class="message">
            This is a friendly reminder that you're registered for an upcoming event!
          </div>
          
          <div class="countdown">
            <div class="countdown-number">${daysUntilEvent}</div>
            <div class="countdown-text">${daysUntilEvent === 1 ? 'Day' : 'Days'} to go!</div>
          </div>
          
          <div class="event-card">
            <div class="event-title">${eventTitle}</div>
            <div class="event-detail">
              <span class="event-icon">📅</span>
              <span>${eventDate}</span>
            </div>
            <div class="event-detail">
              <span class="event-icon">⏰</span>
              <span>${eventTime}</span>
            </div>
            <div class="event-detail">
              <span class="event-icon">📍</span>
              <span>${eventLocation}</span>
            </div>
          </div>
          
          <div class="message">
            We're excited to see you there! Make sure to arrive a few minutes early and bring any materials mentioned in the event description.
          </div>
          
          <a href="https://gather-events.com/events/${data.eventId}" class="cta-button">View Event Details</a>
          
          <div class="message">
            Can't make it? Please let the organizer know by canceling your registration so others can attend.
          </div>
        </div>
        <div class="footer">
          <p>© 2024 Gather Events. Making connections through amazing experiences.</p>
          <p>This reminder was sent because you're registered for this event.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateWaitlistEmail(data) {
  const { userName, eventTitle, eventDate, eventTime, eventLocation, registrationId } = data;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Waitlist Confirmation</title>
      <style>
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 0; background-color: #F7F8FC; }
        .container { max-width: 600px; margin: 0 auto; background-color: #FFFFFF; }
        .header { background: linear-gradient(135deg, #FF9800 0%, #FFB74D 100%); padding: 40px 32px; text-align: center; }
        .header h1 { color: #FFFFFF; margin: 0; font-size: 28px; font-weight: 700; }
        .content { padding: 40px 32px; }
        .status-badge { background: #FF9800; color: white; padding: 8px 16px; border-radius: 20px; display: inline-block; margin-bottom: 24px; font-weight: 600; }
        .event-card { background: #F7F8FC; border: 2px solid #E2E8F0; border-radius: 12px; padding: 24px; margin: 24px 0; }
        .event-title { font-size: 22px; font-weight: 700; color: #1A1A2E; margin-bottom: 16px; }
        .event-detail { display: flex; align-items: center; margin-bottom: 12px; color: #4A5568; }
        .event-icon { margin-right: 12px; font-size: 16px; }
        .message { color: #4A5568; line-height: 1.6; margin-bottom: 24px; }
        .highlight-box { background: #FFF3E0; border: 1px solid #FFB74D; border-radius: 8px; padding: 16px; margin: 24px 0; }
        .footer { background: #1A1A2E; color: #A0AEC0; padding: 24px 32px; text-align: center; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⏳ You're on the Waitlist</h1>
        </div>
        <div class="content">
          <div class="status-badge">Waitlist Confirmed</div>
          
          <div class="message">
            Hi ${userName},
          </div>
          
          <div class="message">
            Thank you for your interest in "${eventTitle}"! While the event is currently full, we've added you to the waitlist.
          </div>
          
          <div class="event-card">
            <div class="event-title">${eventTitle}</div>
            <div class="event-detail">
              <span class="event-icon">📅</span>
              <span>${eventDate}</span>
            </div>
            <div class="event-detail">
              <span class="event-icon">⏰</span>
              <span>${eventTime}</span>
            </div>
            <div class="event-detail">
              <span class="event-icon">📍</span>
              <span>${eventLocation}</span>
            </div>
            <div class="event-detail">
              <span class="event-icon">🎫</span>
              <span>Waitlist ID: ${registrationId}</span>
            </div>
          </div>
          
          <div class="highlight-box">
            <strong>What happens next?</strong>
            <ul style="margin: 8px 0; padding-left: 20px;">
              <li>We'll notify you immediately if a spot becomes available</li>
              <li>You'll have 24 hours to confirm your registration</li>
              <li>Your waitlist position is secured with this confirmation</li>
            </ul>
          </div>
          
          <div class="message">
            We appreciate your patience and hope to welcome you to this event soon!
          </div>
        </div>
        <div class="footer">
          <p>© 2024 Gather Events. Making connections through amazing experiences.</p>
          <p>We'll keep you updated on your waitlist status.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}