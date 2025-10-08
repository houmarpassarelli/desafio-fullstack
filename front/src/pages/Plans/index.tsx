import { PageHeader } from "@/components/Layout/pageheader";
import { IconLibraryFilled } from '@tabler/icons-react';

export const Plans = () => {
  const plans = [
    {
      id: 1,
      price: "87,00",
      storage: 10,
      files: 1000,
      label: "Starter"
    },
    {
      id: 2,
      price: "197,00",
      storage: 25,
      files: 2500,
      label: "Pro"
    },
    {
      id: 3,
      price: "347,00",
      storage: 50,
        files: 5000,
        label: "Business"
    },
    {
      id: 4,
      price: "497,00",
      storage: 100,
        files: 10000,
        label: "Enterprise"
    },
    // {
    //   id: 5,
    //   price: "797,00",
    //   storage: 250,
    //   files: 25000,
    // },
    // {
    //   id: 6,
    //   price: "1.197,00",
    //   storage: 500,
    //     files: 50000,
    // },
  ];

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
        {plans.map((plan) => (
            <div
            key={plan.id}
            className="min-w-0 bg-white rounded-lg shadow-xs dark:bg-gray-800 overflow-hidden"
            >
            <div className="bg-orange-500 text-white p-4">
                <h4 className="font-semibold text-lg">
                Plano {plan.label}
                </h4>
                <p className="text-sm">
                Até {plan.files} arquivos
                </p>
            </div>
            <div className="p-4">
                <div className="mb-4">
                <p className="text-3xl font-bold text-gray-700 dark:text-gray-200">
                    R$ {plan.price}
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
