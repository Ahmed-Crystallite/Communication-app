import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { UseGetWorkspace } from "@/features/workspaces/api/use-get-workspace"
import { useCreateWorkspaceModal } from "@/features/workspaces/store/use-create-workspace-modal"
import { useRouter } from "next/navigation"
import { Loader2, Plus } from "lucide-react"
import { Id } from "../../../../convex/_generated/dataModel"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu"
import { UseGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces"

const WorkspaceSwitcher = () => {
  const router = useRouter()

  const workspaceId = useWorkspaceId()
  const [_open, setOpen] = useCreateWorkspaceModal()

  const { data: workspaces } = UseGetWorkspaces()

  const { data: workspace, isLoading: workspaceLoading } = UseGetWorkspace({
    id: workspaceId || "" as Id<"workspaces">,
  })

  const filterWorkspaces = workspaces?.filter(
    (workspace) => workspace?._id !== workspaceId
  )
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger>
        <span className="inline-flex items-center justify-center rounded-md size-9 relative overflow-hidden bg-[#ababab] hover:bg-[#ababab80] text-slate-800 font-semibold text-xl">
          {workspaceLoading ? (
            <Loader2 className="size-5 animate-spin shrink-0" />
          ) : (
            workspace?.name.charAt(0).toUpperCase()
          )}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="start" className="w-64">
        <DropdownMenuItem
          onClick={() => router.push(`/workspace/${workspaceId}`)}
          className="cursor-pointer flex-col justify-start items-start capitalize text-lg font-semibold leading-tight gap-y-1"
        >
          {workspace?.name}
          <span className="text-xs text-[rgb(215.4_16.3%_46.9%)]">
            Active Workspace
          </span>
        </DropdownMenuItem>
        {filterWorkspaces?.map((workspace) => (
          <DropdownMenuItem
            key={workspace._id}
            className="cursor-pointer capitalize"
            onClick={() => router.push(`/workspace/${workspace._id}`)}
          >
            <div className="shrink-0 size-9 relative overflow-hidden bg-[#616061] text-white font-semibold text-xl rounded-md flex items-center justify-center mr-2">
              {workspace.name.charAt(0).toUpperCase()}
            </div>
            <p className="truncate">{workspace.name}</p>
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <div className="size-9 relative overflow-hidden bg-[#f2f2f2] text-slate-800 font-semibold text-xl rounded-md flex items-center justify-center mr-2">
            <Plus />
          </div>
          Create New Workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default WorkspaceSwitcher
