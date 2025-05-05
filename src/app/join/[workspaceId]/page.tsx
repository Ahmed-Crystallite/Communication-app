"use client"
// React
import { useRouter } from "next/navigation"
import { useMemo, useEffect } from "react"
// Next
import Image from "next/image"
// Media
import Logo from "media/logo.webp"
// React Verification Input
import VerificationInput from "react-verification-input"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { UseGetWorkspaceInfo } from "@/features/workspaces/api/use-get-workspace-info"
import { Loader2 } from "lucide-react"
import { useJoin } from "@/features/workspaces/api/use-join"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Id } from "../../../../convex/_generated/dataModel"

export default function JoinPage() {
  const router = useRouter()

  const workspaceId = useWorkspaceId()

  const { mutate, isPending } = useJoin()
  const { data, isLoading } = UseGetWorkspaceInfo({ id: workspaceId as Id<"workspaces"> })
  const isMember = useMemo(() => data?.isMember, [data?.isMember])

  useEffect(() => {
    if (isMember) {
      router.push(`/workspace/${workspaceId}`)
    }
  }, [isMember, router, workspaceId])

  const handleComplete = (value: string) => {
    mutate(
      { workspaceId: workspaceId as Id<"workspaces">, joinCode: value },
      {
        onSuccess: (id) => {
          router.replace(`/workspace/${id}`)
          toast.success("Workspace Joined")
        },
        onError: () => {
          toast.error("Failed To Join Workspace")
        },
      }
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="size-6 animate-spin text-white" />
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col gap-y-8 items-center justify-center bg-black">
      <Image src={Logo} alt="logo" width={200} height={200} />
      <div className="flex flex-col gap-y-4 items-center justify-center max-w-md">
        <div className="flex flex-col items-center text-white justify-center gap-y-2">
          <h1 className="text-3xl font-bold leading-tight">
            Join {data?.name}
          </h1>
          <p className="text-md text-[#737373]">
            Enter The Workspace Code To Join
          </p>
          <VerificationInput
            length={6}
            onComplete={handleComplete}
            classNames={{
              container: cn(
                "flex gap-x-2 my-2",
                isPending && "opacity-50 cursor-not-allowed"
              ),
              character:
                "uppercase h-auto rounded-md border border-gray-300 flex items-center justify-center text-lg font-medium text-gray-500",
              characterInactive: "bg-[oklch(0.97_0_0)]",
              characterSelected: "bg-white text-black",
              characterFilled: "bg-white text-black",
            }}
            autoFocus
          />
        </div>
        <div className="flex gap-x-4">
          <Button size="lg" variant="outline" asChild>
            <Link href="/">Back To Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
