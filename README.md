# Chat-App

Chat-App is a cross-platform (iOS/Android) single-room chat application built with React Native. It aims to provide a focused, real-time messaging experience for a single shared conversation.

## Features

This project implements the following features :

-   **Core Chat Functionality**: Displays messages with sender info, timestamps, and an input bar.
-   **Real-time Updates**: Fetches new messages and participant data from the API via polling.
-   **Offline Support**: Persists chat data locally for offline access.
-   **Optimized UI**: Grouped consecutive messages, image attachments.
-   **Interactive Elements**: Displays reactions, shows participant details, and previews images in modals.

## Technologies Used

-   **Framework**: React Native
-   **Development Tools**: Expo
-   **State Management**: Zustand
-   **Data Persistence**: `@react-native-async-storage/async-storage`

## Setup & Run

1.  **Clone the repository:**
    ```bash
    git clone [your-repo-link]
    cd chat-app
    ```
2.  **Install dependencies:**
    ```bash
    npm install # or yarn install
    ```
3.  **Run the application:**
    ```bash
    npm start # or yarn start
    ```
    This will open the Expo Dev Tools in your browser. You can then:
    -   Scan the QR code with the **Expo Go** app on your physical device.
    -   Select "Run on Android emulator" or "Run on iOS simulator".
