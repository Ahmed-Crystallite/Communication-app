import dynamic from "next/dynamic"
import { Doc, Id } from "../../convex/_generated/dataModel"
import { format, isToday, isYesterday } from "date-fns"
import Hints from "./Hints"
import { Avatar, AvatarImage, AvatarFallback } from "./ui/Avatar"
import { Thumbnail } from "./Thumbnail"
import { Toolbar } from "./Toolbar"
import { useUpdateMessage } from "@/features/messages/api/use-update-message"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useRemoveMessage } from "@/features/messages/api/use-remove-message"
import { useConfirm } from "@/hooks/use-confirm"
import { useToggleReaction } from "@/features/reactions/api/use-toggle-reaction"
import { Reactions } from "./Reactions"
import { usePanel } from "@/hooks/use-panel"
import { ThreadBar } from "./ThreadBar"
const Renderer = dynamic(() => import("./Renderer"), { ssr: false })
const Editor = dynamic(() => import("./Editor"), { ssr: false })
interface MessageProps {
  id: Id<"messages">
  memberId: Id<"members">
  authorImage?: string
  authorName?: string
  isAuthor: boolean
  reactions: Array<
    Omit<Doc<"reactions">, "memberId"> & {
      count: number
      memberIds: Id<"members">[]
    }
  >
  body: Doc<"messages">["body"]
  image: string | null | undefined
  createdAt: Doc<"messages">["_creationTime"]
  updatedAt: Doc<"messages">["updatedAt"]
  isEditing: boolean
  isCompact?: boolean
  setEditingId: (id: Id<"messages"> | null) => void
  hideThreadButton?: boolean
  threadCount?: number
  threadImage?: string
  threadName?: string
  threadTimestamp?: number
}
const formatFullTime = (date: Date) => {
  return `${isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : format(date, "MMM d yyyy")} at ${format(date, "h:mm:ss a")}`
}

