
import { MainLayout } from '@/components/layout/main-layout';
import { DashboardBacktests } from '@/components/backtest/dashboard-backtests';

export default function HomePage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Meus Backtests
          </h1>
          <p className="text-gray-600 mt-2">
            Organize e gerencie seus registros de backtests de mercado
          </p>
        </div>
        
        <DashboardBacktests />
      </div>
    </MainLayout>
  );
}
