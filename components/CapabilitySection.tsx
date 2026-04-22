"use client";

import React from "react";
import { useI18n } from "@/components/providers/LanguageProvider";
import type { Locale } from "@/lib/i18n";
import { SectionContainer } from "./ui/SectionContainer";

export type MockPanelType = "intake" | "decision" | "portfolio";

interface CapabilitySectionProps {
  title: string;
  paragraph: string;
  bullets: readonly string[];
  mockPanel: MockPanelType;
  imageRight: boolean;
  /** Fondo alternado para ritmo visual en la landing */
  surface?: "default" | "band";
}

export function CapabilitySection({
  title,
  paragraph,
  bullets,
  mockPanel,
  imageRight,
  surface = "default",
}: CapabilitySectionProps) {
  const { dict, locale } = useI18n();
  const content = (
    <div className="max-w-xl">
      <div className="mb-3 flex items-center gap-3">
        <span
          className="h-1 w-10 rounded-full bg-gradient-to-r from-accent to-intelligence"
          aria-hidden
        />
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-secondary">
          {dict.landing.capabilities.label}
        </span>
      </div>
      <h2 className="text-3xl font-bold tracking-tight text-primary md:text-4xl lg:text-[2.35rem] lg:leading-tight">
        {title}
      </h2>
      <p className="mt-5 text-lg leading-relaxed text-secondary">{paragraph}</p>
      <ul className="mt-8 space-y-4">
        {bullets.map((b) => (
          <li
            key={b}
            className="flex items-start gap-3 rounded-xl border border-transparent py-1 pl-1 transition-colors hover:border-border/60 hover:bg-backgroundSecondary/50"
          >
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent ring-4 ring-accent/15" />
            <span className="text-base text-secondary">{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  const panel = <MockPanel type={mockPanel} locale={locale} />;

  const bandClass =
    surface === "band"
      ? "bg-gradient-to-b from-backgroundSecondary/50 to-background"
      : "";

  return (
    <SectionContainer className={`py-20 md:py-28 ${bandClass}`.trim()}>
      <div className="grid gap-14 lg:grid-cols-2 lg:gap-20 lg:items-center">
        <div className={imageRight ? "" : "lg:order-2"}>{content}</div>
        <div className={imageRight ? "" : "lg:order-1"}>{panel}</div>
      </div>
    </SectionContainer>
  );
}

function MockPanel({ type, locale }: { type: MockPanelType; locale: Locale }) {
  if (type === "intake") return <MockIntakePanel locale={locale} />;
  if (type === "decision") return <MockDecisionPanel locale={locale} />;
  return <MockPortfolioPanel locale={locale} />;
}

function MockIntakePanel({ locale }: { locale: Locale }) {
  return (
    <div className="group rounded-2xl border border-border bg-card p-4 shadow-soft ring-1 ring-primary/[0.03] transition-all duration-300 hover:shadow-card-lift md:p-5">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-sm font-medium text-secondary">
          {locale === "es"
            ? "Bandeja de entrada"
            : locale === "zh"
              ? "接收队列"
              : "Intake inbox"}
        </span>
        <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-bold text-accent">
          {locale === "es"
            ? "3 nuevos"
            : locale === "zh"
              ? "新增 3 条"
              : "3 new"}
        </span>
      </div>
      <div className="space-y-2">
        {[
          {
            from: "Broker A",
            subject:
              locale === "es"
                ? "Prop. marítimo — Ref. 8821"
                : locale === "zh"
                  ? "海事财产提案 — 编号 8821"
                  : "Marine property - Ref. 8821",
            status:
              locale === "es"
                ? "Pendiente"
                : locale === "zh"
                  ? "待处理"
                  : "Pending",
          },
          {
            from: "Broker B",
            subject:
              locale === "es"
                ? "Renovación aviación"
                : locale === "zh"
                  ? "航空续保"
                  : "Aviation renewal",
            status:
              locale === "es"
                ? "En proceso"
                : locale === "zh"
                  ? "处理中"
                  : "In progress",
          },
          {
            from: "Broker C",
            subject:
              locale === "es"
                ? "Prop. inmuebles"
                : locale === "zh"
                  ? "财产提交"
                  : "Property submission",
            status:
              locale === "es"
                ? "Extraído"
                : locale === "zh"
                  ? "已提取"
                  : "Extracted",
          },
        ].map((row, i) => (
          <div
            key={i}
            className="rounded-xl border border-border/60 bg-muted/60 p-3 text-sm"
          >
            <div className="flex justify-between">
              <span className="text-primary">{row.from}</span>
              <span className="text-xs font-bold text-intelligence">{row.status}</span>
            </div>
            <p className="mt-0.5 text-secondary">{row.subject}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <div className="h-1.5 flex-1 rounded-full bg-border" />
        <div className="h-1.5 w-2/3 rounded-full bg-accent/60" />
      </div>
    </div>
  );
}

function MockDecisionPanel({ locale }: { locale: Locale }) {
  return (
    <div className="group rounded-2xl border border-border bg-card p-4 shadow-soft ring-1 ring-primary/[0.03] transition-all duration-300 hover:shadow-card-lift md:p-5">
      <div className="mb-4 text-sm font-medium text-secondary">
        {locale === "es"
          ? "Oportunidad #8821"
          : locale === "zh"
            ? "机会 #8821"
            : "Opportunity #8821"}
      </div>
      <div className="mb-4 flex h-28 items-end gap-2">
        {[40, 65, 55, 80, 70].map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-md bg-accent/85"
            style={{ height: `${h}%`, minHeight: 24 }}
          />
        ))}
      </div>
      <div className="rounded-xl border border-intelligence/25 bg-intelligence/[0.06] p-3">
        <p className="text-xs font-semibold text-intelligence">
          {locale === "es"
            ? "Recomendación (IA)"
            : locale === "zh"
              ? "AI 建议"
              : "AI recommendation"}
        </p>
        <p className="mt-1 text-base font-bold text-primary">
          {locale === "es"
            ? "Participar — 15%"
            : locale === "zh"
              ? "建议参与 — 15%"
              : "Participate - 15%"}
        </p>
      </div>
      <div className="mt-3 flex justify-between text-xs text-secondary">
        <span>
          {locale === "es"
            ? "Capacidad disponible"
            : locale === "zh"
              ? "可用承保能力"
              : "Available capacity"}
        </span>
        <span className="font-medium text-primary">78%</span>
      </div>
    </div>
  );
}

function MockPortfolioPanel({ locale }: { locale: Locale }) {
  return (
    <div className="group rounded-2xl border border-border bg-card p-4 shadow-soft ring-1 ring-primary/[0.03] transition-all duration-300 hover:shadow-card-lift md:p-5">
      <div className="mb-4 text-sm font-medium text-secondary">
        {locale === "es"
          ? "KPIs del portafolio"
          : locale === "zh"
            ? "组合 KPI"
            : "Portfolio KPIs"}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[
          {
            label:
              locale === "es"
                ? "Exposición total"
                : locale === "zh"
                  ? "总暴露"
                  : "Total exposure",
            value: "€ 42M",
          },
          {
            label:
              locale === "es"
                ? "Concentración"
                : locale === "zh"
                  ? "集中度"
                  : "Concentration",
            value: "12%",
          },
          { label: "Pipeline", value: "28" },
          {
            label:
              locale === "es"
                ? "Declinaciones"
                : locale === "zh"
                  ? "拒保数"
                  : "Declines",
            value: "5",
          },
        ].map((k) => (
          <div
            key={k.label}
            className="rounded-xl border border-border/60 bg-muted/60 p-3 text-center"
          >
            <p className="text-xs text-secondary">{k.label}</p>
            <p className="mt-1 font-semibold text-primary">{k.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-1">
        {[30, 50, 45, 70, 60, 85].map((w, i) => (
          <div
            key={i}
            className="h-2 rounded-full bg-accent"
            style={{ flex: w }}
          />
        ))}
      </div>
      <p className="mt-2 text-xs text-secondary">
        {locale === "es"
          ? "Pronóstico próximo trimestre"
          : locale === "zh"
            ? "下季度预测"
            : "Next-quarter forecast"}
      </p>
    </div>
  );
}
