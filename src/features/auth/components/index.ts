import dynamic from "next/dynamic"

// Calling Components Dynamically
const AuthScreen = dynamic(() => import("./auth-screen"))
const SignInCard = dynamic(() => import("./sign-in-card"))
const SignUpCard = dynamic(() => import("./sign-up-card"))
const UserButton = dynamic(() => import("./user-button").then(mod => mod.default))

// Export Components
export { AuthScreen, SignInCard, SignUpCard, UserButton }
