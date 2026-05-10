import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import rocketIcon from "./rocket.png";
export const generateWiredNomadPDF = (data: any) => {
  const { 
    client, 
    totalPrice: basePrice,
    totalDays, 
    platform, 
    webPages, 
    selectedAppFeatures, 
    selectedFeatures, 
    selectedDomain, 
    selectedHosting, 
    paymentPlan,   
    priceAdjustment,
    pricingData 
  } = data;

  const doc = new jsPDF();
  const today = new Date();
  const refCode = `WN-${Math.random().toString(36).toUpperCase().substring(7)}`; 
  const pageHeight = doc.internal.pageSize.height;
  const finalPrice = Math.round(basePrice); 

  // --- 1. SETTINGS & HELPERS ---
  const checkPage = (y: number, margin = 20) => {
    if (y > pageHeight - margin) {
      doc.addPage();
      return 20; 
    }
    return y;
  };

  const formatDate = (days: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() + days);
    return d.toLocaleDateString('en-AU');
  };

  // --- 2. BRANDING HEADER (ROCKET REMOVED) ---
  doc.setFillColor(10, 10, 10);
  doc.rect(0, 0, 210, 45, 'F');
  
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 45, 210, 1.5, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.text("WIRED", 14, 25);
  doc.setTextColor(37, 99, 235); 
  doc.text("NOMAD", 48, 25); 

  doc.setTextColor(161, 161, 170);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("DIGITAL SYSTEMS & SOFTWARE ENGINEERING", 14, 33);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(`ABN: 15758394906 | SYDNEY, AU | VERSION 5.8 | REF: ${refCode}`, 14, 38);
