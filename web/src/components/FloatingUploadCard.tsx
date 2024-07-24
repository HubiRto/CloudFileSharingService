import React, {useEffect, useState} from "react";
import {CheckIcon, ChevronDown, ChevronUp, ClockIcon, XIcon} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {Progress} from "@/components/ui/progress.tsx";
import {FileData} from "@/models/FileData.ts";
import axios, {AxiosProgressEvent} from "axios";
import toast from "react-hot-toast";
import {Separator} from "@/components/ui/separator.tsx";
import {useFloatingUploadCard} from '@/providers/FloatingUploadCardProvider';
import {mimeToIcon} from "@/utils/mimeUtils.tsx";
import {useFileContext} from "@/providers/FileProvider.tsx";

type FloatingUploadCardProps = {
    path: string;
}

const FloatingUploadCard: React.FC<FloatingUploadCardProps> = ({path}) => {
    const {addFile} = useFileContext();
    const {isOpen, isMinimalized, files, closeCard, toggleMinimize} = useFloatingUploadCard();
    const [uploadProgress, setUploadProgress] = useState<number[]>([]);
    const [uploadErrors, setUploadErrors] = useState<boolean[]>([]);
    const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);

    useEffect(() => {
        setUploadingFiles(files);
        setUploadProgress(new Array(files.length).fill(0));
        setUploadErrors(new Array(files.length).fill(false));
    }, [files]);

    useEffect(() => {
        if (uploadingFiles.length > 0) {
            uploadingFiles.forEach((file, index) => {
                uploadFile(file, index);
            });
        }
    }, [uploadingFiles]);

    const uploadFile = (file: File, index: number) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("path", path);

        axios
            .post<FileData>("http://127.0.0.1:8080/api/v1/files/upload", formData, {
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
            .then((res) => {
                addFile(res.data);
                toast.success(`Successfully uploaded ${file.name}!`);
            })
            .catch((err: any) => {
                setUploadErrors((prevErrors) => {
                    const newErrors = [...prevErrors];
                    newErrors[index] = true;
                    return newErrors;
                });

                if (!err.response) console.log(err);
                toast.error(`Failed to upload ${file.name}!`);
                toast.error(err.response.data.error);
            });
    };

    return (
        <div
            className={`fixed bottom-0 right-7 w-[300px] bg-card rounded-t-lg shadow-lg ${
                isMinimalized ? "h-[60px]" : ""
            } ${!isOpen && "hidden"}`}
        >
            <div className="flex items-center justify-between px-4 py-2">
                <h3 className="text-lg font-medium">({files.length}) Files Uploaded</h3>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={toggleMinimize}>
                        {!isMinimalized ? <ChevronDown className="h-4 w-4"/> : <ChevronUp className="h-4 w-4"/>}
                        <span className="sr-only">Minimize</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={closeCard}>
                        <XIcon className="h-4 w-4"/>
                        <span className="sr-only">Close</span>
                    </Button>
                </div>
            </div>
            <div className={`${isMinimalized ? "hidden" : ""} transition-all duration-400 ease-in-out`}>
                {uploadingFiles.map((file, index) => (
                    <div key={index}>
                        <Separator/>
                        <div className="p-4">
                            <div key={index} className="flex items-center gap-3">
                                {mimeToIcon(file.type, 12)}
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium">{file.name}</p>
                                        {uploadErrors[index] ? (
                                            <XIcon className="h-6 w-6 text-red-500"/>
                                        ) : uploadProgress[index] === 100 ? (
                                            <CheckIcon className="h-5 w-5 text-green-500"/>
                                        ) : (
                                            <ClockIcon className="h-5 w-5 text-muted-foreground"/>
                                        )}
                                    </div>
                                    <Progress value={uploadProgress[index]} className={`mt-1`}/>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FloatingUploadCard;
