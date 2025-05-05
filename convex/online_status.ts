import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { auth } from "./auth"

export const updateStatus = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    isOnline: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx)
    if (!userId) throw new Error("Unauthorized")

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique()

    if (!member) throw new Error("Member not found")

    const existingStatus = await ctx.db
      .query("onlineStatus")
      .withIndex("by_member_id", (q) => q.eq("memberId", member._id))
      .unique()

    if (existingStatus) {
      await ctx.db.patch(existingStatus._id, {
        isOnline: args.isOnline,
        lastSeen: Date.now(),
      })
    } else {
      await ctx.db.insert("onlineStatus", {
        memberId: member._id,
        workspaceId: args.workspaceId,
        isOnline: args.isOnline,
        lastSeen: Date.now(),
      })
    }
  },
})

export const getStatus = query({
  args: { memberId: v.id("members") },
  handler: async (ctx, args) => {
    const status = await ctx.db
      .query("onlineStatus")
      .withIndex("by_member_id", (q) => q.eq("memberId", args.memberId))
      .unique()

    if (!status) return null

    // Consider user online only if they are marked as online AND were last seen within 30 seconds
    const isOnline = status.isOnline && Date.now() - status.lastSeen < 30 * 1000
    return { isOnline, lastSeen: status.lastSeen }
  },
}) 