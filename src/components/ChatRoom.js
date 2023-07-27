import React, { useState, useEffect, useRef } from 'react';
import { TextField, Button, List, ListItem, ListItemText, Typography } from '@material-ui/core';
import axios from 'axios';

type Message = {
  user: string;
  text: string;
  timestamp: number;
};

const ChatRoom: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [username, setUsername] = useState('');
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    wsRef.current = new WebSocket('ws://localhost:3000');

    wsRef.current.onmessage = (message) => {
      const newMessage = JSON.parse(message.data);
      setMessages((messages) => [...messages, newMessage]);
    };

    return () => {
      wsRef.current?.close();
    };
  }, []);

  const sendMessage = async () => {
    const message: Message = { user: username, text: input, timestamp: Date.now() };

    // Send message to server
    await axios.post('http://localhost:3000/message', message);  // Update here
    
    // Clear the input field
    setInput('');
  };

  return (
    <div>
      <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <List>
        {messages.map((msg, index) => (
          <ListItem key={index}>
            <ListItemText primary={msg.user} secondary={msg.text} />
          </ListItem>
        ))}
      </List>
      <TextField label="Message" value={input} onChange={(e) => setInput(e.target.value)} />
      <Button variant="contained" color="primary" onClick={sendMessage}>
        Send
      </Button>
    </div>
  );
};

export default ChatRoom;
