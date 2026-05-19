# Matches Analyzer - Live Digit Probability Tool

A real-time digit probability analyzer and predictor tool, similar to ProfitPlusPro. Analyzes live digit patterns and displays probability distributions for trading strategies.

## Features

- 📊 **Live Digit Probability Grid** - Real-time probability distribution for digits 0-9
- 🎯 **Strategy Analysis** - Even/Odd and other betting strategies
- 📈 **Live Price Display** - Real-time price updates
- 🔄 **Real-time Updates** - WebSocket-based live data streaming
- 🎮 **Interactive Controls** - Start/Stop buttons and strategy analysis
- 📱 **Responsive UI** - Mobile-friendly interface matching ProfitPlusPro design

## Tech Stack

- **Frontend**: React.js + Tailwind CSS
- **Backend**: Node.js + Express.js
- **Real-time**: WebSocket (Socket.io)
- **Database**: MongoDB (optional, for data persistence)

## Project Structure

```
matches-analyzer/
├── frontend/                 # React application
│   ├── public/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom hooks
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── .env.example
├── backend/                  # Node.js/Express server
│   ├── routes/              # API routes
│   ├── controllers/         # Business logic
│   ├── utils/               # Utility functions
│   ├── models/              # Data models
│   ├── server.js            # Main server file
│   ├── package.json
│   └── .env.example
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/Bonnie254385/matches-analyzer.git
cd matches-analyzer
```

2. Install dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. Start the servers
```bash
# Terminal 1 - Backend (from backend directory)
npm start

# Terminal 2 - Frontend (from frontend directory)
npm start
```

Visit `http://localhost:3000` in your browser.

## Usage

1. **Start Analysis** - Click the "Start" button to begin live analysis
2. **View Probability** - See real-time digit probabilities (0-9)
3. **Select Strategy** - Choose betting strategy (Even/Odd)
4. **Analyze** - Click "Analyze Strategy" for insights
5. **View Matches** - Click "Matches" to see pattern matches

## API Endpoints

- `GET /api/probability` - Get current digit probabilities
- `GET /api/price` - Get live price
- `POST /api/strategy/analyze` - Analyze selected strategy
- `GET /api/matches` - Get matched patterns
- `WebSocket /socket.io` - Real-time updates

## Configuration

Create a `.env` file in the backend directory:
```
PORT=5000
NODE_ENV=development
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

MIT License

## Author

Bonnie254385

## Support

For issues and questions, please open an issue on GitHub.
