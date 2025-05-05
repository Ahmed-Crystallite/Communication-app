import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"
import { IconType } from "react-icons/lib"

interface SidebarButtonProps {
  icon: LucideIcon | IconType
  label: string
  isActive?: boolean
}

export default function SidebarButton({
  icon: Icon,
  label,
  isActive,
}: SidebarButtonProps) {
  return (
    <div className="flex flex-col justify-center items-center gap-y-0.5 cursor-pointer group">
      <Button
        variant="transparent"
        className={cn(
          "size-9 p-2 group-hover:bg-[rgba(210_40%_96.1%_0.2)]",
          isActive && "bg-[#D254CA40]"
        )}
      >
        <Icon className="size-5 text-white group-hover:scale-110 transition-all duration-500" />
      </Button>
      <span className="text-[11px] text-white group-hover:text-[rgb(210_40%_96.1%)]">
        {label}
      </span>
    </div>
  )
}
