import React, {useEffect} from "react";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {z} from "zod";
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form.tsx";
import axios from "axios";
import toast from "react-hot-toast";
import {useAuth} from "@/providers/AuthContext.tsx";

type Props = React.PropsWithChildren<{
    id: number;
    oldName: string;
    isOpen: boolean;
    onClose: () => void;
    onRenameComplete: (oldName: string, newName: string) => void;
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

export const RenameFileModal = ({id, oldName, isOpen, onClose, onRenameComplete}: Props) => {
    const {authState} = useAuth();
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
        if(!authState?.token) return;

        await axios.patch<string>(`http://127.0.0.1:8080/api/v1/files/rename/${id}`, {
            newName: values.name
        }, {
            headers: {
                Authorization: `Bearer ${authState?.token}`
            },
        })
            .then((res) => {
                toast.success(res.data);
                onRenameComplete(oldName, changeFileName(oldName, values.name));
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
                    <DialogTitle>Rename file</DialogTitle>
                </DialogHeader>
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
                            <Button type="submit">Rename</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}