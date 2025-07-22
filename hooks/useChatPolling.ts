import { useCallback, useEffect, useRef } from 'react';
import { getInfo, getMessagesUpdates, getParticipantsUpdates } from '../api/chatApi';
import { useChatStore } from '../store/useChatStore';

const POLLING_INTERVAL = 5000;

export const useChatPolling = () => {
  const {
    sessionUuid,
    lastFetchTime,
    setSessionInfo,
    addOrUpdateMessages,
    addOrUpdateParticipants,
    setLastFetchTime,
    setError,
  } = useChatStore();

  const intervalRef = useRef<number | null>(null);

  const pollForUpdates = useCallback(async () => {
    if (!sessionUuid || lastFetchTime === 0) {
      console.log("Polling: Waiting for initial setup from ChatScreen to complete.");
      return;
    }

    try {
      const info = await getInfo();
      if (!info) {
        console.error("Polling error: Failed to fetch server info.");
        setError("Polling failed: Could not get server info.");
        return;
      }

      if (sessionUuid !== info.sessionUuid) {
        console.warn("Polling detected Session UUID change. Store will reset. Skipping current poll updates.");
        setSessionInfo(info.sessionUuid, info.apiVersion);
        return;
      }

      // Proceed with fetching updates only if no session change detected
      const newMessages = await getMessagesUpdates(lastFetchTime);
      if (newMessages.length > 0) {
        addOrUpdateMessages(newMessages);
      }

      const newParticipants = await getParticipantsUpdates(lastFetchTime);
      if (newParticipants.length > 0) {
        addOrUpdateParticipants(newParticipants);
      }

      setLastFetchTime(Date.now());
      setError(null);
    } catch (e: unknown) {
      console.error("Polling cycle failed:", e);
      setError(`Polling failed: ${(e instanceof Error ? e.message : String(e))}`);
    }
  }, [
    sessionUuid,
    lastFetchTime,
    setSessionInfo,
    addOrUpdateMessages,
    addOrUpdateParticipants,
    setLastFetchTime,
    setError,
  ]);


  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(pollForUpdates, POLLING_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [pollForUpdates]);
};