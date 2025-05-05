import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useEffect } from "react";

export const useOnlineStatus = () => {
  const workspaceId = useWorkspaceId();
  const { data: currentMember } = useCurrentMember({ workspaceId });
  const updateStatus = useMutation(api.online_status.updateStatus);
  const status = useQuery(api.online_status.getStatus, !currentMember?._id ? "skip" : { memberId: currentMember._id });

  useEffect(() => {
    if (!currentMember || !workspaceId) return;

    const updateOnlineStatus = async () => {
      await updateStatus({ workspaceId, isOnline: true });
    };

    updateOnlineStatus();

    const interval = setInterval(updateOnlineStatus, 30000);

    return () => {
      clearInterval(interval);
      updateStatus({ workspaceId, isOnline: false });
    };
  }, [currentMember, workspaceId, updateStatus]);

  return {
    isOnline: status?.isOnline ?? false
  };
};
