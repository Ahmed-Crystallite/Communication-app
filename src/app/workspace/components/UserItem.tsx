import Link from "next/link"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { Button } from "@/components/ui/Button"
import { Id } from "../../../../convex/_generated/dataModel"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"

const userItemVariant = cva(
  "flex items-center gap-1.5 justify-start font-normal h-7 px-4 text-sm overflow-hidden",
  {
    variants: {
      variant: {
        default: "text-[#f9edffcc]",
        active: "text-[#481349] bg-white/90 hover:bg-white/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface UserItemProps {
  id: Id<"members">
  label?: string | "Member"
  image?: string
  variant?: VariantProps<typeof userItemVariant>["variant"]
}

export default function UserItem({ id, label, image, variant }: UserItemProps) {
  const workspaceId = useWorkspaceId()
  const avatarFallback = label?.charAt(0).toUpperCase()
  const status = useQuery(api.online_status.getStatus, { memberId: id })

  return (
    <Button
      variant="transparent"
      size="sm"
      className={cn(userItemVariant({ variant: variant }))}
      asChild
    >
      <Link href={`/workspace/${workspaceId}/member/${id}`}>
        <div className="relative">
          <Avatar className="size-5 rounded-md mr-1">
            <AvatarImage className="rounded-md" src={image} />
            <AvatarFallback className="bg-sky-600 text-white rounded-md text-xs">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
          <span
            className={cn(
              "absolute right-0 bottom-0 size-2 rounded-full border-2 border-white",
              status?.isOnline
                ? "bg-green-500 border-green-500"
                : "bg-transparent border-green-500"
            )}
          />
        </div>
        <span className="text-sm leading-tight truncate">{label}</span>
      </Link>
    </Button>
  )
}
