import { toast } from "sonner"
import { CopyIcon, RefreshCcw } from "lucide-react"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { useNewJoinCode } from "@/features/workspaces/api/use-new-join-code"
import { Button } from "@/components/ui/Button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog"
import { useConfirm } from "@/hooks/use-confirm"
import { Id } from "../../../../convex/_generated/dataModel"
interface InviteModalProps {
  open: boolean
  setOpen: (open: boolean) => void
  name: string
  joinCode: string
}

export default function InviteModal({
  open,
  setOpen,
  name,
  joinCode,
}: InviteModalProps) {
  const workspaceId = useWorkspaceId()

  const [ConfirmDialog, confirm] = useConfirm(
    "Are You Sure",
    "This will deactivate the current invite code and generate a new one."
  )

  const { mutate, isPending } = useNewJoinCode()

  const handleNewCode = async () => {
    const ok = await confirm(
      "Are You Sure",
    )

    if (!ok) {
      return
    }
    mutate(
      { workspaceId: workspaceId as Id<"workspaces"> },
      {
        onSuccess: () => {
          toast.success("Invite Code Regenerated")
        },
        onError: () => {
          toast.error("Failed To Invite Regenerate Code")
        },
      }
    )
  }

  const handleCopy = () => {
    const inviteLink = `${window.location.origin}/join/${workspaceId}`
    navigator.clipboard
      .writeText(inviteLink)
      .then(() => toast.success("Invite Link Copied To Clipboard"))
  }
  return (
    <>
      <ConfirmDialog />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite People To {name}</DialogTitle>
            <DialogDescription>
              Use The code below to invite people to your workspace
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-y-4 items-center justify-center py-10">
            <p className="text-4xl font-bold tracking-widest uppercase">
              {joinCode}
            </p>
            <Button onClick={handleCopy} variant="ghost" size="sm">
              Copy Link
              <CopyIcon className="size-4 ml-2" />
            </Button>
          </div>
          <div className="flex items-center justify-between w-full">
            <Button
              disabled={isPending}
              onClick={handleNewCode}
              variant="outline"
            >
              New Code
              <RefreshCcw className="size-4 ml-2" />
            </Button>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
