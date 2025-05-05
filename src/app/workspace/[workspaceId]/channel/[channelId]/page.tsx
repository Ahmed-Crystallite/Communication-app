"use client"

import { ChatInput, Header } from "@/app/workspace/components"
import { MessageList } from "@/components/MessageList"
import { useGetChannel } from "@/features/channels/api/use-get-channel"
import { UseGetMessages } from "@/features/messages/api/use-get-messages"
import { useChannelId } from "@/hooks/use-channel-id"
import { Loader2, TriangleAlert } from "lucide-react"

const ChannelIdPage = () => {
  const channelId = useChannelId()

  const { results, status, loadMore } = UseGetMessages({ channelId })

  const { data: channel, isLoading: channelLoading } = useGetChannel({
    id: channelId,
  })

  if (channelLoading || status === "LoadingFirstPage") {
    return (
      <div className="h-full flex-1 flex items-center justify-center">
        <Loader2 className="size-5 animate-spin text-[#737373]" />
      </div>
    )
  }
  if (!channel) {
    return (
      <div className="h-full flex-1 flex flex-col gap-y-2 items-center justify-center">
        <TriangleAlert className="size-5 text-[#737373]" />
        <span className="text-sm text-[#737373]">Channel Not Found</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <Header title={channel.name} />
      <MessageList
        channelName={channel.name}
        channelCreationTime={channel._creationTime}
        data={results}
        loadMore={loadMore}
        isLoadingMore={status === "LoadingMore"}
        canLoadMore={status === "CanLoadMore"}
      />
      <ChatInput placeholder={`Message # ${channel.name}`} />
    </div>
  )
}

export default ChannelIdPage
