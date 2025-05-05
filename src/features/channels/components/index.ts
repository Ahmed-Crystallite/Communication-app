import dynamic from "next/dynamic"

const CreateChannelModal = dynamic(() => import("./CreateChannelModal"))

export {CreateChannelModal}