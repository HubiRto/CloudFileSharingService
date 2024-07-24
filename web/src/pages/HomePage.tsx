import {Link, useParams} from "react-router-dom";
import {Input} from "@/components/ui/input"
import {BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator} from "@/components/ui/breadcrumb"
import {Button} from "@/components/ui/button"
import {
    CloudUpload,
    FilePlus2,
    FolderPlus,
    HomeIcon,
    LayoutGridIcon,
    ListIcon,
    SearchIcon,
    Settings,
    UserPen
} from "lucide-react";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {FileData} from "@/models/FileData.ts";
import {useAuth} from "@/providers/AuthContext.tsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {PaginatedResponse} from "@/models/PaginatedResponse.ts";
import InfiniteScroll from "react-infinite-scroll-component";
import {ModeToggle} from "@/components/ModeToggle.tsx";
import {debounce} from 'lodash';
import FileUploadModal from "@/components/modals/FileUploadModal.tsx";
import {AddFolderModal} from "@/components/modals/AddFolderModal.tsx";
import {Sidebar} from "@/components/Sidebar.tsx";
import {GridView} from "@/components/view/GridView.tsx";
import {TableView} from "@/components/view/TableView.tsx";
import {useFileContext} from "@/providers/FileProvider.tsx";
import {useModal} from "@/providers/ModalProvider.tsx";
import {RenameFileModal} from "@/components/modals/RenameFile.tsx";
import {FloatingUploadCardProvider} from "@/providers/FloatingUploadCardProvider.tsx";
import FloatingUploadCard from "@/components/FloatingUploadCard.tsx";
import {AddFileModal} from "@/components/modals/AddFileModal.tsx";


