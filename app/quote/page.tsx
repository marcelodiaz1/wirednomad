"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Clock,
  ShieldCheck,
  FileText,
  GripVertical,
  Plus,
  Trash2,
  Layout,
  Globe,
  Layers,
  ShoppingBag,
  CalendarRange,
  CheckCircle2,
  DollarSign,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { generateWiredNomadPDF } from "./pdf-service";
import { dictionaries, Locale } from "@/lib/dictionaries";

export type Currency = "AUD" | "CLP" | "TWD";

const CURRENCY_CONFIG: Record<
  Currency,
  { symbol: string; rate: number; label: string; flag: string }
> = {
  AUD: { symbol: "A$", rate: 1, label: "AUD", flag: "🇦🇺" },
  CLP: { symbol: "$", rate: 635, label: "CLP", flag: "🇨🇱" },
  TWD: { symbol: "NT$", rate: 21.5, label: "TWD", flag: "🇹🇼" },
};

interface ProjectTier {
  id: "onepager" | "medium" | "bigsystem" | "ecommerce";
  basePriceAUD: number;
  baseHours: number;
  recommendedModules: string[];
  Icon: React.ElementType;
}

interface WebsiteModule {
  id: string;
  priceAUD: number;
  hours: number;
}

const PROJECT_TIERS: ProjectTier[] = [
  {
    id: "onepager",
    basePriceAUD: 450,
    baseHours: 10,
    recommendedModules: ["hero", "contact_form", "seo_basic"],
    Icon: Layout,
  },
  {
    id: "medium",
    basePriceAUD: 950,
    baseHours: 22,
    recommendedModules: ["hero", "cms_blog", "contact_form", "seo_basic", "analytics"],
    Icon: Globe,
  },
  {
    id: "ecommerce",
    basePriceAUD: 1550,
    baseHours: 38,
    recommendedModules: ["hero", "shop_catalog", "stripe_payments", "user_auth", "seo_basic"],
    Icon: ShoppingBag,
  },
  {
    id: "bigsystem",
    basePriceAUD: 2400,
    baseHours: 60,
    recommendedModules: ["user_auth", "admin_dashboard", "api_integration", "db_arch"],
    Icon: Layers,
  },
];

const AVAILABLE_MODULES: WebsiteModule[] = [
  // Design & UI/UX
  { id: "hero", priceAUD: 150, hours: 4 },
  { id: "brand_kit", priceAUD: 260, hours: 6 },
  { id: "design_system", priceAUD: 340, hours: 9 },
  { id: "animations_motion", priceAUD: 220, hours: 5 },
  { id: "interactive_calculators", priceAUD: 320, hours: 8 },
  { id: "dark_mode_toggle", priceAUD: 110, hours: 3 },

  // Content & Media
  { id: "contact_form", priceAUD: 120, hours: 3 },
  { id: "cms_blog", priceAUD: 280, hours: 7 },
  { id: "media_gallery", priceAUD: 170, hours: 4 },
  { id: "testimonials_reviews", priceAUD: 140, hours: 3 },
  { id: "faq_knowledgebase", priceAUD: 190, hours: 5 },
  { id: "legal_pages", priceAUD: 90, hours: 2 },

  // E-Commerce
  { id: "shop_catalog", priceAUD: 480, hours: 12 },
  { id: "stripe_payments", priceAUD: 320, hours: 8 },
  { id: "subscriptions_recurring", priceAUD: 390, hours: 10 },
  { id: "shipping_rules", priceAUD: 240, hours: 6 },
  { id: "discounts_coupons", priceAUD: 180, hours: 4 },
  { id: "inventory_alerts", priceAUD: 210, hours: 5 },

  // Bookings & Operations
  { id: "booking", priceAUD: 350, hours: 9 },
  { id: "calendar_sync", priceAUD: 230, hours: 6 },
  { id: "automated_notifications", priceAUD: 200, hours: 5 },
  { id: "pdf_invoices", priceAUD: 270, hours: 7 },

  // Users, Security & System Architecture
  { id: "user_auth", priceAUD: 380, hours: 10 },
  { id: "admin_dashboard", priceAUD: 550, hours: 15 },
  { id: "api_integration", priceAUD: 400, hours: 10 },
  { id: "db_arch", priceAUD: 450, hours: 12 },
  { id: "security_hardening", priceAUD: 260, hours: 6 },

  // Growth, SEO & Analytics
  { id: "seo_basic", priceAUD: 180, hours: 4 },
  { id: "multilingual", priceAUD: 250, hours: 6 },
  { id: "analytics", priceAUD: 110, hours: 3 },
  { id: "newsletter_crm", priceAUD: 190, hours: 5 },
];

