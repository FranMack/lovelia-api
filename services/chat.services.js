const ChatModel = require("../models/chat.model");

class ChatServices {
  // Save a new chat message
  static async storeChat(data) {
    try {
 
      const newChat = await ChatModel.create(data);
      return newChat;
    } catch (error) {
      throw new Error("Error storing chat: " + error.message);
    }
  }

  // Retrieve all chat messages
  static async getAllChats(id) {
    try {
      const chats = await ChatModel.find({user_id:id});

      return chats;
    } catch (error) {
      throw new Error("Error fetching chats: " + error.message);
    }
  }
}

module.exports = ChatServices;