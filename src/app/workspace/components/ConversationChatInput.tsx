import { useCreateMessage } from "@/features/messages/api/use-create-message"
import { useGenerateUploadUrl } from "@/features/upload/api/use-generate-upload-url"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import dynamic from "next/dynamic"
import Quill from "quill"
import { useRef, useState } from "react"
import { toast } from "sonner"
import { Id } from "../../../../convex/_generated/dataModel"
const Editor = dynamic(() => import("@/components/Editor"), { ssr: false })

interface ConversationChatInputProps {
  placeholder: string
  conversationId: Id<"conversations">
}
type CreateMessageValues = {
  conversationId: Id<"conversations">
  workspaceId: Id<"workspaces">
  body: string
  image: Id<"_storage"> | undefined
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function ConversationChatInput({
  placeholder,
  conversationId,
}: ConversationChatInputProps) {
  const [editorKey, setEditorKey] = useState(0)
  const [isPending, setIsPending] = useState(false)

  const editorRef = useRef<Quill | null>(null)

  const workspaceId = useWorkspaceId()

  const { mutate: createMessage } = useCreateMessage()
  const { mutate: generateUploadUrl } = useGenerateUploadUrl()

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
        conversationId,
        workspaceId: workspaceId ?? "" as Id<"workspaces">,
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
  return (
    <div className="px-5 w-full">
      <Editor
        key={editorKey}
        placeholder={placeholder}
        onSubmit={handleSumbit}
        disabled={isPending}
        innerRef={editorRef}
      />
    </div>
  )
}
