"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog"
import { toast } from "sonner"
import { useCreateWorkspaceModal } from "../store/use-create-workspace-modal"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { useCreateWorkspace } from "../api/use-create-workspace"

export default function CreateWorkspaceModal() {
  const [open, setOpen] = useCreateWorkspaceModal()
  const [name, setName] = useState("")

  const router = useRouter()

  const { mutate, isPending } = useCreateWorkspace()

  const handleClose = () => {
    setOpen(false)
    setName("")
    // Todo Clear Form
  }

  const handleSubmit = async (e: React.FocusEvent<HTMLFormElement>) => {
    e.preventDefault()

    mutate(
      { name },
      {
        onSuccess(id) {
          toast.success("Workspace Created ")
          router.push(`/workspace/${id}`)
          handleClose()
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-5">Add A Workspace</DialogTitle>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isPending}
              required
              autoFocus
              minLength={3}
              placeholder="Workspace name e.g. 'Work' , 'Persnol' , 'Home'"
            />
            <div className="flex justify-end">
              <Button disabled={isPending}>Create</Button>
            </div>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
