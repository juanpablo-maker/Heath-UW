export const es = {
  common: {
    loading: "Cargando...",
    backToHome: "Volver al inicio",
  },
  nav: {
    ariaMain: "Principal",
    ariaMobile: "Móvil",
    menu: "Menú",
    home: { href: "/", label: "Inicio" },
    underwriting: { href: "/underwriting", label: "Suscripción" },
    portfolio: { href: "/portfolio", label: "Portafolio" },
    technology: { href: "/technology", label: "Tecnología" },
    company: { href: "/company", label: "Compañía" },
    contact: { href: "/contact", label: "Contacto" },
    cta: "Contáctanos",
    signIn: "Iniciar sesión",
    footerLinks: [
      { href: "/underwriting", label: "Suscripción" },
      { href: "/portfolio", label: "Portafolio" },
      { href: "/technology", label: "Tecnología" },
      { href: "/company", label: "Compañía" },
      { href: "/contact", label: "Contacto" },
    ],
  },
  languageSwitcher: {
    ariaLabel: "Seleccionar idioma",
    es: "ES",
    en: "EN",
  },
  dashboard: {
    meta: {
      title: "Dashboard de suscripción | Heath",
      description:
        "Visibilidad operativa del pipeline de solicitudes y de las decisiones automáticas.",
    },
    brand: "Heath",
    title: "Dashboard de suscripción",
    subtitle:
      "Visibilidad operativa del pipeline de solicitudes y de las decisiones automáticas.",
    partialErrorsTitle: "No se pudieron cargar algunas vistas",
    views: {
      modeSwitchLabel: "Modo de vista del dashboard",
      overview: "Resumen",
      operations: "Operaciones",
      overviewSubtitle:
        "Qué pasó: indicadores y tendencias para el análisis de cartera.",
      operationsSubtitle:
        "Qué hacer: cola de trabajo, filtros y priorización de solicitudes.",
    },
    overview: {
      pageTitle: "Resumen de suscripción",
      pageSubtitle: "Actividad y tendencias de la cartera",
      kpiSectionTitle: "Métricas clave",
      kpiSectionDesc:
        "Volumen y resultados comparados con el periodo anterior de igual duración.",
      volumeGroup: "Volumen",
      outcomeGroup: "Resultado",
      totalSubmissions: "Solicitudes totales",
      inReview: "En revisión",
      decline: "Declinadas",
      accept: "Aceptadas",
      replySent: "Respuesta enviada",
      priorPeriod: "vs periodo anterior",
      priorPeriodNew: "Sin periodo anterior de referencia",
      insightLabel: "Insight",
      contextChipDateTitle: "Abrir filtro de periodo",
      contextChipLobTitle: "Abrir filtro de línea de negocio",
      contextChipCountryTitle: "Abrir filtro de país",
      quickFiltersLabel: "Filtros rápidos",
      insightCopy: {
        empty:
          "No hay solicitudes en este periodo — amplía el rango de fechas o relaja los filtros.",
        highDecline: "Tasa de declinación alta ({pct}%){driver}",
        declineDriverNamed: ' impulsada por «{label}».',
        declineDriverFallback:
          " — revisa los motivos en el gráfico de declinaciones más abajo.",
        strongAccept:
          "Fuerte peso de aceptaciones ({pct}%) — el resultado se inclina a positivo en este corte.",
        largeReview:
          "Cola de revisión grande ({pct}% del volumen) — vigila antigüedad y SLA.",
        balanced:
          "Mezcla equilibrada entre resultados — {count} solicitudes en esta vista.",
      },
    },
    operations: {
      comingSoon: "La vista Operaciones estará disponible pronto",
      filtersLabel: "Filtros",
      priorityLabel: "Priorización",
      listLabel: "Solicitudes",
      filtersPlaceholder: "Estado, broker, línea…",
      priorityPlaceholder: "Ordenar por antigüedad, SLA, riesgo…",
      listPlaceholder: "La lista operativa aparecerá aquí.",
    },
    overviewFilters: {
      filtersButton: "Filtros",
      filtersActiveAria: "filtros activos",
      reset: "Restablecer",
      moreFilters: "Más filtros",
      activeFilters: "Filtros activos",
      removeFilterAria: "Quitar filtro",
      close: "Cerrar",
      barAria: "Filtros de análisis de cartera",
      dateRange: "Periodo",
      dateLast7d: "Últimos 7 días",
      dateLast30d: "Últimos 30 días",
      dateThisMonth: "Este mes",
      dateLastQuarter: "Último trimestre",
      dateCustom: "Rango personalizado",
      dateFrom: "Desde",
      dateTo: "Hasta",
      lob: "Línea de negocio",
      lobAll: "Todas",
      lobAviation: "Aviación",
      lobMarine: "Marítimo",
      lobProperty: "Propiedad",
      lobConstruction: "Construcción",
      lobPvt: "Violencia política y terrorismo",
      lobMulti: "Multirramo",
      broker: "Broker",
      brokerPlaceholder: "Buscar o elegir…",
      country: "País",
      countryAll: "Todos",
      decision: "Decisión",
      decisionAll: "Todas",
      decisionReview: "En revisión",
      decisionDecline: "Declinada",
      decisionAccept: "Aceptada",
      decisionReplySent: "Respuesta enviada",
      declineReason: "Motivo de declinación",
      declineReasonAll: "Todos",
      submissionsTableSubtitle:
        "Solicitudes que coinciden con tus filtros de análisis.",
    },
    sections: {
      kpisTitle: "Indicadores",
      kpisDesc:
        "Totales agregados para la salud del pipeline y la lectura de tendencias.",
      chartsTitle: "Visualización",
      chartsDesc:
        "Distribución de decisiones, declinaciones y volumen por broker.",
    },
    kpi: {
      total_submissions: "Solicitudes",
      total_in_review: "En revisión",
      total_decline: "Declinadas",
      total_refer: "Derivadas",
      total_accept: "Aceptadas",
      total_reply_sent: "Respuesta enviada",
      total_without_decision: "Sin decisión",
      total_missing_country: "País faltante",
    },
    charts: {
      decisionTitle: "Distribución por decisión",
      decisionDesc: "Volumen agregado por decisión automática.",
      declineTitle: "Motivos de declinación",
      declineDesc: "Frecuencia por motivo registrado.",
      brokerTitle: "Solicitudes por broker",
      brokerDesc: "Comparación de volumen por intermediario.",
      emptyTitle: "Sin datos",
      emptyDesc: "La vista no devolvió filas en este momento.",
      countLabel: "Cantidad",
    },
    submissions: {
      title: "Pipeline de solicitudes",
      subtitle:
        "Vista operativa principal; desplazamiento horizontal en pantallas pequeñas.",
      empty: "No hay solicitudes en esta vista.",
      colInsured: "Asegurado",
      colBroker: "Broker",
      colLine: "Línea de negocio",
      colCountry: "País",
      colCurrency: "Moneda",
      colLimit: "Límite",
      colDecision: "Decisión",
      colReason: "Motivo",
      colStatus: "Estado",
      colReply: "Respuesta",
      colCreated: "Creado",
    },
    alerts: {
      title: "Alertas operativas",
      subtitle: "Casos que requieren atención inmediata.",
      emptyTitle: "Sin alertas activas",
      emptyDesc:
        "Cuando existan incidencias, aparecerán aquí con el tipo y contexto.",
      labelType: "Tipo",
      labelInsuredBroker: "Asegurado / Broker",
      labelLineCountry: "Línea / País",
      labelDecisionReply: "Decisión / Reply",
    },
    sla: {
      title: "Rendimiento operativo (SLA)",
      subtitleEmpty: "Antigüedad y tiempos de respuesta por caso.",
      emptyTitle: "Sin registros SLA",
      emptyDesc:
        "Cuando haya datos en la vista, verás el seguimiento por antigüedad.",
      subtitleFull:
        "Casos con mayor antigüedad resaltados; umbrales orientativos 2h / 8h.",
      legendOver2h: "> 2h",
      legendOver8h: "> 8h",
      colInsured: "Asegurado",
      colBroker: "Broker",
      colDecision: "Decisión",
      colReply: "Reply",
      colAge: "Antigüedad",
      colReplyTime: "Tiempo reply",
      colCreated: "Creado",
    },
    badges: {
      replySent: "Enviado",
      replyPending: "Pendiente",
      noDataTitle: "Sin dato",
      decisionAccept: "Aceptar",
      decisionApproved: "Aprobado",
      decisionDecline: "Declinar",
      decisionDeclined: "Declinado",
      decisionRefer: "Derivar",
      decisionPending: "Pendiente",
    },
    config: {
      title: "Configuración de Supabase",
      envHint:
        "Añade NEXT_PUBLIC_SUPABASE_URL y una clave pública (NEXT_PUBLIC_SUPABASE_ANON_KEY o NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) en .env.local y reinicia el servidor de desarrollo.",
    },
    errors: {
      missingEnvBody:
        "Faltan variables de entorno de Supabase. Configura la URL del proyecto y una clave pública.",
      loadFailed: "No se pudo cargar el dashboard",
      unexpected: "Error inesperado al obtener datos.",
      retry: "Reintentar",
    },
    minutesSuffix: "min",
  },
  home: {
    hero: {
      kicker: "MGM moderno",
      title: "Heath es una plataforma de suscripción liderada por socios, operando como un MGM moderno.",
      subtitle:
        "Combinamos experiencia técnica de suscripción, tecnología propietaria y capacidad alineada para construir crecimiento disciplinado ajustado por riesgo.",
      primaryCta: "Contáctanos",
      secondaryCta: "Explorar suscripción",
    },
    quickTags: [
      "Líneas especializadas",
      "Disciplina de portafolio",
      "Capacidad alineada",
      "Ejecución tecnológica",
    ],
    whoWeAre: {
      title: "Quiénes somos",
      body:
        "Somos una firma independiente enfocada en suscripción especializada. Priorizamos valor de largo plazo, disciplina de portafolio y alineación de intereses por encima del volumen transaccional.",
    },
    model: {
      title: "El modelo Heath",
      pillars: [
        {
          title: "Experiencia de suscripción",
          body: "Equipos senior por línea, con criterio técnico y gobernanza clara en cada decisión.",
        },
        {
          title: "Mentalidad de capacidad alineada",
          body: "Suscribimos como socios de capacidad, protegiendo desempeño técnico y consistencia en el ciclo.",
        },
        {
          title: "Decisiones guiadas por portafolio",
          body: "Cada riesgo se evalúa en contexto de acumulación, concentración y retorno esperado.",
        },
        {
          title: "Ejecución habilitada por tecnología",
          body: "Nuestra plataforma propia acelera procesos y eleva calidad operativa sin desplazar el juicio técnico.",
        },
      ],
    },
    edge: {
      title: "La ventaja Heath",
      items: [
        {
          title: "Suscribir con contexto",
          body: "Convertimos información dispersa en una lectura completa para decidir mejor y con mayor consistencia.",
        },
        {
          title: "Alineación sobre volumen",
          body: "Priorizamos relaciones de largo plazo y desempeño técnico sostenido, no crecimiento indiscriminado.",
        },
        {
          title: "Preparados para velocidad",
          body: "Combinamos disciplina técnica con ejecución ágil para responder al mercado sin comprometer calidad.",
        },
      ],
    },
    credibility: {
      title: "Credenciales en construcción",
      items: [
        "Foco en líneas especializadas con criterios técnicos definidos.",
        "Disciplina de portafolio desde el origen de cada decisión.",
        "Desarrollo de alianzas de capacidad con visión de largo plazo.",
      ],
    },
    finalCta: {
      title: "Construyamos capacidad con disciplina técnica",
      body: "Trabajamos con socios que buscan resultados sostenibles en mercados especializados.",
      primary: "Asóciate con nosotros",
      secondary: "Compañía",
    },
  },
  footer: {
    description:
      "MGM moderno orientado a suscripción especializada, con disciplina técnica, enfoque de portafolio y ejecución habilitada por tecnología.",
    contact: "Contact us",
    copyright: "© Heath. Todos los derechos reservados.",
  },
  forms: {
    demo: {
      name: "Nombre",
      namePlaceholder: "Tu nombre",
      email: "Correo corporativo",
      emailPlaceholder: "nombre@empresa.com",
      company: "Empresa",
      companyPlaceholder: "Aseguradora / reaseguradora",
      sending: "Enviando...",
      submit: "Enviar solicitud (simulación)",
      errors: {
        email: "Ingresá un correo corporativo válido.",
        name: "Ingresá tu nombre.",
        company: "Ingresá la empresa.",
      },
    },
    login: {
      title: "Iniciar sesión",
      subtitle: "Accedé al dashboard de suscripción.",
      email: "Correo corporativo",
      emailPlaceholder: "nombre@empresa.com",
      password: "Contraseña",
      passwordPlaceholder: "••••••••",
      submit: "Ir al dashboard",
      submitting: "Ingresando...",
      hint: "Usá tus credenciales para continuar.",
      errors: {
        email: "Ingresá un correo válido.",
        password: "Ingresá tu contraseña.",
        invalidCredentials: "Credenciales incorrectas.",
      },
    },
  },
  marketingLayout: {
    backHome: "Volver al inicio",
  },
  landing: {
    comparison: {
      kicker: "Comparación",
      title: "Velocidad y claridad frente al modelo tradicional",
      subtitle: "Mismo mercado, distinta forma de operar la mesa.",
      positiveTitle: "En segundos, con Heath",
      positiveBullets: [
        "Ingesta estructurada al instante",
        "Soporte a la decisión en tiempo real",
        "Suscripción consciente de capacidad",
      ],
      negativeTitle: "En días, de forma tradicional",
      negativeBullets: [
        "Procesamiento manual por correo",
        "Decisiones fragmentadas",
        "Sin visibilidad de la exposición",
      ],
    },
    process: {
      kicker: "Flujo",
      title: "Cómo funciona",
      subtitle: "De la recepción a la decisión en cuatro pasos claros.",
      steps: [
        { label: "Ingresar solicitudes", subline: "Desde correo, portal o API" },
        { label: "Estructurar datos", subline: "Extracción y normalización automática" },
        { label: "Analizar y puntuar", subline: "Puntuación e indicadores con IA" },
        { label: "Decidir y hacer seguimiento", subline: "Flujo de trabajo y trazabilidad" },
      ],
    },
    capabilities: {
      label: "Capacidad",
      sections: [
        {
          title: "Gestión de recepción y compromisos",
          paragraph:
            "Unificá la llegada de oportunidades desde correos y portales en un único Panel de Underwriting. La plataforma extrae datos estructurados, rastrea compromisos y mantiene el estado de cada submission en tiempo real.",
          bullets: [
            "Ingesta automática de correos y documentos",
            "Extracción estructurada de datos con IA",
            "Seguimiento de compromisos y plazos",
            "Panel de Underwriting unificado de submissions",
          ],
        },
        {
          title: "Soporte a la decisión de underwriting",
          paragraph:
            "Obtené puntuación de oportunidades, control de capacidad y recomendaciones de participación integradas en el flujo de decisión. Todo el contexto necesario para decidir con confianza.",
          bullets: [
            "Puntuación de oportunidades",
            "Control de capacidad y límites",
            "Recomendación de participación",
            "Flujo de decisión auditable",
          ],
        },
        {
          title: "Inteligencia de portafolio",
          paragraph:
            "Visualizá exposición, concentración y tendencias en tableros. Analizá motivos de rechazo y pronosticá el pipeline comercial para planificar con datos.",
          bullets: [
            "Tablero de visibilidad del portafolio",
            "Análisis de concentración y exposición",
            "Motivos de rechazo y tendencias",
            "Pronóstico de pipeline",
          ],
        },
      ],
    },
    social: {
      kicker: "Confianza",
      title: "Con la confianza de aseguradores y reaseguradores líderes",
      logos: ["Socio A", "Socio B", "Socio C", "Socio D", "Socio E", "Socio F"],
    },
    finalCta: {
      kicker: "Siguiente paso",
      title: "Empezá a suscribir con",
      titleAccent: "velocidad de mercado",
      description: "Pasá de solicitudes fragmentadas a inteligencia de suscripción estructurada.",
      primary: "Ingresá al dashboard",
      secondary: "Panel de Underwriting",
    },
  },
  pagesV2: {
    underwriting: {
      title: "Suscripción",
      subtitle: "Suscripción especializada con enfoque técnico, autoridad clara y disciplina de cartera.",
      intro:
        "Nuestra práctica de suscripción combina experiencia por línea, gobernanza de decisiones y seguimiento de desempeño técnico.",
      pillars: [
        "Evaluación técnica por sector y estructura de riesgo.",
        "Lineamientos de participación y límites consistentes.",
        "Control continuo de calidad y desempeño por cohorte.",
      ],
    },
    portfolio: {
      title: "Portafolio",
      subtitle: "Construimos el libro con visión integral de acumulación, concentración y retorno esperado.",
      intro:
        "Cada decisión se valida en contexto de portafolio para sostener resultados técnicos y estabilidad en el ciclo.",
      metrics: [
        "Disciplina de acumulación por zona, línea y evento.",
        "Seguimiento de mix, retención y rentabilidad esperada.",
        "Monitoreo dinámico de exposición y límites operativos.",
      ],
    },
    technology: {
      title: "Tecnología",
      subtitle: "Nuestra plataforma propietaria habilita ejecución eficiente y consistencia operativa.",
      intro:
        "La tecnología es una capa habilitadora dentro del modelo de suscripción de Heath, diseñada para mejorar tiempos, calidad de datos y trazabilidad.",
      capabilities: [
        "Ingesta de submissions por correo y canales digitales.",
        "Extracción y normalización de datos relevantes.",
        "Scoring y priorización para soporte al underwriter.",
        "Dashboard operativo y analítica de portafolio.",
      ],
    },
    company: {
      title: "Compañía",
      subtitle: "Heath es una firma independiente de suscripción orientada a asociaciones de largo plazo.",
      intro:
        "Operamos con una visión institucional: disciplina técnica, gobernanza clara y alineación con socios de capacidad.",
    },
    contact: {
      title: "Contacto",
      subtitle: "Conversemos sobre oportunidades de suscripción, capacidad y alianzas estratégicas.",
      intro:
        "Trabajamos con reaseguradores, aseguradores y brokers que priorizan desempeño técnico sostenido.",
      primary: "Enviar un email",
      secondary: "Explorar suscripción",
    },
  },
  pages: {
    soluciones: {
      title: "Soluciones",
      subtitle: "Cómo los equipos implementan Heath en intake, decisiones y control de portafolio.",
      intro:
        "Desde la digitalización de solicitudes hasta la gobernanza de exposición, Heath conecta los flujos que las organizaciones de suscripción necesitan. Esta vista resume las capacidades que podés explorar en el recorrido y las demos.",
      bullets: [
        "Intake estructurado y triage para líneas especializadas",
        "Decisiones consistentes con contexto de auditoría",
        "Visibilidad de portafolio para límites y acumulación",
      ],
    },
    sectores: {
      title: "Sectores",
      subtitle: "Especialidad y profundidad por ramo, con flujos adaptados a cada mercado.",
      heroKicker: "Líneas especializadas",
      intro:
        "Heath está pensado para aseguradores y reaseguradores en líneas especializadas. Explorá cómo el intake estructurado, decisiones consistentes y visibilidad de portafolio se aplican a cada industria—con una base sólida que podés extender a playbooks específicos por ramo.",
      industries: [
        {
          slug: "aviation",
          title: "Aviación",
          description:
            "Casco, responsabilidad y exposiciones aeroportuarias con submissions ágiles y control estricto de acumulación.",
        },
        {
          slug: "marine",
          title: "Marítimo",
          description:
            "Flujos de carga, casco y responsabilidad con contexto de viaje, límites y estacionalidad.",
        },
        {
          slug: "construction",
          title: "Construcción",
          description:
            "Programas tipo CAR/EAR con riesgo por hitos, contratistas y concentración por obra.",
        },
        {
          slug: "property",
          title: "Propiedad",
          description:
            "Portafolios con exposición a CAT, acumulación, contexto de reaseguro y priorización de renovaciones.",
        },
        {
          slug: "political-violence-terrorism",
          title: "Violencia política y terrorismo",
          description:
            "Ramos de perils donde geografía, eventos de seguridad y wording condicionan el triage.",
        },
        {
          slug: "enterprise-multi-line",
          title: "Modelo enterprise multi-ramo",
          description:
            "Mesa unificada para organizaciones complejas que coordinan múltiples ramos, entidades y capacidad.",
        },
      ],
      feature: {
        kicker: "Por qué importa el ramo",
        title: "Flujos alineados a exposición, estructura y estacionalidad",
        description:
          "Cada línea tiene distinta calidad de datos, cadencia de renovación y perfiles de acumulación. Heath mantiene un solo modelo operativo y adapta reglas de triage, scoring y monitoreo a la realidad de cada mercado.",
        bullets: [
          "Triage consciente del ramo sin perder un estándar único de intake",
          "Contexto de portafolio embebido en el camino de decisión",
          "Tableros operativos alineados a cómo los equipos gestionan el libro",
        ],
      },
      cta: {
        kicker: "Siguiente paso",
        title: "Conocé Heath en tus",
        titleAccent: "líneas de negocio",
        description: "Pasá de solicitudes fragmentadas a inteligencia de suscripción estructurada.",
        primary: "Ingresá al dashboard",
        secondary: "Panel de Underwriting",
      },
      industryDetail: {
        notFoundTitle: "Sector no encontrado",
        notFoundBody: "Esta página no está disponible.",
        upcomingTitle: "Profundización próximamente",
        upcomingBody:
          "Estamos preparando flujos específicos por ramo, benchmarks y ejemplos para esta industria.",
        backLink: "Volver a sectores",
      },
    },
    recursos: {
      title: "Recursos",
      subtitle: "Ideas, guías y novedades para equipos de suscripción e innovación.",
      intro: "Estructura alineada a sitios enterprise de insurtech: blog, eventos, medios y descargas.",
      items: [
        { t: "Blog", d: "Artículos sobre IA, orquestación y suscripción." },
        { t: "Eventos", d: "Webinars y encuentros con el sector." },
        { t: "Medios", d: "Notas de prensa y cobertura." },
        { t: "Documentos", d: "Documentación técnica y de negocio (próximamente)." },
      ],
    },
    empresa: {
      title: "Empresa",
      subtitle: "Construimos la siguiente generación de inteligencia de suscripción.",
      intro:
        "Historia, misión, alianzas y carreras. Texto provisional hasta definición de marca y mensajes corporativos.",
      upcoming: "Próximamente",
      upcomingItems: "Sobre nosotros · Asociarse con Heath · Oportunidades laborales",
    },
    exposicion: {
      title: "Gestión de exposición",
      subtitle: "Conocé el libro mientras lo construís: límites, acumulación y concentración.",
      p1: "Cada decisión se evalúa en contexto de portafolio, reduciendo sorpresas en renovación y reforzando el control de capacidad.",
      p2: "Texto provisional de marketing: tableros, reglas y alertas se documentarán aquí cuando el producto lo requiera.",
    },
    mesa: {
      title: "Panel de Underwriting",
      subtitle: "Una interfaz operativa para gestionar el ciclo completo de underwriting con contexto de portafolio.",
      p1: "El panel unifica solicitudes, extracción de datos y decisiones con trazabilidad. Diseñado para decisiones consistentes, menores tiempos y mejor control de capacidad.",
      p2: "En esta demo, la experiencia es 100% mock: al solicitar demo podrás explorar escenarios de distintas oportunidades.",
      primary: "Entrar al panel",
      secondary: "Volver al inicio",
      cards: [
        { title: "Bandeja unificada", description: "Solicitudes estructuradas con estado y contexto para cada oportunidad." },
        { title: "Reglas y configuración", description: "Ajustá estrategia, umbrales y buffers para ver el impacto estimado." },
        { title: "Trazabilidad de decisiones", description: "Historial claro de decisiones: qué se hizo, por qué y con qué riesgo." },
      ],
    },
    demo: {
      title: "Solicitar demo",
      subtitle: "Coordinemos una sesión con tu equipo de suscripción y tecnología.",
      intro: "Este formulario es una simulación: al enviarlo, se inicia una sesión mock y se redirige al Panel de Underwriting.",
    },
    login: {
      title: "Iniciar sesión",
      subtitle: "Entrá al dashboard de suscripción. (Simulación sin backend)",
    },
  },
} as const;
