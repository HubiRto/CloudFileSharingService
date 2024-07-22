"use client"

import {ColumnDef} from "@tanstack/react-table"
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {FaRegStar, FaStar} from "react-icons/fa";
import {useState} from "react";
import {HoverCard, HoverCardContent, HoverCardTrigger} from "@/components/ui/hover-card.tsx";
import {Folder} from "lucide-react";

export type FileCol = {
    id: number;
    type: string;
    name: string;
    owner: string;
    lastModified: string;
    size: number;
}

export const columns: ColumnDef<FileCol>[] = [
    {
        id: "select",
        header: ({table}) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({row}) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "favorite",
        header: undefined,
        cell: ({row}) => {
            const [isFavorite, setIsFavorite] = useState(Math.random() < 0.5);
            if (isFavorite) {
                return (
                    <FaStar
                        onClick={() => setIsFavorite(!isFavorite)}
                        style={{cursor: 'pointer'}}
                        className="w-5 h-5 text-yellow-300"
                    />
                );
            } else {
                return (
                    <FaRegStar
                        onClick={() => setIsFavorite(!isFavorite)}
                        style={{cursor: 'pointer'}}
                        className="w-5 h-5 text-yellow-300"
                    />
                );
            }
        },
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "type",
        header: "Type",
        cell: ({row}) => {
            if (row.original.type === 'folder') {
                return <Folder/>
            } else if (row.original.type === 'png') {
                return (
                    <HoverCard>
                        <HoverCardTrigger asChild>
                            <img src="@/assets/ich_aep.svg" alt="file"/>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-[200px] rounded-md shadow-lg">
                            <img
                                src="https://assets.puzzlefactory.pl/puzzle/113/519/original.jpg"
                                alt="Preview image"
                                width={200}
                                height={150}
                                className="rounded-t-md object-cover"
                            />
                        </HoverCardContent>
                    </HoverCard>
                );
            } else {
                return <img src="@/assets/ich_aep.svg" alt="file"/>;
            }
        },
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "lastModified",
        header: "Last Modified",
    },
    {
        accessorKey: "size",
        header: "Size",
    },
]