// --- THE ROCKET (TS-SAFE FIX) ---
  try {
    // Cast to any or specifically access .src to satisfy jsPDF's string requirement
    const imgPath = typeof rocketIcon === 'string' ? rocketIcon : (rocketIcon as any).src;
    
    if (imgPath) {
      doc.addImage(imgPath, 'PNG', 175, 10, 22, 22, 'rocket_logo', 'FAST');
    }
  } catch (e) {
    console.warn("Rocket icon could not be rendered in PDF:", e);
  }
  // --- 2b. CLIENT INFO ---
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("CLIENT PARTNER:", 14, 58);
  doc.setFont("helvetica", "normal");
  doc.text(`${client.firstName} ${client.lastName}`, 14, 63);
  doc.text(`${client.email} | ${client.phone}`, 14, 68);
  if (client.companyName) {
    doc.text(`${client.companyName} ${client.abn ? `(ABN: ${client.abn})` : ''}`, 14, 73);
  }

  // --- 3. LEGAL CONTENT (1.2x LINE HEIGHT) ---
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("DIGITAL SERVICES AGREEMENT", 14, 85);

  const fontSize = 9;
  const lineHeightFactor = 1.2;
  const spacing = fontSize * lineHeightFactor * 0.3527; 

  doc.setFontSize(fontSize);
  const fullLegalText = `DIGITAL SERVICES AGREEMENT (V5.8)
BETWEEN: WiredNomad, hereafter referred to as "WN", and ${client.firstName} ${client.lastName} ${client.companyName ? `of ${client.companyName}` : ''}, hereafter referred to as "The Client."

### INTRODUCTION
This Agreement governs the terms and conditions under which WN will provide the digital services described herein. This contract supersedes any prior written or verbal agreements, even if they contain conflicting terms. The validity of this contract commences on the date the Client begins using the "Client Panel," or when the initial payment is received and validated by WN. By proceeding, the Client automatically agrees to these terms.

### 1. PAYMENT TERMS
Billing Cycle: Payments are generated prior to project commencement. Payment amounts are disclosed via the email address provided in the "Client Panel."
Final Settlement: Upon project completion, the Client is obligated to settle the remaining balance within 5 business days.
Late Penalties: Failure to settle the balance within the specified timeframe will incur a daily penalty of 15% of the total project value.
Currency: All prices are in Australian Dollars (AUD) plus GST (Goods and Services Tax), unless otherwise specified.
Validation: Payments are typically validated within 1 to 48 business hours. WN reserves the right to delay deployment for reasonable periods without prior notice if administrative delays occur.

### 2. INTELLECTUAL PROPERTY RIGHTS
All technology provided by WN is the exclusive, registered property of WN. The Client is granted a non-exclusive license to use the intellectual property and deliverables strictly as described in the project scope, provided all payments are settled in full. These usage rights continue after the termination of this contract only if no balance is outstanding.

### 3. SCOPE OF DEVELOPMENT & SERVICES
The development strategy is based solely on the quotation sent to the Client’s registered email. Any development requests outside of this original quote ("Variations") must be re-evaluated and quoted separately. New service quotes will only be processed if all prior invoices are paid in full.

### 4. SERVERS & DOMAINS
Term: Hosting and domain services are provided on a 1-year renewal basis.
Migration: If the hosting service is not renewed, the Client will be granted FTP access for 7 days to migrate the site. Access is permanently revoked thereafter.
Usage Policy: Services are provided on LINUX systems for standard business use. High-performance or critical-intensity sites require custom tiers.
Prohibited Content: Use of servers for illegal purposes, copyright infringement, gaming servers, SPAM, or "Bandwidth/Disk space hogging" (e.g., mass streaming or unauthorized mirrors) is strictly prohibited and may result in immediate termination without refund.

### 5. ANTI-SPAM & EMAIL COMPLIANCE
In accordance with the Spam Act 2003 (Cth), sending unsolicited commercial electronic messages is prohibited. All marketing emails must: Be sent only to recipients who have opted-in (Consent). Clearly identify the sender. Include a functional, easy-to-use "Unsubscribe" facility. WN reserves the right to suspend email services found in violation of these regulations.

### 6. CORPORATE EMAIL & THIRD-PARTY CLIENTS
WN is responsible only for the functionality of the Webmail platform (accessible via webmail.domain.com). While WN provides illustrative tutorials for third-party clients (Outlook, Gmail, Apple Mail, etc.), WN is not responsible for the configuration or connectivity issues of these external softwares. Individual mailbox capacity is capped at 2000 MB.

### 7. SEO & RANKING DISCLAIMER
SEO projects are managed by internal and external global teams. While WN uses industry-standard strategies compatible with the latest Google algorithms, WN has no authority or influence over Google’s ranking results or the time required for indexing. Project timelines are estimates based on historical experience.

### 8. MODIFICATIONS & UPDATES
WN reserves the right to charge for updates to site information or imagery requested after the final development has been delivered and the original contract payments concluded.

### 9. LIMITATION OF WARRANTIES & LIABILITY
Conversions: WN does not guarantee specific quantities or qualities of leads, sales, or clicks.
Third-Parties: WN is not responsible for errors or additional fees from third-party processors (PayPal, Stripe, Visa, etc.).
Data Loss: While WN performs backups, the Client is ultimately responsible for their data. WN is not liable for business interruption or data loss. Recovery of content lost due to Client error may incur additional fees.

### 10. CANCELLATION & SUSPENSION
WN reserves the right to suspend services immediately upon any payment discrepancy or failure. If the Client fails to resolve the payment after notice, the service will be permanently terminated for breach of contract.

### 11. GENERAL EXCLUSIONS
WN is not responsible for: Errors caused by Internet Service Providers (ISPs). Virus contamination on Client hardware. Third-party intrusions (Hacking), despite reasonable security measures. Backups for accounts exceeding 1000 MB of space.

### 12. GOOGLE ADS POLICIES
All advertising campaigns must strictly adhere to Google Advertising Policies. WN reserves the right to deactivate non-compliant campaigns without notice. The Client grants WN the right to manage campaign assets for the duration of the service.

### 13. VIRTUAL IP & TELEPHONY
WN acts as a strategic partner for telephony solutions. WN is not liable for occasional server outages from third-party telephony providers. Due to the sensitive nature of the configuration, the Client will not have direct administrative access to the virtual switchboard; it will be managed exclusively by WN.

### 14. CONFIDENTIALITY & PRIVACY
All information or documentation exchanged between the parties is considered Confidential. Neither party shall disclose such information to third parties without consent. This obligation persists for two (2) years after the termination of this contract.

### 15. JURISDICTION & GOVERNING LAW
The Client explicitly consents to the jurisdiction of the laws and courts of New South Wales, Australia. The Client waives any right to any other jurisdiction by reason of their current or future domicile. The Client shall bear all legal costs derived from any action taken against WN.

### ACCEPTANCE
By proceeding with the initial payment, I hereby accept the terms and conditions stipulated in this Agreement, creating a binding commercial relationship with WiredNomad.`;

  const lines = doc.splitTextToSize(fullLegalText, 182);
  let currentY = 92;

  lines.forEach((line: string) => {
    currentY = checkPage(currentY);
    if (line.startsWith('###')) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(fontSize + 1);
      currentY += 2; 
      doc.text(line.replace('### ', ''), 14, currentY);
      currentY += spacing + 1;
      doc.setFontSize(fontSize);
    } else {
      doc.setFont("helvetica", "normal");
      doc.text(line, 14, currentY);
      currentY += spacing;
    }
  });

  // --- 4. ITEMISED INVESTMENT TABLE ---
  doc.addPage(); 
  doc.setTextColor(10, 10, 10);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("ITEMISED INVESTMENT", 14, 25);

  const tableRows: any[][] = [];
  if (platform.web) {
    const webCost = pricingData.platforms.website.price + (webPages - 1) * pricingData.platforms.website.perPagePrice;
    tableRows.push(["Web Architecture", `${webPages} UI/UX Views`, `$${Math.round(webCost).toLocaleString()}`]);
  }
  if (platform.app) {
    tableRows.push(["Mobile Development", "Native iOS & Android Build", `$${Math.round(pricingData.platforms.mobileApp.price).toLocaleString()}`]);
    selectedAppFeatures.forEach((id: string) => {
      const f = pricingData.appSpecificFeatures.find((feat: any) => feat.id === id);
      if (f) tableRows.push([" - App Module", f.label, `$${Math.round(f.price).toLocaleString()}`]);
    });
  }
  selectedFeatures.forEach((id: string) => {
    const f = pricingData.features.find((feat: any) => feat.id === id);
    if (f) tableRows.push(["System Module", f.label, `$${Math.round(f.price).toLocaleString()}`]);
  });
  
  const host = pricingData.infrastructure.hosting.find((h:any) => h.id === selectedHosting);
  tableRows.push(["Cloud Hosting", host?.label || "Basic Tier", `$${Math.round(host?.price || 0).toLocaleString()}`]);

  if (priceAdjustment && priceAdjustment.type !== 'none') {
    const isDiscount = priceAdjustment.type === 'discount';
    const label = isDiscount ? 'Plan Reward / Discount' : 'Payment Plan Surcharge';
    const sign = isDiscount ? '-' : '+';
    tableRows.push([
      label, 
      `${paymentPlan.toUpperCase()} (${sign}${priceAdjustment.percent}%)`, 
      `${sign}$${Math.round(priceAdjustment.amount).toLocaleString()}`
    ]);
  }

  autoTable(doc, {
    startY: 33,
    head: [['Deliverable', 'Description', 'Amount (AUD)']],
    body: tableRows,
    theme: 'striped',
    headStyles: { fillColor: [10, 10, 10], fontStyle: 'bold' },
    didParseCell: (data) => {
      const isLastRow = data.row.index === tableRows.length - 1;
      if (data.section === 'body' && isLastRow && priceAdjustment?.type !== 'none') {
        data.cell.styles.fontStyle = 'bold';
        if (priceAdjustment.type === 'discount') {
          data.cell.styles.textColor = [16, 185, 129];
        } else {
          data.cell.styles.textColor = [249, 115, 22];
        }
      }
    },
    foot: [[`TOTAL PROJECT INVESTMENT`, paymentPlan.toUpperCase(), `$${finalPrice.toLocaleString()}`]],
    footStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 11 }
  });

  // --- 5. ROADMAP ENGINE ---
  doc.addPage();
  doc.setTextColor(10, 10, 10);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("EXECUTION & PAYMENT ROADMAP", 14, 25);

  const roadmapRows: any[][] = [];
  if (paymentPlan === "50-50") {
    const half = Math.round(finalPrice / 2);
    roadmapRows.push([formatDate(0), "Commencement Deposit", `$${half.toLocaleString()}`]);
    roadmapRows.push([formatDate(totalDays), "Project Handover", `$${half.toLocaleString()}`]);
  } else if (paymentPlan === "milestones") { 
    const amount = Math.round(finalPrice / 10);
    const interval = totalDays / 9; 
    const milestoneNames = ["Discovery", "UI/UX Sign-off", "Infrastructure", "Frontend", "Alpha", "APIs", "Refinement", "Beta QA", "Security", "Deployment"];
    for (let i = 0; i < 10; i++) {
      roadmapRows.push([formatDate(Math.round(i * interval)), `Milestone ${i + 1}: ${milestoneNames[i]}`, `$${amount.toLocaleString()}`]);
    }
  } else {
    let daysBetween = (paymentPlan === "daily") ? 1 : (paymentPlan === "fortnightly") ? 14 : (paymentPlan === "monthly") ? 30 : 7;
    const iterations = Math.ceil(totalDays / daysBetween);
    const installment = Math.round(finalPrice / iterations);
    for (let i = 0; i < iterations; i++) {
      const day = i * daysBetween;
      if (day > totalDays) break;
      roadmapRows.push([formatDate(day), `${paymentPlan} Payment ${i + 1}`, `$${installment.toLocaleString()}`]);
    }
  }

  autoTable(doc, {
    startY: 33,
    head: [['Scheduled Date', 'Milestone / Phase', 'Due (AUD)']],
    body: roadmapRows,
    theme: 'grid',
    headStyles: { fillColor: [10, 10, 10] },
    columnStyles: { 2: { textColor: [37, 99, 235], fontStyle: 'bold' } },
    didDrawCell: (data) => {
      if (data.section === 'body' && data.column.index === 2 && data.cell.raw) {
        const rawValue = String(data.cell.raw);
        const cleanAmount = rawValue.replace(/\D/g, ''); 
        const amount = parseInt(cleanAmount, 10);
        
        if (!isNaN(amount)) {
          const rowPaypalUrl = `https://paypal.me/wirednomadAU/${amount}`;
          doc.link(data.cell.x, data.cell.y, data.cell.width, data.cell.height, { url: rowPaypalUrl });
        }
      }
    }
  });

  // --- 6. SIGN OFF & SAVE ---
  let signY = (doc as any).lastAutoTable?.finalY + 40;
  if (signY > 250) { doc.addPage(); signY = 40; }
  
  doc.setFillColor(16, 185, 129);
  doc.circle(16, signY - 1, 1, 'F');
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.setFont("helvetica", "bold");
  doc.text("SYSTEMS OPERATIONAL // AGREEMENT ENCRYPTED", 20, signY);

  doc.setFontSize(8);
  doc.setFont("helvetica", "italic");
  doc.text(`WiredNomad Engineering | Ref: ${refCode} | Generated: ${today.toLocaleDateString()}`, 14, signY + 10);

  // Email Trigger
  const pdfBase64 = doc.output('datauristring').split(',')[1];
  fetch('/api/send-agreement', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      pdfBase64,
      refCode,
      clientName: `${client.firstName} ${client.lastName}`,
      clientEmail: client.email
    }),
  }).catch(err => console.error("Email notification failed:", err));

  doc.save(`WiredNomad_Agreement_${refCode}.pdf`);
};