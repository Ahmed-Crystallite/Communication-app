import { useCallback, useMemo, useState } from "react"

import { useMutation } from "convex/react"

import { api } from "../../../../convex/_generated/api"

type ResponseType = string | null

type Options = {
  onSuccess?: (data: ResponseType) => void
  onError?: (error: Error) => void
  onSettled?: () => void
  throwError?: boolean
}

export const useGenerateUploadUrl = () => {
  const [data, setData] = useState<ResponseType>(null)
  const [error, setError] = useState<Error | null>(null)
  const [status, setStatus] = useState<
    "success" | "error" | "settled" | "pending" | null
  >(null)

  const isPending = useMemo(() => status === "pending", [status])
  const isSuccess = useMemo(() => status === "success", [status])
  const isError = useMemo(() => status === "error", [status])
  const isSettled = useMemo(() => status === "settled", [status])

  // const [isPending, setIsPending] = useState(false)
  //   const [isSuccess, setIsSuccess] = useState(false)
  //   const [isError, setIsError] = useState(false)
  //   const [isSettled, setIsSettled] = useState(false)

  const generateUploadUrl = useMutation(api.upload.generateUploadUrl)

  const mutate = useCallback(
    async (_args: Record<string, never>, options?: Options) => {
      try {
        setData(null)
        setError(null)
        setStatus("pending")

        const uploadUrl = await generateUploadUrl()
        setData(uploadUrl)
        setStatus("success")
        options?.onSuccess?.(uploadUrl)
        return uploadUrl
      } catch (error) {
        setStatus("error")
        setError(error as Error)
        options?.onError?.(error as Error)
        if (options?.throwError) {
          throw error
        }
        return null
      } finally {
        setStatus("settled")
        options?.onSettled?.()
      }
    },
    [generateUploadUrl]
  )

  return {
    mutate,
    data,
    error,
    isPending,
    isSuccess,
    isError,
    isSettled,
  }
}
