import { TrendingUp } from "lucide-react";
import Link from "next/link";

export default function Logo({ href = '/icon.png' }: { href?: string }) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-2 text-lg font-semibold"
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors group-hover:bg-primary/90">
        <TrendingUp className="h-5 w-5" />
      </div>
      <span className="font-bold">TradeDiary</span>
    </Link>
  );
}
