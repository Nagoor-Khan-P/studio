import AppHeader from '@/components/app-header';
import PerformanceMetrics from '@/components/performance-metrics';
import PerformanceChart from '@/components/performance-chart';
import RecentTrades from '@/components/recent-trades';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getTrades } from '@/lib/data';
import AuthWrapper from '@/components/auth-wrapper';

async function DashboardContent() {
  const trades = await getTrades();

  return (
    <div className="flex min-h-screen w-full flex-col">
      <AppHeader />
      <main className="flex flex-1 flex-col gap-4 p-4 sm:px-8 sm:py-6 md:gap-8">
        <PerformanceMetrics trades={trades} />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-7">
          <Card className="lg:col-span-4">
             <CardHeader>
              <CardTitle>Recent Trades</CardTitle>
              <CardDescription>
                A log of your recent trades.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecentTrades trades={trades} />
            </CardContent>
          </Card>
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Performance Over Time</CardTitle>
              <CardDescription>Cumulative profit/loss history.</CardDescription>
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

export default function DashboardPage() {
  return (
    <AuthWrapper>
      <DashboardContent />
    </AuthWrapper>
  );
}
