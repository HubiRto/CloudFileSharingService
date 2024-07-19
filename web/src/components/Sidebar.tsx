import {UserItem} from "@/components/UserItem.tsx";
import {Command, CommandGroup, CommandItem, CommandList} from "@/components/ui/command.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Folder, Share, Trash, Users} from "lucide-react";

export function Sidebar() {
    return (
        <div className="flex flex-col w-[300px] min-w-[300px] border-r min-h-screen p-4 gap-4">
            <div>
                <UserItem/>
            </div>
            <Button>Create New</Button>
            <div>
                <Command>
                    <CommandList>
                        <CommandGroup>
                            <CommandItem><Folder className="w-4 h-4 mr-2"/>My Files</CommandItem>
                            <CommandItem><Users className="w-4 h-4 mr-2"/>Shared with me</CommandItem>
                            <CommandItem><Share className="w-4 h-4 mr-2"/>Shared by me</CommandItem>
                            <CommandItem><Trash className="w-4 h-4 mr-2"/>Trash</CommandItem>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </div>
        </div>
    );
};