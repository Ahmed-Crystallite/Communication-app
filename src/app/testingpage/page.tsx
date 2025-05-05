"use client"
// Next
import Image from "next/image"
// Media
import Logo from "media/logo.webp"
import Banner from "media/banner2.jpg"
import Link from "next/link"
import { useEffect, useState } from "react"
const TestingPage = () => {
  const [openIndex, setOpenIndex] = useState(false)

  useEffect(() => {
    if (openIndex) {
      document.body.classList.add("overflow-hidden")
    } else {
      document.body.classList.remove("overflow-hidden")
    }
  }, [openIndex])
  return (
    <main>
      <header className="bg-black py-8">
        <div className="container">
          <nav className="flex flex-wrap items-center sm:justify-between justify-center">
            <Image src={Logo} alt="logo" width={150} height={150} />
            <Link
              className="sm:block hidden bg-white text-black sm:px-5 px-4 py-2 rounded-[0_10px_0_0] sm:text-base text-sm leading-tight font-medium transition-all ease-in-out duration-300 hover:bg-white/90 hover:rounded-[10px]"
              href="/auth"
            >
              Let's Go Back To Chat
            </Link>
          </nav>
        </div>
      </header>
      <section>
        <div className="relative bg-black/50 z-10 py-[250px] sm:h-[calc(100vh-104px)] h-[calc(100vh-87px)] flex flex-col items-center justify-center">
          <Image
            src={Banner}
            alt="banner"
            priority
            className="absolute -z-10 object-cover object-top w-full h-full inset-0"
          />
          <span className="bg-black/50 absolute -z-10 object-cover object-top w-full h-full inset-0" />
          <div className="container">
            <div className="text-white max-w-[800px]">
              <span className="block md:text-[30px] text-[20px] leading-tight font-semibold">
                Welcome To Dark Chat
              </span>
              <h1 className="md:text-[50px] sm:text-[30px] text-[24px] leading-tight font-bold sm:my-4 my-2.5">
                Connect, Chat, and Share – Anytime, Anywhere!
              </h1>
              <p className="md:text-lg sm:text-base text-sm font-normal leading-normal mb-3">
                Unlock the Power of Seamless Collaboration: Connect Across
                Multiple Workspaces, Join Your Dynamic Team, and Elevate
                Productivity with Fully Encrypted, Ultra-Secure Communication
                for Uninterrupted Workflows.
              </p>
              <p className="md:text-lg sm:text-base text-sm font-normal leading-normal">
                We adds a stronger emphasis on innovation,
                productivity, and security while maintaining a professional
                tone.
              </p>
              <Link
                className="sm:hidden block bg-white w-max mt-3 text-black px-8 py-3 rounded-[0_10px_0_0] sm:text-base text-sm leading-tight font-medium transition-all ease-in-out duration-300 hover:bg-white/90 hover:rounded-[10px]"
                href="/auth"
              >
                Let's Go Back To Chat
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default TestingPage
