"use client"

import {ColumnDef} from "@tanstack/react-table"
import {Checkbox} from "@/components/ui/checkbox.tsx";
import aep_svg from '../../assets/ich_aep.svg'
import ai_svg from '../../assets/icn_ai.svg'
import doc_svg from '../../assets/icn_doc.svg'
import fla_svg from '../../assets/icn_fla.svg'
import png_svg from '../../assets/icn_png.svg';
import {Button} from "@/components/ui/button.tsx";
import {FaRegStar, FaStar} from "react-icons/fa";
import {useState} from "react";
import {HoverCard, HoverCardContent, HoverCardTrigger} from "@/components/ui/hover-card.tsx";

const FileTypeIconMap = {
    aep: aep_svg,
    ai: ai_svg,
    doc: doc_svg,
    fla: fla_svg,
    png: png_svg,
};

export type FileType = keyof typeof FileTypeIconMap;

export type FileCol = {
    id: number;
    type: FileType;
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
            if (row.original.type === 'png') {
                return (
                    <HoverCard>
                        <HoverCardTrigger asChild>
                            <img src={FileTypeIconMap[row.original.type]} alt="file"/>
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
                return <img src={FileTypeIconMap[row.original.type]} alt="file"/>;
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
