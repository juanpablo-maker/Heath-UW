export const en = {
  common: {
    loading: "Loading...",
    backToHome: "Back to home",
  },
  nav: {
    ariaMain: "Main",
    ariaMobile: "Mobile",
    menu: "Menu",
    platformMenuId: "nav-platform-menu",
    platform: "Platform",
    platformMenuAria: "Platform",
    platformItems: [
      { href: "/soluciones", label: "Solutions" },
      { href: "/sectores", label: "Industries" },
      { href: "/mesa-de-trabajo", label: "Underwriting Desk" },
    ],
    solutions: { href: "/soluciones", label: "Solutions" },
    company: { href: "/empresa", label: "Company" },
    signIn: "Sign in",
    dashboard: "Dashboard",
    cta: "Go to Dashboard",
    footerLinks: [
      { href: "/sectores", label: "Industries" },
      { href: "/mesa-de-trabajo", label: "Underwriting Desk" },
      { href: "/soluciones", label: "Solutions" },
      { href: "/empresa", label: "Company" },
    ],
  },
  languageSwitcher: {
    ariaLabel: "Select language",
    es: "ES",
    en: "EN",
  },
  dashboard: {
    meta: {
      title: "Underwriting Dashboard | Heath",
      description:
        "Operational visibility into the submissions pipeline and automated decisions.",
    },
    brand: "Heath",
    title: "Underwriting Dashboard",
    subtitle:
      "Operational visibility into the submissions pipeline and automated decisions.",
    partialErrorsTitle: "Some views could not be loaded",
    views: {
      modeSwitchLabel: "Dashboard view mode",
      overview: "Overview",
      operations: "Operations",
      overviewSubtitle:
        "What happened: indicators and trends for portfolio analysis.",
      operationsSubtitle:
        "What to do: work queue, filters, and submission prioritization.",
    },
    overview: {
      pageTitle: "Underwriting Overview",
      pageSubtitle: "Portfolio activity and trends",
      kpiSectionTitle: "Key metrics",
      kpiSectionDesc:
        "Volume and outcomes compared to the prior period of equal length.",
      volumeGroup: "Volume",
      outcomeGroup: "Outcome",
      totalSubmissions: "Total submissions",
      inReview: "In review",
      decline: "Decline",
      accept: "Accept",
      replySent: "Reply sent",
      priorPeriod: "vs prior period",
      priorPeriodNew: "No prior period baseline",
      insightLabel: "Insight",
      contextChipDateTitle: "Open period filter",
      contextChipLobTitle: "Open line of business filter",
      contextChipCountryTitle: "Open country filter",
      quickFiltersLabel: "Quick filters",
      insightCopy: {
        empty:
          "No submissions in this period — widen the date range or relax filters.",
        highDecline: "High decline rate ({pct}%){driver}",
        declineDriverNamed: ' driven by "{label}".',
        declineDriverFallback: " — review drivers in the decline chart below.",
        strongAccept:
          "Strong accept share ({pct}%) — outcomes skew positive for this slice.",
        largeReview:
          "Large review queue ({pct}% of volume) — monitor aging and SLA.",
        balanced:
          "Balanced mix across outcomes — {count} submissions in this view.",
      },
    },
    operations: {
      comingSoon: "Operations view coming soon",
      filtersLabel: "Filters",
      priorityLabel: "Prioritization",
      listLabel: "Submissions",
      filtersPlaceholder: "Status, broker, line of business…",
      priorityPlaceholder: "Sort by age, SLA, risk…",
      listPlaceholder: "The operational list will appear here.",
    },
    overviewFilters: {
      filtersButton: "Filters",
      filtersActiveAria: "active filters",
      reset: "Reset",
      moreFilters: "More filters",
      activeFilters: "Active filters",
      removeFilterAria: "Remove filter",
      close: "Close",
      barAria: "Portfolio analysis filters",
      dateRange: "Period",
      dateLast7d: "Last 7 days",
      dateLast30d: "Last 30 days",
      dateThisMonth: "This month",
      dateLastQuarter: "Last quarter",
      dateCustom: "Custom range",
      dateFrom: "From",
      dateTo: "To",
      lob: "Line of business",
      lobAll: "All",
      lobAviation: "Aviation",
      lobMarine: "Marine",
      lobProperty: "Property",
      lobConstruction: "Construction",
      lobPvt: "Political Violence & Terrorism",
      lobMulti: "Multi-line",
      broker: "Broker",
      brokerPlaceholder: "Search or pick…",
      country: "Country",
      countryAll: "All",
      decision: "Decision",
      decisionAll: "All",
      decisionReview: "Review",
      decisionDecline: "Decline",
      decisionAccept: "Accept",
      decisionReplySent: "Reply sent",
      declineReason: "Decline reason",
      declineReasonAll: "All",
      submissionsTableSubtitle:
        "Submissions matching your analysis filters.",
    },
    sections: {
      kpisTitle: "Indicators",
      kpisDesc: "Aggregated totals for pipeline health and trend reading.",
      chartsTitle: "Visualization",
      chartsDesc:
        "Distribution of decisions, declines, and volume by broker.",
    },
    kpi: {
      total_submissions: "Submissions",
      total_in_review: "In review",
      total_decline: "Decline",
      total_refer: "Refer",
      total_accept: "Accept",
      total_reply_sent: "Reply sent",
      total_without_decision: "No decision",
      total_missing_country: "Missing country",
    },
    charts: {
      decisionTitle: "Distribution by decision",
      decisionDesc: "Aggregated volume by automated decision.",
      declineTitle: "Decline reasons",
      declineDesc: "Frequency by recorded reason.",
      brokerTitle: "Submissions by broker",
      brokerDesc: "Volume comparison by intermediary.",
      emptyTitle: "No data",
      emptyDesc: "The view returned no rows at this time.",
      countLabel: "Count",
    },
    submissions: {
      title: "Submissions pipeline",
      subtitle:
        "Primary operational view; horizontal scroll on small screens.",
      empty: "No submissions in this view.",
      colInsured: "Insured",
      colBroker: "Broker",
      colLine: "Line of business",
      colCountry: "Country",
      colCurrency: "Currency",
      colLimit: "Limit",
      colDecision: "Decision",
      colReason: "Reason",
      colStatus: "Status",
      colReply: "Reply",
      colCreated: "Created",
    },
    alerts: {
      title: "Operational alerts",
      subtitle: "Cases that need immediate attention.",
      emptyTitle: "No active alerts",
      emptyDesc:
        "When incidents exist, they will appear here with type and context.",
      labelType: "Type",
      labelInsuredBroker: "Insured / Broker",
      labelLineCountry: "Line / Country",
      labelDecisionReply: "Decision / Reply",
    },
    sla: {
      title: "Operational performance (SLA)",
      subtitleEmpty: "Age and response times per case.",
      emptyTitle: "No SLA records",
      emptyDesc:
        "When the view has data, you will see tracking by age.",
      subtitleFull:
        "Older cases highlighted; indicative thresholds 2h / 8h.",
      legendOver2h: "> 2h",
      legendOver8h: "> 8h",
      colInsured: "Insured",
      colBroker: "Broker",
      colDecision: "Decision",
      colReply: "Reply",
      colAge: "Age",
      colReplyTime: "Reply time",
      colCreated: "Created",
    },
    badges: {
      replySent: "Sent",
      replyPending: "Pending",
      noDataTitle: "No data",
      decisionAccept: "Accept",
      decisionApproved: "Approved",
      decisionDecline: "Decline",
      decisionDeclined: "Declined",
      decisionRefer: "Refer",
      decisionPending: "Pending",
    },
    config: {
      title: "Supabase configuration",
      envHint:
        "Add NEXT_PUBLIC_SUPABASE_URL and a public key (NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) to .env.local and restart the dev server.",
    },
    errors: {
      missingEnvBody:
        "Supabase environment variables are missing. Set the project URL and a public key.",
      loadFailed: "Could not load the dashboard",
      unexpected: "Unexpected error while fetching data.",
      retry: "Retry",
    },
    minutesSuffix: "min",
  },
  hero: {
    badge: "Real-time underwriting",
    subBadge: "Decisions with portfolio context",
    title: "Underwriting is no longer a process.",
    titleAccent: "It is now a real-time operating system",
    description:
      "Centralize opportunities, assess risk, and make portfolio-aware decisions in seconds.",
    primaryCta: "See how it works",
    secondaryCta: "Go to Dashboard",
    mock: {
      tag: "Decision Engine",
      title: "Underwriting",
      subtitle: "Trading-desk view",
      realtime: "Real time",
      columns: {
        submission: "Submission",
        operation: "Operation",
        status: "Status",
        risk: "Risk",
      },
      rows: [
        { deal: "Marine property", status: "New", riskLabel: "Low" },
        { deal: "Aviation renewal", status: "In review", riskLabel: "High" },
        { deal: "Property renewal", status: "Decision", riskLabel: "Low" },
        { deal: "Specialty package", status: "In review", riskLabel: "High" },
      ],
      capacityLabel: "Capacity-aware participation",
      capacityValue: "82% available",
    },
  },
  footer: {
    description:
      "AI-powered underwriting platform for insurers and reinsurers. Faster decisions with stronger portfolio control.",
    contact: "Contact us",
    copyright: "© Heath. All rights reserved.",
  },
  forms: {
    demo: {
      name: "Name",
      namePlaceholder: "Your name",
      email: "Work email",
      emailPlaceholder: "name@company.com",
      company: "Company",
      companyPlaceholder: "Insurer / reinsurer",
      sending: "Sending...",
      submit: "Submit request (simulation)",
      errors: {
        email: "Enter a valid work email.",
        name: "Enter your name.",
        company: "Enter your company name.",
      },
    },
    login: {
      title: "Sign in",
      subtitle: "Access the underwriting dashboard (mock, no backend).",
      email: "Work email",
      emailPlaceholder: "name@company.com",
      password: "Password",
      passwordPlaceholder: "••••••••",
      submit: "Go to Dashboard",
      submitting: "Signing in...",
      hint: "Use your credentials to continue.",
      errors: {
        email: "Enter a valid email.",
        password: "Enter your password.",
        invalidCredentials: "Invalid credentials.",
      },
    },
  },
  marketingLayout: {
    backHome: "Back to home",
  },
  landing: {
    comparison: {
      kicker: "Comparison",
      title: "Speed and clarity vs. the traditional model",
      subtitle: "Same market, a radically better operating model.",
      positiveTitle: "In seconds, with Heath",
      positiveBullets: [
        "Instant structured intake",
        "Real-time decision support",
        "Capacity-aware underwriting",
      ],
      negativeTitle: "In days, the old way",
      negativeBullets: [
        "Manual email processing",
        "Fragmented decisions",
        "No exposure visibility",
      ],
    },
    process: {
      kicker: "Workflow",
      title: "How it works",
      subtitle: "From intake to decision in four clear steps.",
      steps: [
        { label: "Capture submissions", subline: "From email, portal, or API" },
        { label: "Structure data", subline: "Automated extraction and normalization" },
        { label: "Analyze and score", subline: "AI-powered scoring and indicators" },
        { label: "Decide and track", subline: "Workflow execution with full traceability" },
      ],
    },
    capabilities: {
      label: "Capabilities",
      sections: [
        {
          title: "Intake and commitment management",
          paragraph:
            "Unify incoming opportunities from email and portals into one Underwriting Desk. The platform extracts structured data, tracks commitments, and keeps every submission status updated in real time.",
          bullets: [
            "Automated intake from emails and documents",
            "AI-based structured data extraction",
            "Commitment and deadline tracking",
            "Unified submission underwriting desk",
          ],
        },
        {
          title: "Underwriting decision support",
          paragraph:
            "Get opportunity scoring, capacity controls, and participation recommendations directly in the decision flow, with the full context your team needs to decide confidently.",
          bullets: [
            "Opportunity scoring",
            "Capacity and limit controls",
            "Participation recommendations",
            "Auditable decision workflow",
          ],
        },
        {
          title: "Portfolio intelligence",
          paragraph:
            "Visualize exposure, concentration, and trends in operational dashboards. Analyze decline drivers and forecast pipeline performance with data-first planning.",
          bullets: [
            "Portfolio visibility dashboard",
            "Concentration and exposure analysis",
            "Decline reasons and trend analysis",
            "Pipeline forecasting",
          ],
        },
      ],
    },
    social: {
      kicker: "Trusted by",
      title: "Built for leading insurers and reinsurers",
      logos: ["Partner A", "Partner B", "Partner C", "Partner D", "Partner E", "Partner F"],
    },
    finalCta: {
      kicker: "Next step",
      title: "Start underwriting at",
      titleAccent: "market speed",
      description: "Move from fragmented submissions to structured underwriting intelligence.",
      primary: "Go to Dashboard",
      secondary: "Underwriting Desk",
    },
  },
  pages: {
    soluciones: {
      title: "Solutions",
      subtitle: "How teams deploy Heath across intake, decisions, and portfolio control.",
      intro:
        "From digitizing submissions to governing exposure, Heath connects the workflows underwriting organizations rely on. This overview links the core capabilities you can explore in the product tour and demos.",
      bullets: [
        "Structured intake and triage for specialty lines",
        "Consistent decisions with full audit context",
        "Portfolio visibility for limits and accumulation",
      ],
    },
    sectores: {
      title: "Industries",
      subtitle: "Deep underwriting expertise by line, with workflows tailored to each market.",
      heroKicker: "Specialty lines",
      intro:
        "Heath is built for insurers and reinsurers across specialty lines. Explore how structured intake, consistent decisions, and portfolio visibility apply to each industry—starting from a strong foundation you can extend into line-specific playbooks.",
      industries: [
        {
          slug: "aviation",
          title: "Aviation",
          description:
            "Hull, liability, and airport exposures with fast-moving submissions and strict accumulation controls.",
        },
        {
          slug: "marine",
          title: "Marine",
          description:
            "Cargo, hull, and liability workflows with voyage context, limits, and seasonal volume patterns.",
        },
        {
          slug: "construction",
          title: "Construction",
          description:
            "CAR/EAR-style programs with milestone-driven risk, contractors, and project concentration.",
        },
        {
          slug: "property",
          title: "Property",
          description:
            "CAT-exposed portfolios with accumulation, reinsurance context, and renewal prioritization.",
        },
        {
          slug: "political-violence-terrorism",
          title: "Political violence and terrorism",
          description:
            "Specialty peril lines where geography, security events, and wording nuance drive triage.",
        },
        {
          slug: "enterprise-multi-line",
          title: "Multi-line enterprise model",
          description:
            "Unified desk for complex organizations coordinating multiple lines, entities, and capacity.",
        },
      ],
      feature: {
        kicker: "Why industries matter",
        title: "Workflows tuned to exposure, structure, and seasonality",
        description:
          "Each line has different data quality, renewal cadence, and accumulation profiles. Heath keeps one operating model while adapting triage rules, scoring context, and monitoring to the realities of each market.",
        bullets: [
          "Line-aware triage without losing a single intake standard",
          "Portfolio context embedded in the decision path",
          "Operational dashboards that match how underwriting teams actually run the book",
        ],
      },
      cta: {
        kicker: "Next step",
        title: "See Heath on your",
        titleAccent: "lines of business",
        description: "Move from fragmented submissions to structured underwriting intelligence.",
        primary: "Go to Dashboard",
        secondary: "Underwriting Desk",
      },
      industryDetail: {
        notFoundTitle: "Industry not found",
        notFoundBody: "This page is not available.",
        upcomingTitle: "Deep dive coming soon",
        upcomingBody:
          "We are preparing line-specific workflows, benchmarks, and examples for this industry.",
        backLink: "Back to industries",
      },
    },
    recursos: {
      title: "Resources",
      subtitle: "Insights, guides, and updates for underwriting and innovation teams.",
      intro: "Enterprise-ready structure for insurtech content: blog, events, media, and downloads.",
      items: [
        { t: "Blog", d: "Articles on AI, orchestration, and underwriting." },
        { t: "Events", d: "Webinars and industry sessions." },
        { t: "Media", d: "Press coverage and announcements." },
        { t: "Documents", d: "Technical and business documentation (coming soon)." },
      ],
    },
    empresa: {
      title: "Company",
      subtitle: "We are building the next generation of underwriting intelligence.",
      intro:
        "Company story, mission, partnerships, and careers. Placeholder copy until final brand messaging is approved.",
      upcoming: "Coming soon",
      upcomingItems: "About us · Partner with Heath · Careers",
    },
    exposicion: {
      title: "Exposure Management",
      subtitle: "See your book while you build it: limits, accumulation, and concentration.",
      p1: "Every decision is evaluated with portfolio context, reducing renewal surprises and improving capacity control.",
      p2: "Placeholder marketing copy: dashboards, rules, and alerts will be documented here as the product evolves.",
    },
    mesa: {
      title: "Underwriting Desk",
      subtitle: "An operational interface to manage the full underwriting cycle with portfolio context.",
      p1: "The desk unifies submissions, data extraction, and decision traceability for consistent underwriting at speed.",
      p2: "In this demo, the experience is fully mocked so you can explore different underwriting opportunity scenarios.",
      primary: "Open desk",
      secondary: "Back to home",
      cards: [
        { title: "Unified queue", description: "Structured submissions with status and context per opportunity." },
        { title: "Rules and configuration", description: "Tune strategy, thresholds, and buffers to see estimated impact." },
        { title: "Decision traceability", description: "A clear history of what was decided, why, and at what risk." },
      ],
    },
    demo: {
      title: "Request demo",
      subtitle: "Let's schedule a session with your underwriting and technology teams.",
      intro: "This form is a simulation: after submitting, a mock session starts and redirects you to the Underwriting Desk.",
    },
    login: {
      title: "Sign in",
      subtitle: "Access the underwriting dashboard. (Backend-free simulation)",
    },
  },
} as const;
