
import { MainLayout } from '@/components/layout/main-layout';
import { FormularioBacktest } from '@/components/backtest/formulario-backtest';

export default function NovoBacktestPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Novo Registro de Backtest
          </h1>
          <p className="text-gray-600 mt-2">
            Crie um novo registro para organizar seu backtest de mercado
          </p>
        </div>
        
        <FormularioBacktest />
      </div>
    </MainLayout>
  );
}
