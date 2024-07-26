import React, {useEffect} from "react";
import {DialogFooter} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {z} from "zod";
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form.tsx";
import axios from "axios";
import {FileData} from "@/models/FileData.ts";
import {Modal} from "@/components/modals/Modal.tsx";
import {useFileContext} from "@/providers/FileProvider.tsx";
import toast from "react-hot-toast";
import {useAuth} from "@/providers/AuthContext.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {useSelectFileContext} from "@/providers/SelectFileProvider.tsx";

type Props = React.PropsWithChildren<{
    isOpen: boolean;
    onClose: () => void;
    path: string;
}>

const formSchema = z.object({
    name: z.string().min(5, {
        message: "Archive name must be at least 5 characters.",
    }),
    type: z.string()
})

export const CompressModal = ({isOpen, onClose, path}: Props) => {
    const {addFile} = useFileContext();
    const {authState} = useAuth();
    const {selectedFiles, clear} = useSelectFileContext();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            type: "zip"
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!authState?.token) return;

        console.log(values.name);

        await axios.post<FileData>(`http://127.0.0.1:8080/api/v1/files/archive/compress`, {
            name: values.name,
            type: values.type,
            path: path,
            ids: selectedFiles
        }, {
            headers: {
                Authorization: `Bearer ${authState?.token}`
            },
        })
            .then((res) => {
                addFile(res.data);
                clear();
                onClose();
                toast.success("Successfully create archive");
            })
            .catch((err: any) => {
                if (!err.response) console.log(err);
                toast.error(err.response.data.error);
            })
    }

    useEffect(() => {
        form.reset();
    }, [isOpen]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create Archive">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({field}) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="Archive file name..." {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select archive type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="zip">.zip</SelectItem>
                                            <SelectItem value="tar">.tar.xz</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <DialogFooter>
                        <Button type="submit">Add Folder</Button>
                    </DialogFooter>
                </form>
            </Form>
        </Modal>
    )
}