import React, { useEffect, useState } from "react";
import { ActivityIndicator, Button, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { getAllMessages, getAllParticipants, getInfo, postNewMessage } from "../api/chatApi";
import InputBar from "../components/InputBar";
import MessageList from "../components/MessageList";
import { useChatPolling } from "../hooks/useChatPolling";
import { useChatStore } from "../store/useChatStore";
import { TMessageJSON } from "../types/api";

// All the styles for my chat screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000000",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  }
});


const ChatScreen = () => {
  // Pulling out all the important data and functions from our central Zustand store.
  // This is how my UI gets the messages, participants, and controls loading states.
  const messages = useChatStore((state) => state.messages);
  const participants = useChatStore((state) => state.participants);
  const isLoading = useChatStore((state) => state.isLoading);
  const error = useChatStore((state) => state.error);
  const setSessionInfo = useChatStore((state) => state.setSessionInfo);
  const setLoading = useChatStore((state) => state.setLoading);
  const setError = useChatStore((state) => state.setError);
  const addOrUpdateMessages = useChatStore(
    (state) => state.addOrUpdateMessages,
  );
  const addOrUpdateParticipants = useChatStore(
    (state) => state.addOrUpdateParticipants,
  );
  const setLastFetchTime = useChatStore((state) => state.setLastFetchTime);
  const myUuid = useChatStore((state) => state.myUuid);

  const [inputText, setInputText] = useState("");

  // This line is what kicks off the background polling.
  // It constantly checks the server for new messages and participants.
  useChatPolling();

  // This function is what gets all the initial chat data when the app starts or refreshes.
  // It handles everything from server info to getting all messages and participants.
  const initializeChat = async () => {
    setLoading(true);
    setError(null);

    try {
      // First, get the server's session info. This tells me if the server's data has reset.
      const info = await getInfo();
      if (!info) {
        setError("Failed to fetch server info.");
        return;
      }

      // Pass the session info to the store. The store knows if the session UUID changed,
      // And if it did, it wipes my local data to stay in sync with the server.
      setSessionInfo(info.sessionUuid, info.apiVersion);

      // This will fetch all the messages and participants at once to fill up the chat.
      const [allMessages, allParticipants] = await Promise.all([
        getAllMessages(),
        getAllParticipants(),
      ]);

      // Add all these initial messages and participants to my Zustand store.
      // The store handles adding new ones or updating existing ones.
      addOrUpdateMessages(allMessages);
      addOrUpdateParticipants(allParticipants);
      setLastFetchTime(Date.now());
    } catch (e: unknown) {
      console.error("Initialization error:", e);
      setError(`Failed to initialize chat: ${(e instanceof Error ? e.message : String(e))}`);
    } finally {
      setLoading(false);
    }
  };

  // This runs 'initializeChat' only once when my ChatScreen component first loads.
  useEffect(() => {
    initializeChat();
  }, []);

  const handleSendMessage = async () => {
    if (inputText.trim()) {
      // This immediately shows my message on screen, so it feels instant.
      const tempMessage: TMessageJSON = {
        uuid: `client-${Date.now()}`,
        text: inputText.trim(),
        authorUuid: myUuid,
        sentAt: Date.now(),
        updatedAt: Date.now(),
        attachments: [],
        reactions: [],
      };
      // Add it to the UI right away
      addOrUpdateMessages([tempMessage]);
      setInputText("");

      try {
        // Now, actually send the message to the server.
        const sentMessage = await postNewMessage(tempMessage.text);
        if (sentMessage) {
          // If the server confirms, I update my store with the official message.
          addOrUpdateMessages([sentMessage]);
        } else {
          setError("Failed to send message.");
        }
      } catch (e: unknown) {
        console.error("Error sending message:", e);
        setError(`Failed to send message: ${(e instanceof Error ? e.message : String(e))}`);
      }
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" /> 
        <Text style={{ color: "#FFFFFF" }}>Loading chat...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <Button title="Retry" onPress={initializeChat} />
      </View>
    );
  }

  // This is the main chat interface
  return (
    <SafeAreaView style={styles.container}>
      <MessageList
        messages={messages}
        participants={participants}
        myUuid={myUuid}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
        style={{ width: '100%' }}
      >
        <InputBar
          inputText={inputText}
          onChangeText={setInputText}
          onSendMessage={handleSendMessage}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;