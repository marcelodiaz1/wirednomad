import { Resend } from 'resend';
import { NextResponse } from 'next/server';

// Initialize safely
const resend = new Resend(process.env.RESEND_API_KEY || '');

export async function POST(req: Request) {
  // Check if API key is missing before trying to use it
  if (!process.env.RESEND_API_KEY) {
    console.error("CRITICAL: RESEND_API_KEY is missing from .env.local");
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  try {
    const { pdfBase64, refCode, clientName, clientEmail } = await req.json();

    const { data, error } = await resend.emails.send({
      from: 'WiredNomad <onboarding@resend.dev>', // Ensure this domain is verified in Resend
      to: ['marcelo.diaz.santis@gmail.com'], // Send to yourself or the client
      subject: `New Digital Agreement: ${refCode} - ${clientName}`,
      html: `<p>New agreement generated for <strong>${clientName}</strong> (${clientEmail}). Reference: ${refCode}</p>`,
      attachments: [
        {
          filename: `WiredNomad_Agreement_${refCode}.pdf`,
          content: pdfBase64,
        },
      ],
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}