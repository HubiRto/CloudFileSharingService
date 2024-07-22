"use client"

import {ColumnDef} from "@tanstack/react-table"
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {FaRegStar, FaStar} from "react-icons/fa";
import {useState} from "react";
import {HoverCard, HoverCardContent, HoverCardTrigger} from "@/components/ui/hover-card.tsx";
import {Link} from "react-router-dom";

import pngSvg from '@/assets/png.svg';
import jpgSvg from '@/assets/jpg.svg';
import pdfSvg from '@/assets/pdf.svg';
import videoSvg from '@/assets/mpg.svg'
import folderSvg from '@/assets/folder.svg'
import {File} from "lucide-react";


export type FileCol = {
    id: number;
    type: string;
    name: string;
    owner: string;
    path: string;
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
            switch (row.original.type) {
                case 'dir': {
                    return <img src={folderSvg} className="h-8 w-8" alt="pdf_file"/>;
                }
                case 'jpeg': {
                    return (
                        <HoverCard>
                            <HoverCardTrigger asChild>
                                <img src={jpgSvg} className="h-8 w-8" alt="jpg_file"/>
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
                }
                case 'png': {
                    return (
                        <HoverCard>
                            <HoverCardTrigger asChild>
                                <img src={pngSvg} className="h-8 w-8" alt="png_file"/>
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
                }
                case 'pdf': {
                    return <img src={pdfSvg} className="h-8 w-8" alt="pdf_file"/>;
                }
                case 'mp4':
                case 'webm': {
                    return <img src={videoSvg} className="h-8 w-8" alt="mp4_file"/>;
                }
                default:
                    return <File className="w-8 h-8"/>
            }
        },
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        header: "Name",
        cell: ({row}) => {
            if (row.original.type === 'dir') {
                return <Link to={`${row.original.name}`}>{row.original.name}</Link>;
            } else {
                return <span>{row.original.name}</span>;
            }
        }
    },
    {
        accessorKey: "lastModified",
        header: "Last Modified",
    },
    {
        accessorKey: "size",
        header: "Size",
    },
];
