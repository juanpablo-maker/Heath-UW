"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/components/providers/LanguageProvider";
import { createMockSession } from "@/lib/mockAuth";

export function ReservarDemoForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirect = useMemo(() => {
    const param = searchParams.get("redirect");
    return param && param.startsWith("/") ? param : "/panel-de-suscripcion-dashboard";
  }, [searchParams]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { dict } = useI18n();

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const nombre = String(formData.get("nombre") ?? "").trim();
    const empresa = String(formData.get("empresa") ?? "").trim();

    if (!email.includes("@")) {
      setError(dict.forms.demo.errors.email);
      return;
    }
    if (!nombre) {
      setError(dict.forms.demo.errors.name);
      return;
    }
    if (!empresa) {
      setError(dict.forms.demo.errors.company);
      return;
    }

    setLoading(true);
    createMockSession({
      id: `mock_${Date.now()}`,
      email,
      name: nombre,
      company: empresa,
      role: "cliente",
    });

    // Keep UX snappy: redirect immediately after mock session.
    router.replace(redirect);
  }

  return (
    <form
      className="mx-auto max-w-md space-y-4 text-left"
      onSubmit={onSubmit}
    >
      <div>
        <label htmlFor="nombre" className="mb-1 block text-sm font-medium text-primary">
          {dict.forms.demo.name}
        </label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-primary outline-none ring-accent focus:ring-2"
          placeholder={dict.forms.demo.namePlaceholder}
        />
      </div>
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-primary">
          {dict.forms.demo.email}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-primary outline-none ring-accent focus:ring-2"
          placeholder={dict.forms.demo.emailPlaceholder}
        />
      </div>
      <div>
        <label htmlFor="empresa" className="mb-1 block text-sm font-medium text-primary">
          {dict.forms.demo.company}
        </label>
        <input
          id="empresa"
          name="empresa"
          type="text"
          className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-primary outline-none ring-accent focus:ring-2"
          placeholder={dict.forms.demo.companyPlaceholder}
        />
      </div>
      {error && (
        <div
          className="rounded-xl border border-risk/30 bg-risk/5 px-4 py-3 text-sm text-risk"
          role="alert"
        >
          {error}
        </div>
      )}
      <Button variant="primary" className="w-full" type="submit" disabled={loading}>
        {loading ? dict.forms.demo.sending : dict.forms.demo.submit}
      </Button>
    </form>
  );
}
