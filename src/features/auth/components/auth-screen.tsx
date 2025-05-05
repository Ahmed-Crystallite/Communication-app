"use client"

import { useState } from "react"
import { SignInFlow } from "../types"
import { SignInCard, SignUpCard } from "./index"

export default function AuthScreen() {
  const [state, setState] = useState<SignInFlow>("signIn")
  return (
    <div className="bg-[#222831] h-screen flex items-center justify-center">
        {state === "signIn" ? <SignInCard setState={setState} /> : <SignUpCard setState={setState} />}
    </div>
  )
}
