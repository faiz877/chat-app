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
    try {
      const info = await getInfo();
      if (!info) {
        console.error("Polling error: Failed to fetch server info.");
        setError("Polling failed: Could not get server info.");
        return;
      }

      setSessionInfo(info.sessionUuid, info.apiVersion);

      if (sessionUuid === info.sessionUuid || sessionUuid === null) {
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
      } else {
        console.log("Polling skipped this cycle: Session UUID changed, expecting full re-initialization from ChatScreen.");
      }
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

    pollForUpdates();
    intervalRef.current = setInterval(pollForUpdates, POLLING_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [pollForUpdates]);
};