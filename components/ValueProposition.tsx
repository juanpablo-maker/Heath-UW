import React from "react";
import { FeatureCard } from "./FeatureCard";
import { SectionContainer } from "./ui/SectionContainer";

const valueProps = [
  {
    title: "Recepci?n de solicitudes",
    description:
      "Centraliz? y estructur? cada oportunidad de forma autom?tica",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
  {
    title: "Inteligencia de decisi?n",
    description: "Puntu? y evalu? riesgos con insights impulsados por IA",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
  },
  {
    title: "Visibilidad del portafolio",
    description: "Entend? tu exposici?n y optimiz? la participaci?n",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
        />
      </svg>
    ),
  },
];

export function ValueProposition() {
  return (
    <SectionContainer className="bg-backgroundSecondary/80">
      <div className="mb-12 text-center md:mb-16">
        <h2 className="text-3xl font-bold tracking-tight text-primary md:text-4xl">
          Todo en una sola plataforma
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-secondary">
          Desde la recepci?n hasta la decisi?n: flujo integrado para
          aseguradores y reaseguradores.
        </p>
      </div>
      <div className="grid gap-8 md:grid-cols-3 md:gap-6 lg:gap-8">
        {valueProps.map((item) => (
          <FeatureCard
            key={item.title}
            icon={item.icon}
            title={item.title}
            description={item.description}
          />
        ))}
      </div>
    </SectionContainer>
  );
}
