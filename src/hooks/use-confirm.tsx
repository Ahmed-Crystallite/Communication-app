import React, { useState, useCallback } from "react"
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
): [() => React.ReactElement, (message: string) => Promise<boolean>] => {
  const [confirmState, setConfirmState] = useState<{
    message: string
    resolve: (value: boolean) => void
  } | null>(null)

  const confirm = useCallback(
    (message: string) =>
      new Promise<boolean>((resolve) => {
        setConfirmState({
          message,
          resolve,
        })
      }),
    []
  )
  const handleClose = () => {
    setConfirmState(null)
  }
  const handleCancel = () => {
    confirmState?.resolve(false)
    handleClose()
  }
  const handleConfirm = () => {
    confirmState?.resolve(true)
    handleClose()
  }
  const ConfrimDialog = () => (
    <Dialog
      open={confirmState !== null}
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
