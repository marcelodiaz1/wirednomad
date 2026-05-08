import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Increase if the PDF is large
    },
  },
};
export async function POST(req: Request) {
  try {
    const { pdfBase64, refCode } = await req.json();

    await resend.emails.send({
      from: 'System <contact@wirednomad.xyz>',
      to: 'contact@wirednomad.xyz',
      subject: `New Agreement Generated: ${refCode}`,
      text: `A new service agreement has been generated and downloaded by a user. Ref: ${refCode}`,
      attachments: [
        {
          filename: `WiredNomad_Agreement_${refCode}.pdf`,
          content: pdfBase64,
        },
      ],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}