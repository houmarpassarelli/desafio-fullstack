import { useState, useEffect } from 'react';
import { PageHeader } from "@/components/Layout/pageheader";
import { IconLibraryFilled } from '@tabler/icons-react';
import { PlanService } from '../../services/PlanService';
import { UserService } from '../../services/UserService';
import { useAuth } from '../../hooks/useAuth';
import type { Plan } from '../../types';
import { formatPrice } from '@/lib';

export const Plans = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'monthly' | 'yearly'>('monthly');
  const [contractingPlan, setContractingPlan] = useState<string | null>(null);

  const { user, refreshUser } = useAuth();

  // Recuperar plano ativo do localStorage
  const userService = new UserService();
  const activePlan = userService.getActivePlan();

  // Função para validar se é um UUID válido
  const isValidUUID = (str: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
  };

  // Função auxiliar para obter identificador do plano de forma segura
  const getPlanIdentifier = (plan: Plan): string | null => {
    // A API sempre retorna 'id' que é na verdade o 'reference' (devido à trait HasReferenceAsId)
    if (plan.id && isValidUUID(plan.id.toString())) {
      return plan.id.toString();
    }
    // Fallback para 'reference' caso não tenha 'id'
    if (plan.reference && isValidUUID(plan.reference)) {
      return plan.reference;
    }
    // Retorna null se não houver UUID válido
    return null;
  };

  // Função para verificar se um plano está sendo contratado
  const isContractingPlan = (plan: Plan): boolean => {
    if (!contractingPlan) return false;
    const planId = getPlanIdentifier(plan);
    return planId !== null && contractingPlan === planId;
  };

  // Função para verificar se um plano é o plano ativo do usuário
  const isCurrentActivePlan = (plan: Plan): boolean => {
    if (!activePlan) return false;
    const planId = getPlanIdentifier(plan);
    return planId !== null && activePlan.plan_reference === planId;
  };

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        setError(null);
        const planService = new PlanService();
        const plansData = await planService.getPlans();

        // Log estrutura de cada plano
        plansData.forEach((plan, index) => {
          console.log(`Plan ${index + 1}:`, {
            id: plan.id,
            reference: plan.reference,
            label: plan.label,
            type: plan.type,
            hasValidId: plan.id ? isValidUUID(plan.id.toString()) : false,
            hasValidRef: plan.reference ? isValidUUID(plan.reference) : false
          });
        });

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

  // Função para contratar um plano
  const handleContractPlan = async (plan: Plan) => {
    console.log('=== Contract Plan Debug ===');
    console.log('Plan data:', plan);
    console.log('Plan.id:', plan.id, 'Type:', typeof plan.id);
    console.log('Plan.reference:', plan.reference, 'Type:', typeof plan.reference);

    const planIdentifier = getPlanIdentifier(plan);
    console.log('Plan identifier to send:', planIdentifier);
    console.log('Plan identifier type:', typeof planIdentifier);
    console.log('Is valid UUID?', planIdentifier ? isValidUUID(planIdentifier) : false);

    if (!planIdentifier) {
      alert('Erro: Plano não possui identificador válido (UUID). Dados inconsistentes na API.');
      console.error('Plan without valid UUID:', plan);
      return;
    }

    if (!user) {
      alert('Você precisa estar logado para contratar um plano');
      return;
    }

    setContractingPlan(planIdentifier);

    try {
      const planService = new PlanService();
      const userService = new UserService();

      // Determinar tipo de operação baseado se usuário já tem plano ativo
      const exchangeType = activePlan ? 'change' : 'contract';

      // Contratar o plano
      const contractedPlan = await planService.contractPlan(planIdentifier, exchangeType);

      // Salvar dados do plano contratado no localStorage
      userService.saveActivePlan(contractedPlan);

      // Atualizar dados do usuário no localStorage
      if (user.reference) {
        const updatedUser = await userService.getUser(user.reference);
        userService.saveUserProfile(updatedUser, undefined, contractedPlan);

        // Atualizar estado global do usuário
        await refreshUser();
      }

      alert(`Plano ${plan.label} contratado com sucesso!`);

    } catch (error: any) {
      console.error('Erro ao contratar plano:', error);
      const errorMessage = error?.response?.data?.message || 'Erro ao contratar plano. Tente novamente.';
      alert(errorMessage);
    } finally {
      setContractingPlan(null);
    }
  };

  // Componente de label "Atual" triangular
  const CurrentPlanLabel = () => (
    <div className="absolute top-0 right-0 z-10">
      <div className="relative">
        {/* Triângulo verde */}
        <div className="w-0 h-0 border-l-[50px] border-l-transparent border-t-[50px] border-t-green-500 border-r-[50px] border-r-green-500"></div>
        {/* Texto "ATUAL" */}
        <span className="absolute top-2 right-2 text-white text-xs font-bold transform rotate-45 origin-center">
          ATUAL
        </span>
      </div>
    </div>
  );

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
            className="min-w-0 bg-white rounded-lg shadow-xs dark:bg-gray-800 overflow-hidden relative"
            >
            {/* Label "Atual" para plano ativo */}
            {isCurrentActivePlan(plan) && <CurrentPlanLabel />}

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
                    {(plan.storage / 1000)} GB
                </p>
                </div>
                <div>
                {(() => {
                  const planId = getPlanIdentifier(plan);
                  const isContractingThisPlan = isContractingPlan(plan);
                  const hasValidId = planId !== null;
                  const isCurrentPlan = isCurrentActivePlan(plan);

                  // Se for o plano atual, não mostrar botão
                  if (isCurrentPlan) {
                    return null;
                  }

                  return (
                    <button
                      onClick={() => handleContractPlan(plan)}
                      disabled={isContractingThisPlan || !hasValidId}
                      className={`mt-4 w-full px-4 py-2 rounded transition-colors ${
                        isContractingThisPlan
                          ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                          : !hasValidId
                          ? 'bg-red-400 text-white cursor-not-allowed'
                          : 'bg-gray-800 text-orange-600 hover:bg-orange-600 hover:text-white'
                      }`}
                    >
                      {isContractingThisPlan
                        ? 'Contratando...'
                        : !hasValidId
                        ? 'Dados Inválidos'
                        : activePlan ? 'Trocar Plano' : 'Contratar Plano'
                      }
                    </button>
                  );
                })()}
                </div>
            </div>
            </div>
            ))}
          </div>
        )}
    </div>
  );
};
