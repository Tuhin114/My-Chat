# My-Chat

## Authentication

- Same as before
- New - Use of changable avatar images in signup function

## Send Messages

Here's an explanation of the `sendMessage` function, which handles sending a message between two users in a chat application:

---

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
