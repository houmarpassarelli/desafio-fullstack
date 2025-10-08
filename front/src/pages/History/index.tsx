import { PageHeader } from "@/components/Layout/pageheader";
import { IconHistory, IconCreditCardFilled, IconArrowsExchange } from '@tabler/icons-react';
import { Modal } from '@/components/Modal';
import { useModal } from '@/hooks/useModal';

interface HistoryItem {
    id: number;
    title: string;
    description: string;
    date: string;
    validUntil: string;
    type: 'exchange' | 'payment';
}

export const History = () => {
    const { isOpen, data: selectedItem, openModal, closeModal } = useModal<HistoryItem>();

    const historyData: HistoryItem[] = [
        {
            id: 1,
            title: 'Troca de plano mensal',
            description: 'Troca realizada em 01/01/2024. Válido até 01/02/2024.',
            date: '01/01/2024',
            validUntil: '01/02/2024',
            type: 'exchange'
        },
        {
            id: 2,
            title: 'Aquisição do plano mensal',
            description: 'Plano adquirido em 01/01/2024. Válido até 01/02/2024.',
            date: '01/01/2024',
            validUntil: '01/02/2024',
            type: 'payment'
        }
    ];

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
                {historyData.map((item) => (
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
                        <button
                            onClick={() => openModal(item)}
                            className="px-4 py-2 text-sm text-orange-600 rounded hover:bg-orange-600 hover:text-white transition-colors"
                        >
                            Ver detalhes
                        </button>
                    </div>
                ))}
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