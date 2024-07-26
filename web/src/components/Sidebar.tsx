import {Link, useLocation} from "react-router-dom";
import {FileIcon, MountainIcon, ShareIcon, TrashIcon, UsersIcon} from "lucide-react";

export function Sidebar(){
    const location = useLocation();

    return (
        <div className="hidden border-r bg-muted/40 lg:block">
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-[60px] items-center border-b px-6">
                    <div className="flex items-center justify-between w-full">
                        <Link to="#" className="flex items-center gap-2">
                            <MountainIcon className="h-6 w-6"/>
                            <span className="text-lg font-semibold">File Manager</span>
                        </Link>
                    </div>
                </div>
                <div className="flex-1 overflow-auto py-2">
                    <nav className="grid items-start px-4 text-sm font-medium">
                        <Link
                            to="/my-files"
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary 
                            ${location.pathname.startsWith("/my-files") ? 'bg-muted text-primary' : 'text-muted-foreground'}`}
                        >
                            <FileIcon className="h-4 w-4"/>
                            My Files
                        </Link>
                        <Link
                            to="/shared-by-me"
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary 
                            ${location.pathname.startsWith("/shared-by-me") ? 'bg-muted text-primary' : 'text-muted-foreground'}`}

                        >
                            <ShareIcon className="h-4 w-4"/>
                            Shared by Me
                        </Link>
                        <Link
                            to="/shared-with-me"
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary 
                            ${location.pathname.startsWith("/shared-with-me") ? 'bg-muted text-primary' : 'text-muted-foreground'}`}

                        >
                            <UsersIcon className="h-4 w-4"/>
                            Shared for Me
                        </Link>
                        <Link
                            to="/trash"
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary 
                            ${location.pathname.startsWith("/trash") ? 'bg-muted text-primary' : 'text-muted-foreground'}`}

                        >
                            <TrashIcon className="h-4 w-4"/>
                            Trash
                        </Link>
                    </nav>
                </div>
            </div>
        </div>
    );
}