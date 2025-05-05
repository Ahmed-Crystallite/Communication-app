"use client"

import { useEffect, useState } from "react"
import CreateWorkspaceModal from "@/features/workspaces/components/create-workspace-modal"
import CreateChannelModal from "@/features/channels/components/CreateChannelModal"

export default function Modal() {
  const [mouted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])
  if (!mouted) return null
  return (
    <>
      <CreateChannelModal />
      <CreateWorkspaceModal />
    </>
  )
}