export default function HomePage() {
    const {'*': path} = useParams();
    const {authState} = useAuth();
    const {openModal, closeModal, isOpen, getModalData} = useModal();

    const {removeAllFiles, addFiles, setFiles, files} = useFileContext();
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [pageSize] = useState(20);

    const [view, setView] = useState("list");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        removeAllFiles();
        setPage(0);
        setHasMore(true);
        fetchFiles(0, pageSize);
    }, [authState?.token, path]);

    const fetchFiles = async (page: number, size: number) => {
        if (!authState?.token) return;
        try {
            try {
                const response = await axios.get<PaginatedResponse<FileData>>('http://127.0.0.1:8080/api/v1/files/files/path', {
                    params: {
                        path: path === '' ? '/' : (`/${path}/`),
                        page,
                        size,
                    },
                    headers: {
                        Authorization: `Bearer ${authState?.token}`
                    },
                });

                const data = response.data;
                addFiles(data.content);
                setHasMore(data.page.number + 1 < data.page.totalPages);
                setPage(prevPage => prevPage + 1);
            } catch (error) {
                console.error('Error fetching files:', error);
            }
        } catch (error) {
            console.error('Error fetching files:', error);
        }
    };

    const handleSearch = debounce(async (query: string) => {
        if (!authState?.token) return;

        removeAllFiles();
        setPage(0);
        setHasMore(true);

        if (query === '') {
            fetchFiles(0, pageSize);
        } else {
            try {
                const response = await axios.get<PaginatedResponse<FileData>>('http://127.0.0.1:8080/api/v1/files/files/context', {
                    params: {
                        context: query,
                        page: 0,
                        size: pageSize,
                    },
                    headers: {
                        Authorization: `Bearer ${authState?.token}`
                    },
                });

                const data = response.data;
                setFiles(data.content);
                setHasMore(data.page.number + 1 < data.page.totalPages);
                setPage(1); // Start from the next page
            } catch (error) {
                console.error('Error searching files:', error);
            }
        }
    }, 250);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value;
        setSearchQuery(query);
        handleSearch(query);
    };

    const generateBreadcrumbs = () => {
        const pathArray = path?.split("/").filter((p) => p);
        return (
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link to="/my-files">
                            <div className="flex items-center flex-row gap-2">
                                <HomeIcon className="w-4 h-4"/>
                                Home
                            </div>
                        </Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                {pathArray?.map((p, index) => (
                    <BreadcrumbItem key={index}>
                        <BreadcrumbSeparator/>
                        <BreadcrumbLink asChild>
                            <Link to={`/my-files/${pathArray.slice(0, index + 1).join("/")}`}>{p}</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                ))}
            </BreadcrumbList>
        );
    };

    return (
        <FloatingUploadCardProvider>
            <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
                <Sidebar/>
                <div className="flex flex-col">
                    <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-muted/40 px-6">
                        <div className="flex items-center justify-between w-full">
                            <div className="flex-1">
                                <div className="relative">
                                    <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
                                    <Input
                                        type="search"
                                        placeholder="Search files..."
                                        className="w-full bg-background shadow-none appearance-none pl-8 md:w-2/3 lg:w-1/3"
                                        value={searchQuery}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <ModeToggle/>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="icon" className="w-9 h-9">
                                            {view === "grid" ? <LayoutGridIcon className="h-4 w-4"/> :
                                                <ListIcon className="h-4 w-4"/>}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => setView("grid")}>
                                            <LayoutGridIcon className="h-4 w-4 mr-2"/>
                                            Grid View
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setView("list")}>
                                            <ListIcon className="h-4 w-4 mr-2"/>
                                            List View
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Avatar>
                                            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn"/>
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>
                                            <UserPen className="h-4 w-4 mr-2"/>
                                            Profile
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator/>
                                        <DropdownMenuItem>
                                            <Settings className="h-4 w-4 mr-2"/>
                                            Settings
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </header>
                    <header
                        className={`flex h-14 lg:h-[60px] items-center gap-4 border-b bg-muted/40 px-6 transition-all duration-400 ease-in-out ${searchQuery ? 'max-h-0 opacity-0' : 'max-h-40 opacity-100'}`}>
                        <div className="flex items-center justify-between w-full">
                            {generateBreadcrumbs()}
                            <div className="flex items-center gap-2">
                                <Button size="sm" className="h-8 gap-1" onClick={() => openModal("upload")}>
                                    <CloudUpload className="h-3.5 w-3.5"/>
                                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Upload</span>
                                </Button>
                                <Button variant="outline" size="sm" className="h-8 gap-1"
                                        onClick={() => openModal('addFolder')}>
                                    <FolderPlus className="h-3.5 w-3.5"/>
                                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">New folder</span>
                                </Button>
                                <Button variant="outline" size="sm" className="h-8 gap-1" onClick={() => openModal("addFile")}>
                                    <FilePlus2 className="h-3.5 w-3.5"/>
                                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">New file</span>
                                </Button>
                            </div>
                        </div>
                    </header>
                    <main
                        id="main"
                        className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6"
                        style={{maxHeight: 'calc(100vh - 60px - 60px)', overflowY: 'auto'}}>
                        <InfiniteScroll
                            dataLength={files.length}
                            next={() => fetchFiles(page, pageSize)}
                            hasMore={hasMore}
                            loader={<div className="flex justify-center items-center py-4">Loading...</div>}
                            endMessage={<p className="text-center py-4">No more files to load</p>}
                            scrollableTarget="main"
                        >
                            {view === "grid" ?
                                <GridView files={files} path={path!}/> :
                                <TableView path={path!}/>
                            }
                        </InfiniteScroll>
                    </main>
                    <RenameFileModal
                        file={getModalData<FileData>()!}
                        isOpen={isOpen('renameFile')}
                        onClose={closeModal}
                    />
                    <AddFolderModal
                        isOpen={isOpen('addFolder')}
                        onClose={closeModal}
                        path={path === '' ? '/' : (`/${path}/`)}
                    />
                    <FileUploadModal
                        isOpen={isOpen('upload')}
                        onClose={closeModal}
                    />
                    <AddFileModal
                        isOpen={isOpen('addFile')}
                        onClose={closeModal}
                        path={path === '' ? '/' : (`/${path}/`)}
                    />

                    <FloatingUploadCard path={path === '' ? '/' : (`/${path}/`)}/>
                </div>
            </div>
        </FloatingUploadCardProvider>
    );
};