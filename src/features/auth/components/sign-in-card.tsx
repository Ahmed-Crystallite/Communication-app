"use client"
import { useAuthActions } from "@convex-dev/auth/react"
import { useState } from "react"
import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa"
import { Button } from "@/components/ui/Button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Separator } from "@/components/ui/Separator"
import { SignInFlow } from "../types"
import { TriangleAlert } from "lucide-react"

interface SignInCardProps {
  setState: (state: SignInFlow) => void
}

export default function SignInCard({ setState }: SignInCardProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [pending, setPending] = useState(false)
  const [error, setError] = useState("")

  const { signIn } = useAuthActions()

  const onProviderSignIn = (value: "github" | "google") => {
    setPending(true)
    signIn(value).finally(() => {
      setPending(false)
    })
  }
  const onPasswordSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setPending(true)
    signIn("password", { email, password, flow: "signIn" })
      .catch(() => {
        setError("Invalid Email Or Password")
      })
      .finally(() => {
        setPending(false)
      })
  }

  return (
    <Card className="w-[400px] bg-[#EEEEEE] border-[#EEEEEE] p-8 rounded-lg">
      <CardHeader className="mb-5 pb-0">
        <CardTitle className="pb-0 text-2xl leading-tight mb-2">
          Login To Continue
        </CardTitle>
        <CardDescription className="mb-5 text-base leading-normal">
          Use Your Email Or Anothre Service To Continue
        </CardDescription>
      </CardHeader>
      {!!error && (
        <div className="bg-red-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm leading-tight text-red-500 mb-6">
          <TriangleAlert className="size-4" />
          <p>{error}</p>
        </div>
      )}
      <CardContent className="space-y-5 px-0 pb-0">
        <form onSubmit={onPasswordSignIn} className="space-y-2.5">
          <Input
            disabled={pending}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            required
            className="mb-3"
          />
          <Input
            disabled={pending}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            required
            className="mb-3 "
          />
          <Button
            disabled={pending}
            type="submit"
            size="lg"
            className="w-full !mt-5"
          >
            Continue
          </Button>
          <Separator />
          <div className="flex flex-col gap-y-3.5">
            <Button
              disabled={pending}
              onClick={() => onProviderSignIn("google")}
              variant="outline"
              size="lg"
              className="w-full relative"
            >
              <FcGoogle className="size-5 absolute top-2.5 left-2.5" />
              Continue With Google
            </Button>
            <Button
              disabled={pending}
              onClick={() => onProviderSignIn("github")}
              variant="outline"
              size="lg"
              className="w-full relative"
            >
              <FaGithub className="size-5 absolute top-2.5 left-2.5" />
              Continue With Github
            </Button>
          </div>
          <p className="text-sm text-gray-400">
            Don't have an account?{" "}
            <span
              onClick={() => setState("signUp")}
              className="text-sky-700 hover:underline cursor-pointer"
            >
              Sign up
            </span>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
