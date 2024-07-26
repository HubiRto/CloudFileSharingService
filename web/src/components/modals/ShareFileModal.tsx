import React, {useEffect} from "react";
import {DialogFooter} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {z} from "zod";
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form.tsx";
import axios from "axios";
import {Modal} from "@/components/modals/Modal.tsx";
import toast from "react-hot-toast";
import {useAuth} from "@/providers/AuthContext.tsx";
import {useModal} from "@/providers/ModalProvider.tsx";

type Props = React.PropsWithChildren<{
    isOpen: boolean;
    onClose: () => void;
}>

const formSchema = z.object({
    email: z.string().email()
})

export const ShareFileModal = ({isOpen, onClose}: Props) => {
    const {authState} = useAuth();
    const {getModalData} = useModal();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!authState?.token || !getModalData<number>()) return;

        await axios.post<string>(`http://127.0.0.1:8080/api/v1/files/share/share`, {
            id: getModalData<number>(),
            email: values.email
        }, {
            headers: {
                Authorization: `Bearer ${authState?.token}`
            },
        })
            .then((res) => {
                onClose();
                toast.success(res.data);
            })
            .catch((err: any) => {
                const statusCode: number = err.response.status;

                if (statusCode === 404) {
                    form.setError("email", {message: "User with that email does not exist"});
                } else if (statusCode === 409) {
                    if ((new Map(Object.entries(err.response.data.details))).get("errorType") === "Share Yourself") {
                        form.setError("email", {message: err.response.data.error})
                    } else {
                        onClose();
                        toast.error(err.response.data.error);
                    }
                } else {
                    console.log(err);
                }
            })
    }

    useEffect(() => {
        form.reset();
    }, [isOpen]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Share file to...">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({field}) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="Email..." {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <DialogFooter>
                        <Button type="submit">Share</Button>
                    </DialogFooter>
                </form>
            </Form>
        </Modal>
    )
}