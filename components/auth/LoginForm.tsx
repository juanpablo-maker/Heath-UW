"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { useI18n } from "@/components/providers/LanguageProvider";
import { createMockSession } from "@/lib/mockAuth";

const ALLOWED_EMAIL = "pruebas@heathuw.com";
const ALLOWED_PASSWORD = "pruebas2026";

function deriveCompanyFromEmail(email: string) {
  const domain = email.split("@")[1] ?? "empresa";
  return domain
    .replaceAll(".", " ")
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .trim()
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirect = useMemo(() => {
    const param = searchParams.get("redirect");
    return param && param.startsWith("/") ? param : "/dashboard";
  }, [searchParams]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { dict } = useI18n();

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail.includes("@")) {
      setError(dict.forms.login.errors.email);
      return;
    }
    if (!trimmedPassword) {
      setError(dict.forms.login.errors.password);
      return;
    }
    if (trimmedEmail.toLowerCase() !== ALLOWED_EMAIL || trimmedPassword !== ALLOWED_PASSWORD) {
      setError(dict.forms.login.errors.invalidCredentials);
      return;
    }

    setLoading(true);

    const userEmail = ALLOWED_EMAIL;
    const namePart = userEmail.split("@")[0]?.slice(0, 20) ?? "Cliente";
    const userName = namePart
      .replace(/[._-]+/g, " ")
      .replace(/\b\w/g, (m) => m.toUpperCase());

    createMockSession({
      id: `mock_${Date.now()}`,
      email: userEmail,
      name: userName,
      company: deriveCompanyFromEmail(userEmail),
      role: "cliente",
    });

    router.replace(redirect);
  }

  return (
    <form
      className="mx-auto max-w-md space-y-6 text-left"
      onSubmit={onSubmit}
    >
      <div className="space-y-3 text-center">
        <Heading as="h1" variant="h1">
          {dict.forms.login.title}
        </Heading>
        <Text className="md:text-lg">{dict.forms.login.subtitle}</Text>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-primary">
            {dict.forms.login.email}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-primary outline-none ring-accent focus:ring-2"
            placeholder={dict.forms.login.emailPlaceholder}
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-primary">
            {dict.forms.login.password}
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-primary outline-none ring-accent focus:ring-2"
            placeholder={dict.forms.login.passwordPlaceholder}
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
      </div>

      <div className="space-y-3">
        <Button
          variant="primary"
          className="w-full"
          type="submit"
          disabled={loading}
        >
          {loading ? dict.forms.login.submitting : dict.forms.login.submit}
        </Button>
        <div className="text-center text-xs text-secondary">
          {dict.forms.login.hint}
        </div>
      </div>
    </form>
  );
}

