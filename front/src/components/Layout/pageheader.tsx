import { ComponentType } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface IconProps {
    size?: string | number;
    color?: string;
    stroke?: string | number;
    className?: string;
}

interface BreadcrumbItem {
    label: string;
    path?: string;
}

interface PageHeaderProps {
    title: string;
    icon: ComponentType<IconProps>;
    breadcrumbs?: BreadcrumbItem[];
}

export const PageHeader = ({
    title,
    icon: Icon,
    breadcrumbs
}: PageHeaderProps) => {
    const navigate = useNavigate();

    return (<>
                <div className="flex items-center justify-between">
                    <h1 className="flex items-center gap-3 text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-6">
                        <Icon size={32} className="text-orange-400" /> <span>{title}</span>
                    </h1>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 text-orange-600 rounded hover:bg-orange-600 hover:text-white transition-colors"
                    >
                        &larr; Voltar
                    </button>
                </div>
                <nav className="flex text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {breadcrumbs?.map((item, index) => (
                        <div key={`${item.label}-${index}`} className="flex items-center">
                            {item.path ? (
                                <Link to={item.path} className="hover:text-orange-500 transition-colors">
                                    {item.label}
                                </Link>
                            ) : (
                                <span className="text-orange-500 font-medium">{item.label}</span>
                            )}
                            {index < breadcrumbs.length - 1 && (
                                <span className="mx-2 text-gray-400">/</span>
                            )}
                        </div>
                    ))}
                </nav>
            </>)
}