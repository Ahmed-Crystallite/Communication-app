import GitHub from "@auth/core/providers/github"
import Google from "@auth/core/providers/google"
import { convexAuth } from "@convex-dev/auth/server"
import { Password } from "@convex-dev/auth/providers/Password"
import { DataModel } from "./_generated/dataModel"

const CustomPassword = Password<DataModel>({
  profile(params) {
    return {
      email: params.email as string,
      name: params.name as string,
    }
  },
})

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    CustomPassword,
    // GitHub now sends an `iss` param in the OAuth callback (RFC 9207);
    // @auth/core 0.37 rejects it unless the issuer is declared.
    GitHub({ issuer: "https://github.com/login/oauth" }),
    Google,
  ],
})
