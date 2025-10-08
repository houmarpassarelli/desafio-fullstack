import { PageHeader } from "@/components/Layout/pageheader";
import { IconHistory } from '@tabler/icons-react';

export const History = () => {
    return (<div className="py-6">
        <PageHeader 
            title="Histórico" 
            icon={IconHistory}
            breadcrumbs={[
                { label: "Início", path: "/" },
                { label: "Histórico" }
            ]}
        />
    </div>)
}