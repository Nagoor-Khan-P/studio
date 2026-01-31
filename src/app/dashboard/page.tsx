import AppHeader from "@/components/app-header";
import PerformanceMetrics from "@/components/performance-metrics";
import PerformanceChart from "@/components/performance-chart";
import RecentTrades from "@/components/recent-trades";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getTrades } from "@/lib/data";
import AddEntrySheet from "@/components/add-entry-sheet";
import { getCurrentUser } from "@/lib/get-current-user";

export default async function DashboardPage() {
  const [trades, user] = await Promise.all([
    getTrades(),
    getCurrentUser(),
  ]);

  return (
    <div className="flex min-h-screen w-full flex-col">
      {/* ✅ Pass real user name */}
      <AppHeader user={user} />

      <main className="flex flex-1 flex-col gap-4 p-4 sm:px-8 sm:py-6 md:gap-8">
        <PerformanceMetrics trades={trades} />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-7">
          {/* Recent Trades */}
          <Card className="lg:col-span-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Trades</CardTitle>
                <CardDescription>
                  A log of your recent trades.
                </CardDescription>
              </div>

              {/* Add Entry */}
              <AddEntrySheet>
                <Button size="sm">+ Add Entry</Button>
              </AddEntrySheet>
            </CardHeader>

            <CardContent>
              <RecentTrades trades={trades} />
            </CardContent>
          </Card>

          {/* Performance Chart */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Performance Over Time</CardTitle>
              <CardDescription>
                Cumulative profit/loss history.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <PerformanceChart trades={trades} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
