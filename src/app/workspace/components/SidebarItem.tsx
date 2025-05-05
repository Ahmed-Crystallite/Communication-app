import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { LucideIcon } from "lucide-react"
import { IconType } from "react-icons/lib"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const SidebarItemVariants = cva(
  "flex items-center gap-1.5 justify-start font-normal h-7 px-[18px] text-sm overflow-hidden",
  {
    variants: {
      variant: {
        default: "text-[#f9edffcc]",
        active: "text-[#481349] bg-white/90 hover:bg-white/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface SidebarItemProps {
  label: string
  id: string
  icon: LucideIcon | IconType
  variant?: VariantProps<typeof SidebarItemVariants>["variant"]
}
export default function SidebarItem({
  label,
  id,
  icon: Icon,
  variant,
}: SidebarItemProps) {
  const workspaceId = useWorkspaceId()
  return (
    <Button
      asChild
      variant="transparent"
      size="sm"
      className={cn(SidebarItemVariants({ variant }))}
    >
      <Link href={`/workspace/${workspaceId}/channel/${id}`}>
        <Icon className="mr-1 shrink-0" />
        <span className="inline-block text-sm truncate leading-tight font-normal">
          {label}
        </span>
      </Link>
    </Button>
  )
}
