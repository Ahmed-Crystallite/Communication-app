"use client"

import { useCreateOrGetConversation } from "@/features/conversations/api/use-create-or-get-conversation"
import { useMemberId } from "@/hooks/use-member-id"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { Loader2, TriangleAlert } from "lucide-react"
import { useEffect, useState } from "react"
import { Id } from "../../../../../../convex/_generated/dataModel"
import { toast } from "sonner"
import { Conversation } from "@/app/workspace/components"

const MemberIdPage = () => {
  const workspaceId = useWorkspaceId()
  const memberId = useMemberId()

  const [conversationId, setConversationId] =
    useState<Id<"conversations"> | null>(null)

  const { data, mutate, isPending } = useCreateOrGetConversation()

  useEffect(() => {
    mutate(
      { memberId, workspaceId },
      {
        onSuccess: (data) => {
          setConversationId(data)
        },
        onError: () => {
          toast.error("Failed to create or get conversation")
        },
      }
    )
  }, [mutate, memberId, workspaceId])

  if (isPending) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="size-6 animate-spin text-[#737373]" />
      </div>
    )
  }
  if (!isPending && !conversationId) {
    return (
      <div className="h-full flex flex-col gap-2 items-center justify-center">
        <TriangleAlert className="size-6 text-[#737373]" />
        <p className="text-sm text-[#737373]">Conversation not found</p>
      </div>
    )
  }

  return <Conversation id={conversationId} />
}

export default MemberIdPage
