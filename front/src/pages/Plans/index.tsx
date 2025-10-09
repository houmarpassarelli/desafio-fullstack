import { useState, useEffect } from 'react';
import { PageHeader } from "@/components/Layout/pageheader";
import { IconLibraryFilled } from '@tabler/icons-react';
import { PlanService } from '../../services/PlanService';
import type { Plan } from '../../types';

export const Plans = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        setError(null);
        const planService = new PlanService();
        const plansData = await planService.getPlans();
        setPlans(plansData);
      } catch (err) {
        setError('Erro ao carregar planos. Tente novamente mais tarde.');
        console.error('Erro ao buscar planos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const formatPrice = (priceInCents: string | number): string => {
    const price = typeof priceInCents === 'string' ? parseInt(priceInCents) : priceInCents;
    const priceInReais = price / 100; // Converter centavos para reais
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(priceInReais);
  };

  if (loading) {
    return (
      <div className="py-6">
        <PageHeader
          title="Planos de Assinatura"
          icon={IconLibraryFilled}
          breadcrumbs={[
            { label: "Início", path: "/" },
            { label: "Planos de Assinatura" }
          ]}
        />
        <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="min-w-0 bg-white rounded-lg shadow-xs dark:bg-gray-800 overflow-hidden animate-pulse"
            >
              <div className="bg-gray-300 h-20"></div>
              <div className="p-4 space-y-4">
                <div className="h-8 bg-gray-300 rounded"></div>
                <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                <div className="h-10 bg-gray-300 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-6">
        <PageHeader
          title="Planos de Assinatura"
          icon={IconLibraryFilled}
          breadcrumbs={[
            { label: "Início", path: "/" },
            { label: "Planos de Assinatura" }
          ]}
        />
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="text-red-500 text-lg mb-2">⚠️</div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
        <PageHeader 
            title="Planos de Assinatura" 
            icon={IconLibraryFilled}
            breadcrumbs={[
                { label: "Início", path: "/" },
                { label: "Planos de Assinatura" }
            ]}
        />
        <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan, index) => (
            <div
            key={`${plan.label}-${plan.type}-${index}`}
            className="min-w-0 bg-white rounded-lg shadow-xs dark:bg-gray-800 overflow-hidden"
            >
            <div className="bg-orange-500 text-white p-4">
                <h4 className="font-semibold text-lg">
                Plano {plan.label}
                </h4>
                <p className="text-sm">
                Até {plan.lot.toLocaleString('pt-BR')} arquivos
                </p>
            </div>
            <div className="p-4">
                <div className="mb-4">
                <p className="text-3xl font-bold text-gray-700 dark:text-gray-200">
                    R$ {formatPrice(plan.price)}
                    <span className="text-base font-normal text-gray-600 dark:text-gray-400">
                    /mês
                    </span>
                </p>
                </div>
                <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Armazenamento:
                </p>
                <p className="text-2xl font-bold text-gray-700 dark:text-gray-200">
                    {plan.storage} GB
                </p>
                </div>
                <div>
                <button className="mt-4 w-full px-4 py-2 bg-gray-800 text-orange-600 rounded hover:bg-orange-600 hover:text-white transition-colors">
                    Contratar Plano
                </button>
                </div>
            </div>
            </div>
        ))}
        </div>
    </div>
  );
};
