import {useLocation} from "react-router-dom";
import {useMemo} from "react";
import {Files, Share, Trash, Users} from "lucide-react";


export const useNavigation = () => {
    const {pathname} = useLocation();

    return useMemo(() => [
        {
            name: "My files",
            to: "/my-files",
            icon: pathname === "/my-files"
                ? <Files className="h-4 w-4 transition-all group-hover:scale-110"/>
                : <Files className="h-5 w-5"/>,
            active: pathname.startsWith("/my-files")
        },
        {
            name: "Shared with me",
            to: "/shared-with-me",
            icon: pathname === "/shared-with-me"
                ? <Users className="h-4 w-4 transition-all group-hover:scale-110"/>
                : <Users className="h-5 w-5"/>,
            active: pathname === "/shared-with-me"
        },
        {
            name: "Shared by me",
            to: "/shared-by-me",
            icon: pathname === "/shared-by-me"
                ? <Share className="h-4 w-4 transition-all group-hover:scale-110"/>
                : <Share className="h-5 w-5"/>,
            active: pathname === "/shared-by-me"
        },
        {
            name: "Trash",
            to: "/trash",
            icon: pathname === "/trash"
                ? <Trash className="h-4 w-4 transition-all group-hover:scale-110"/>
                : <Trash className="h-5 w-5"/>,
            active: pathname === "/trash"
        }
    ], [pathname]);
};