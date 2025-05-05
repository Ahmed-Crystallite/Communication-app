import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { FaChevronDown } from "react-icons/fa"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog"
import { Trash2Icon } from "lucide-react"
import { Input } from "@/components/ui/Input"
import { useUpdateChannel } from "@/features/channels/api/use-update-channel"
import { useChannelId } from "@/hooks/use-channel-id"
import { toast } from "sonner"
import { useRemoveChannel } from "@/features/channels/api/use-remove-channel"
import { useConfirm } from "@/hooks/use-confirm"
import { useRouter } from "next/navigation"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { useCurrentMember } from "@/features/members/api/use-current-member"

interface HeaderProps {
  title: string
}

export default function Header({ title }: HeaderProps) {
  const router = useRouter()

  const workspaceId = useWorkspaceId()

  const channelId = useChannelId()

  const [ConfrimDialog, confirm] = useConfirm(
    "Delete This Channel ?",
    "You are about to delete this channel. this actions is irreversible"
  )

  const [value, setValue] = useState(title)
  const [editOpen, setEditOpen] = useState(false)

  const { data: member } = useCurrentMember({ workspaceId })
  const { mutate: updateChannel, isPending: isUpdateChannel } =
    useUpdateChannel()
  const { mutate: removeChannel, isPending: isRemoveChannel } =
    useRemoveChannel()

  const handleEditOpen = (value: boolean) => {
    if (member?.role !== "admin") return

    setEditOpen(value)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, "-").toLowerCase()
    setValue(value)
  }

  const handleDelete = async () => {
    const ok = await confirm()
    if (!ok) return

    removeChannel(
      { id: channelId },
      {
        onSuccess: () => {
          toast.success("Channel Deleted")
          router.push(`/workspace/${workspaceId}`)
        },
        onError: () => {
          toast.success("Failed To Delete Channel")
        },
      }
    )
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    updateChannel(
      { id: channelId, name: value },
      {
        onSuccess: () => {
          toast.success("Channel Updated")
          setEditOpen(false)
        },
        onError: () => {
          toast.success("Failed To Update Channel")
        },
      }
    )
  }

  return (
    <div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
      <ConfrimDialog />
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="text-lg font-semibold px-2 overflow-hidden w-auto"
            size="sm"
          >
            <span className="truncate"># {title}</span>
            <FaChevronDown className="size-2.5 ml-2" />
          </Button>
        </DialogTrigger>
        <DialogContent className="p-0 bg-gray-50 overflow-hidden">
          <DialogHeader className="p-4 border-b bg-white">
            <DialogTitle># {title}</DialogTitle>
          </DialogHeader>
          <DialogDescription className="hidden"></DialogDescription>
          <div className="px-4 pb-4 flex flex-col gap-y-2">
            <Dialog open={editOpen} onOpenChange={handleEditOpen}>
              <DialogTrigger asChild>
                <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Channel Name</p>
                    {member?.role === "admin" && (
                      <p className="text-sm text-[#1264a3] hover:underline font-semibold">
                        Edit
                      </p>
                    )}
                  </div>
                  <p className="text-sm pt-1"># {title}</p>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Rename This Channel</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    value={value}
                    disabled={isUpdateChannel}
                    onChange={handleChange}
                    required
                    autoFocus
                    minLength={3}
                    maxLength={80}
                    placeholder="e.g. plan-budget "
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" disabled={isUpdateChannel}>
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button disabled={isUpdateChannel}>Save</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
              {member?.role === "admin" && (
                <button
                  onClick={handleDelete}
                  disabled={isRemoveChannel}
                  className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg cursor-pointer border hover:bg-gray-50 text-rose-600"
                >
                  <Trash2Icon className="size-4" />
                  <p className="text-sm font-semibold">Delete Channel</p>
                </button>
              )}
            </Dialog>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
