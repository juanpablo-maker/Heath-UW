import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { cn } from "@/lib/cn";

export type IndustryCardProps = {
  title: string;
  description: string;
  /** Detail URL — use `ROUTES.industries.detail(slug)` from `@/lib/routes/marketing` */
  href: string;
  className?: string;
};

export function IndustryCard({ title, description, href, className }: IndustryCardProps) {
  return (
    <Link
      href={href}
      className={cn("group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-2xl", className)}
    >
      <Card className="relative h-full transition-transform duration-300 group-hover:-translate-y-0.5">
        <div className="flex items-start justify-between gap-3">
          <Heading as="h3" variant="h3" className="text-xl md:text-2xl">
            {title}
          </Heading>
          <ArrowUpRight
            className="mt-1 h-5 w-5 shrink-0 text-secondary transition-colors group-hover:text-accent"
            aria-hidden
          />
        </div>
        <Text variant="muted" className="mt-3 text-sm md:text-base">
          {description}
        </Text>
      </Card>
    </Link>
  );
}
