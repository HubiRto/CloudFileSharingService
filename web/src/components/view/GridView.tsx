import {FileData} from "@/models/FileData.ts";
import React, {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {StarIcon} from "lucide-react";
import {mimeToIcon} from "@/utils/mimeUtils.tsx";
import {formatFileSize} from "@/utils/formatFileSizeUtil.ts";
import {FileContextMenu} from "@/components/contxtMenu/FileContextMenu.tsx";
import {useSelectFileContext} from "@/providers/SelectFileProvider.tsx";

type GridViewProps = {
    files: FileData[];
    path: string;
};

export const GridView: React.FC<GridViewProps> = ({files, path}) => {
    const navigate = useNavigate();
    const {selectFile, selectedFiles} = useSelectFileContext();

    useEffect(() => {
        console.log(selectedFiles);
    }, [selectedFiles]);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {files.map((file, index) => (
                <FileContextMenu file={file} key={index}>
                    <div
                        key={index}
                        className={`
                            relative overflow-hidden
                            transition-transform duration-300
                            ease-in-out rounded-lg shadow-lg
                            group hover:shadow-xl hover:-translate-y-2
                        `}
                    >
                        <div
                            className={`flex items-center justify-center h-40 ${selectedFiles.includes(file.id) ? 'bg-blue-100' : 'bg-muted'}`}
                            onClick={() => selectFile(file.id, !selectedFiles.includes(file.id))}
                        >
                            {mimeToIcon(file.mime, 16)}
                        </div>
                        <div
                            className={`p-4 ${selectedFiles.includes(file.id) ? 'bg-blue-200' : 'bg-background'}`}
                            onClick={() => {
                                if(file.mime === 'dir') {
                                    navigate(`/my-files/${path === '' ? file.name : `${path}/${file.name}`}`)
                                }
                            }}
                        >
                            <h3 className="text-lg font-medium truncate">{file.name}</h3>
                            <div
                                className="flex items-center justify-between text-sm text-muted-foreground">
                                <div>{formatFileSize(file.size)}</div>
                                <div>
                                    <StarIcon className={`h-4 w-4 fill-primary`}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </FileContextMenu>
            ))}
        </div>
    );
};