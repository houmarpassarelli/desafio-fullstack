import { PageHeader } from "@/components/Layout/pageheader";
import { IconCreditCardFilled } from '@tabler/icons-react';

export const Subscription = () => {
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
                <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-3">
                    <div className="min-w-0 bg-white rounded-lg shadow-xs dark:bg-gray-800 overflow-hidden">
                        <div className="bg-orange-500 text-white p-4">
                            <h4 className="font-semibold text-lg">
                            Plano Mensal
                            </h4>
                            <p className="text-sm">
                            Até 1000 arquivos
                            </p>
                        </div>
                        <div className="p-4">
                            <div className="mb-4">
                                <p className="text-3xl font-bold text-gray-700 dark:text-gray-200">
                                    R$ 87,00
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
                                    10 GB
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    Exoiração:
                                </p>
                                <p className="text-2xl font-bold text-gray-700 dark:text-gray-200">
                                    01/02/2024
                                </p>
                            </div>
                            <div>
                                <button className="mt-4 w-full px-4 py-2 bg-gray-800 text-orange-600 rounded hover:bg-orange-600 hover:text-white transition-colors">
                                    Trocar Plano
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>)
}