import { useCallback, useEffect, useRef } from 'react';
import { getInfo, getMessagesUpdates, getParticipantsUpdates } from '../api/chatApi';
import { useChatStore } from '../store/useChatStore';

// How long I want to check for new messages and participant updates from the server.
// Right now, I've set it to 5 seconds.
const POLLING_INTERVAL = 5000;

// This is a custom hook that's responsible for keeping my chat data real-time.
// It basically runs in the background, constantly asking the server for what's new.
export const useChatPolling = () => {
  // Pulling out the pieces of state and actions I need from my Zustand store.
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

  // This is the core function that actually goes out and fetches updates.
  // I wrap it in useCallback so it doesn't get re-created unnecessarily on every render,
  const pollForUpdates = useCallback(async () => {
    // If my app hasn't fully initialized its session data yet (sessionUuid is null or lastFetchTime is 0),
    // I don't want to make API calls yet.
    if (!sessionUuid || lastFetchTime === 0) {
      console.log("Polling: Waiting for initial setup from ChatScreen to complete.");
      return;
    }

    try {
      // First, I check the server's general info, especially its session UUID.
      // This is how I detect if the mock server has restarted and wiped its data.
      const info = await getInfo();
      if (!info) {
        console.error("Polling error: Failed to fetch server info.");
        setError("Polling failed: Could not get server info.");
        return;
      }

      // If the server's session UUID is different from what I have, it means the server reset.
      // In that case, I tell my store to reset all local data. I then skip the rest of this
      // polling cycle because the main ChatScreen will handle re-fetching all the fresh data.
      if (sessionUuid !== info.sessionUuid) {
        console.warn("Polling detected Session UUID change. Store will reset. Skipping current poll updates.");
        setSessionInfo(info.sessionUuid, info.apiVersion);
        return; // Exit the polling cycle if we can't get info
      }

      // If the session UUID hasn't changed, I proceed to fetch only the updates.
      // I use lastFetchTime to tell the server to only send me messages/participants that have changed since my last successful fetch.
      const newMessages = await getMessagesUpdates(lastFetchTime);
      if (newMessages.length > 0) {
        // Add these new/updated messages to the store.
        addOrUpdateMessages(newMessages);
      }

      const newParticipants = await getParticipantsUpdates(lastFetchTime);
      if (newParticipants.length > 0) {
        // Add/update participants too.
        addOrUpdateParticipants(newParticipants);
      }

      // If everything went well, I update my lastFetchTime to 'now'.
      // This ensures the next poll will look for updates from this very moment.
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


  // This useEffect sets up the polling interval. It runs when the component mounts.
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(pollForUpdates, POLLING_INTERVAL);

    // This is the cleanup function, it runs when the component unmounts
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [pollForUpdates]);
};