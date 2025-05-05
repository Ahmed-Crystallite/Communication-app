import dynamic from "next/dynamic"

const Toolbar = dynamic(() => import("./Toolbar"))
const Sidebar = dynamic(() => import("./Sidebar"))
const WorkspaceSwitcher = dynamic(() => import("./WorkspaceSwitcher"))
const SidebarButton = dynamic(() => import("./SidebarButton"))
const WorkspaceSidebar = dynamic(() => import("./WorkspaceSidebar"))
const WorkspaceHeader = dynamic(() => import("./WorkspaceHeader"))
const PreferenceModal = dynamic(() => import("./PreferenceModal"))
const SidebarItem = dynamic(() => import("./SidebarItem"))
const WorkspaceSection = dynamic(() => import("./WorkspaceSection"))
const UserItem = dynamic(() => import("./UserItem"))
const InviteModal = dynamic(() => import("./InviteModal"))
const Header = dynamic(() => import("./Header"))
const ChatInput = dynamic(() => import("./ChatInput"))
const Conversation = dynamic(() => import("./Conversation"))
const ConversationHeader = dynamic(() => import("./ConversationHeader"))
const ConversationChatInput = dynamic(() => import("./ConversationChatInput"))

export {
  Toolbar,
  Sidebar,
  WorkspaceSwitcher,
  SidebarButton,
  WorkspaceSidebar,
  WorkspaceHeader,
  PreferenceModal,
  SidebarItem,
  WorkspaceSection,
  UserItem,
  InviteModal,
  Header,
  ChatInput,
  Conversation,
  ConversationHeader,
  ConversationChatInput,
}
