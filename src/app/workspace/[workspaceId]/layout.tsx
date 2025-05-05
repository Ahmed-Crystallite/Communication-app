"use client"

import { usePanel } from "@/hooks/use-panel"
import { Sidebar, Toolbar, WorkspaceSidebar } from "../components"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/Resizable"
import { Loader2 } from "lucide-react"
import { Id } from "../../../../convex/_generated/dataModel"
import { Thread } from "@/features/messages/components/Thread"
import { Profile } from "@/features/members/components/Profile"
interface WorkspaceIdLayoutProps {
  children: React.ReactNode
}

export default function WorkspaceIdLayout({
  children,
}: WorkspaceIdLayoutProps) {
  const { parentMessageId, onClose, profileMemberId } = usePanel()
  const showPanel = !!parentMessageId || !!profileMemberId
  return (
    <div className="h-full">
      <Toolbar />
      <div className="flex h-[calc(100vh-40px)]">
        <Sidebar />
        <ResizablePanelGroup
          direction="horizontal"
          autoSaveId="ar-workspace-layout"
        >
          <ResizablePanel
            defaultSize={20}
            minSize={11}
            className="bg-[#5e2c5f] "
          >
            <WorkspaceSidebar />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel minSize={20} defaultSize={80}>{children}</ResizablePanel>
          {showPanel && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel minSize={20} defaultSize={29}>
                {parentMessageId ? (
                  <Thread
                    messageId={parentMessageId as Id<"messages">}
                    onClose={onClose}
                  />
                ) : profileMemberId ? (
                  <Profile
                    memberId={profileMemberId as Id<"members">}
                    onClose={onClose}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="size-5 animate-spin text-[#737373]" />
                  </div>
                )}
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  )
}
