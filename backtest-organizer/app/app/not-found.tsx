
import Link from 'next/link';
import { ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            Página não encontrada
          </h2>
          <p className="text-gray-500 max-w-md mx-auto">
            A página que você está procurando não existe ou foi movida.
          </p>
        </div>

        <div className="flex items-center justify-center gap-4">
          <Button 
            asChild 
            variant="outline"
            className="flex items-center gap-2"
          >
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Link>
          </Button>
          
          <Button asChild className="flex items-center gap-2">
            <Link href="/">
              <Home className="h-4 w-4" />
              Página Inicial
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
