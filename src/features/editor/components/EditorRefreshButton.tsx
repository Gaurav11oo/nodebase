import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";

import { useTransition } from "react";

export const RefreshPageButton = () => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleRefresh = () => {
        startTransition(() => {
            router.refresh();
        });
    };

    return (
        <Button
            size="icon"
            variant="outline"
            onClick={handleRefresh}
            disabled={isPending}
            title="Refresh page"
            className="h-9 w-9"
        >
            <RefreshCcw
                className={`size-4 ${isPending ? "animate-spin" : ""
                    }`}
            />
        </Button>
    );
};