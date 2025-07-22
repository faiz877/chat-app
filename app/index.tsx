import React, { useEffect } from "react";
import { ActivityIndicator, Button, FlatList, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";
import { getAllMessages, getAllParticipants, getInfo } from "../api/chatApi";
import { useChatStore } from "../store/useChatStore";
import { TMessageJSON, TParticipant } from "../types/api";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  invertedFlatList: {
    paddingVertical: 10, 
    justifyContent: "flex-end",
  },
  messageItem: {
    backgroundColor: "#ffffff",
    padding: 10,
    marginVertical: 4,
    marginHorizontal: 10,
    borderRadius: 8,
    maxWidth: "80%",
    alignSelf: "flex-start",
  },
  messageSender: {
    fontWeight: "bold",
    marginBottom: 2,
  },
  messageText: {
    fontSize: 16,
  },
  messageTime: {
    fontSize: 10,
    color: "#666",
    marginTop: 5,
    alignSelf: "flex-end",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    backgroundColor: "#ffffff",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    minHeight: 40,
    maxHeight: 120,
  },
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

  const [inputText, setInputText] = React.useState("");

  const initializeChat = async () => {
    setLoading(true); 
    setError(null);

    try {
      //Get server info
      const info = await getInfo();
      if (!info) {
        setError("Failed to fetch server info.");
        return;
      }

      //Update session info in store
      setSessionInfo(info.sessionUuid, info.apiVersion);

      //Fetch all messages and participants concurrently
      const [allMessages, allParticipants] = await Promise.all([
        getAllMessages(),
        getAllParticipants(),
      ]);

      //Populate the store with fetched data
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

  const handleSendMessage = () => {
    if (inputText.trim()) {
      console.log("Sending message:", inputText);
      setInputText("");
    }
  };

  // Helper function to find a participant's name by their UUID
  const getParticipantName = (uuid: string) => {
    const participant = participants.find((p: TParticipant) => p.uuid === uuid);
    return participant ? participant.name : "Unknown User";
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading chat...</Text>
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
      <FlatList<TMessageJSON> 
        data={messages}
        keyExtractor={(item: TMessageJSON) => item.uuid} 
        renderItem={({ item }: { item: TMessageJSON }) => (
          <View style={styles.messageItem}>
            <Text style={styles.messageSender}>
              {getParticipantName(item.authorUuid)}
            </Text>
            <Text style={styles.messageText}>{item.text}</Text>
            <Text style={styles.messageTime}>
              {new Date(item.sentAt).toLocaleTimeString()}
            </Text>
          </View>
        )}
        inverted
        contentContainerStyle={styles.invertedFlatList}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={inputText}
          onChangeText={setInputText}
          multiline
        />
        <Button title="Send" onPress={handleSendMessage} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;