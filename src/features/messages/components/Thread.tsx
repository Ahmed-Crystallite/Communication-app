import { AlertTriangle, Loader2, XIcon } from "lucide-react"
import { Id } from "../../../../convex/_generated/dataModel"
import { Button } from "@/components/ui/Button"
import { useGetMessage } from "../api/use-get-message"
import { Message } from "@/components/Message"
import { useCurrentMember } from "@/features/members/api/use-current-member"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { useRef, useState } from "react"
import dynamic from "next/dynamic"
import Quill from "quill"
import { useCreateMessage } from "../api/use-create-message"
import { useGenerateUploadUrl } from "@/features/upload/api/use-generate-upload-url"
import { useChannelId } from "@/hooks/use-channel-id"
import { toast } from "sonner"
import { UseGetMessages } from "../api/use-get-messages"
import { isToday, isYesterday, format, differenceInMinutes } from "date-fns"

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false })

const TIME_THERSHOLD = 5
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

interface ThreadProps {
  messageId: Id<"messages">
  onClose: () => void
}

type CreateMessageValues = {
  channelId: Id<"channels">
  workspaceId: Id<"workspaces">
  parentMessageId: Id<"messages">
  body: string
  image: Id<"_storage"> | undefined
}

const formatDateLabel = (dateStr: string) => {
  const date = new Date(dateStr)
  if (isToday(date)) return "Today"
  if (isYesterday(date)) return "Yesterday"
  return format(date, "EEEE, MMMM d")
}

