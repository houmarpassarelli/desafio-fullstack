import { useState, useEffect } from 'react';
import { PageHeader } from "@/components/Layout/pageheader";
import { IconLibraryFilled } from '@tabler/icons-react';
import { PlanService } from '../../services/PlanService';
import type { Plan } from '../../types';
import { formatPrice } from '@/lib';

export const Plans = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'monthly' | 'yearly'>('monthly');

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

  // Filtrar planos baseado na tab ativa
  const filteredPlans = plans.filter(plan => plan.type === activeTab);

  // Componente de Tabs
  const TabsComponent = () => (
    <div className="mb-6">
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('monthly')}
          className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            activeTab === 'monthly'
              ? 'bg-orange-600 text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Mensal
        </button>
        <button
          onClick={() => setActiveTab('yearly')}
          className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            activeTab === 'yearly'
              ? 'bg-orange-600 text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Anual
        </button>
      </div>
    </div>
  );

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

        <TabsComponent />

        {filteredPlans.length === 0 ? (
          <div className="flex items-center justify-center min-h-64">
            <div className="text-center">
              <div className="text-gray-400 text-4xl mb-4">📋</div>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Nenhum plano {activeTab === 'monthly' ? 'mensal' : 'anual'} disponível
              </p>
              <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
                Tente a aba {activeTab === 'monthly' ? 'Anual' : 'Mensal'}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-3 transition-opacity duration-300">
            {filteredPlans.map((plan, index) => (
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
                    {plan.type === 'monthly' ? '/mês' : '/ano'}
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
        )}
    </div>
  );
};
