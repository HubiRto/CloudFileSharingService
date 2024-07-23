import React, {useEffect, useState} from 'react';
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {FileInput, FileUploader, FileUploaderContent, FileUploaderItem} from "@/components/FileUploader.tsx";
import {Paperclip} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";

type Props = React.PropsWithChildren<{
    isOpen: boolean;
    onClose: () => void;
    onFilesSelected: (files: File[]) => void;
}>

const FileSvgDraw = () => {
    return (
        <>
            <svg
                className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
            >
                <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
            </svg>
            <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span>
                &nbsp; or drag and drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
                SVG, PNG, JPG or GIF
            </p>
        </>
    );
};

const FileUpload = ({isOpen, onClose, onFilesSelected}: Props) => {
    const [files, setFiles] = useState<File[] | null>(null);

    const dropZoneConfig = {
        maxFiles: 5,
        multiple: true,
    };

    useEffect(() => {
        if(!isOpen){
            setFiles(null);
        }
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]" aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle>Upload</DialogTitle>
                </DialogHeader>
                <FileUploader
                    value={files}
                    onValueChange={setFiles}
                    dropzoneOptions={dropZoneConfig}
                    className="relative bg-background rounded-lg p-2"
                >
                    <FileInput className="outline-dashed outline-1">
                        <div className="flex items-center justify-center flex-col pt-3 pb-4 w-full ">
                            <FileSvgDraw />
                        </div>
                    </FileInput>
                    <FileUploaderContent>
                        {files &&
                            files.length > 0 &&
                            files.map((file, i) => (
                                <FileUploaderItem key={i} index={i}>
                                    <Paperclip className="h-4 w-4 stroke-current" />
                                    <span>{file.name}</span>
                                </FileUploaderItem>
                            ))}
                    </FileUploaderContent>
                </FileUploader>
                <DialogFooter>
                    <Button onClick={() => onFilesSelected(files!)}>Upload</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default FileUpload;
