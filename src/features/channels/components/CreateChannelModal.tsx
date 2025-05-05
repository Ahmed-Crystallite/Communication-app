import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCreateChannelModal } from "../store/use-create-channel-modal"
import { useCreateChannel } from "../api/use-create-channel"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog"

import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { toast } from "sonner"
import { Id } from "../../../../convex/_generated/dataModel"

export default function CreateChannelModal() {
  const router = useRouter()
  const workspaceId = useWorkspaceId()

  const [open, setOpen] = useCreateChannelModal()

  const { mutate, isPending } = useCreateChannel()

  const [name, setName] = useState("")

  const handleClose = () => {
    setName("")
    setOpen(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, "-").toLowerCase()
    setName(value)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    mutate(
      {
        name,
        workspaceId: workspaceId as Id<"workspaces">,
      },
      {
        onSuccess: (id) => {
          toast.success("Channel Created")
          router.push(`/workspace/${workspaceId}/channel/${id}`)
          handleClose()
        },
        onError: () => {
          toast.error("Failed To Create Channel")
        },
      }
    )
  }
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add A Channel</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            value={name}
            disabled={isPending}
            onChange={handleChange}
            required
            autoFocus
            min={3}
            max={80}
            placeholder="e.g. plan-budget"
          />
          <div className="flex justify-end">
            <Button disabled={isPending}>Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
