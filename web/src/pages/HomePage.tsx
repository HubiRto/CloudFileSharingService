import {Link, useNavigate, useParams} from "react-router-dom";
import {Input} from "@/components/ui/input"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {FilterIcon, ImportIcon, PlusIcon, SearchIcon} from "lucide-react";
import {DataTable} from "@/components/DataTable.tsx";
import {columns, FileCol} from "@/components/columnsDef/FilesColDef.tsx";
import {useEffect, useState} from "react";
import axios from "axios";
import {FileResponse} from "@/models/FileResponse.ts";
import mimeTypes from "@/utils/mimeTypes.ts";
import {format} from "date-fns";
import {useAuth} from "@/providers/AuthContext.tsx";


export default function HomePage() {
    const {'*': path} = useParams();
    const [files, setFiles] = useState<FileResponse[] | undefined>(undefined);
    const navigate = useNavigate();
    const {authState} = useAuth();

    useEffect(() => {
        if (authState?.token) {
            axios.get<FileResponse[]>(`http://localhost:8080/api/v1/files?path=/${path}`,
                {
                    headers: {
                        "Authorization": `Bearer ${authState?.token}`
                    },
                }
            )
                .then((res) => {
                    setFiles(res.data);
                })
                .catch((err: any) => {
                    console.log(err);
                    navigate("/my-files");
                });
        }
    }, [path, authState?.token]);

    const mapToCol = (files: FileResponse[]): FileCol[] => {
        return files.map((item) => ({
            id: item.id,
            type: mimeTypes[item.mime],
            name: item.name,
            owner: "Me",
            lastModified: format(item.createdAt, "MMMM do, yyyy"),
            size: item.size
        }));
    }

    return (
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 w-full">
            <header
                className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                <div className="relative flex-1 ml-auto">
                    <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
                    <Input
                        type="search"
                        placeholder="Search..."
                        className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-8 gap-1">
                        <FilterIcon className="h-3.5 w-3.5"/>
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Filter</span>
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 gap-1">
                        <ImportIcon className="h-3.5 w-3.5"/>
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Export</span>
                    </Button>
                    <Button size="sm" className="h-8 gap-1">
                        <PlusIcon className="h-3.5 w-3.5"/>
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add</span>
                    </Button>
                </div>
            </header>
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 w-full">
                <Breadcrumb className="hidden md:flex">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link to="#">
                                    Home
                                </Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator/>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link to="#">
                                    Screenshots
                                </Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator/>
                        <BreadcrumbItem>
                            <BreadcrumbPage>02_01_2011</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                    <Card x-chunk="dashboard-06-chunk-0">
                        <CardHeader>
                            <CardTitle>Files</CardTitle>
                            <CardDescription>Manage your files
                                performance.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {files && (
                                <DataTable columns={columns} data={mapToCol(files!)}/>
                            )}
                        </CardContent>
                    </Card>
                </main>
            </div>
        </div>
    )
};