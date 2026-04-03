import type { Metadata } from "next";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { ControlPanelShell } from "@/components/dashboard/ControlPanelHome";

export const metadata: Metadata = {
  title: "Configuraciones | Heath",
  description: "Panel de configuraciones (mock) para el Panel de Underwriting.",
};

export default function PanelConfiguracionesPage() {
  return (
    <RequireAuth>
      <ControlPanelShell
        title="Configuraciones"
        subtitle="Mock de configuración del panel (próximamente: reglas, umbrales y capacidad)."
      >
        <section className="rounded-2xl border border-border bg-card/95 p-5 shadow-card-lift">
          <div className="text-sm font-semibold text-primary">Próximamente</div>
          <div className="mt-2 text-sm text-secondary">
            Aquí se mostrarán las reglas y la configuración del flujo de underwriting.
          </div>
        </section>
      </ControlPanelShell>
    </RequireAuth>
  );
}

