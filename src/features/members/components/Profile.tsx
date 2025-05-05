import { Button } from "@/components/ui/Button"
import { Id } from "../../../../convex/_generated/dataModel"
import { useGetMember } from "../api/use-get-member"
import {
  AlertTriangle,
  ChevronDownIcon,
  Loader2,
  MailIcon,
  XIcon,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { Separator } from "@/components/ui/Separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/DropdownMenu"

import Link from "next/link"
import { useUpdateMember } from "../api/use-update-member"
import { useRemoveMember } from "../api/use-remove-member"
import { useCurrentMember } from "../api/use-current-member"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { toast } from "sonner"
import { useConfirm } from "@/hooks/use-confirm"
import { useRouter } from "next/navigation"

interface ProfileProps {
  memberId: Id<"members">
  onClose: () => void
}

export const Profile = ({ memberId, onClose }: ProfileProps) => {
  const router = useRouter()

  const workspaceId = useWorkspaceId()

  const [LeaveDialog, confirmLeave] = useConfirm(
    "Leave Workspace",
    "Are you sure you want to leave this workspace?"
  )
  const [RemoveDialog, confirmRemove] = useConfirm(
    "Remove Member",
    "Are you sure you want to remove this member?"
  )
  const [UpdateRoleDialog, confirmUpdateRole] = useConfirm(
    "Update Role",
    "Are you sure you want to update this member's role?"
  )

  const { data: currentMember, isLoading: isCurrentMemberLoading } =
    useCurrentMember({ workspaceId })

  const { data: member, isLoading: isMemberLoading } = useGetMember({
    id: memberId,
  })
  const { mutate: updateMember } = useUpdateMember()
  const { mutate: removeMember } = useRemoveMember()

  const onRemove = async () => {
    const ok = await confirmRemove("Are you sure you want to remove this member?")
    if (!ok) return

    removeMember(
      { id: memberId },
      {
        onSuccess: () => {
          toast.success("Member removed successfully")
          onClose()
        },
        onError: () => {
          toast.error("Failed to remove member")
        },
      }
    )
  }

  const onUpdateRole = async (role: "admin" | "member") => {
    const ok = await confirmUpdateRole("Are you sure you want to update this member's role?")
    if (!ok) return
    updateMember(
      { id: memberId, role },
      {
        onSuccess: () => {
          toast.success("Role updated successfully")
        },
        onError: () => {
          toast.error("Failed to update role")
        },
      }
    )
  }

  const onLeave = async () => {
    const ok = await confirmLeave("Are you sure you want to leave this workspace?")
    if (!ok) return
    removeMember(
      { id: memberId },
      {
        onSuccess: () => {
          router.replace("/")
          toast.success("You have left the workspace")
          onClose()
        },
        onError: () => {
          toast.error("Failed to leave workspace")
        },
      }
    )
  }

  if (isMemberLoading || isCurrentMemberLoading) {
    return (
      <div className="h-full flex flex-col">
        <div className="h-[49px] flex justify-between items-center px-4 border-b">
          <p className="text-xl font-bold leading-tight">Profile</p>
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
  if (!member) {
    return (
      <div className="h-full flex flex-col">
        <div className="h-[49px] flex justify-between items-center px-4 border-b">
          <p className="text-xl font-bold leading-tight">Profile</p>
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

  const avatarFallback = member?.user.name?.charAt(0).toUpperCase() ?? "M"

  return (
    <>
      <RemoveDialog />
      <LeaveDialog />
      <UpdateRoleDialog />
      <div className="h-full flex flex-col">
        <div className="h-[49px] flex justify-between items-center px-4 border-b">
          <p className="text-xl font-bold leading-tight">Profile</p>
          <Button variant="ghost" size="iconSm" onClick={onClose}>
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex flex-col p-4 items-center justify-center">
          <Avatar className="max-w-[256px] max-h-[256px] size-full">
            <AvatarImage src={member.user.image} />
            <AvatarFallback className="bg-sky-600 h-full aspect-square text-white text-6xl">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col p-4">
          <p className="text-xl font-bold leading-tight">{member.user.name}</p>
          {currentMember?.role === "admin" && currentMember._id !== memberId ? (
            <div className="flex items-center gap-2 mt-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full capitalize">
                {member.role} <ChevronDownIcon className="size-4 ml-2" />
              </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  <DropdownMenuRadioGroup value={member.role} onValueChange={(role) => onUpdateRole(role as "admin" | "member")}>
                    <DropdownMenuRadioItem value="admin">Admin</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="member">Member</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button onClick={onRemove} variant="outline" className="w-full">
                Remove
              </Button>
            </div>
          ) : currentMember?._id === memberId &&
            currentMember.role !== "admin" ? (
            <div className="mt-4">
              <Button onClick={onLeave} variant="outline" className="w-full">
                Leave
              </Button>
            </div>
          ) : null}
        </div>
        <Separator />
        <div className="flex flex-col p-4">
          <p className="text-sm text-[#737373] font-bold mb-4">
            Contact Information
          </p>
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-md bg-[#f5f5f5] flex items-center justify-center gap-2">
              <MailIcon className="size-4" />
            </div>
            <div className="flex flex-col">
              <p className="text-[13px] font-semibold text-[#737373]">
                Email Address
              </p>
              <Link
                href={`mailto:${member.user.email}`}
                className="text-sm text-[#1264a3] hover:underline"
              >
                {member.user.email}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