export const Thread = ({ messageId, onClose }: ThreadProps) => {
  const channelId = useChannelId()
  const workspaceId = useWorkspaceId()

  const [editingId, setEditingId] = useState<Id<"messages"> | null>(null)
  const [editorKey, setEditorKey] = useState(0)
  const [isPending, setIsPending] = useState(false)

  const editorRef = useRef<Quill | null>(null)

  const { mutate: createMessage } = useCreateMessage()

  const { mutate: generateUploadUrl } = useGenerateUploadUrl()

  const { data: currentMember } = useCurrentMember({ workspaceId })

  const { data: message, isLoading: isMessageLoading } = useGetMessage({
    id: messageId,
  })
  const { results, status, loadMore } = UseGetMessages({
    channelId,
    parentMessageId: messageId,
  })

  const canLoadMore = status === "CanLoadMore"
  const isLoadingMore = status === "LoadingMore"

  const handleSumbit = async ({
    body,
    image,
  }: {
    body: string
    image: File | null
  }) => {
    try {
      setIsPending(true)
      editorRef?.current?.enable(false)

      let imageStorageId: Id<"_storage"> | undefined = undefined

      if (image) {
        // Validate file size
        if (image.size > MAX_FILE_SIZE) {
          toast.error("Image size should be less than 5MB")
          return
        }

        // Validate file type
        if (!image.type.startsWith('image/')) {
          toast.error("Only image files are allowed")
          return
        }

        try {
          const uploadUrl = await generateUploadUrl({}, { throwError: true })
          if (!uploadUrl) {
            throw new Error("Failed to generate upload URL")
          }

          const uploadResponse = await fetch(uploadUrl, {
            method: "POST",
            body: image,
          })

          if (!uploadResponse.ok) {
            throw new Error("Failed to upload image")
          }

          const { storageId } = await uploadResponse.json()
          imageStorageId = storageId
        } catch (error) {
          toast.error(error instanceof Error ? error.message : "Failed to upload image. Please try again.")
          return
        }
      }

      const values: CreateMessageValues = {
        channelId,
        workspaceId: workspaceId ?? "" as Id<"workspaces">,
        parentMessageId: messageId,
        body,
        image: imageStorageId,
      }

      await createMessage(values, { throwError: true })
      setEditorKey((prev) => prev + 1)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to send message. Please try again.")
    } finally {
      setIsPending(false)
      editorRef?.current?.enable(true)
    }
  }

  const groupedMessages = results?.reduce(
    (groups, message) => {
      const date = new Date(message._creationTime)
      const dateKey = format(date, "yyyy-MM-dd")
      if (!groups[dateKey]) {
        groups[dateKey] = []
      }
      groups[dateKey].unshift(message)
      return groups
    },
    {} as Record<string, typeof results>
  )

  if (isMessageLoading || status === "LoadingFirstPage") {
    return (
      <div className="h-full flex flex-col">
        <div className="h-[49px] flex justify-between items-center px-4 border-b">
          <p className="text-xl font-bold leading-tight">Thread</p>
          <Button variant="ghost" size="iconSm" onClick={onClose}>
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="h-full flex items-center justify-center">
          <Loader2 className="size-6 animate-spin text-[#737373]" />
        </div>
      </div>
    )
  }
  if (!message) {
    return (
      <div className="h-full flex flex-col">
        <div className="h-[49px] flex justify-between items-center px-4 border-b">
          <p className="text-xl font-bold leading-tight">Thread</p>
          <Button variant="ghost" size="iconSm" onClick={onClose}>
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="h-full flex flex-col gap-2 items-center justify-center">
          <AlertTriangle className="size-6 text-[#737373]" />
          <p className="text-sm text-[#737373]">Message not found</p>
        </div>
      </div>
    )
  }
  return (
    <div className="h-full flex flex-col">
      <div className="h-[49px] flex justify-between items-center px-4 border-b">
        <p className="text-xl font-bold leading-tight">Thread</p>
        <Button variant="ghost" size="iconSm" onClick={onClose}>
          <XIcon className="size-5 stroke-[1.5]" />
        </Button>
      </div>
      <div className="flex-1 flex flex-col-reverse overflow-y-auto px-4 messages-scrollbar my-4">
        {Object.entries(groupedMessages || {}).map(([dateKey, messages]) => (
          <div key={dateKey}>
            <div className="text-center my-2 relative">
              <hr className="absolute top-1/2 w-full left-0 right-0 border-t border-gray-300" />
              <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
                {formatDateLabel(dateKey)}
              </span>
            </div>
            {messages.map((message, index) => {
              const prevMessage = messages[index - 1]
              const isCompact =
                prevMessage &&
                prevMessage.user?._id === message.user?._id &&
                differenceInMinutes(
                  new Date(message._creationTime),
                  new Date(prevMessage._creationTime)
                ) < TIME_THERSHOLD
              return (
                <Message
                  key={message._id}
                  id={message._id}
                  memberId={message.memberId}
                  authorImage={message.user.image}
                  authorName={message.user.name}
                  isAuthor={message.memberId === currentMember?._id}
                  reactions={message.reactions}
                  body={message.body}
                  image={message.image}
                  updatedAt={message.updatedAt}
                  createdAt={message._creationTime}
                  isEditing={editingId === message._id}
                  setEditingId={setEditingId}
                  isCompact={isCompact}
                  hideThreadButton
                  threadCount={message.threadCount}
                  threadImage={message.threadImage}
                  threadName={message.threadName}
                  threadTimestamp={message.threadTimestamp}
                />
              )
            })}
          </div>
        ))}
        <div
          className="h-1"
          ref={(el) => {
            if (el) {
              const observer = new IntersectionObserver(
                ([entry]) => {
                  if (entry.isIntersecting && canLoadMore) {
                    loadMore()
                  }
                },
                {
                  threshold: 0.1,
                }
              )
              observer.observe(el)
              return () => observer.disconnect()
            }
          }}
        />
        {isLoadingMore && (
          <div className="text-center my-2 relative">
            <hr className="absolute top-1/2 w-full left-0 right-0 border-t border-gray-300" />
            <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
              <Loader2 className="animate-spin size-4" />
            </span>
          </div>
        )}
      </div>
      <div className="px-4">
        <Editor
          key={editorKey}
          onSubmit={handleSumbit}
          disabled={isPending}
          innerRef={editorRef}
          placeholder="Reply to message..."
        />
      </div>
    </div>
  )
}
