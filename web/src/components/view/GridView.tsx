import {FileData} from "@/models/FileData.ts";
import React from "react";
import {Link} from "react-router-dom";
import {StarIcon} from "lucide-react";
import {mimeToIcon} from "@/utils/mimeUtils.tsx";
import {formatFileSize} from "@/utils/formatFileSizeUtil.ts";

type GridViewProps = {
    files: FileData[];
    path: string;
};

export const GridView: React.FC<GridViewProps> = ({files, path}) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {files.map((file, index) => (
                <div
                    key={index}
                    className="relative overflow-hidden transition-transform duration-300 ease-in-out rounded-lg shadow-lg group hover:shadow-xl hover:-translate-y-2"
                >
                    {file.mime === 'dir' ? (
                        <Link to={path === '' ? file.name : (`${path}/${file.name}`)}>
                            <div className="flex items-center justify-center h-40 bg-muted">
                                {mimeToIcon(file.mime, 12)}
                            </div>
                        </Link>
                    ) : (
                        <div className="flex items-center justify-center h-40 bg-muted">
                            {mimeToIcon(file.mime, 12)}
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
    );
};