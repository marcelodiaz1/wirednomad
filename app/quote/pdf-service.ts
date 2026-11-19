import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import rocketIcon from "./rocket.png";

export interface WiredNomadPDFPayload {
  locale?: "en" | "es" | "zh";
  currency: "AUD" | "CLP" | "TWD";
  currencySymbol: string;
  exchangeRate: number;
  projectType: {
    id: string;
    title: string;
    subtitle: string;
    basePrice: number;
    baseHours: number;
  };
  selectedModules: Array<{
    id: string;
    name: string;
    category: string;
    hours: number;
    price: number;
  }>;
  contract: {
    years: 1 | 2 | 3;
    weeks: number;
    label: string;
    discountPercent: number;
  };
  totals: {
    totalHours: number;
    estimatedDays: number;
    subtotal: number;
    discountAmount: number;
    totalPrice: number;
    weeklyPayment: number;
  };
  client: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    companyName?: string;
    abn?: string;
  };
}

export const generateWiredNomadPDF = (data: WiredNomadPDFPayload) => {
  const {
    currency = "AUD",
    currencySymbol = "A$",
    projectType,
    selectedModules = [],
    contract,
    totals,
    client,
  } = data;

  const doc = new jsPDF();
  const today = new Date();
  const refCode = `WN-${Math.random().toString(36).toUpperCase().substring(7)}`;
  const pageHeight = doc.internal.pageSize.height;

  // --- 1. SETTINGS & HELPERS ---
  const formatCurrency = (amount: number, allowDecimals = false) => {
    const decimals = allowDecimals && currency === "AUD" ? 2 : 0;
    return `${currencySymbol}${amount.toLocaleString("en-AU", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}`;
  };

  const checkPage = (y: number, margin = 20) => {
    if (y > pageHeight - margin) {
      doc.addPage();
      return 20;
    }
    return y;
  };

  const formatDate = (daysToAdd: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() + daysToAdd);
    return d.toLocaleDateString("en-AU");
  };

  // --- 2. BRANDING HEADER ---
  doc.setFillColor(10, 10, 10);
  doc.rect(0, 0, 210, 45, "F");

  doc.setFillColor(37, 99, 235);
  doc.rect(0, 45, 210, 1.5, "F");

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
  doc.text(`ABN: 15758394906 | SYDNEY, AU | VERSION 6.0 | REF: ${refCode}`, 14, 38);

  // Rocket Logo
  try {
    const imgPath = typeof rocketIcon === "string" ? rocketIcon : (rocketIcon as any).src;
    if (imgPath) {
      doc.addImage(imgPath, "PNG", 175, 10, 22, 22, "rocket_logo", "FAST");
    }
  } catch (e) {
    console.warn("Rocket icon could not be rendered in PDF:", e);
  }

  // --- 2b. CLIENT & CONTRACT SNAPSHOT ---
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("CLIENT PARTNER:", 14, 56);
  doc.setFont("helvetica", "normal");
  doc.text(`${client.firstName} ${client.lastName}`, 14, 61);
  doc.text(`${client.email} | ${client.phone}`, 14, 66);
  if (client.companyName) {
    doc.text(`${client.companyName} ${client.abn ? `(ID/ABN: ${client.abn})` : ""}`, 14, 71);
  }

  // Contract Highlight Box (Right Side)
  doc.setFillColor(244, 244, 245);
  doc.roundedRect(122, 51, 74, 24, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(37, 99, 235);
  doc.text("CONTRACT SUMMARY", 126, 56);
  doc.setTextColor(24, 24, 27);
  doc.setFontSize(9);
  doc.text(`Plan: ${projectType.title}`, 126, 61);
  doc.text(`Term: ${contract.label} (${contract.weeks} Weeks)`, 126, 66);
  doc.text(`Weekly Fee: ${formatCurrency(totals.weeklyPayment, true)} ${currency}/wk`, 126, 71);

  // --- 3. LEGAL CONTENT ---
  doc.setTextColor(10, 10, 10);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("DIGITAL SERVICES & SUBSCRIPTION AGREEMENT", 14, 85);

  const fontSize = 9;
  const lineHeightFactor = 1.2;
  const spacing = fontSize * lineHeightFactor * 0.3527;

  doc.setFontSize(fontSize);
  const fullLegalText = `DIGITAL SERVICES & SUBSCRIPTION AGREEMENT (V6.0)
BETWEEN: WiredNomad, hereafter referred to as "WN", and ${client.firstName} ${client.lastName} ${client.companyName ? `of ${client.companyName}` : ""}, hereafter referred to as "The Client."

### INTRODUCTION
This Agreement governs the terms and conditions under which WN will design, engineer, host, and maintain the modular digital solution selected by the Client. This contract supersedes any prior written or verbal agreements. The validity of this contract commences on the date the Client accesses the "Client Panel" or when the initial weekly installment is received and validated by WN.

### 1. SUBSCRIPTION & WEEKLY PAYMENT TERMS
Contract Term: The Client commits to a ${contract.years}-year (${contract.weeks}-week) service agreement for the selected ${projectType.title} and ${selectedModules.length} modular feature(s).
Weekly Installments: The total contract value of ${formatCurrency(totals.totalPrice)} (${currency}) is divided into ${contract.weeks} equal weekly payments of ${formatCurrency(totals.weeklyPayment, true)} (${currency}).
Billing Cycle: Weekly payments are billed automatically in advance starting on the commencement date.
Late Penalties: Overdue weekly installments not settled within 5 business days will incur a late fee of 15% on the overdue installment and may result in temporary service suspension.
Currency & Taxes: All figures in this proposal are quoted in ${currency} (${currencySymbol}). Australian clients are subject to applicable GST.
Validation: Payments are typically validated within 1 to 48 business hours.

### 2. INTELLECTUAL PROPERTY & OWNERSHIP
All underlying frameworks, proprietary modules, and technology provided by WN remain the registered property of WN during the active subscription term. The Client is granted an exclusive commercial license to operate the deliverables for their business. Upon full completion of all ${contract.weeks} weekly payments under the ${contract.label} term, full ownership rights of the custom frontend assets and client data transfer to the Client.

### 3. MODULAR SCOPE & DEVELOPMENT HOURS
The development scope is strictly defined by the Base Solution (${projectType.baseHours} hrs) and the ${selectedModules.length} selected module(s), totaling ${totals.totalHours} estimated engineering hours (~${totals.estimatedDays} working days). Any additional modules or custom features requested outside this scope ("Variations") can be added to the Client's subscription at WN's published modular rates.

### 4. MANAGED HOSTING, DOMAINS & MAINTENANCE
Included Infrastructure: Managed cloud hosting, SSL security certificates, routine updates, and technical support are included throughout the active ${contract.weeks}-week subscription term.
Migration: Upon contract expiration or non-renewal, the Client will be granted FTP/export access for 7 days to migrate their assets, provided no balance is outstanding.
Prohibited Content: Use of WN servers for illegal purposes, copyright infringement, gaming servers, SPAM, or excessive bandwidth/disk abuse is strictly prohibited and may result in immediate termination without refund.

### 5. ANTI-SPAM & EMAIL COMPLIANCE
In accordance with the Spam Act 2003 (Cth) and international equivalents, sending unsolicited commercial electronic messages is prohibited. Marketing emails must only be sent to opted-in recipients and include a functional "Unsubscribe" link.

### 6. CORPORATE EMAIL & THIRD-PARTY CLIENTS
WN is responsible only for the functionality of the Webmail platform. While WN provides setup guides for third-party clients (Outlook, Gmail, Apple Mail), WN is not liable for third-party software configuration issues. Individual mailbox capacity is capped at 2000 MB.

### 7. SEO & RANKING DISCLAIMER
While WN implements technical SEO best practices as specified in the selected modules, WN has no authority or influence over Google or third-party search engine ranking algorithms or indexing timelines.

### 8. LIMITATION OF WARRANTIES & LIABILITY
Conversions: WN does not guarantee specific quantities of leads, sales, or traffic.
Third-Parties: WN is not responsible for outages or fees from third-party payment processors (Stripe, PayPal, local gateways, etc.).
Data Loss: While WN performs routine backups, the Client remains responsible for maintaining copies of critical business content.

### 9. EARLY CANCELLATION & SUSPENSION
If the Client cancels the agreement prior to completing the ${contract.weeks}-week commitment, the remaining unpaid balance of the build value becomes due immediately, or WN may permanently revoke access to the hosted platform and proprietary modules.

### 10. CONFIDENTIALITY & PRIVACY
All proprietary data, credentials, and documentation exchanged between the parties are strictly confidential. This obligation persists for two (2) years after the termination of this contract.

### 11. JURISDICTION & GOVERNING LAW
The Client explicitly consents to the jurisdiction of the laws and courts of New South Wales, Australia, waiving any other jurisdiction by reason of current or future domicile.

### ACCEPTANCE
By completing the initial weekly payment of ${formatCurrency(totals.weeklyPayment, true)} (${currency}), the Client accepts all terms stipulated in this Agreement, creating a binding commercial relationship with WiredNomad.`;

  const lines = doc.splitTextToSize(fullLegalText, 182);
  let currentY = 92;

  lines.forEach((line: string) => {
    currentY = checkPage(currentY);
    if (line.startsWith("###")) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(fontSize + 1);
      currentY += 2;
      doc.text(line.replace("### ", ""), 14, currentY);
      currentY += spacing + 1;
      doc.setFontSize(fontSize);
    } else {
      doc.setFont("helvetica", "normal");
      doc.text(line, 14, currentY);
      currentY += spacing;
    }
  });

  // --- 4. ITEMISED MODULAR INVESTMENT & HOURS TABLE ---
  doc.addPage();
  doc.setTextColor(10, 10, 10);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("ITEMISED MODULAR SCOPE & INVESTMENT", 14, 25);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(
    `Currency: ${currency} | Total Engineering Effort: ${totals.totalHours} hrs (~${totals.estimatedDays} business days)`,
    14,
    31
  );

  const tableRows: any[][] = [
    [
      "Solution Base",
      `${projectType.title} — ${projectType.subtitle}`,
      `${projectType.baseHours} hrs`,
      formatCurrency(projectType.basePrice),
    ],
  ];

  selectedModules.forEach((mod) => {
    tableRows.push([
      mod.category,
      mod.name,
      `${mod.hours} hrs`,
      formatCurrency(mod.price),
    ]);
  });

  tableRows.push([
    "Managed Care",
    `Cloud Hosting, SSL & Maintenance (${contract.label})`,
    "Included",
    formatCurrency(0),
  ]);

  if (contract.discountPercent > 0 && totals.discountAmount > 0) {
    tableRows.push([
      "Contract Reward",
      `${contract.label} Commitment Discount (-${contract.discountPercent}%)`,
      "—",
      `-${formatCurrency(totals.discountAmount)}`,
    ]);
  }

  autoTable(doc, {
    startY: 37,
    head: [["Category", "Module / Deliverable", "Est. Hours", `Value (${currency})`]],
    body: tableRows,
    theme: "striped",
    headStyles: { fillColor: [10, 10, 10], fontStyle: "bold" },
    columnStyles: {
      2: { halign: "right" },
      3: { halign: "right", fontStyle: "bold" },
    },
    didParseCell: (cellData) => {
      const isLastRow = cellData.row.index === tableRows.length - 1;
      if (cellData.section === "body" && isLastRow && contract.discountPercent > 0) {
        cellData.cell.styles.fontStyle = "bold";
        cellData.cell.styles.textColor = [16, 185, 129];
      }
    },
    foot: [
      [
        `TOTAL CONTRACT VALUE (${contract.weeks} WEEKS)`,
        `${formatCurrency(totals.weeklyPayment, true)} / week`,
        `${totals.totalHours} hrs`,
        formatCurrency(totals.totalPrice),
      ],
    ],
    footStyles: {
      fillColor: [37, 99, 235],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 10,
    },
  });

  // --- 5. DELIVERY TIMELINE & WEEKLY PAYMENT SCHEDULE ---
  doc.addPage();
  doc.setTextColor(10, 10, 10);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("DELIVERY & WEEKLY SUBSCRIPTION SCHEDULE", 14, 25);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(90, 90, 90);
  doc.text(
    `Estimated Build Completion: ${formatDate(totals.estimatedDays)} (${totals.totalHours} hrs) | Subscription: ${contract.weeks} weekly payments of ${formatCurrency(totals.weeklyPayment, true)}`,
    14,
    31
  );

  // Summary box of the 4 delivery phases + weekly payment schedule
  const phaseInterval = Math.max(1, Math.round(totals.estimatedDays / 4));
  const deliveryPhases = [
    [formatDate(0), "Phase 1: Kickoff, Architecture & Initial Weekly Payment", "Week 1", formatCurrency(totals.weeklyPayment, true)],
    [formatDate(phaseInterval), "Phase 2: UI/UX & Core Module Engineering", `Week ${Math.max(2, Math.ceil(phaseInterval / 7))}`, "Active Weekly Billing"],
    [formatDate(phaseInterval * 2), "Phase 3: Integrations, QA & Staging Review", `Week ${Math.max(3, Math.ceil((phaseInterval * 2) / 7))}`, "Active Weekly Billing"],
    [formatDate(totals.estimatedDays), "Phase 4: Production Launch & Handover", `Week ${Math.max(4, Math.ceil(totals.estimatedDays / 7))}`, "Active Weekly Billing"],
  ];

  autoTable(doc, {
    startY: 37,
    head: [["Target Date", "Engineering Milestone", "Timeline", "Billing Status"]],
    body: deliveryPhases,
    theme: "grid",
    headStyles: { fillColor: [24, 24, 27] },
  });

  const scheduleStartY = ((doc as any).lastAutoTable?.finalY || 80) + 12;

  doc.setTextColor(10, 10, 10);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(`WEEKLY PAYMENT LEDGER (${contract.weeks} WEEKS — ${contract.label.toUpperCase()})`, 14, scheduleStartY);

  const weeklyRows: any[][] = [];
  for (let w = 1; w <= contract.weeks; w++) {
    const dueDate = formatDate((w - 1) * 7);
    weeklyRows.push([
      `Week ${w} of ${contract.weeks}`,
      dueDate,
      `${projectType.title} Subscription`,
      formatCurrency(totals.weeklyPayment, true),
    ]);
  }

  autoTable(doc, {
    startY: scheduleStartY + 5,
    head: [["Installment", "Scheduled Date", "Description", `Weekly Due (${currency})`]],
    body: weeklyRows,
    theme: "striped",
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [10, 10, 10] },
    columnStyles: { 3: { textColor: [37, 99, 235], fontStyle: "bold", halign: "right" } },
    didDrawCell: (cellData) => {
      if (cellData.section === "body" && cellData.column.index === 3 && cellData.cell.raw) {
        const numericAmount = Number(totals.weeklyPayment.toFixed(2));
        if (!isNaN(numericAmount) && numericAmount > 0) {
          const rowPaypalUrl = `https://paypal.me/wirednomadAU/${numericAmount}${currency}`;
          doc.link(cellData.cell.x, cellData.cell.y, cellData.cell.width, cellData.cell.height, {
            url: rowPaypalUrl,
          });
        }
      }
    },
  });

  // --- 6. SIGN OFF & SAVE ---
  let signY = ((doc as any).lastAutoTable?.finalY || 200) + 20;
  if (signY > 265) {
    doc.addPage();
    signY = 30;
  }

  doc.setFillColor(16, 185, 129);
  doc.circle(16, signY - 1, 1, "F");
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.setFont("helvetica", "bold");
  doc.text("SYSTEMS OPERATIONAL // AGREEMENT ENCRYPTED", 20, signY);

  doc.setFontSize(8);
  doc.setFont("helvetica", "italic");
  doc.text(
    `WiredNomad Engineering | Ref: ${refCode} | Currency: ${currency} | Generated: ${today.toLocaleDateString("en-AU")}`,
    14,
    signY + 8
  );

  // Email Trigger
  const pdfBase64 = doc.output("datauristring").split(",")[1];
  fetch("/api/send-agreement", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      pdfBase64,
      refCode,
      currency,
      contractYears: contract.years,
      weeklyPayment: totals.weeklyPayment,
      totalPrice: totals.totalPrice,
      clientName: `${client.firstName} ${client.lastName}`,
      clientEmail: client.email,
    }),
  }).catch((err) => console.error("Email notification failed:", err));

  doc.save(`WiredNomad_Agreement_${refCode}_${currency}.pdf`);
};