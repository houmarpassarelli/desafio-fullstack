import { Link } from "react-router-dom";
import { PageHeader } from "@/components/Layout/pageheader";
import { IconCreditCardFilled, IconLibrary } from '@tabler/icons-react';
import { UserService } from '../../services/UserService';
import { useAuth } from '../../hooks/useAuth';
import { formatPrice } from '@/lib';

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

// Função para formatar data no formato brasileiro
const formatDateBR = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
};

export const Subscription = () => {
    const { user } = useAuth();
    const userService = new UserService();
    const activePlan = userService.getActivePlan();

    return (<div className="py-6">
        <PageHeader
            title="Assinatura"
            icon={IconCreditCardFilled}
            breadcrumbs={[
                { label: "Início", path: "/" },
                { label: "Assinatura" }
            ]}
        />
        <main className="h-full pb-16 overflow-y-auto">
            <div className="container mx-auto grid">
                {activePlan ? (
                    // Card do plano ativo
                    <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-3">
                        <div className="min-w-0 bg-white rounded-lg shadow-xs dark:bg-gray-800 overflow-hidden relative">
                            {/* Label "Atual" */}
                            <CurrentPlanLabel />

                            <div className="bg-orange-500 text-white p-4">
                                <h4 className="font-semibold text-lg">
                                    Plano {activePlan.plan?.label || 'Ativo'}
                                </h4>
                                <p className="text-sm">
                                    Até {activePlan.plan?.lot.toLocaleString('pt-BR') || 0} arquivos
                                </p>
                            </div>
                            <div className="p-4">
                                <div className="mb-4">
                                    <p className="text-3xl font-bold text-gray-700 dark:text-gray-200">
                                        R$ {activePlan.plan?.price ? formatPrice(activePlan.plan.price) : '0,00'}
                                        <span className="text-base font-normal text-gray-600 dark:text-gray-400">
                                            {activePlan.plan?.type === 'monthly' ? '/mês' : '/ano'}
                                        </span>
                                    </p>
                                </div>
                                <div className="mb-4">
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                        Armazenamento:
                                    </p>
                                    <p className="text-2xl font-bold text-gray-700 dark:text-gray-200">
                                        {activePlan.plan?.storage ? (activePlan.plan.storage / 1000) : 0} GB
                                    </p>
                                </div>
                                {activePlan.expires_in && (
                                    <div className="mb-4">
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                            Expiração:
                                        </p>
                                        <p className="text-2xl font-bold text-gray-700 dark:text-gray-200">
                                            {formatDateBR(activePlan.expires_in)}
                                        </p>
                                    </div>
                                )}
                                <div>
                                    <Link
                                        to="/planos"
                                        className="mt-4 w-full px-4 py-2 bg-gray-800 text-orange-600 rounded hover:bg-orange-600 hover:text-white transition-colors inline-block text-center"
                                    >
                                        Trocar Plano
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    // Estado quando não há plano
                    <div className="flex items-center justify-center min-h-64">
                        <div className="text-center">
                            <IconLibrary size={64} className="text-orange-400 mb-4 mx-auto" />
                            <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
                                Nenhuma assinatura ativa
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Você não possui nenhum plano contratado no momento.
                            </p>
                            <Link
                                to="/planos"
                                className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                            >
                                Contratar Plano
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </main>
    </div>)
}