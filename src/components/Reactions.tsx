import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { Doc, Id } from "../../convex/_generated/dataModel"
import { useCurrentMember } from "@/features/members/api/use-current-member"
import { cn } from "@/lib/utils"
import Hints from "./Hints"
import EmojiPopover from "./EmojiPopover"
import { Button } from "./ui/Button"
import { Plus } from "lucide-react"
import { MdOutlineAddReaction } from "react-icons/md"
interface ReactionsProps {
  data: Array<
    Omit<Doc<"reactions">, "memberId"> & {
      count: number
      memberIds: Id<"members">[]
    }
  >
  onChange: (value: string) => void
}

export const Reactions = ({ data, onChange }: ReactionsProps) => {
  const workspaceId = useWorkspaceId()
  const { data: currentMember } = useCurrentMember({ workspaceId })

  const currentMemberId = currentMember?._id

  if (data.length === 0 || !currentMemberId) {
    return null
  }

  return (
    <div className="flex items-center gap-1 my-1">
      {data.map((reaction) => (
        <Hints
          key={reaction._id}
          label={`${reaction.count} ${reaction.count === 1 ? "person" : "people"} reacted with ${reaction.value}`}
        >
          <button
            key={reaction._id}
            onClick={() => onChange(reaction.value)}
            className={cn(
              "h-6 px-2 rounded-full bg-slate-200/70 border border-transparent text-slate-800 flex items-center gap-x-1",
              reaction.memberIds.includes(currentMemberId) &&
                "bg-blue-100/70 border-blue-500 text-blue-500"
            )}
          >
            {reaction.value}
            <span
              className={cn(
                "text-xs font-semibold text-[#737373]",
                reaction.memberIds.includes(currentMemberId) && "text-blue-500"
              )}
            >
              {reaction.count}
            </span>
          </button>
        </Hints>
      ))}
      <EmojiPopover
        hint="Add a reaction"
        onEmojiSelect={(emoji) => onChange(emoji)}
      >
        <button className="h-7 px-3 rounded-full bg-slate-200/70 border border-transparent text-slate-800 flex items-center gap-x-1 hover:border-slate-500">
          <MdOutlineAddReaction />
        </button>
      </EmojiPopover>
    </div>
  )
}
