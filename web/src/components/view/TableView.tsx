import React from "react";
import {Link} from "react-router-dom";
import {mimeToIcon} from "@/utils/mimeUtils.tsx";
import {formatFileSize} from "@/utils/formatFileSizeUtil.ts";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {format} from "date-fns";
import {useFileContext} from "@/providers/FileProvider.tsx";
import {FileContextMenu} from "@/components/contxtMenu/FileContextMenu.tsx";

type TableViewProps = {
    path: string;
};

export const TableView: React.FC<TableViewProps> = ({path}) => {
    const {files} = useFileContext();

    if (!files) return null;

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[40px]">
                            <Checkbox/>
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
                        <FileContextMenu file={item} key={index}>
                            <TableRow>
                                <TableCell>
                                    <Checkbox/>
                                </TableCell>
                                <TableCell>
                                    {mimeToIcon(item.mime, 5)}
                                </TableCell>

                                <TableCell className="font-medium">
                                    {item.mime !== 'dir' ? item.name : (
                                        <Link
                                            to={path === '' ? item.name : (`${path}/${item.name}`)}>
                                            {item.name}
                                        </Link>
                                    )}
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                    {formatFileSize(item.size)}
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                    {format(item.createdAt, "MMMM do, yyyy")}
                                </TableCell>
                            </TableRow>
                        </FileContextMenu>
                    ))}
                </TableBody>
            </Table>
        </>
    );
};