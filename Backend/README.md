# My-Chat

## Authentication

- Same as before
- New - Use of changable avatar images in signup function

### `sendMessage` Function (Controller)

This function is designed to allow a user to send a message to another user. It involves managing conversations between participants and saving the message details in a MongoDB database. Here's a breakdown:

#### 1. **Extracting the Message and User IDs**

- The message content is retrieved from the request body (`req.body.message`).
- The `receiverId` is extracted from the URL parameters (`req.params.id`), which identifies the user receiving the message.
- The `senderId` is pulled from the `req.user._id`, assuming the user sending the message is authenticated.

#### 2. **Finding or Creating a Conversation**

- The system checks for an existing conversation between the two participants (`senderId` and `receiverId`) using `Conversation.findOne`. It looks for a conversation where both users are included in the `participants` field.
- If no such conversation exists, a new one is created (`Conversation.create`) with both participants included.

#### 3. **Creating a New Message**

- A new message is created using the `Message` model, storing the `senderId`, `receiverId`, and the actual message content (`message`).

#### 4. **Associating the Message with the Conversation**

- If the new message is created successfully, the message’s ID is added to the `messages` array in the corresponding conversation (`conversation.messages.push(newMessage._id)`).

#### 5. **Saving Data in Parallel**

- Both the conversation and the new message are saved to the database in parallel using `Promise.all()`. This improves performance by saving the conversation and message concurrently instead of sequentially.

#### 6. **Error Handling**

- In case of an error during the process, the error is logged (`console.log`) and a 500 status code with an error message is returned as a response (`res.status(500).json`).

#### Example Response

On success, the new message object is returned as a JSON response with a `201` status code (`res.status(201).json(newMessage)`).

---

This method ensures efficient handling of chat conversations, minimizing database operations by reusing existing conversations and saving message data in parallel.

Here’s an explanation of the `getMessages` function, which retrieves messages between two users:

---

### `getMessages` Function (Controller)

This function is responsible for fetching all messages between the currently authenticated user and another user. The messages are retrieved from an existing conversation stored in the database.

#### 1. **Extracting User IDs**

- `userToChatId`: The ID of the other user with whom the current user is having a conversation is retrieved from the URL parameters (`req.params.id`).
- `senderId`: The authenticated user’s ID is extracted from the `req.user._id`.

#### 2. **Finding the Conversation**

- The function searches for a conversation between the authenticated user (`senderId`) and the other user (`userToChatId`) using `Conversation.findOne()`. It checks for both users in the `participants` array with `$all: [senderId, userToChatId]`.
- The `populate("messages")` method is used to retrieve the **actual message documents** associated with the conversation, not just the references (message IDs). This ensures that the entire message data is included in the response.

#### 3. **Handling Non-Existent Conversations**

- If no conversation is found between the two users, the function returns an empty array (`res.status(200).json([])`), indicating no messages exist.

#### 4. **Returning the Messages**

- If a conversation is found, the messages associated with it are stored in the `messages` array.
- The function then responds with a `200` status code and returns the list of messages (`res.status(200).json(messages)`).

#### 5. **Error Handling**

- In case of any errors during the process, the error is logged to the console (`console.log`) and a `500` status code with a relevant error message is returned (`res.status(500).json({ error: "Internal server error" })`).

---

This method allows users to retrieve all messages from a specific conversation between themselves and another user, including the actual message content, by using the `populate()` method to fully load the related message data.

Here’s an explanation of the `getUsersForSidebar` function, which retrieves users to display on the sidebar, excluding the logged-in user:

---

### `getUsersForSidebar` Function (Controller)

This function is responsible for fetching a list of users that can be displayed on the sidebar in a chat or social media application. The logged-in user is excluded from this list.

#### 1. **Extracting Logged-in User ID**

- The function retrieves the ID of the currently logged-in user from the request (`req.user._id`).

#### 2. **Querying the Database for Other Users**

- The database is queried to find all users except the logged-in user. This is done using the condition `{ _id: { $ne: loggedInUserId } }`, where `$ne` stands for "not equal."
- The `select("-password")` method is used to exclude the `password` field from the returned user data, enhancing security and ensuring sensitive information is not exposed.

#### 3. **Returning the Filtered Users**

- If successful, the function sends a `200` status code and returns the list of filtered users (`res.status(200).json(filteredUsers)`), which can be displayed on the sidebar.

#### 4. **Error Handling**

- If an error occurs during the operation, it is logged to the console (`console.error`), and a `500` status code with an appropriate error message is returned (`res.status(500).json({ error: "Internal server error" })`).

---

This function efficiently retrieves all users, excluding the current logged-in user, while ensuring sensitive information like passwords is not returned. This allows the UI to populate a sidebar with other users for potential conversations or interactions.

## Socket.io

Here’s an explanation of the socket server setup for real-time communication in your application:

---

### Socket.IO Server Setup

This server facilitates real-time communication between connected clients, using Socket.IO and Express.js. It maintains a map of active users and their respective socket connections, allowing efficient messaging and tracking of online users.

#### 1. **Setting Up Socket.IO Server**

- **Server Initialization**:
  - An HTTP server is created using Express (`http.createServer(app)`), and Socket.IO is initialized (`new Server(server)`) to handle WebSocket connections.
  - The `cors` configuration allows connections from `http://localhost:3000`, enabling the frontend (likely React) to interact with the WebSocket server.

#### 2. **Managing Online Users**

- **userSocketMap**:
  - This is an object used to store the mapping of users' IDs to their respective socket IDs (`{ userId: socketId }`).
  - This allows the server to track which users are currently connected and retrieve their socket IDs for direct communication.

- **getReceiverSocketId**:
  - A utility function that takes a `receiverId` and returns the corresponding socket ID from `userSocketMap`. This is useful when sending messages to a specific user by their socket ID.

#### 3. **Handling User Connections**

- **Socket Connection Event**:
  - When a client connects, the server listens for the `"connection"` event. The connected user's socket ID is logged (`socket.id`).
  - **User Identification**:
    - The server reads the `userId` from `socket.handshake.query`. If the userId is valid, it maps the user ID to the socket ID in `userSocketMap`, allowing future identification of this user for message delivery.
  - **Broadcasting Online Users**:
    - After a new user connects, the server broadcasts the current list of online users (`Object.keys(userSocketMap)`) using `io.emit("getOnlineUsers")`.

#### 4. **Handling Disconnections**

- **Disconnect Event**:
  - When a user disconnects, the `"disconnect"` event is triggered, and the server logs the disconnection.
  - The user's socket ID is removed from `userSocketMap` to ensure they are no longer considered online.
  - The updated list of online users is emitted again to all connected clients.

#### 5. **Exporting Server and Modules**

- The `app`, `io`, and `server` instances are exported for use in other parts of the project. This setup allows the server to handle HTTP requests and Socket.IO events in parallel.

---

This setup ensures efficient tracking of online users and real-time messaging between clients. When users connect or disconnect, their presence is broadcasted to all clients, making it easy to show a list of online users or send targeted messages.
