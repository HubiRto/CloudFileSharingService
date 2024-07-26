import React, {useEffect} from "react";
import {DialogFooter} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {z} from "zod";
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form.tsx";
import axios from "axios";
import toast from "react-hot-toast";
import {useAuth} from "@/providers/AuthContext.tsx";
import {FileData} from "@/models/FileData.ts";
import {Modal} from "@/components/modals/Modal.tsx";
import {useFileContext} from "@/providers/FileProvider.tsx";

type Props = React.PropsWithChildren<{
    file: FileData;
    isOpen: boolean;
    onClose: () => void;
}>

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 5 characters.",
    }),
})

function changeFileName(fullFileName: string, newName: string): string {
    const dotIndex = fullFileName.lastIndexOf('.');
    if (dotIndex === -1) {
        throw new Error('File does not have an extension');
    }
    const extension = fullFileName.substring(dotIndex);
    return newName + extension;
}

export const RenameFileModal = ({file, isOpen, onClose}: Props) => {
    const {authState} = useAuth();
    const {renameFile} = useFileContext();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    });

    useEffect(() => {
        form.reset();
    }, [isOpen]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!authState?.token) return;

        await axios.patch<FileData>(`http://127.0.0.1:8080/api/v1/files/rename/${file.id}`, {
            newName: values.name
        }, {
            headers: {
                Authorization: `Bearer ${authState?.token}`
            },
        })
            .then((res) => {
                renameFile(file.name, changeFileName(file.name, values.name), res.data.lastModifiedAt);
                onClose();
                toast.success("Successfully renamed file");
            })
            .catch((err: any) => {
                if (!err.response) console.log(err);
                const code: number = err.response.status;

                if (code === 409) {
                    form.setError("name", {message: err.response.data.error as string})
                }
            })
    }

    useEffect(() => {
        form.reset();
    }, [isOpen]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Rename File">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({field}) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="New file name..." {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <DialogFooter>
                        <Button type="submit">Rename</Button>
                    </DialogFooter>
                </form>
            </Form>
        </Modal>
    )
}