import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"

export default function UseCurrentUser() {
  const data = useQuery(api.users.current)
  const isLoading = data === undefined

  return { data, isLoading }
}
