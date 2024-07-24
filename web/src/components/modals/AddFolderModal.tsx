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

type Props = React.PropsWithChildren<{
    isOpen: boolean;
    onClose: () => void;
    path: string;
}>

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
})

export const AddFolderModal = ({isOpen, onClose, path}: Props) => {
    const {addFile} = useFileContext();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        await axios.post<FileData>('http://127.0.0.1:8080/api/v1/files/folders/add', {
            name: values.name,
            path: path
        })
            .then((res) => {
                addFile(res.data);
                onClose();
                toast.success("Successfully added folder");
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
        <Modal isOpen={isOpen} onClose={onClose} title="Add Folder">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({field}) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="Folder Name..." {...field} />
                                </FormControl>
                                <FormMessage/>
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