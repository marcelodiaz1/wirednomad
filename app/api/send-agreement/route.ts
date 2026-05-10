import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { pdfBase64, refCode, clientName, clientEmail } = body;

    // Log the size to debug Vercel limits
    const sizeInMB = (Buffer.from(pdfBase64, 'base64').length / (1024 * 1024)).toFixed(2);
    console.log(`PDF Size: ${sizeInMB} MB for Ref: ${refCode}`);

    const { data, error } = await resend.emails.send({
      from: 'WiredNomad <onboarding@resend.dev>',
      to: ['marcelo.diaz.santis@gmail.com'], // KEEP THIS AS YOUR EMAIL FOR TESTING
      subject: `Agreement: ${refCode} - ${clientName}`,
      html: `<p>New agreement for <strong>${clientName}</strong>. Ref: ${refCode}</p>`,
      attachments: [
        {
          filename: `WiredNomad_${refCode}.pdf`,
          content: pdfBase64,
        },
      ],
    });

    if (error) {
      console.error("Resend API Error:", error);
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Server Crash:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}