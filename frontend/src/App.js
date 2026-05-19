import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import MatchesAnalyzer from './components/MatchesAnalyzer';
import './App.css';

const App = () => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketUrl = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';
    const newSocket = io(socketUrl);

    newSocket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>📊 Matches Analyzer</h1>
          <div className="connection-status">
            <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}></span>
            <span>{isConnected ? 'Live' : 'Offline'}</span>
          </div>
        </div>
      </header>
      <main className="main-content">
        {socket && <MatchesAnalyzer socket={socket} />}
      </main>
    </div>
  );
};

export default App;
