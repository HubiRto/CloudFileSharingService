import React, {useState} from 'react';
import axios, {AxiosProgressEvent} from 'axios';
import {Progress} from "@/components/ui/progress";
import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import toast from "react-hot-toast";

const FileUpload = ({triggerUpload}: { triggerUpload: boolean }) => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const filesArray = Array.from(event.target.files);
            setSelectedFiles(filesArray);
            setDialogOpen(true);
        }
    };

    const handleUpload = () => {
        const formData = new FormData();
        selectedFiles.forEach(file => {
            formData.append('files', file);
        });

        axios.post('http://127.0.0.1:8080/api/v1/files/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                if (progressEvent.total) {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                }
            }
        })
            .then(() => {
                toast.success(`Successfully uploaded ${selectedFiles.length} files!`);
                setDialogOpen(false);
                setSelectedFiles([]);
                setUploadProgress(0);
            })
            .catch(() => {
                toast.error('File upload failed!');
                setDialogOpen(false);
            });
    };

    React.useEffect(() => {
        if (triggerUpload) {
            document.getElementById("file-upload")?.click();
        }
    }, [triggerUpload]);

    return (
        <>
            <input type="file" multiple onChange={handleFileChange} style={{display: 'none'}} id="file-upload"/>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Upload Progress</DialogTitle>
                        <DialogDescription>
                            Uploading {selectedFiles.length} file(s).
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        {selectedFiles.map((file, index) => (
                            <div key={index}>
                                <div>{file.name}</div>
                            </div>
                        ))}
                        <Progress value={uploadProgress} className="w-full"/>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleUpload}>Start Upload</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default FileUpload;
