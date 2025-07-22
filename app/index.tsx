import React, { useEffect, useState } from "react";
import { ActivityIndicator, Button, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { getAllMessages, getAllParticipants, getInfo, postNewMessage } from "../api/chatApi";
import InputBar from "../components/InputBar";
import MessageList from "../components/MessageList";
import { useChatStore } from "../store/useChatStore";
import { TMessageJSON } from "../types/api";

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
  const myUuid = useChatStore((state) => state.myUuid);

  const [inputText, setInputText] = useState("");

  const initializeChat = async () => {
    setLoading(true);
    setError(null);

    try {
      const info = await getInfo();
      if (!info) {
        setError("Failed to fetch server info.");
        return;
      }

      setSessionInfo(info.sessionUuid, info.apiVersion);

      const [allMessages, allParticipants] = await Promise.all([
        getAllMessages(),
        getAllParticipants(),
      ]);

      addOrUpdateMessages(allMessages);
      addOrUpdateParticipants(allParticipants);
    } catch (e: unknown) {
      console.error("Initialization error:", e);
      setError(`Failed to initialize chat: ${(e instanceof Error ? e.message : String(e))}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeChat();
  }, []);

  const handleSendMessage = async () => {
    if (inputText.trim()) {
      const tempMessage: TMessageJSON = {
        uuid: `client-${Date.now()}`,
        text: inputText.trim(),
        authorUuid: myUuid,
        sentAt: Date.now(),
        updatedAt: Date.now(),
        attachments: [],
        reactions: [],
      };
      addOrUpdateMessages([tempMessage]);
      setInputText("");

      try {
        const sentMessage = await postNewMessage(tempMessage.text);
        if (sentMessage) {
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