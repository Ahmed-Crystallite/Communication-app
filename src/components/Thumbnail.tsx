/* eslint-disable @next/next/no-img-element */
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/Dialog"
interface ThumbnailProps {
  url: string | null | undefined
}
export const Thumbnail = ({ url }: ThumbnailProps) => {
  if (!url) return null
  return (
    <Dialog>
      <DialogTrigger>
        <div className="relative overflow-hidden max-w-[360px] border rounded-lg my-2 cursor-zoom-in">
          <img
            src={url}
            alt="message image"
            className="rounded-md object-cover size-full"
          />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-[800px] border-none bg-transparent p-0 shadow-none">
        <DialogHeader>
          <DialogTitle>Image</DialogTitle>
          <DialogDescription>
            <img
              src={url}
              alt="message image"
              className="rounded-md object-cover size-full"
            />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
