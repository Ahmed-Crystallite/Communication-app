import { formatDistanceToNow } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar"
import { ChevronRight } from "lucide-react"

interface ThreadBarProps {
  count?: number
  image?: string
  timestamp?: number
  name?: string
  onClick?: () => void
}

export const ThreadBar = ({
  count,
  image,
  timestamp,
  name = "Member",
  onClick,
}: ThreadBarProps) => {
  if (!count || !timestamp) return null
  const avatarFallback = name.charAt(0).toUpperCase()
  return (
    <button
      onClick={onClick}
      className="p-1 rounded-md hover:bg-white border border-transparent hover:border-[#e5e5e5] flex items-center justify-start group/thread-bar transition-all max-w-[600px]"
    >
      <div className="flex items-center gap-2 overflow-hidden">
        <Avatar className="size-4 rounded-md shrink-0">
          <AvatarImage src={image} />
          <AvatarFallback className="bg-sky-600 text-white text-sm">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
        <span className="text-xs text-sky-700 hover:underline font-bold truncate">
          {count} {count === 1 ? "reply" : "replies"}
        </span>
        <span className="text-xs text-[#737373] truncate group-hover/thread-bar:hidden block transition-all">
          Last reply {formatDistanceToNow(timestamp, { addSuffix: true })}
        </span>
        <span className="text-xs text-[#737373] truncate group-hover/thread-bar:block hidden transition-all">
          View Thread
        </span>
      </div>
      <ChevronRight className="size-4 text-[#737373] ml-auto opacity-0 group-hover/thread-bar:opacity-100 transition-all shrink-0" />
    </button>
  )
}
