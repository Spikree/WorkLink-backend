import Message from "../models/chat.model";
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
            senderId:userToChatId,
            receiverId:myId,
        },
      ],
    }).sort({createdAt: 1});

    return res.status(200).json({
        messages: "Fetched All Messages",
        messages
    })
  } catch (error) {
    console.log("Error in chat controller at get messages" + error);
    return res.status(500).json({
        messages: "Internal Server Error"
    });
  }
};
