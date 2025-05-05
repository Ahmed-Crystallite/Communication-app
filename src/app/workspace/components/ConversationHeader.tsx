import { Button } from "@/components/ui/Button"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { FaChevronDown } from "react-icons/fa"

interface HeaderProps {
  memberName?: string
  memberImage?: string
  onClick?: () => void
}

export default function Header({
  memberName = "Member",
  memberImage,
  onClick,
}: HeaderProps) {
  const avatarFallback = memberName.charAt(0).toUpperCase()
  return (
    <div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
      <Button
        variant="ghost"
        size="sm"
        className="text-lg font-semibold px-2 overflow-hidden w-auto"
        onClick={onClick}
      >
        <Avatar className="size-6 mr-2">
          <AvatarImage src={memberImage} />
          <AvatarFallback className="bg-sky-600 text-white rounded-md text-sm">{avatarFallback}</AvatarFallback>
        </Avatar>
        <span className="truncate">{memberName}</span>
        <FaChevronDown className="size-2.5 ml-2" />
      </Button>
    </div>
  )
}
