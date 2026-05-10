import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY || '');

export async function POST(req: Request) {
  // 1. Safety Check for API Key
  if (!process.env.RESEND_API_KEY) {
    console.error("CRITICAL: RESEND_API_KEY is missing from .env.local");
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  try {
    const { name, email, projectType, message } = await req.json();

    // 2. Execute the send call and capture the response
    const { data, error } = await resend.emails.send({
      from: 'WiredNomad <onboarding@resend.dev>',
      to: ['marcelo.diaz.santis@gmail.com'], 
      subject: `New Project Inquiry: ${projectType} from ${name}`,
      html: `
        <div style="font-family: sans-serif; color: #333;">
          <h1 style="color: #2563eb;">New Contact Form Submission</h1>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Project Type:</strong> ${projectType}</p>
          <hr />
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `,
    });

    // 3. Check for Resend-specific errors
    if (error) {
      console.error("Resend API Error:", error);
      return NextResponse.json({ error }, { status: 400 });
    }

    // 4. Success Response
    return NextResponse.json({ success: true, data });

  } catch (error: any) {
    console.error("Server Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}