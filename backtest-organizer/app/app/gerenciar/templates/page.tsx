
import { MainLayout } from '@/components/layout/main-layout';
import { GerenciadorTemplates } from '@/components/templates/gerenciador-templates';

export default function GerenciarTemplatesPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gerenciar Templates
          </h1>
          <p className="text-gray-600 mt-2">
            Crie e gerencie templates reutilizáveis para observações
          </p>
        </div>
        
        <GerenciadorTemplates />
      </div>
    </MainLayout>
  );
}
