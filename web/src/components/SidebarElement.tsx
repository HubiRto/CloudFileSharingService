import React from "react";
import {Link} from "react-router-dom";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip.tsx";

type Props = React.PropsWithChildren<{
    isActive: boolean;
    href: string;
    name: string;
}>;

export const SidebarElement = ({children, isActive, href, name}: Props) => {
    if (isActive) {
        return (
            <Link
                to={href}
                className="
                    group flex h-9 w-9 shrink-0
                    items-center justify-center
                    gap-2 rounded-full bg-primary
                    text-lg font-semibold
                    text-primary-foreground
                    md:h-8 md:w-8 md:text-base"
            >
                {children}
                <span className="sr-only">Acme Inc</span>
            </Link>
        );
    } else {
        return (
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link
                        to={href}
                        className="
                            flex h-9 w-9 items-center
                            justify-center rounded-lg
                            text-muted-foreground
                            transition-colors
                            hover:text-foreground md:h-8 md:w-8"
                    >
                        {children}
                        <span className="sr-only">{name}</span>
                    </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{name}</TooltipContent>
            </Tooltip>
        );
    }
}