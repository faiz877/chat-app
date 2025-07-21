import { API_BASE_URL } from "../constants";
import { TInfoJSON, TMessageJSON, TParticipant } from "../types/api";


//Fetches server info, including session UUID and API version
export const getInfo = async (): Promise<TInfoJSON | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/info`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: TInfoJSON = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching info:", error);
    return null;
  }
};

//Fetches all messages from the server
export const getAllMessages = async (): Promise<
  TMessageJSON[]
> => {
  try {
    const response = await fetch(`${API_BASE_URL}/messages/all`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: TMessageJSON[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching all messages:", error);
    return [];
  }
};

//Fetches the latest 25 messages from the server
export const getLatestMessages = async (): Promise<
  TMessageJSON[]
> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/messages/latest`,
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: TMessageJSON[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching latest messages:", error);
    return [];
  }
};

//Fetches 25 older messages before a specific reference message UUID
export const getOlderMessages = async (
  refMessageUuid: string,
): Promise<TMessageJSON[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/messages/older/${refMessageUuid}`,
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: TMessageJSON[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching older messages:", error);
    return [];
  }
};

//Fetches messages updated after a specific timestamp
export const getMessagesUpdates = async (
  time: number,
): Promise<TMessageJSON[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/messages/updates/${time}`,
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: TMessageJSON[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching message updates:", error);
    return [];
  }
};

//Posts a new message to the server
export const postNewMessage = async (
  text: string,
): Promise<TMessageJSON | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/messages/new`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: TMessageJSON = await response.json();
    return data;
  } catch (error) {
    console.error("Error posting new message:", error);
    return null;
  }
};

//Fetches all participants
export const getAllParticipants = async (): Promise<
  TParticipant[]
> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/participants/all`,
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: TParticipant[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching all participants:", error);
    return [];
  }
};

//Fetches participants updated after a specific timestamp
export const getParticipantsUpdates = async (
  time: number,
): Promise<TParticipant[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/participants/updates/${time}`,
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: TParticipant[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching participant updates:", error);
    return [];
  }
};