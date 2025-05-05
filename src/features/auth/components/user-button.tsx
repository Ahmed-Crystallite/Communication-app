"use client";
import { useAuthActions } from "@convex-dev/auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import UseCurrentUser from "../api/use-current-user";
import { Loader2, LogOut } from "lucide-react";
import { useOnlineStatus } from "@/features/online-status/api/use-online-status";
import { cn } from "@/lib/utils";
export default function UserButton() {
  const { signOut } = useAuthActions();
  const { data, isLoading } = UseCurrentUser();
  const status = useOnlineStatus();
  console.log(status);
  if (isLoading) {
    return <Loader2 className="size-4 text-white animate-spin" />;
  }
  if (!data) {
    return null;
  }

  const { image, name } = data;

  const avavterFallback = name!.charAt(0).toUpperCase();
  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger
          asChild
          className="outline-none relative z-10 cursor-pointer"
        >
          <Avatar className="relative size-10 hover:opacity-75 transition-all rounded-md">
            <span
              className={cn(
                "absolute right-0 bottom-0 size-2.5 rounded-full border-2 border-white",
                status?.isOnline
                  ? "bg-green-500 border-green-500"
                  : "bg-transparent border-green-500"
              )}
            ></span>
            <AvatarImage src={image} alt={name} />
            <AvatarFallback className="bg-sky-600 text-white rounded-md">
              {avavterFallback}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" side="right" className="w-60">
          <DropdownMenuLabel>{name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => signOut()}
            className="cursor-pointer"
          >
            <LogOut className="size-4 mr-2" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
