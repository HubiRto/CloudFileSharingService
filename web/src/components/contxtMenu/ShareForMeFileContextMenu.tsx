import React from "react";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuGroup,
    ContextMenuItem,
    ContextMenuLabel,
    ContextMenuSeparator,
    ContextMenuShortcut,
    ContextMenuTrigger
} from "@/components/ui/context-menu.tsx";
import {ArrowDownToLine, Files, Link2} from "lucide-react";
import {FileData} from "@/models/FileData.ts";

type Props = React.PropsWithChildren<{
    file: FileData;
}>

export const ShareForeMeFileContextMenu = ({file, children}: Props) => {
    return (
        <>
            <ContextMenu>
                <ContextMenuTrigger asChild>
                    {children}
                </ContextMenuTrigger>
                <ContextMenuContent className="w-64">
                    <ContextMenuLabel>{file.name}</ContextMenuLabel>
                    <ContextMenuSeparator/>
                    <ContextMenuGroup>
                        {file.mime === 'dir' ? (
                            <ContextMenuItem onClick={() => window.open(`http://localhost:5173/shared-with-me${file.path}${file.name}`)}>
                                <Link2 className="mr-2 h-4 w-4"/>
                                <span>Open in new tab</span>
                                <ContextMenuShortcut>⇧⌘P</ContextMenuShortcut>
                            </ContextMenuItem>
                        ) : (
                            <ContextMenuItem>
                                <ArrowDownToLine className="mr-2 h-4 w-4"/>
                                <span>Download</span>
                                <ContextMenuShortcut>⌘B</ContextMenuShortcut>
                            </ContextMenuItem>
                        )}
                    </ContextMenuGroup>
                    <ContextMenuSeparator/>
                    <ContextMenuGroup>
                        <ContextMenuItem>
                            <Files className="mr-2 h-4 w-4"/>
                            <span>Copy</span>
                        </ContextMenuItem>
                    </ContextMenuGroup>
                </ContextMenuContent>
            </ContextMenu>
        </>
    );
}