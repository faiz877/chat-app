import AsyncStorage from "@react-native-async-storage/async-storage";
import { produce } from "immer";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { TMessageJSON, TParticipant } from "../types/api";

interface ChatState {
  messages: TMessageJSON[];
  participants: TParticipant[];
  sessionUuid: string | null;
  lastFetchTime: number;
  isLoading: boolean;
  error: string | null;
  myUuid: string;
}

interface ChatActions {
  // Replaces all messages with a new array.
  setMessages: (newMessages: TMessageJSON[]) => void;

  // Adds a new message or updates an existing one by UUID.
  addOrUpdateMessage: (message: TMessageJSON) => void;

  // Adds multiple new messages or updates existing ones.
  addOrUpdateMessages: (newMessages: TMessageJSON[]) => void;

  // Replaces all participants with a new array.
  setParticipants: (newParticipants: TParticipant[]) => void;

  // Adds a new participant or updates an existing one by UUID.
  addOrUpdateParticipant: (participant: TParticipant) => void;

  // Adds multiple new participants or updates existing ones.
  addOrUpdateParticipants: (newParticipants: TParticipant[]) => void;

  // Sets server session info, triggering a data reset if UUID changes.
  setSessionInfo: (uuid: string, apiVersion: number) => void;

  // Updates the timestamp of the last successful data fetch.
  setLastFetchTime: (time: number) => void;

  // Sets the loading status of the application.
  setLoading: (loading: boolean) => void;

  // Sets or clears an application-wide error message.
  setError: (errorMessage: string | null) => void;

  // Resets the entire store state to its initial values.
  resetState: () => void;
}

// Initial state for the store
const initialState: ChatState = {
  messages: [],
  participants: [],
  sessionUuid: null,
  lastFetchTime: 0,
  isLoading: false,
  error: null,
  myUuid: "you",
};

export const useChatStore = create<ChatState & ChatActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      setMessages: (newMessages) =>
        set(
          produce((state) => {
            state.messages = newMessages;
          }),
        ),

      addOrUpdateMessage: (message) =>
        set(
          produce((state) => {
            const existingIndex = state.messages.findIndex(
              (msg : TMessageJSON) => msg.uuid === message.uuid,
            );
            if (existingIndex !== -1) {
              state.messages[existingIndex] = message;
            } else {
              state.messages.push(message);
              state.messages.sort((a : TMessageJSON, b : TMessageJSON) => a.sentAt - b.sentAt);
            }
          }),
        ),

      addOrUpdateMessages: (newMessages) =>
        set(
          produce((state) => {
            newMessages.forEach((newMessage) => {
              const existingIndex = state.messages.findIndex(
                (msg : TMessageJSON) => msg.uuid === newMessage.uuid,
              );
              if (existingIndex !== -1) {
                state.messages[existingIndex] = newMessage;
              } else {
                state.messages.push(newMessage);
              }
            });
            state.messages.sort((a : TMessageJSON, b : TMessageJSON) => a.sentAt - b.sentAt);
          }),
        ),

      setParticipants: (newParticipants) =>
        set(
          produce((state) => {
            state.participants = newParticipants;
          }),
        ),

      addOrUpdateParticipant: (participant) =>
        set(
          produce((state) => {
            const existingIndex = state.participants.findIndex(
              (p : TParticipant) => p.uuid === participant.uuid,
            );
            if (existingIndex !== -1) {
              state.participants[existingIndex] = participant;
            } else {
              state.participants.push(participant);
            }
          }),
        ),

      addOrUpdateParticipants: (newParticipants) =>
        set(
          produce((state) => {
            newParticipants.forEach((newParticipant) => {
              const existingIndex = state.participants.findIndex(
                (p : TParticipant) => p.uuid === newParticipant.uuid,
              );
              if (existingIndex !== -1) {
                state.participants[existingIndex] = newParticipant;
              } else {
                state.participants.push(newParticipant);
              }
            });
          }),
        ),

      setSessionInfo: (uuid, apiVersion) =>
        set(
          produce((state) => {
            if (state.sessionUuid !== uuid) {
              console.warn("Session UUID changed! Resetting local data.");
              state.messages = initialState.messages;
              state.participants = initialState.participants;
              state.lastFetchTime = initialState.lastFetchTime;
            }
            state.sessionUuid = uuid;
          }),
        ),

      setLastFetchTime: (time) =>
        set(
          produce((state) => {
            state.lastFetchTime = time;
          }),
        ),

      setLoading: (loading) =>
        set(
          produce((state) => {
            state.isLoading = loading;
          }),
        ),

      setError: (errorMessage) =>
        set(
          produce((state) => {
            state.error = errorMessage;
          }),
        ),

      resetState: () => set(initialState),
    }),
    {
      name: "chat-app-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        messages: state.messages,
        participants: state.participants,
      }),
    },
  ),
);