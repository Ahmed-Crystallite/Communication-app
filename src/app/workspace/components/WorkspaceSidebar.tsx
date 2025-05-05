import { useCurrentMember } from "@/features/members/api/use-current-member"
import { UseGetWorkspace } from "@/features/workspaces/api/use-get-workspace"
import { useGetChannels } from "@/features/channels/api/use-get-channels"
import { useGetMembers } from "@/features/members/api/use-get-members"
import { useCreateChannelModal } from "@/features/channels/store/use-create-channel-modal"

import { useChannelId } from "@/hooks/use-channel-id"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { useMemberId } from "@/hooks/use-member-id"

import {
  AlertTriangle,
  HashIcon,
  Loader2,
  MessageSquareText,
  SendHorizonal,
} from "lucide-react"

import {
  SidebarItem,
  UserItem,
  WorkspaceHeader,
  WorkspaceSection,
} from "./index"

const WorkspaceSidebar = () => {
  const memberId = useMemberId()
  const channelId = useChannelId()
  const workspaceId = useWorkspaceId()

  const [_open, setOpen] = useCreateChannelModal()

  const { data: member, isLoading: memberLoading } = useCurrentMember({
    workspaceId,
  })
  const { data: workspace, isLoading: workspaceLoading } = UseGetWorkspace({
    id: workspaceId,
  })
  const { data: channels, isLoading: channelsLoading } = useGetChannels({
    workspaceId,
  })

  const { data: members, isLoading: membersLoading } = useGetMembers({
    workspaceId,
  })
  if (workspaceLoading || memberLoading) {
    return (
      <div className="flex flex-col bg-[#5e2c5f] h-full items-center justify-center">
        <Loader2 className="size-5 animate-spin text-white" />
      </div>
    )
  }
  if (!workspace || !member) {
    return (
      <div className="flex flex-col gap-y-2 bg-[#5e2c5f] h-full items-center justify-center">
        <AlertTriangle className="size-5 text-white" />
        <p className="text-white text-base">Workspace Not Found</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col bg-[#5e2c5f] h-full">
      <WorkspaceHeader
        workspace={workspace}
        isAdmin={member.role === "admin"}
      />
      <div className="flex flex-col px-2 gap-y-2 mt-3">
        <SidebarItem
          label="Threads"
          icon={MessageSquareText}
          id="threads"
          variant="active"
        />
        <SidebarItem label="Draft & Sent" icon={SendHorizonal} id="draft" />
      </div>
      <WorkspaceSection
        label="Channels"
        hint="New Channel"
        onNew={member.role === "admin" ? () => setOpen(true) : undefined}
      >
        {channels?.map((item) => (
          <SidebarItem
            key={item._id}
            icon={HashIcon}
            label={item.name}
            id={item._id}
            variant={channelId === item._id ? "active" : "default"}
          />
        ))}
      </WorkspaceSection>
      <WorkspaceSection
        label="Direct Message"
        hint="New direct message"
        // onNew={() => {}}
      >
        {members?.map((items) => (
          <UserItem
            key={items._id}
            id={items._id}
            label={items.user.name}
            image={items.user.image}
            variant={items._id === memberId ? "active" : "default"}
          />
        ))}
      </WorkspaceSection>
    </div>
  )
}

export default WorkspaceSidebar