export const Message = ({
  id,
  memberId,
  authorImage,
  authorName = "Member",
  isAuthor,
  reactions,
  body,
  image,
  createdAt,
  updatedAt,
  isEditing,
  isCompact,
  setEditingId,
  hideThreadButton,
  threadCount,
  threadImage,
  threadTimestamp,
  threadName,
}: MessageProps) => {
  const { parentMessageId, onOpenMessage, onOpenProfile, onClose } = usePanel()

  const [ConfirmDialog, confirm] = useConfirm(
    "Delete Message",
    "Are you sure you want to delete this message? this action cannot be undone."
  )

  const { mutate: updateMessage, isPending: isUpdatingMessage } =
    useUpdateMessage()
  const { mutate: removeMessage, isPending: isRemovingMessage } =
    useRemoveMessage()
  const { mutate: toggleReaction, isPending: isTogglingReaction } =
    useToggleReaction()

  const isPending = isUpdatingMessage || isTogglingReaction

  const handleToggleReaction = (value: string) => {
    toggleReaction(
      {
        messageId: id,
        value,
      },
      {
        onError: () => {
          toast.error("Failed to toggle reaction")
        },
      }
    )
  }
  const handleDeleteMessage = async () => {
    const ok = await confirm(
      "Are You Sure",
    )
    if (!ok) return
    removeMessage(
      { id },
      {
        onSuccess: () => {
          toast.success("Message deleted successfully")

          if (parentMessageId === id) {
            onClose()
          }
        },
        onError: () => {
          toast.error("Failed to delete message")
        },
      }
    )
  }

  const handleUpdateMessage = ({ body }: { body: string }) => {
    updateMessage(
      {
        id,
        body,
      },
      {
        onSuccess: () => {
          toast.success("Message updated successfully")
          setEditingId(null)
        },
        onError: () => {
          toast.error("Failed to update message")
        },
        onSettled: () => {
          setEditingId(null)
        },
      }
    )
  }

  if (isCompact) {
    return (
      <>
        <ConfirmDialog />
        <div
          className={cn(
            "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
            isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]",
            isRemovingMessage &&
              "bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200"
          )}
        >
          <div className="flex items-start gap-2">
            <Hints label={formatFullTime(new Date(createdAt))}>
              <button className="text-xs text-[#737373] opacity-0 group-hover:opacity-100 hover:underline w-[40px] leading-[22px]">
                {format(new Date(createdAt), "hh:mm")}
              </button>
            </Hints>
            {isEditing ? (
              <div className="w-full h-full">
                <Editor
                  onSubmit={handleUpdateMessage}
                  disabled={isPending}
                  defaultValue={JSON.parse(body)}
                  onCancel={() => setEditingId(null)}
                  variant="update"
                />
                {image && <Thumbnail url={image} />}
              </div>
            ) : (
              <div className="flex flex-col w-full">
                <Renderer value={body} />
                <Thumbnail url={image} />
                {updatedAt ? (
                  <span className="text-xs text-[#737373]">(edited)</span>
                ) : null}
                <Reactions data={reactions} onChange={handleToggleReaction} />
                <ThreadBar
                  count={threadCount}
                  image={threadImage}
                  timestamp={threadTimestamp}
                  name={threadName}
                  onClick={() => onOpenMessage(id)}
                />
              </div>
            )}
          </div>
          {!isEditing && (
            <Toolbar
              isAuthor={isAuthor}
              isPending={isPending}
              handleEdit={() => setEditingId(id)}
              handleThread={() => onOpenMessage(id)}
              handleDelete={handleDeleteMessage}
              handleReaction={handleToggleReaction}
              hideThreadButton={hideThreadButton}
            />
          )}
        </div>
      </>
    )
  }
  const avatarFallback = authorName?.charAt(0).toUpperCase()
  return (
    <>
      <ConfirmDialog />
      <div
        className={cn(
          "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
          isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]",
          isRemovingMessage &&
            "bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200"
        )}
      >
        <div className="flex items-start gap-2">
          <button onClick={() => onOpenProfile(memberId)}>
            <Avatar>
              <AvatarImage src={authorImage} />
              <AvatarFallback className="bg-sky-600 text-white text-sm">
                {avatarFallback}
              </AvatarFallback>
            </Avatar>
          </button>
          {isEditing ? (
            <div className="w-full h-full">
              <Editor
                onSubmit={handleUpdateMessage}
                disabled={isPending}
                defaultValue={JSON.parse(body)}
                onCancel={() => setEditingId(null)}
                variant="update"
              />
              {image && <Thumbnail url={image} />}
            </div>
          ) : (
            <div className="flex flex-col w-full overflow-hidden">
              <div className="text-sm">
                <button
                  onClick={() => onOpenProfile(memberId)}
                  className="font-bold text-[#171717] hover:underline"
                >
                  {authorName}
                </button>
                <span>&nbsp;&nbsp;</span>
                <Hints label={formatFullTime(new Date(createdAt))}>
                  <button className="text-xs text-[#737373] hover:underline">
                    {format(new Date(createdAt), "h:mm a")}
                  </button>
                </Hints>
              </div>
              <Renderer value={body} />
              {image && <Thumbnail url={image} />}
              {updatedAt ? (
                <span className="text-xs text-[#737373]">(edited)</span>
              ) : null}
              <Reactions data={reactions} onChange={handleToggleReaction} />
              <ThreadBar
                count={threadCount}
                image={threadImage}
                timestamp={threadTimestamp}
                name={threadName}
                onClick={() => onOpenMessage(id)}
              />
            </div>
          )}
        </div>
        {!isEditing && (
          <Toolbar
            isAuthor={isAuthor}
            isPending={isPending}
            handleEdit={() => setEditingId(id)}
            handleThread={() => onOpenMessage(id)}
            handleDelete={handleDeleteMessage}
            handleReaction={handleToggleReaction}
            hideThreadButton={hideThreadButton}
          />
        )}
      </div>
    </>
  )
}
