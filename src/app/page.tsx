import Link from "next/link";
import { Button } from "@/components/ui/button";
import Logo from "@/components/logo";
import Image from "next/image";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { getSessionUserId } from "@/lib/session";
import { redirect } from "next/navigation";

function LandingHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 sm:px-8">
      <Logo />

      <div className="flex items-center gap-2">
        <Button variant="ghost" asChild>
          <Link href="/login">Login</Link>
        </Button>
        <Button asChild>
          <Link href="/signup">Sign Up</Link>
        </Button>
      </div>
    </header>
  );
}

export default async function LandingPage() {
  const userId = await getSessionUserId();

  // 🔒 Logged-in users should never see landing page
  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader />

      <main className="flex-1">
        {/* HERO */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Your Personal Trading Journal
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Track your trades, analyze your performance, and become a
                    more disciplined trader with TradeDiary.
                  </p>
                </div>

                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" asChild>
                    <Link href="/signup">
                      Get Started for Free
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>

              <Image
                src="https://picsum.photos/seed/tradedemo/600/400"
                width={600}
                height={400}
                alt="Trading dashboard preview"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  Key Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Why Choose TradeDiary?
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  We provide the tools you need to reflect on your trading habits
                  and improve your strategy.
                </p>
              </div>
            </div>

            <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-12">
              {[
                "Easy Entry",
                "Performance Metrics",
                "Visual Charts",
                "Trade History",
                "Secure Authentication",
                "Modern Interface",
              ].map((title) => (
                <div key={title} className="grid gap-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-bold">{title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          &copy; 2026 TradeDiary. All rights reserved to Nagoor Khan.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline">
            Terms
          </Link>
          <Link href="#" className="text-xs hover:underline">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
