"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/components/providers/LanguageProvider";
import { getMockSession } from "@/lib/mockAuth";

type RequireAuthProps = {
  children: ReactNode;
};

export function RequireAuth({ children }: RequireAuthProps) {
  const router = useRouter();
  const { locale } = useI18n();
  const [status, setStatus] = useState<"loading" | "authed">("loading");

  useEffect(() => {
    const user = getMockSession();
    if (user) {
      setStatus("authed");
      return;
    }

    const redirectTarget =
      typeof window !== "undefined"
        ? window.location.pathname + window.location.search
        : "/dashboard";

    router.replace(
      `/iniciar-sesion?redirect=${encodeURIComponent(redirectTarget)}`
    );
  }, [router]);

  if (status === "loading") {
    return (
      <div className="mx-auto max-w-6xl px-6 py-14 text-center text-secondary">
        {locale === "es"
          ? "Cargando panel..."
          : locale === "zh"
            ? "正在加载仪表盘..."
            : "Loading dashboard..."}
      </div>
    );
  }

  return <>{children}</>;
}

