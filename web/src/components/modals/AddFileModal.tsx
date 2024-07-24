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

type Props = React.PropsWithChildren<{
    isOpen: boolean;
    onClose: () => void;
    path: string;
}>

const formSchema = z.object({
    name: z.string().min(5, {
        message: "Name must be at least 5 characters.",
    }),
})

export const AddFileModal = ({isOpen, onClose, path}: Props) => {
    const {addFile} = useFileContext();
    const {authState} = useAuth();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!authState?.token) return;

        console.log(values.name);

        await axios.post<FileData>(`http://127.0.0.1:8080/api/v1/files/addNew?path=${path}&fileName=${values.name}`, undefined, {
            headers: {
                Authorization: `Bearer ${authState?.token}`
            },
        })
            .then((res) => {
                addFile(res.data);
                onClose();
                toast.success("Successfully added file");
            })
            .catch((err: any) => {
                if (!err.response) console.log(err);
                toast.error(`Failed to create ${form.getValues("name")}!`);
                toast.error(err.response.data.error);
            })
    }

    useEffect(() => {
        form.reset();
    }, [isOpen]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add File">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({field}) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="File Name..." {...field} />
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