import data from "@emoji-mart/data"
import Picker from "@emoji-mart/react"
import EmojiPicker, { EmojiClickData } from "emoji-picker-react"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip"
import { useState } from "react"

interface EmojiPopoverProps {
  children: React.ReactNode
  hint?: string
  onEmojiSelect: (value: string) => void
}
export default function EmojiPopover({
  children,
  hint = "Emoji",
  onEmojiSelect,
}: EmojiPopoverProps) {
  const [popoverOpen, setpopoverOpen] = useState(false)
  const [tooltipOpen, setTooltipOpen] = useState(false)

  const onSelect = (value: EmojiClickData) => {
    onEmojiSelect(value.emoji)
    setpopoverOpen(false)

    setTimeout(() => {
      setpopoverOpen(false)
    }, 500)
  }
  return (
    <TooltipProvider>
      <Popover open={popoverOpen} onOpenChange={setpopoverOpen}>
        <Tooltip
          open={tooltipOpen}
          onOpenChange={setTooltipOpen}
          delayDuration={50}
        >
          <PopoverTrigger asChild>
            <TooltipTrigger asChild>{children}</TooltipTrigger>
          </PopoverTrigger>
          <TooltipContent className="bg-black text-white border border-white/5">
            <p className="font-medium text-xs">{hint}</p>
          </TooltipContent>
        </Tooltip>
        <PopoverContent className="p-0 w-full border-none shadow-none">
          <EmojiPicker onEmojiClick={onSelect} />
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  )
}
