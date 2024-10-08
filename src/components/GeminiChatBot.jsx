import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, User, Bot } from 'lucide-react';
import CleanResponse from './CleanResponse';

const API_KEY = 'AIzaSyCBw8CFbUNreTcCNGq4eTJRDrnymJIXhTU'; // Replace with your actual API key
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

const GeminiChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await axios.post(
        `${API_URL}?key=${API_KEY}`,
        {
          contents: [{ parts: [{ text: input }] }]
        },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

      const aiMessage = { 
        role: 'ai', 
        content: result.data.candidates[0].content.parts[0].text 
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = { 
        role: 'ai', 
        content: 'An error occurred while fetching the response.' 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gemini Chat</h1>
      <div className="flex-1 overflow-auto mb-4 border border-gray-300 rounded-lg p-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex items-start mb-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-start space-x-2 ${message.role === 'user' ? 'flex-row-reverse' : ''} max-w-3xl`}>
              <div className={`p-2 rounded-lg ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                {message.role === 'user' ? <User className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
              </div>
              <div className={`p-3 rounded-lg ${message.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'} w-full`}>
                {message.role === 'user' ? (
                  message.content
                ) : (
                  <CleanResponse content={message.content} />
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center justify-start mb-4">
            <div className="bg-gray-200 p-3 rounded-lg">
              <div className="animate-pulse flex space-x-2">
                <div className="rounded-full bg-gray-400 h-2 w-2"></div>
                <div className="rounded-full bg-gray-400 h-2 w-2"></div>
                <div className="rounded-full bg-gray-400 h-2 w-2"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-2 border border-gray-300 rounded-lg"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded-lg" disabled={isLoading}>
          <Send className="h-6 w-6" />
        </button>
      </form>
    </div>
  );
};

export default GeminiChatBot;