import React, { useState } from "react"
import { Button } from "@/components/ui/Button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog"

export const useConfirm = (
  title: string,
  message: string
): [() => React.ReactElement, () => Promise<unknown>] => {
  const [promise, setPromise] = useState<{
    resolve: (value: boolean) => void
  } | null>(null)

  const confirm = () =>
    new Promise((resolve, reject) => {
      setPromise({ resolve })
    })
  const handleClose = () => {
    setPromise(null)
  }
  const handleCancel = () => {
    promise?.resolve(false)
    handleClose()
  }
  const handleConfirm = () => {
    promise?.resolve(true)
    handleClose()
  }
  const ConfrimDialog = () => (
    <Dialog
      open={promise !== null}
      onOpenChange={(open) => !open && handleClose()}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="leading-normal">{title}</DialogTitle>
          <DialogDescription className="text-base">{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="pt-2">
          <Button onClick={handleCancel} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
  return [ConfrimDialog, confirm]
}
