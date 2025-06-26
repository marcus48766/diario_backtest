
import { MainLayout } from '@/components/layout/main-layout';
import { GerenciadorTags } from '@/components/tags/gerenciador-tags';

export default function GerenciarTagsPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gerenciar Tags
          </h1>
          <p className="text-gray-600 mt-2">
            Configure e organize as tags para categorizar seus backtests
          </p>
        </div>
        
        <GerenciadorTags />
      </div>
    </MainLayout>
  );
}
