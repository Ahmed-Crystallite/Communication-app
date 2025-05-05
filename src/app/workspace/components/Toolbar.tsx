import { Button } from "@/components/ui/Button"
import { UseGetWorkspace } from "@/features/workspaces/api/use-get-workspace"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { Info, Search } from "lucide-react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/Command"
import { useState } from "react"
import { useGetChannels } from "@/features/channels/api/use-get-channels"
import { useGetMembers } from "@/features/members/api/use-get-members"
import { useRouter } from "next/navigation"
import { Id } from "../../../../convex/_generated/dataModel"

const Toolbar = () => {
  const router = useRouter()

  const [open, setOpen] = useState(false)

  const workspaceId = useWorkspaceId()

  const { data: channels } = useGetChannels({
    workspaceId: workspaceId ?? "" as Id<"workspaces">,
  })
  const { data: members } = useGetMembers({
    workspaceId: workspaceId ?? "" as Id<"workspaces">,
  })
  const { data } = UseGetWorkspace({ id: workspaceId ?? "" as Id<"workspaces"> })

  const onChannelClick = (channelId: string) => {
    setOpen(false)
    router.push(`/workspace/${workspaceId}/channel/${channelId}`)
  }
  const onMemberClick = (memberId: string) => {
    setOpen(false)
    router.push(`/workspace/${workspaceId}/member/${memberId}`)
  }
  return (
    <nav className="bg-[#483149] flex items-center justify-between h-10 p-1.5">
      <div className="flex-1" />
      <div className="min-w-[280px] max-w-[642px] grow-[2] shrink">
        <Button
          onClick={() => setOpen(true)}
          size="sm"
          className="bg-slate-100/25 hover:bg-slate-100/25 w-full justify-start h-7 px-2"
        >
          <Search className="size-4 text-white mr-2" />
          <span className="text-white text-xs">Search {data?.name}</span>
        </Button>
        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Channels">
              {channels?.map((channel) => (
                <CommandItem
                  asChild
                  className="cursor-pointer"
                  onSelect={() => onChannelClick(channel._id)}
                  key={channel._id}
                >
                  <span>{channel.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Members">
              {members?.map((member) => (
                <CommandItem
                  asChild
                  className="cursor-pointer"
                  onSelect={() => onMemberClick(member._id)}
                  key={member._id}
                >
                  <span>{member.user.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </div>
      <div className="ml-auto flex-1 flex items-center justify-end">
        <Button variant="transparent" size="iconSm">
          <Info className="size-5 text-white" />
        </Button>
      </div>
    </nav>
  )
}

export default Toolbar
