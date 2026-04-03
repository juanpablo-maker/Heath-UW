import type { Metadata } from "next";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { UnderwritingWorkbench } from "@/components/dashboard/UnderwritingWorkbench";

export const metadata: Metadata = {
  title: "Panel de Underwriting | Heath",
  description:
    "Mesa de trabajo operativa de underwriting con submissions, workflow y decisión en pantalla (mock).",
};

export default function PanelDeSuscripcionDashboardPage() {
  return (
    <RequireAuth>
      <UnderwritingWorkbench />
    </RequireAuth>
  );
}

