import React, {useEffect, useState} from "react";
import {
    CheckIcon,
    ChevronDown,
    ChevronUp,
    ClockIcon,
    FileIcon,
    FolderIcon,
    ImageIcon,
    VideoIcon,
    XIcon
} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {Progress} from "@/components/ui/progress.tsx";
import {FileResponse} from "@/models/FileResponse.ts";
import axios, {AxiosProgressEvent} from "axios";
import toast from "react-hot-toast";

type Props = React.PropsWithChildren<{
    isOpen: boolean;
    path: string;
    files: File[];
    onUploadComplete: (fileResponse: FileResponse) => void;
    onClearFiles: () => void;
}>;

export const FloatingUploadCard = ({isOpen, path, files, onUploadComplete, onClearFiles}: Props) => {
    const [isMinimalized, setIsMinimalized] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<number[]>([]);
    const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);

    useEffect(() => {
        setUploadingFiles(files);
        setUploadProgress(new Array(files.length).fill(0));
    }, [files]);

    useEffect(() => {
        if (uploadingFiles.length > 0) {
            uploadingFiles.forEach((file, index) => {
                uploadFile(file, index);
            });
        }
    }, [uploadingFiles]);

    const fileToIcon = (file: File) => {
        const style = `"h-12 w-12" text-muted-foreground`;

        switch (file.type) {
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

    const uploadFile = (file: File, index: number) => {
        const formData = new FormData();
        formData.append("files", file);
        formData.append("path", path);

        axios
            .post("http://127.0.0.1:8080/api/v1/files/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                    if (progressEvent.total) {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        setUploadProgress((prevProgress) => {
                            const newProgress = [...prevProgress];
                            newProgress[index] = percentCompleted;
                            return newProgress;
                        });
                    }
                },
            })
            .then((response) => {
                onUploadComplete(response.data);
                toast.success(`Successfully uploaded ${file.name}!`);
            })
            .catch(() => {
                toast.error(`Failed to upload ${file.name}!`);
            });
    };

    return (
        <div
            className={`fixed bottom-4 right-5 w-[300px] bg-card rounded-lg shadow-lg ${
                isMinimalized ? "h-[60px]" : ""
            } ${!isOpen && "hidden"}`}
        >
            <div className="flex items-center justify-between px-4 py-3">
                <h3 className="text-lg font-medium">Files Uploaded</h3>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setIsMinimalized(!isMinimalized)}>
                        {!isMinimalized ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                        <span className="sr-only">Minimize</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={onClearFiles}>
                        <XIcon className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                    </Button>
                </div>
            </div>
            <div className={`${isMinimalized ? "hidden" : ""} transition-all duration-400 ease-in-out`}>
                <div className="p-4 space-y-3">
                    {uploadingFiles.map((file, index) => (
                        <div key={index} className="flex items-center gap-3">
                            {fileToIcon(file)}
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium">{file.name}</p>
                                    {uploadProgress[index] === 100 ? (
                                        <CheckIcon className="h-5 w-5 text-green-500" />
                                    ) : (
                                        <ClockIcon className="h-5 w-5 text-muted-foreground" />
                                    )}
                                </div>
                                <Progress value={uploadProgress[index]} className="mt-1" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};