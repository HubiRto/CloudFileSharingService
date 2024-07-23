import React, {useEffect} from "react";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {z} from "zod";
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form.tsx";
import axios from "axios";
import {FileResponse} from "@/models/FileResponse.ts";

type Props = React.PropsWithChildren<{
    isOpen: boolean;
    onClose: () => void;
    path: string;
    onAddComplete: (res: FileResponse) => void;
}>

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
})

export const AddFolderModal = ({isOpen, onClose, path, onAddComplete}: Props) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        await axios.post<FileResponse>('http://127.0.0.1:8080/api/v1/files/folders/add', {
            name: values.name,
            path: path
        })
            .then((res) => {
                onAddComplete(res.data);
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
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Folder</DialogTitle>
                </DialogHeader>
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
            </DialogContent>
        </Dialog>
    )
}