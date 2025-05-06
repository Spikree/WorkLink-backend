import Message from "../models/chat.model.js";
import { io, users } from "../socket/socket.js";

export const getMessages = async (req, res) => {
  const { id: userToChatId } = req.params;
  const user = req.user;
  const myId = user._id;

  try {
    const messages = await Message.find({
      $or: [
        {
          senderId: myId,
          receiverId: userToChatId,
        },
        {
          senderId: userToChatId,
          receiverId: myId,
        },
      ],
    }).sort({ createdAt: 1 });

    return res.status(200).json({
      messages: "Fetched All Messages",
      messages,
    });
  } catch (error) {
    console.log("Error in chat controller at get messages" + error);
    return res.status(500).json({
      messages: "Internal Server Error",
    });
  }
};

export const sendMessage = async (req, res) => {
  const { id: receiverId } = req.params;
  const { text } = req.body;
  const user = req.user;
  const myId = user._id;

  try {
    const chatId = [myId, receiverId].sort().join("_");

    const newMessage = new Message({
      senderId: myId,
      receiverId,
      text,
      chatId,
    });

    await newMessage.save();

    const receiverSockets = user.get(receiverId);
    if (receiverSockets) {
      receiverSockets.forEach((socketId) => {
        io.to(socketId).emit("newMessage", {
          ...newMessage.toObject(),
          chatId,
        });
      });
    }

    res.status(200).json({
      messages: "Message Sent Sucessfully",
      newMessage,
    });
  } catch (error) {
    console.log("Error in chat controller at send message" + error);
  }
};
