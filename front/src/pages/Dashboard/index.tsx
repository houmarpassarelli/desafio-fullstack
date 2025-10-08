import { Link } from "react-router-dom";
import { IconLibrary, IconHomeFilled } from '@tabler/icons-react';
import { PageHeader } from "@/components/Layout/pageheader";

export const Dashboard = () => {
  return (
    <div className="py-6">
      <PageHeader title="Início" icon={IconHomeFilled} />
      <div className="flex items-center justify-start py-12">
        <div className="grid gap-6 mb-8 md:grid-cols-2">
          <div
            className="min-w-0 p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800 flex flex-col"
          >
            <IconLibrary size={32} className="text-orange-400 mb-4" />
            <h4 className="mb-4 font-semibold text-orange-400">
              Nenhum plano contratado
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              Contrate um plano para contunuar aproveitando todos os benefícios.
            </p>
            <Link to="/planos" className="mt-4 px-4 py-2 rounded text-orange-400 hover:bg-orange-500 hover:text-gray-800 transition-colors self-end">
              Contrate agora &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}