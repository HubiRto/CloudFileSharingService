import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";

export function UserItem() {
    return (
        <div className="flex items-center justify-between gap-2 border rounded-[8px] p-4">
            <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="grow">
                <p className="text-[16px] font-bold">Hubert Rybicki</p>
                <p className="text-[12px] text-neutral-500">hubert.rybicki.hr@gmail.com</p>
            </div>
        </div>
    );
}