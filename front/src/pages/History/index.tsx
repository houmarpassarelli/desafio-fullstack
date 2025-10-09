import { useState, useEffect } from 'react';
import { PageHeader } from "@/components/Layout/pageheader";
import { IconHistory, IconCreditCardFilled, IconArrowsExchange } from '@tabler/icons-react';
import { Modal } from '@/components/Modal';
import { useModal } from '@/hooks/useModal';
import { UserService } from '../../services/UserService';
import { useAuth } from '../../hooks/useAuth';
import type { UserPlan } from '../../types';

interface HistoryItem {
    id: number;
    title: string;
    description: string;
    date: string;
    validUntil: string;
    type: 'exchange' | 'payment';
}

// Função para formatar data no formato brasileiro
const formatDateBR = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
};

// Função para transformar UserPlan em HistoryItem
const userPlanToHistoryItem = (userPlan: UserPlan): HistoryItem => {
    const isChange = userPlan.exchange_type === 'change';
    const planName = userPlan.plan?.label || 'Plano';
    const actionDate = formatDateBR(userPlan.created_at);
    const validUntil = userPlan.expires_in ? formatDateBR(userPlan.expires_in) : 'Indeterminado';

    return {
        id: userPlan.id,
        title: isChange ? `Troca de ${planName}` : `Aquisição do ${planName}`,
        description: `${isChange ? 'Troca' : 'Plano adquirido'} realizada em ${actionDate}. Válido até ${validUntil}.`,
        date: actionDate,
        validUntil: validUntil,
        type: isChange ? 'exchange' : 'payment'
    };
};

export const History = () => {
    const { isOpen, data: selectedItem, closeModal } = useModal<HistoryItem>();
    const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchHistory = async () => {
            if (!user?.reference) {
                setError('Usuário não encontrado');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const userService = new UserService();
                const userPlans = await userService.getUserPlanHistory(user.reference);

                const historyItems = userPlans.map(userPlanToHistoryItem);

                setHistoryData(historyItems);
            } catch (err) {
                console.error('Erro ao buscar histórico:', err);
                setError('Erro ao carregar histórico. Tente novamente mais tarde.');
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [user?.reference]);

    if (loading) {
        return (
            <div className="py-6">
                <PageHeader
                    title="Histórico"
                    icon={IconHistory}
                    breadcrumbs={[
                        { label: "Início", path: "/" },
                        { label: "Histórico" }
                    ]}
                />
                <div className="flex items-center justify-center min-h-64">
                    <div className="text-center">
                        <div className="text-orange-500 text-4xl mb-4">⏳</div>
                        <p className="text-gray-600 dark:text-gray-400">Carregando histórico...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="py-6">
                <PageHeader
                    title="Histórico"
                    icon={IconHistory}
                    breadcrumbs={[
                        { label: "Início", path: "/" },
                        { label: "Histórico" }
                    ]}
                />
                <div className="flex items-center justify-center min-h-64">
                    <div className="text-center">
                        <div className="text-red-500 text-4xl mb-4">⚠️</div>
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

    return (<div className="py-6">
        <PageHeader 
            title="Histórico" 
            icon={IconHistory}
            breadcrumbs={[
                { label: "Início", path: "/" },
                { label: "Histórico" }
            ]}
        />
        <main className="h-full pb-16 overflow-y-auto">
            <div className="container mx-auto grid">
                {historyData.length === 0 ? (
                    <div className="flex items-center justify-center min-h-64">
                        <div className="text-center">
                            <div className="text-gray-400 text-4xl mb-4">📋</div>
                            <p className="text-gray-600 dark:text-gray-400 text-lg">
                                Nenhum histórico de planos encontrado
                            </p>
                            <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
                                Quando você contratar ou trocar planos, eles aparecerão aqui
                            </p>
                        </div>
                    </div>
                ) : (
                    historyData.map((item) => (
                    <div key={item.id} className="flex items-center justify-between bg-white rounded-lg shadow-md dark:bg-gray-800 px-4 py-3 mb-2">
                        <div>
                            <h2 className="flex items-center gap-3 text-1xl font-semibold text-gray-700 dark:text-gray-200 mb-6">
                                {item.type === 'exchange' ? (
                                    <IconArrowsExchange size={24} className="text-orange-400" />
                                ) : (
                                    <IconCreditCardFilled size={24} className="text-orange-400" />
                                )}
                                <span>{item.title}</span>
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {item.description}
                            </p>
                        </div>
                    </div>
                    ))
                )}
            </div>
        </main>

        <Modal
            isOpen={isOpen}
            onClose={closeModal}
            title={selectedItem?.title}
            size="md"
            footer={
                <>
                    <button
                        onClick={closeModal}
                        className="w-full px-5 py-3 text-sm font-medium leading-5 text-gray-700 transition-colors duration-150 border border-gray-300 rounded-lg dark:text-gray-400 sm:px-4 sm:py-2 sm:w-auto hover:border-gray-500 focus:outline-none"
                    >
                        Fechar
                    </button>
                    <button className="w-full px-5 py-3 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-orange-600 border border-transparent rounded-lg sm:w-auto sm:px-4 sm:py-2 hover:bg-orange-700 focus:outline-none">
                        Baixar comprovante
                    </button>
                </>
            }
        >
            {selectedItem && (
                <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                        {selectedItem.type === 'exchange' ? (
                            <IconArrowsExchange size={32} className="text-orange-400" />
                        ) : (
                            <IconCreditCardFilled size={32} className="text-orange-400" />
                        )}
                        <div>
                            <p className="font-semibold text-gray-700 dark:text-gray-300">
                                {selectedItem.title}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Data da transação</p>
                            <p className="font-medium text-gray-700 dark:text-gray-300">{selectedItem.date}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Válido até</p>
                            <p className="font-medium text-gray-700 dark:text-gray-300">{selectedItem.validUntil}</p>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {selectedItem.description}
                        </p>
                    </div>
                </div>
            )}
        </Modal>
    </div>)
}