import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useEffect } from "react";
import { useAuthActions } from "@convex-dev/auth/react";

export const useOnlineStatus = () => {
  const workspaceId = useWorkspaceId();
  const { data: currentMember } = workspaceId 
    ? useCurrentMember({ workspaceId }) 
    : { data: undefined };
  const updateStatus = useMutation(api.online_status.updateStatus);
  const status = useQuery(
    api.online_status.getStatus,
    currentMember?._id ? { memberId: currentMember._id } : "skip"
  );
  const { signOut } = useAuthActions();

  // Update status when component mounts and unmounts
  useEffect(() => {
    if (!workspaceId || !currentMember?._id) return;

    // Set online when component mounts
    updateStatus({ workspaceId, isOnline: true });

    // Set offline when component unmounts
    return () => {
      updateStatus({ workspaceId, isOnline: false });
    };
  }, [workspaceId, currentMember?._id, updateStatus]);

  // Also update status periodically to keep it fresh
  useEffect(() => {
    if (!workspaceId || !currentMember?._id) return;

    const interval = setInterval(() => {
      updateStatus({ workspaceId, isOnline: true });
    }, 30 * 1000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [workspaceId, currentMember?._id, updateStatus]);

  // Handle logout
  useEffect(() => {
    const handleLogout = () => {
      if (workspaceId && currentMember?._id) {
        updateStatus({ workspaceId, isOnline: false });
      }
    };

    // Add event listener for beforeunload to handle browser/tab close
    window.addEventListener('beforeunload', handleLogout);

    // Add event listener for visibility change to handle tab switching
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden' && workspaceId && currentMember?._id) {
        updateStatus({ workspaceId, isOnline: false });
      } else if (document.visibilityState === 'visible' && workspaceId && currentMember?._id) {
        updateStatus({ workspaceId, isOnline: true });
      }
    });

    return () => {
      window.removeEventListener('beforeunload', handleLogout);
      document.removeEventListener('visibilitychange', handleLogout);
    };
  }, [workspaceId, currentMember?._id, updateStatus]);

  return status;
};
