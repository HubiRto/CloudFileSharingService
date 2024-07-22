import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {Link} from "react-router-dom";
import {Plus, SettingsIcon} from "lucide-react";
import {useNavigation} from "@/hooks/useNavigation.tsx";
import {SidebarElement} from "@/components/SidebarElement.tsx";
import {ModeToggle} from "@/components/DarkModeToggle.tsx";
import {Button} from "@/components/ui/button.tsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {useState} from "react";
import FileUpload from "@/components/FileUpload.tsx";

export const Sidebar = () => {
    const paths = useNavigation();
    const [triggerUpload, setTriggerUpload] = useState(false);

    return (
        <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
            <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
                <TooltipProvider>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button className="w-9 h-9" variant="outline" size="icon">
                                <Plus className="h-4 w-4 rotate-0"/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>New folder</DropdownMenuItem>
                            <DropdownMenuSeparator/>
                            <DropdownMenuGroup>
                                <DropdownMenuItem onClick={() => setTriggerUpload(true)}>
                                    Upload Files
                                </DropdownMenuItem>
                                <DropdownMenuItem>Upload Folder</DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    {paths.map((path, index) => {
                        return (
                            <SidebarElement
                                key={index}
                                isActive={path.active}
                                href={path.to}
                                name={path.name}
                                children={path.icon}
                            />
                        );
                    })}
                </TooltipProvider>
            </nav>
            <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
                <ModeToggle/>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                to="#"
                                className="
                                    flex h-9 w-9 items-center
                                    justify-center rounded-lg
                                    text-muted-foreground
                                    transition-colors
                                    hover:text-foreground
                                    md:h-8 md:w-8"
                            >
                                <SettingsIcon className="h-5 w-5"/>
                                <span className="sr-only">Settings</span>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">Settings</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </nav>
            <FileUpload triggerUpload={triggerUpload}/>
        </aside>
    );
}