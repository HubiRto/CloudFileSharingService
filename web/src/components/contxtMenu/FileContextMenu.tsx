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
import {
    ArrowDownToLine,
    Files,
    FolderArchive,
    FolderKanban,
    Link2,
    Pencil,
    Scissors,
    Share2,
    Trash
} from "lucide-react";
import {FileData} from "@/models/FileData.ts";
import {useModal} from "@/providers/ModalProvider.tsx";
import axios from "axios";
import toast from "react-hot-toast";
import {useAuth} from "@/providers/AuthContext.tsx";
import {useFileContext} from "@/providers/FileProvider.tsx";

type Props = React.PropsWithChildren<{
    file: FileData;
}>

export const FileContextMenu = ({file, children}: Props) => {
    const {openModal} = useModal();
    const {removeFile} = useFileContext();
    const {authState} = useAuth();

    const handleDelete = async () => {
        if (!authState?.token) return;

        await axios.delete<string>(`http://127.0.0.1:8080/api/v1/files/delete/${file.id}`, {
            headers: {
                Authorization: `Bearer ${authState?.token}`
            },
        })
            .then((res) => {
                removeFile(file.name);
                toast.success(res.data);
            })
            .catch((err: any) => {
                if (!err.response) console.log(err);
                const code: number = err.response.status;

                if (code === 404) {
                    toast.error(err.response.data.error as string);
                }
            });
    }

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
                        <ContextMenuItem>
                            <Link2 className="mr-2 h-4 w-4"/>
                            <span>Open in new tab</span>
                            <ContextMenuShortcut>⇧⌘P</ContextMenuShortcut>
                        </ContextMenuItem>
                        <ContextMenuItem>
                            <ArrowDownToLine className="mr-2 h-4 w-4"/>
                            <span>Download</span>
                            <ContextMenuShortcut>⌘B</ContextMenuShortcut>
                        </ContextMenuItem>
                        <ContextMenuItem>
                            <Share2 className="mr-2 h-4 w-4"/>
                            <span>Share</span>
                            <ContextMenuShortcut>⌘S</ContextMenuShortcut>
                        </ContextMenuItem>
                    </ContextMenuGroup>
                    <ContextMenuSeparator/>
                    <ContextMenuItem onClick={() => openModal('renameFile', file)}>
                        <Pencil className="mr-2 h-4 w-4"/>
                        <span>Rename</span>
                        <ContextMenuShortcut>⌘S</ContextMenuShortcut>
                    </ContextMenuItem>
                    <ContextMenuSeparator/>
                    <ContextMenuGroup>
                        <ContextMenuItem>
                            <Scissors className="mr-2 h-4 w-4"/>
                            <span>Move</span>
                        </ContextMenuItem>
                        <ContextMenuItem>
                            <Files className="mr-2 h-4 w-4"/>
                            <span>Copy</span>
                        </ContextMenuItem>
                    </ContextMenuGroup>
                    <ContextMenuSeparator/>
                    <ContextMenuGroup>
                        <ContextMenuItem>
                            <FolderArchive className="mr-2 h-4 w-4"/>
                            <span>Compress</span>
                        </ContextMenuItem>
                        <ContextMenuItem>
                            <FolderKanban className="mr-2 h-4 w-4"/>
                            <span>Extract</span>
                        </ContextMenuItem>
                    </ContextMenuGroup>
                    <ContextMenuSeparator/>
                    <ContextMenuItem className="text-red-500" onClick={() => handleDelete()}>
                        <Trash className="mr-2 h-4 w-4"/>
                        <span>Delete</span>
                    </ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>
        </>
    );
}