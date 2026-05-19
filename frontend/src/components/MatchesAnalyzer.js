import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProbabilityGrid from './ProbabilityGrid';
import './MatchesAnalyzer.css';

const MatchesAnalyzer = ({ socket }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [probability, setProbability] = useState({});
  const [price, setPrice] = useState('$0.00000');
  const [strategy, setStrategy] = useState('Even/Odd');
  const [connectionStatus, setConnectionStatus] = useState('Live');

  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (!socket) return;

    socket.on('live_update', (data) => {
      setProbability(data.probability);
      setPrice(`$${data.price}`);
    });

    socket.on('analysis_started', () => {
      setIsAnalyzing(true);
    });

    socket.on('analysis_stopped', () => {
      setIsAnalyzing(false);
    });

    return () => {
      socket.off('live_update');
      socket.off('analysis_started');
      socket.off('analysis_stopped');
    };
  }, [socket]);

  const handleStart = () => {
    socket?.emit('start_analysis', { strategy });
    setIsAnalyzing(true);
  };

  const handleStop = () => {
    socket?.emit('stop_analysis', {});
    setIsAnalyzing(false);
  };

  const handleAnalyzeStrategy = async () => {
    try {
      const response = await axios.post(`${apiUrl}/api/strategy/analyze`, { strategy });
      alert(`Strategy Analysis: ${response.data.data.prediction}\nConfidence: ${response.data.data.confidence}%`);
    } catch (error) {
      console.error('Error analyzing strategy:', error);
    }
  };

  const handleViewMatches = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/matches`);
      console.log('Matches:', response.data.data);
      alert(`Found ${response.data.totalMatches} matches`);
    } catch (error) {
      console.error('Error fetching matches:', error);
    }
  };

  return (
    <div className="analyzer-container">
      <div className="analyzer-card">
        {/* Volume Section */}
        <div className="section volume-section">
          <label>Volume</label>
          <select defaultValue="Vol 10 (1s)" className="select-input">
            <option>Vol 10 (1s)</option>
            <option>Vol 20 (2s)</option>
            <option>Vol 50 (5s)</option>
          </select>
        </div>

        {/* Strategy Section */}
        <div className="section strategy-section">
          <label>Strategy</label>
          <select value={strategy} onChange={(e) => setStrategy(e.target.value)} className="select-input">
            <option>Even/Odd</option>
            <option>Matches</option>
            <option>Unmatches</option>
            <option>Over</option>
            <option>Under</option>
          </select>
        </div>

        {/* Connection Status */}
        <div className="section status-section">
          <label>Connection Status</label>
          <div className="status-box">
            <span className="status-dot live"></span>
            <span>{connectionStatus}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="controls-section">
          <button 
            className={`btn btn-start ${isAnalyzing ? 'disabled' : ''}`}
            onClick={handleStart}
            disabled={isAnalyzing}
          >
            ▶ Start
          </button>
          <button 
            className={`btn btn-stop ${!isAnalyzing ? 'disabled' : ''}`}
            onClick={handleStop}
            disabled={!isAnalyzing}
          >
            ⊟ Stop
          </button>
        </div>

        {/* Analyze Strategy Button */}
        <button className="btn btn-analyze" onClick={handleAnalyzeStrategy}>
          ℹ️ Analyze Strategy
        </button>

        {/* Matches Button */}
        <button className="btn btn-matches" onClick={handleViewMatches}>
          ◉ Matches
        </button>

        {/* Probability Grid */}
        <div className="probability-section">
          <div className="probability-header">
            <h3>Live Digit Probability Distribution</h3>
            <p>Dynamic percentages • Range: 4.1% - 15.0% • Updates every 2 seconds</p>
          </div>
          <ProbabilityGrid probability={probability} />
        </div>

        {/* Live Price */}
        <div className="price-section">
          <label>LIVE PRICE</label>
          <div className="price-display">{price}</div>
        </div>
      </div>
    </div>
  );
};

export default MatchesAnalyzer;
