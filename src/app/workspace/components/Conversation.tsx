import { useGetMember } from "@/features/members/api/use-get-member"
import { Id } from "../../../../convex/_generated/dataModel"
import { useMemberId } from "@/hooks/use-member-id"
import { UseGetMessages } from "@/features/messages/api/use-get-messages"
import { Loader2 } from "lucide-react"
import { ConversationChatInput, ConversationHeader } from "./index"
import { MessageList } from "@/components/MessageList"
import { usePanel } from "@/hooks/use-panel"
interface ConversationProps {
  id: Id<"conversations">
}

export default function Conversation({ id }: ConversationProps) {
  const memberId = useMemberId()

  const {onOpenProfile} = usePanel()

  const { data: member, isLoading: memberLoading } = useGetMember({
    id: memberId,
  })

  const { results, status, loadMore } = UseGetMessages({
    conversationId: id,
  })

  if (memberLoading || status === "LoadingFirstPage") {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="size-6 animate-spin text-[#737373]" />
      </div>
    )
  }
  return (
    <div className="flex flex-col h-full">
      <ConversationHeader
        memberName={member?.user?.name}
        memberImage={member?.user?.image}
        onClick={() => onOpenProfile(memberId)}
      />
      <MessageList
        data={results}
        varient="conversation"
        memberImage={member?.user?.image}
        memberName={member?.user?.name}
        memberId={memberId}
        loadMore={loadMore}
        isLoadingMore={status === "LoadingMore"}
        canLoadMore={status === "CanLoadMore"}
      />
      <ConversationChatInput
        placeholder={`Message ${member?.user?.name}`}
        conversationId={id}
      />
    </div>
  )
}
