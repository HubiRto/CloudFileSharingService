import {Link, useParams} from "react-router-dom";
import {Input} from "@/components/ui/input"
import {BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator} from "@/components/ui/breadcrumb"
import {Button} from "@/components/ui/button"
import {
    CloudUpload,
    DownloadIcon,
    FileIcon,
    FilePlus2,
    FolderIcon,
    FolderPlus,
    HomeIcon,
    ImageIcon,
    LayoutGridIcon,
    ListIcon,
    MountainIcon,
    MoveHorizontalIcon,
    SearchIcon,
    Settings,
    ShareIcon,
    StarIcon,
    TrashIcon,
    UserPen,
    UsersIcon,
    VideoIcon
} from "lucide-react";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {FileResponse} from "@/models/FileResponse.ts";
import {useAuth} from "@/providers/AuthContext.tsx";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {PaginatedResponse} from "@/models/PaginatedResponse.ts";
import InfiniteScroll from "react-infinite-scroll-component";
import {format} from "date-fns";
import {ModeToggle} from "@/components/ModeToggle.tsx";
import {debounce} from 'lodash';
import FileUpload from "@/components/FileUpload.tsx";
import {FloatingUploadCard} from "@/components/FloatingUploadCard.tsx";


export default function HomePage() {
    const {'*': path} = useParams();
    const {authState} = useAuth();

    const [files, setFiles] = useState<FileResponse[]>([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [pageSize, setPageSize] = useState(20);

    const [view, setView] = useState("grid");
    const [favorites, setFavorites] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");

    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [uploadFiles, setUploadFiles] = useState<File[]>([]);

    const [isFloatingUploadCardOpen, setIsFloatingUploadCardOpen] = useState(false);

    useEffect(() => {
        setFiles([]);
        setPage(0);
        setHasMore(true);
        fetchFiles(0, pageSize);
    }, [authState?.token, path]);

    const fetchFiles = async (page: number, size: number) => {
        if (!authState?.token) return;
        try {
            try {
                const response = await axios.get<PaginatedResponse<FileResponse>>('http://127.0.0.1:8080/api/v1/files/files/path', {
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
                setFiles(prevFiles => [...prevFiles, ...data.content]);
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

        setFiles([]);
        setPage(0);
        setHasMore(true);

        if (query === '') {
            fetchFiles(0, pageSize);
        } else {
            try {
                const response = await axios.get<PaginatedResponse<FileResponse>>('http://127.0.0.1:8080/api/v1/files/files/context', {
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

    const mimeToIcon = (mimeType: string, isTabel: boolean) => {
        const style = `${isTabel ? "h-5 w-5" : "h-12 w-12"} text-muted-foreground`;

        switch (mimeType) {
            case 'image/jpeg':
            case 'image/png':
            case 'image/svg+xml': {
                return (
                    <ImageIcon className={style}/>
                );
            }
            case 'video/mp4': {
                return (
                    <VideoIcon className={style}/>
                );
            }
            case 'dir': {
                return (
                    <FolderIcon className={`${style} text-yellow-500`}/>
                );
            }
            default: {
                return (
                    <FileIcon className={style}/>
                );
            }
        }
    };

    const formatFileSize = (size: number) => {
        if (size < 1024) return size + " B";
        else if (size < 1024 * 1024) return (size / 1024).toFixed(2) + " KB";
        else if (size < 1024 * 1024 * 1024) return (size / (1024 * 1024)).toFixed(2) + " MB";
        else return (size / (1024 * 1024 * 1024)).toFixed(2) + " GB";
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

    const handleFilesSelected = (selectedFiles: File[]) => {
        setIsUploadModalOpen(false);
        setUploadFiles(selectedFiles);
        setIsFloatingUploadCardOpen(true);
    };

    const handleUploadComplete = (fileResponse: FileResponse) => {
        setFiles((prevFiles) => [...prevFiles, fileResponse]);
    };

    const handleClearFiles = () => {
        setUploadFiles([]);
        setIsFloatingUploadCardOpen(false);
    };

    return (
        <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
            <FileUpload
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                onFilesSelected={handleFilesSelected}
            />
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
                                to="#"
                                className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
                            >
                                <FileIcon className="h-4 w-4"/>
                                My Files
                            </Link>
                            <Link
                                to="#"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"

                            >
                                <ShareIcon className="h-4 w-4"/>
                                Shared by Me
                            </Link>
                            <Link
                                to="#"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"

                            >
                                <UsersIcon className="h-4 w-4"/>
                                Shared for Me
                            </Link>
                            <Link
                                to="#"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"

                            >
                                <TrashIcon className="h-4 w-4"/>
                                Trash
                            </Link>
                        </nav>
                    </div>
                </div>
            </div>
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
                            <Button size="sm" className="h-8 gap-1" onClick={() => setIsUploadModalOpen(true)}>
                                <CloudUpload className="h-3.5 w-3.5"/>
                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Upload</span>
                            </Button>
                            <Button variant="outline" size="sm" className="h-8 gap-1">
                                <FolderPlus className="h-3.5 w-3.5"/>
                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">New folder</span>
                            </Button>
                            <Button variant="outline" size="sm" className="h-8 gap-1">
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
                        {view === "grid" ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {files.map((file, index) => (
                                    <div
                                        key={index}
                                        className="relative overflow-hidden transition-transform duration-300 ease-in-out rounded-lg shadow-lg group hover:shadow-xl hover:-translate-y-2"
                                    >
                                        {file.mime === 'dir' ? (
                                            <Link to={path === '' ? file.name : (`${path}/${file.name}`)}>
                                                <div className="flex items-center justify-center h-40 bg-muted">
                                                    {mimeToIcon(file.mime, false)}
                                                </div>
                                            </Link>
                                        ) : (
                                            <div className="flex items-center justify-center h-40 bg-muted">
                                                {mimeToIcon(file.mime, false)}
                                            </div>
                                        )}
                                        <div className="p-4 bg-background">
                                            <h3 className="text-lg font-medium truncate">{file.name}</h3>
                                            <div
                                                className="flex items-center justify-between text-sm text-muted-foreground">
                                                <div>{formatFileSize(file.size)}</div>
                                                <div>
                                                    <StarIcon
                                                        className={`h-4 w-4 fill-primary`}/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[40px]">
                                            <Checkbox checked={favorites}
                                                      onCheckedChange={() => setFavorites((prev) => !prev)}/>
                                        </TableHead>
                                        <TableHead className="w-[40px]">
                                            <span className="sr-only">Type</span>
                                        </TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead className="hidden md:table-cell">Size</TableHead>
                                        <TableHead className="hidden md:table-cell">Modified</TableHead>
                                        <TableHead className="w-[40px]">
                                            <span className="sr-only">Actions</span>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {files.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <Checkbox/>
                                            </TableCell>
                                            <TableCell>
                                                {mimeToIcon(item.mime, true)}
                                            </TableCell>
                                            <TableCell className="font-medium">{item.mime !== 'dir' ? item.name : (
                                                <Link to={path === '' ? item.name : (`${path}/${item.name}`)}>
                                                    {item.name}
                                                </Link>
                                            )}</TableCell>
                                            <TableCell
                                                className="hidden md:table-cell">{formatFileSize(item.size)}</TableCell>
                                            <TableCell
                                                className="hidden md:table-cell">{format(item.createdAt, "MMMM do, yyyy")}</TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon"
                                                                className="w-8 h-8 rounded-full">
                                                            <MoveHorizontalIcon className="h-4 w-4"/>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>
                                                            <DownloadIcon className="h-4 w-4 mr-2"/>
                                                            Download
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <ShareIcon className="h-4 w-4 mr-2"/>
                                                            Share
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <TrashIcon className="h-4 w-4 mr-2"/>
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </InfiniteScroll>
                </main>
                <FloatingUploadCard
                    isOpen={isFloatingUploadCardOpen}
                    path={path === '' ? '/' : (`/${path}/`)}
                    files={uploadFiles}
                    onUploadComplete={handleUploadComplete}
                    onClearFiles={handleClearFiles}
                />
            </div>
        </div>
    )
};