const CONTRACT_OPTIONS = [
  { years: 1 as const, weeks: 52, discount: 0 },
  { years: 2 as const, weeks: 104, discount: 0.1 },
  { years: 3 as const, weeks: 156, discount: 0.18 },
];

export default function AdvancedQuotePage() {
  const [locale, setLocale] = useState<Locale>("en");
  const t: any = dictionaries[locale]?.quote || {};

  const [currency, setCurrency] = useState<Currency>("AUD");
  const [selectedTierId, setSelectedTierId] = useState<ProjectTier["id"]>("onepager");
  const [selectedModuleIds, setSelectedModuleIds] = useState<string[]>([
    "hero",
    "contact_form",
    "seo_basic",
  ]);
  const [contractYears, setContractYears] = useState<1 | 2 | 3>(1);

  const [draggedModuleId, setDraggedModuleId] = useState<string | null>(null);
  const [isDraggingOverDropzone, setIsDraggingOverDropzone] = useState(false);

  const [errors, setErrors] = useState<string[]>([]);
  const [clientData, setClientData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    companyName: "",
    abn: "",
  });

  // Fixed "en-AU" locale prevents SSR/client number formatting hydration mismatches
  const formatMoney = (amountInAUD: number, decimals = 0) => {
    const config = CURRENCY_CONFIG[currency];
    const converted = amountInAUD * config.rate;
    const effectiveDecimals = currency === "CLP" || currency === "TWD" ? 0 : decimals;
    return `${config.symbol}${converted.toLocaleString("en-AU", {
      minimumFractionDigits: effectiveDecimals,
      maximumFractionDigits: effectiveDecimals,
    })}`;
  };

  const handleSelectTier = (tier: ProjectTier) => {
    setSelectedTierId(tier.id);
    setSelectedModuleIds(tier.recommendedModules);
  };

  const addModule = (id: string) => {
    if (!selectedModuleIds.includes(id)) {
      setSelectedModuleIds((prev) => [...prev, id]);
    }
  };

  const removeModule = (id: string) => {
    setSelectedModuleIds((prev) => prev.filter((m) => m !== id));
  };

  const handleDragStartAvailable = (e: React.DragEvent, id: string) => {
    setDraggedModuleId(id);
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.setData("source", "available");
  };

  const handleDragStartSelected = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("reorderIndex", index.toString());
    e.dataTransfer.setData("source", "selected");
  };

  const handleDropOnBuilder = (e: React.DragEvent, targetIndex?: number) => {
    e.preventDefault();
    setIsDraggingOverDropzone(false);
    const source = e.dataTransfer.getData("source");

    if (source === "available") {
      const moduleId = e.dataTransfer.getData("text/plain") || draggedModuleId;
      if (moduleId && !selectedModuleIds.includes(moduleId)) {
        if (typeof targetIndex === "number") {
          const updated = [...selectedModuleIds];
          updated.splice(targetIndex, 0, moduleId);
          setSelectedModuleIds(updated);
        } else {
          setSelectedModuleIds((prev) => [...prev, moduleId]);
        }
      }
    } else if (source === "selected" && typeof targetIndex === "number") {
      const fromIndex = parseInt(e.dataTransfer.getData("reorderIndex"), 10);
      if (!isNaN(fromIndex) && fromIndex !== targetIndex) {
        const updated = [...selectedModuleIds];
        const [movedItem] = updated.splice(fromIndex, 1);
        updated.splice(targetIndex, 0, movedItem);
        setSelectedModuleIds(updated);
      }
    }
    setDraggedModuleId(null);
  };

  const calculations = useMemo(() => {
    const activeTier = PROJECT_TIERS.find((tier) => tier.id === selectedTierId)!;
    const tierCopy = t.tiers?.[activeTier.id] || { title: activeTier.id, subtitle: "" };

    const activeModules = selectedModuleIds
      .map((id) => {
        const baseMod = AVAILABLE_MODULES.find((m) => m.id === id);
        if (!baseMod) return null;
        const copy = t.modules?.[id] || { name: id, category: "Module" };
        return {
          ...baseMod,
          name: copy.name,
          category: copy.category,
        };
      })
      .filter((m): m is WebsiteModule & { name: string; category: string } => Boolean(m));

    const modulesPriceAUD = activeModules.reduce((sum, m) => sum + m.priceAUD, 0);
    const modulesHours = activeModules.reduce((sum, m) => sum + m.hours, 0);

    const subtotalAUD = activeTier.basePriceAUD + modulesPriceAUD;
    const totalHours = activeTier.baseHours + modulesHours;

    const contractBase = CONTRACT_OPTIONS.find((c) => c.years === contractYears)!;
    const contractCopy = t.contractOptions?.[contractYears] || {
      label: `${contractYears} Year`,
      badge: "",
    };
    const discountAmountAUD = subtotalAUD * contractBase.discount;
    const finalTotalAUD = subtotalAUD - discountAmountAUD;
    const weeklyAmountAUD = finalTotalAUD / contractBase.weeks;

    const rate = CURRENCY_CONFIG[currency].rate;

    return {
      activeTier,
      tierCopy,
      activeModules,
      subtotalAUD,
      discountAmountAUD,
      finalTotalAUD,
      weeklyAmountAUD,
      totalHours,
      contract: {
        ...contractBase,
        label: contractCopy.label,
        badge: contractCopy.badge,
      },
      converted: {
        currency,
        symbol: CURRENCY_CONFIG[currency].symbol,
        rate,
        basePrice: Math.round(activeTier.basePriceAUD * rate),
        modulesPrice: Math.round(modulesPriceAUD * rate),
        subtotal: Math.round(subtotalAUD * rate),
        discountAmount: Math.round(discountAmountAUD * rate),
        finalTotal: Math.round(finalTotalAUD * rate),
        weeklyAmount: Number((weeklyAmountAUD * rate).toFixed(currency === "AUD" ? 2 : 0)),
      },
    };
  }, [selectedTierId, selectedModuleIds, contractYears, currency, t]);

  const handleDownload = () => {
    const newErrors: string[] = [];
    if (!clientData.firstName.trim()) newErrors.push("firstName");
    if (!clientData.lastName.trim()) newErrors.push("lastName");
    if (!clientData.email.includes("@")) newErrors.push("email");
    if (!clientData.phone.trim()) newErrors.push("phone");

    if (newErrors.length > 0) {
      setErrors(newErrors);
      document.getElementById(newErrors[0])?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setErrors([]);

    generateWiredNomadPDF({
      locale,
      currency,
      currencySymbol: calculations.converted.symbol,
      exchangeRate: calculations.converted.rate,
      projectType: {
        id: calculations.activeTier.id,
        title: calculations.tierCopy.title,
        subtitle: calculations.tierCopy.subtitle,
        basePrice: calculations.converted.basePrice,
        baseHours: calculations.activeTier.baseHours,
      },
      selectedModules: calculations.activeModules.map((m) => ({
        id: m.id,
        name: m.name,
        category: m.category,
        hours: m.hours,
        price: Math.round(m.priceAUD * calculations.converted.rate),
      })),
      contract: {
        years: calculations.contract.years,
        weeks: calculations.contract.weeks,
        label: calculations.contract.label,
        discountPercent: calculations.contract.discount * 100,
      },
      totals: {
        totalHours: calculations.totalHours,
        estimatedDays: Math.ceil(calculations.totalHours / 6),
        subtotal: calculations.converted.subtotal,
        discountAmount: calculations.converted.discountAmount,
        totalPrice: calculations.converted.finalTotal,
        weeklyPayment: calculations.converted.weeklyAmount,
      },
      client: clientData,
    } as any);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-blue-500/30 font-sans">
      <Navbar locale={locale} onLocaleChange={setLocale} />

      <header className="pt-32 pb-12 px-6 max-w-5xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="bg-blue-500/10 text-blue-500 border border-blue-500/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 inline-block">
            {t.badge}
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
            {t.title}
          </h1>

          {/* Currency Switcher */}
          <div className="inline-flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 p-1.5 rounded-2xl mt-2">
            {(Object.keys(CURRENCY_CONFIG) as Currency[]).map((curr) => {
              const item = CURRENCY_CONFIG[curr];
              const isActive = currency === curr;
              return (
                <button
                  key={curr}
                  type="button"
                  onClick={() => setCurrency(curr)}
                  className={`px-4 py-2 rounded-xl text-xs font-black tracking-wider flex items-center gap-2 transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <span>{item.flag}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>
      </header>

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-14 pb-36">
          {/* STEP 1: PROJECT SOLUTION TIER */}
          <section>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-blue-500 mb-5 font-mono">
              {t.step1Title}
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {PROJECT_TIERS.map((tier) => {
                const active = selectedTierId === tier.id;
                const Icon = tier.Icon;
                const copy = t.tiers?.[tier.id] || { title: tier.id, subtitle: "" };
                return (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => handleSelectTier(tier)}
                    className={`p-6 rounded-3xl border-2 text-left transition-all flex flex-col justify-between ${
                      active
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700"
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div
                          className={`p-3 rounded-2xl ${
                            active ? "bg-blue-500 text-white" : "bg-zinc-800 text-zinc-400"
                          }`}
                        >
                          <Icon size={22} />
                        </div>
                        <span className="text-xs font-mono text-zinc-400 bg-zinc-950/70 px-2.5 py-1 rounded-lg border border-zinc-800">
                          {tier.baseHours} {t.hoursBaseSuffix}
                        </span>
                      </div>
                      <div className="font-black text-lg text-white">{copy.title}</div>
                      <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{copy.subtitle}</p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-zinc-800/80 flex justify-between items-center">
                      <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
                        {t.baseSetupLabel}
                      </span>
                      <span className="font-mono font-bold text-blue-400 text-sm">
                        {formatMoney(tier.basePriceAUD)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* STEP 2: DRAGGABLE MODULES BUILDER */}
          <section>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-blue-500 font-mono">
                {t.step2Title}
              </h2>
              <span className="text-xs text-zinc-500">{t.step2Hint}</span>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* AVAILABLE MODULES */}
              <div className="bg-zinc-900/30 border border-zinc-800 rounded-3xl p-5">
                <div className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-4 flex justify-between">
                  <span>{t.availableModulesTitle}</span>
                  <span>
                    {AVAILABLE_MODULES.length - selectedModuleIds.length} {t.leftSuffix}
                  </span>
                </div>

                <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                  {AVAILABLE_MODULES.map((mod) => {
                    const isSelected = selectedModuleIds.includes(mod.id);
                    const copy = t.modules?.[mod.id] || { name: mod.id, category: "Module" };
                    return (
                      <div
                        key={mod.id}
                        draggable={!isSelected}
                        onDragStart={(e) => handleDragStartAvailable(e, mod.id)}
                        className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                          isSelected
                            ? "border-zinc-800/50 bg-zinc-950/40 opacity-45 cursor-not-allowed"
                            : "border-zinc-800 bg-zinc-900 hover:border-blue-500/60 cursor-grab active:cursor-grabbing"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <GripVertical size={16} className="text-zinc-600 shrink-0" />
                          <div className="truncate">
                            <div className="text-xs font-bold text-zinc-200 truncate">
                              {copy.name}
                            </div>
                            <div className="text-[10px] text-zinc-500 flex items-center gap-2 mt-0.5">
                              <span>{copy.category}</span>
                              <span>•</span>
                              <span className="text-zinc-400">
                                {mod.hours} {t.hrsSuffix}
                              </span>
                              <span>•</span>
                              <span className="text-blue-400 font-mono">
                                +{formatMoney(mod.priceAUD)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          disabled={isSelected}
                          onClick={() => addModule(mod.id)}
                          className={`p-2 rounded-xl shrink-0 transition-colors ${
                            isSelected
                              ? "text-emerald-500 bg-emerald-500/10"
                              : "bg-zinc-800 hover:bg-blue-600 text-white"
                          }`}
                          title={isSelected ? t.addedTooltip : t.addTooltip}
                        >
                          {isSelected ? <CheckCircle2 size={15} /> : <Plus size={15} />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SELECTED STACK DROPZONE */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDraggingOverDropzone(true);
                }}
                onDragLeave={() => setIsDraggingOverDropzone(false)}
                onDrop={(e) => handleDropOnBuilder(e)}
                className={`rounded-3xl p-5 border-2 border-dashed transition-all flex flex-col ${
                  isDraggingOverDropzone
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-zinc-700/80 bg-zinc-900/50"
                }`}
              >
                <div className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-4 flex justify-between items-center">
                  <span>
                    {t.selectedModulesTitle} ({calculations.activeModules.length})
                  </span>
                  <span className="font-mono text-[11px] text-zinc-400">
                    +{calculations.activeModules.reduce((a, b) => a + b.hours, 0)} {t.hrsSuffix}
                  </span>
                </div>

                {calculations.activeModules.length === 0 ? (
                  <div className="flex-1 min-h-[260px] flex flex-col items-center justify-center text-center p-6 text-zinc-500">
                    <Layers size={32} className="mb-3 opacity-40" />
                    <p className="text-xs font-bold">{t.dropEmptyTitle}</p>
                    <p className="text-[11px] mt-1">{t.dropEmptyDesc}</p>
                  </div>
                ) : (
                  <div className="space-y-2.5 flex-1 max-h-[460px] overflow-y-auto pr-1">
                    <AnimatePresence>
                      {calculations.activeModules.map((mod, index) => (
                        <motion.div
                          key={mod.id}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          draggable
                          onDragStart={(e: any) => handleDragStartSelected(e, index)}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.stopPropagation();
                            handleDropOnBuilder(e, index);
                          }}
                          className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-3 cursor-grab active:cursor-grabbing group"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <GripVertical size={15} className="text-zinc-600 shrink-0" />
                            <div className="truncate">
                              <div className="text-xs font-bold text-white truncate">
                                {mod.name}
                              </div>
                              <div className="text-[10px] text-zinc-400 font-mono mt-0.5">
                                {mod.hours} {t.hrsSuffix} • {formatMoney(mod.priceAUD)}
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeModule(mod.id)}
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title={t.removeTooltip}
                          >
                            <Trash2 size={15} />
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* STEP 3: CONTRACT TERM */}
          <section>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-blue-500 mb-5 font-mono">
              {t.step3Title}
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {CONTRACT_OPTIONS.map((option) => {
                const active = contractYears === option.years;
                const copy = t.contractOptions?.[option.years] || {
                  label: `${option.years} Year`,
                  badge: "",
                };
                const discountedTotalAUD = calculations.subtotalAUD * (1 - option.discount);
                const weeklyPreviewAUD = discountedTotalAUD / option.weeks;

                return (
                  <button
                    key={option.years}
                    type="button"
                    onClick={() => setContractYears(option.years)}
                    className={`p-5 rounded-3xl border-2 text-left transition-all relative ${
                      active
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700"
                    }`}
                  >
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        option.discount > 0
                          ? "bg-emerald-500/15 text-emerald-400"
                          : "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      {copy.badge}
                    </span>

                    <div className="text-xl font-black mt-3">{copy.label}</div>
                    <div className="text-xs text-zinc-500 mt-0.5">
                      {option.weeks} {t.weeklyPaymentsSuffix}
                    </div>

                    <div className="mt-4 pt-3 border-t border-zinc-800/80">
                      <span className="text-lg font-black text-white font-mono">
                        {formatMoney(weeklyPreviewAUD, 2)}
                      </span>
                      <span className="text-xs text-zinc-400"> {t.perWeekSuffix}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* STEP 4: CLIENT DETAILS */}
          <section id="client-info-section">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-blue-500 mb-5 font-mono">
              {t.step4Title}
            </h2>
            <div className="grid sm:grid-cols-2 gap-5 bg-zinc-900/30 p-7 rounded-3xl border border-zinc-800">
              <div id="firstName" className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  {t.clientFields?.firstName}
                </label>
                <input
                  type="text"
                  value={clientData.firstName}
                  onChange={(e) => setClientData({ ...clientData, firstName: e.target.value })}
                  className={`w-full bg-zinc-950 border ${
                    errors.includes("firstName") ? "border-red-500" : "border-zinc-800"
                  } p-3.5 rounded-xl focus:border-blue-500 outline-none`}
                />
              </div>

              <div id="lastName" className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  {t.clientFields?.lastName}
                </label>
                <input
                  type="text"
                  value={clientData.lastName}
                  onChange={(e) => setClientData({ ...clientData, lastName: e.target.value })}
                  className={`w-full bg-zinc-950 border ${
                    errors.includes("lastName") ? "border-red-500" : "border-zinc-800"
                  } p-3.5 rounded-xl focus:border-blue-500 outline-none`}
                />
              </div>

              <div id="email" className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  {t.clientFields?.email}
                </label>
                <input
                  type="email"
                  value={clientData.email}
                  onChange={(e) => setClientData({ ...clientData, email: e.target.value })}
                  className={`w-full bg-zinc-950 border ${
                    errors.includes("email") ? "border-red-500" : "border-zinc-800"
                  } p-3.5 rounded-xl focus:border-blue-500 outline-none`}
                />
              </div>

              <div id="phone" className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  {t.clientFields?.phone}
                </label>
                <input
                  type="tel"
                  value={clientData.phone}
                  onChange={(e) => setClientData({ ...clientData, phone: e.target.value })}
                  className={`w-full bg-zinc-950 border ${
                    errors.includes("phone") ? "border-red-500" : "border-zinc-800"
                  } p-3.5 rounded-xl focus:border-blue-500 outline-none`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  {t.clientFields?.companyName}
                </label>
                <input
                  type="text"
                  value={clientData.companyName}
                  onChange={(e) => setClientData({ ...clientData, companyName: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 p-3.5 rounded-xl focus:border-blue-500 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  {t.clientFields?.abn}
                </label>
                <input
                  type="text"
                  value={clientData.abn}
                  onChange={(e) => setClientData({ ...clientData, abn: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 p-3.5 rounded-xl focus:border-blue-500 outline-none"
                />
              </div>
            </div>
          </section>
        </div>

        {/* STICKY WEEKLY SUMMARY */}
        <div className="lg:col-span-1">
          <div className="sticky top-10 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-blue-500">
                <Sparkles size={20} />
                <span className="font-black uppercase tracking-tighter text-sm">
                  {t.summaryTitle}
                </span>
              </div>
              <span className="text-xs font-black bg-zinc-800 px-3 py-1 rounded-full text-zinc-300">
                {currency}
              </span>
            </div>

            <div className="space-y-4 mb-8 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400 flex items-center gap-2">
                  <Layout size={15} /> {t.solutionBaseLabel}
                </span>
                <span className="font-bold text-zinc-200">{calculations.tierCopy.title}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-zinc-400 flex items-center gap-2">
                  <Clock size={15} /> {t.buildEffortLabel}
                </span>
                <span className="font-bold text-zinc-200">
                  {calculations.totalHours} {t.hrsSuffix} (~
                  {Math.ceil(calculations.totalHours / 6)} {t.daysApproxSuffix})
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-zinc-400 flex items-center gap-2">
                  <CalendarRange size={15} /> {t.contractTermLabel}
                </span>
                <span className="font-bold text-zinc-200">
                  {calculations.contract.label} ({calculations.contract.weeks} {t.wksSuffix})
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-zinc-400 flex items-center gap-2">
                  <DollarSign size={15} /> {t.totalValueLabel}
                </span>
                <span className="font-mono font-bold text-zinc-300">
                  {formatMoney(calculations.finalTotalAUD)}
                </span>
              </div>

              {calculations.discountAmountAUD > 0 && (
                <div className="flex justify-between items-center text-emerald-400 text-xs bg-emerald-500/10 px-3 py-2 rounded-xl">
                  <span>
                    {t.multiYearDiscountLabel} ({calculations.contract.discount * 100}%)
                  </span>
                  <span className="font-mono font-bold">
                    -{formatMoney(calculations.discountAmountAUD)}
                  </span>
                </div>
              )}
            </div>

            <div className="border-t border-zinc-800 pt-7 mb-8">
              <span className="text-zinc-400 text-xs font-bold uppercase tracking-widest block">
                {t.weeklyInvestmentLabel}
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-5xl font-black tracking-tighter text-white">
                  {formatMoney(calculations.weeklyAmountAUD, 2)}
                </span>
                <span className="text-zinc-400 font-bold text-sm">{t.perWeekSuffix}</span>
              </div>
              <p className="text-[11px] text-zinc-500 mt-2 flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-blue-500 shrink-0" />
                {t.includesSupportNote} {calculations.contract.weeks} {t.wksSuffix}.
              </p>
            </div>

            <button
              type="button"
              onClick={handleDownload}
              className={`w-full py-4 rounded-2xl font-black text-base flex items-center justify-center gap-3 transition-all ${
                errors.length > 0
                  ? "bg-red-600/80 hover:bg-red-600"
                  : "bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/20"
              }`}
            >
              {errors.length > 0 ? t.checkRequiredFields : t.generateProposal}{" "}
              <FileText size={19} />
            </button>
          </div>
        </div>
      </div>

      <Footer locale={locale} />
    </div>
  );
}