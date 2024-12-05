const ChatServices = require("../services/chat.services");

class ChatControllers {
  // Method to store a new chat
  static async storeChat(req, res) {
    const { text } = req.body; // Extract chat text from request body
    const { id: userId } = req.user; // Extract user ID from authenticated user

    try {
      const newChat = await ChatServices.storeChat({ text, user_id: userId });
      res.status(200).json(newChat);
    } catch (error) {
      if (error.response) {
        res.status(error.response.status).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }

  // Method to get all chats
  static async getAllChats(req, res) {
    const { id } = req.user; // Extract user ID from authenticated user
    try {
      const chats = await ChatServices.getAllChats(id);
      res.status(200).json(chats);
    } catch (error) {
      if (error.response) {
        res.status(error.response.status).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }
}

module.exports = ChatControllers;