import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"

interface ConversationHeroProps {
  name?: string
  image?: string
  isCurrentUser?: boolean
}
export const ConversationHero = ({
  name = "Member",
  image,
  isCurrentUser = false,
}: ConversationHeroProps) => {
  const avatarFallback = name.charAt(0).toUpperCase()
  return (
    <div className=" mt-[88px] mx-5 mb-4">
      <div className="flex items-center gap-x-1 mb-4">
        <Avatar className="size-14 rounded-md mr-2">
          <AvatarImage src={image} />
          <AvatarFallback className="bg-sky-600 text-white rounded-md text-xl">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
        <p className="text-2xl font-bold flex items-center mb-2">{name}</p>
      </div>
      <p className="text-base leading-normal font-normal text-slate-800 mb-4">
        {isCurrentUser ? (
          <>
            <strong>This is your space.</strong> Draft messages, make to-do
            lists or keep links and files to hand. You can also talk to yourself
            here, but please bear in mind you’ll have to provide both sides of
            the conversation.
          </>
        ) : (
          <>
            This conversation is just between you and <strong>{name}</strong>.
            Take a look at their profile to learn more about them.
          </>
        )}
      </p>
    </div>
  )
}
