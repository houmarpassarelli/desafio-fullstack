import { Link } from "react-router-dom";
import { IconLibrary, IconHomeFilled, IconFiles, IconDatabase } from '@tabler/icons-react';
import { PageHeader } from "@/components/Layout/pageheader";
import { UserService } from '../../services/UserService';
import { useAuth } from '../../hooks/useAuth';

export const Dashboard = () => {
  const { user } = useAuth();
  const userService = new UserService();
  const activePlan = userService.getActivePlan();

  // Função para calcular benefícios disponíveis e utilizados
  const getBenefitsData = () => {
    if (!activePlan) return null;

    const metaData = activePlan.meta_data || {};
    const usage = activePlan.usage || { lot_used: 0, storage_used: 0 };

    // Benefícios disponíveis vêm do meta_data, com fallback para o plano
    const lotAvailable = metaData.lot_available || activePlan.plan?.lot || 0;
    const storageAvailable = metaData.storage_available || activePlan.plan?.storage || 0;

    return {
      lot: {
        used: usage.lot_used,
        available: lotAvailable
      },
      storage: {
        used: usage.storage_used,
        available: storageAvailable
      }
    };
  };

  const benefitsData = getBenefitsData();

  return (
    <div className="py-6">
      <PageHeader title="Início" icon={IconHomeFilled} />
      <div className="flex items-center justify-start py-12">
        <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-3">
          {activePlan && benefitsData ? (
            // Cards de benefícios quando há plano ativo
            <>
              {/* Card de Arquivos */}
              <div className="min-w-0 p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800 flex flex-col">
                <IconFiles size={32} className="text-orange-400 mb-4" />
                <h4 className="mb-2 font-semibold text-orange-400">
                  Arquivos
                </h4>
                <div className="mb-4">
                  <p className="text-2xl font-bold text-gray-700 dark:text-gray-200">
                    {benefitsData.lot.used.toLocaleString('pt-BR')} / {benefitsData.lot.available.toLocaleString('pt-BR')}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    arquivos utilizados
                  </p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-orange-500 h-2 rounded-full"
                    style={{
                      width: `${benefitsData.lot.available > 0 ? (benefitsData.lot.used / benefitsData.lot.available) * 100 : 0}%`
                    }}
                  ></div>
                </div>
              </div>

              {/* Card de Armazenamento */}
              <div className="min-w-0 p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800 flex flex-col">
                <IconDatabase size={32} className="text-orange-400 mb-4" />
                <h4 className="mb-2 font-semibold text-orange-400">
                  Armazenamento
                </h4>
                <div className="mb-4">
                  <p className="text-2xl font-bold text-gray-700 dark:text-gray-200">
                    {(benefitsData.storage.used / 1000).toFixed(1)} / {(benefitsData.storage.available / 1000).toFixed(1)} GB
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    armazenamento utilizado
                  </p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-orange-500 h-2 rounded-full"
                    style={{
                      width: `${benefitsData.storage.available > 0 ? (benefitsData.storage.used / benefitsData.storage.available) * 100 : 0}%`
                    }}
                  ></div>
                </div>
              </div>

              {/* Card de Plano Atual */}
              <div className="min-w-0 p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800 flex flex-col">
                <IconLibrary size={32} className="text-orange-400 mb-4" />
                <h4 className="mb-2 font-semibold text-orange-400">
                  Plano {activePlan.plan?.label || 'Ativo'}
                </h4>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Seu plano está ativo e funcionando perfeitamente.
                </p>
                <Link
                  to="/assinatura"
                  className="mt-auto px-4 py-2 rounded text-orange-400 hover:bg-orange-500 hover:text-gray-800 transition-colors self-end"
                >
                  Ver detalhes &rarr;
                </Link>
              </div>
            </>
          ) : (
            // Card quando não há plano ativo
            <div className="min-w-0 p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800 flex flex-col">
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
          )}
        </div>
      </div>
    </div>
  )
}