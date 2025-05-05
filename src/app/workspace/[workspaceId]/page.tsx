"use client"
// React
import { useMemo, useEffect } from "react"
// Next
import { useRouter } from "next/navigation"

import { useCreateChannelModal } from "@/features/channels/store/use-create-channel-modal"

import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { UseGetWorkspace } from "@/features/workspaces/api/use-get-workspace"
import { useGetChannels } from "@/features/channels/api/use-get-channels"
import { Loader2, TriangleAlert } from "lucide-react"
import { useCurrentMember } from "@/features/members/api/use-current-member"
import { Id } from "../../../../convex/_generated/dataModel"

const WorkspaceIdPage = () => {
  const router = useRouter()
  const workspaceId = useWorkspaceId()
  const [open, setOpen] = useCreateChannelModal()

  const { data: member, isLoading: memberLoading } = useCurrentMember({
    workspaceId,
  })
  const { data: workspace, isLoading: workspaceLoading } = UseGetWorkspace({
    id: workspaceId as Id<"workspaces">,
  })

  const { data: channels, isLoading: channelsLoading } = useGetChannels({
    workspaceId: workspaceId as Id<"workspaces">,
  })

  const channelId = useMemo(() => channels?.[0]?._id, [channels])
  const isAdmin = useMemo(() => member?.role === "admin", [member?.role])
  useEffect(() => {
    if (
      workspaceLoading ||
      channelsLoading ||
      memberLoading ||
      !member ||
      !workspace
    )
      return

    if (channelId) {
      router.push(`/workspace/${workspaceId}/channel/${channelId}`)
    } else if (!open && isAdmin) {
      setOpen(true)
    }
  }, [
    member,
    memberLoading,
    isAdmin,
    channelId,
    workspaceLoading,
    channelsLoading,
    workspace,
    open,
    setOpen,
    router,
    workspaceId,
  ])

  if (workspaceLoading || channelsLoading || memberLoading) {
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
        <Loader2 className="size-6 animate-spin text-[#737373] " />
      </div>
    )
  }

  if (!workspace || !member) {
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
        <TriangleAlert className="size-6 text-[#737373] " />
        <span className="text-sm text-[#737373]">
          Workspace Not Found
        </span>
      </div>
    )
  }

  return (
    <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
      <TriangleAlert className="size-6 text-[#737373] " />
      <span className="text-sm text-[#737373]">No Channel Found</span>
    </div>
  )
}
export default WorkspaceIdPage
