
import React, { useState } from 'react';

const chats = [
  { id: 1, user: "Charles", lastMessage: "Is the blade still available?", time: "2m ago", avatar: "C" },
  { id: 2, user: "Alex", lastMessage: "Thanks for the trade!", time: "1h ago", avatar: "A" },
  { id: 3, user: "Jordan", lastMessage: "Interested in buying", time: "3h ago", avatar: "J" }
];

const Chat = () => {
  const [selectedChat, setSelectedChat] = useState(chats[0]);
  const [chatMessage, setChatMessage] = useState('');

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      alert(`Message sent: ${chatMessage}`);
      setChatMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-[#232323] text-white flex flex-col sm:flex-row">
      <div className="w-full sm:w-1/3 bg-[#232323] border-b sm:border-b-0 sm:border-r border-gray-800 p-4 sm:p-6">
        <h2 className="text-xl font-bold mb-6">Chats</h2>
        <ul>
          {chats.map(chat => (
            <li
              key={chat.id}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer mb-2 hover:bg-[#2d2d3a] ${selectedChat?.id === chat.id ? 'bg-[#2d2d3a]' : ''}`}
              onClick={() => setSelectedChat(chat)}
            >
              <div className="w-10 h-10 bg-[#3b2ff7] rounded-full flex items-center justify-center text-white font-bold text-lg">{chat.avatar}</div>
              <div>
                <p className="text-white font-bold">{chat.user}</p>
                <p className="text-gray-400 text-xs">{chat.lastMessage}</p>
              </div>
              <span className="ml-auto text-gray-500 text-xs">{chat.time}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-4 sm:p-8">
          <h2 className="text-xl font-bold mb-4">Chat with {selectedChat?.user}</h2>
          <div className="bg-[#2d2d3a] rounded-xl p-6 min-h-[200px] mb-6">
            <p className="text-gray-400 text-sm">{selectedChat?.lastMessage}</p>
          </div>
        </div>
        <div className="p-4 sm:p-8 border-t border-gray-800">
          <div className="flex gap-2 sm:gap-3">
            <input
              type="text"
              value={chatMessage}
              onChange={e => setChatMessage(e.target.value)}
              className="flex-1 bg-[#232323] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#3b2ff7]"
              placeholder="Type your message..."
            />
            <button
              onClick={handleSendMessage}
              className="bg-[#3b2ff7] hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
