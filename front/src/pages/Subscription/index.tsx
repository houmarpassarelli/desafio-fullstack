import { PageHeader } from "@/components/Layout/pageheader";
import { IconHistory } from '@tabler/icons-react';

export const Subscription = () => {
    return (<div className="py-6">
        <PageHeader 
            title="Assinatura" 
            icon={IconHistory}
            breadcrumbs={[
                { label: "Início", path: "/" },
                { label: "Assinatura" }
            ]}
        />
    </div>)
}