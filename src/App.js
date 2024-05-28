import './App.css';
import { useState, useEffect } from 'react';
import io from 'socket.io-client';

// Move socket initialization outside of the component to prevent reinitializing on each render
const socket = io('http://localhost:5000', {
  transportOptions: {
    polling: {
      extraHeaders: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInBob25lTnVtYmVyIjoiKzk5ODMzMTIzNDU2NyIsImlhdCI6MTcxNTc1ODM3MiwiZXhwIjoxNzE4MzUwMzcyfQ.rRS0Q68EPetmtGeX3bsQ1rTfmFTp3cLyyJdbKgm5ClI`,
      },
    },
  },
});

function App() {
  const [messages, setMessages] = useState([]);
  const [token, setToken] = useState('');
  const [text, setText] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    // Listen for messages from the server
    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      console.log(message);
    });

    // Cleanup on component unmount
    return () => {
      socket.off('message');
    };
  }, []);

  const sendMessage = () => {
    // Emit the message to the server
    socket.emit('message', { text, userId: userId || null });
  };

  const updateToken = () => {
    socket.io.opts.transportOptions.polling.extraHeaders.Authorization = `Bearer ${token}`;
    socket.disconnect().connect();
  };

  return (
    <div className="App">
      <h1>Chat example from Rediska Kolokovna</h1>

      {/* Input for token, text, and user_id */}
      <input
        type="text"
        placeholder="token"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        onBlur={updateToken}
      />
      <input
        type="text"
        placeholder="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <input
        type="text"
        placeholder="user_id"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />

      {/* Button to send message */}
      <button onClick={sendMessage}>Send message</button>

      {messages.map((msg, index) => (
        <div key={index}>
          <strong>{msg.userId ? `User ${msg.userId}` : 'Mentor'}:</strong> {msg.text}
        </div>
      ))}
    </div>
  );
}

export default App;
