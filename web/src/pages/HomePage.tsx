import {Link} from "react-router-dom";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip"
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
import {
    BarChart2Icon,
    FilterIcon,
    HomeIcon,
    ImportIcon,
    Package2Icon,
    PackageIcon,
    PlusIcon,
    SearchIcon,
    SettingsIcon,
    ShoppingCartIcon,
    UsersIcon
} from "lucide-react";
import {DataTable} from "@/components/DataTable.tsx";
import {columns} from "@/components/columnsDef/FilesColDef.tsx";

export default function HomePage() {
    return (
        <div className="flex min-h-screen w-full bg-muted/40">
            <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
                <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
                    <TooltipProvider>
                        <Link
                            to="#"
                            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"

                        >
                            <Package2Icon className="h-4 w-4 transition-all group-hover:scale-110"/>
                            <span className="sr-only">Acme Inc</span>
                        </Link>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link
                                    to="#"
                                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"

                                >
                                    <HomeIcon className="h-5 w-5"/>
                                    <span className="sr-only">Dashboard</span>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right">Dashboard</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link
                                    to="#"
                                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8"

                                >
                                    <ShoppingCartIcon className="h-5 w-5"/>
                                    <span className="sr-only">Orders</span>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right">Orders</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link
                                    to="#"
                                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"

                                >
                                    <PackageIcon className="h-5 w-5"/>
                                    <span className="sr-only">Products</span>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right">Products</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link
                                    to="#"
                                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"

                                >
                                    <UsersIcon className="h-5 w-5"/>
                                    <span className="sr-only">Customers</span>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right">Customers</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link
                                    to="#"
                                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"

                                >
                                    <BarChart2Icon className="h-5 w-5"/>
                                    <span className="sr-only">Analytics</span>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right">Analytics</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </nav>
                <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link
                                    to="#"
                                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"

                                >
                                    <SettingsIcon className="h-5 w-5"/>
                                    <span className="sr-only">Settings</span>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right">Settings</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </nav>
            </aside>
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
                                <DataTable columns={columns} data={[
                                    {
                                        id: 1,
                                        type: "aep",
                                        name: "screely-1666841037591.png",
                                        owner: "Me",
                                        lastModified: "2 minutes ago",
                                        size: 0.00
                                    },
                                    {
                                        id: 2,
                                        type: "ai",
                                        name: "screely-1666841037591.png",
                                        owner: "Me",
                                        lastModified: "2 minutes ago",
                                        size: 0.00
                                    },
                                    {
                                        id: 3,
                                        type: "doc",
                                        name: "screely-1666841037591.png",
                                        owner: "Me",
                                        lastModified: "2 minutes ago",
                                        size: 0.00
                                    },
                                    {
                                        id: 4,
                                        type: "fla",
                                        name: "screely-1666841037591.png",
                                        owner: "Me",
                                        lastModified: "2 minutes ago",
                                        size: 0.00
                                    },
                                    {
                                        id: 5,
                                        type: "png",
                                        name: "screely-1666841037591.png",
                                        owner: "Me",
                                        lastModified: "2 minutes ago",
                                        size: 0.00
                                    },
                                ]}/>
                            </CardContent>
                        </Card>
                    </main>
                </div>
            </div>
        </div>
    )
};