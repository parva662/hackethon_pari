# Game Combination Generator

This project is an interactive web application that allows users to combine different cards to generate unique game ideas. The application features a multi-step process including authentication, user identification, card selection, and game generation.

## Project Structure

The project is built using Next.js for the frontend with TypeScript support.

### Core Types

#### Card
```typescript
interface Card {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  compatibleCardIds: string[];
}
```
Represents individual cards that users can select and combine.

#### GameResult
```typescript
interface GameResult {
  game_name: string;
  description: string;
  rules: string[];
  materials_needed: string[];
  safety_considerations: string[];
  error?: string;
}
```
Represents the generated game combination result from the backend.

#### User
```typescript
interface User {
  id: string;
  name: string;
  schoolId: string;
  role: 'student' | 'teacher';
}
```
Represents an authenticated user in the system.

#### GameState
```typescript
interface GameState {
  selectedCards: Card[];
  phase: 'auth' | 'name' | 'selection' | 'results';
  user: User | null;
}
```
Manages the application's state and flow.

## Application Flow

1. **Authentication Phase (`auth`)**: Users must first authenticate using their credentials.
2. **Name Input Phase (`name`)**: Authenticated users provide their name.
3. **Card Selection Phase (`selection`)**: Users can select two cards to combine.
4. **Results Phase (`results`)**: The application displays the generated game combination based on the selected cards.

## API Integration

The application communicates with a backend server running on `http://localhost:8000` to generate game combinations. The main endpoint used is:

- `POST /supervisor/combine`: Accepts two card titles and returns a generated game combination.

## Error Handling

The application includes comprehensive error handling:
- Network errors are caught and displayed to the user
- Loading states are managed to provide feedback during API calls
- Type safety is enforced throughout the application using TypeScript

## UI Features

- Responsive design using Tailwind CSS
- Clear visual hierarchy for game results
- Loading indicators during API calls
- Error messages when things go wrong
- Step-by-step user flow with clear phase transitions

## Project Structure
```bash
.
├── backend/         # FastAPI backend for game generation
├── frontend/        # React frontend (llmHero)
└── README.md
```

## Setup Instructions

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the backend server:
   ```bash
   python main.py
   ```
   The server will run on http://localhost:8000

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will run on http://localhost:3000

## Features

1. **Game Combination**
   - Combines two sports/activities into new games
   - Generates rules, materials, and safety considerations
   - Uses RAG for context-aware game creation

2. **Question Answering**
   - Handles general questions about games
   - Provides detailed responses with suggestions
   - Uses RAG for context-aware answers

3. **Response Storage**
   - Saves all responses to game_library.jsonl
   - Includes timestamps for tracking
   - Maintains history of generated games

## API Endpoints

1. **/supervisor/combine** (POST)
   - Combines two sports/activities into a new game
   - Input: GameRequest (card1, card2, constraints)
   - Output: Game details with rules and safety considerations

2. **/supervisor/ask** (POST)
   - Handles general questions about games
   - Input: QueryRequest (query)
   - Output: Response with suggestions

3. **/health** (GET)
   - Health check endpoint
   - Returns server status

## Dependencies

### Backend
```
langchain==0.1.0
langchain-community==0.0.20
langchain-core==0.1.23
langchain-openai==0.0.2
openai>=1.6.1,<2.0.0
fastapi==0.100.0
uvicorn==0.23.0
faiss-cpu==1.10.0
```

### Frontend
- Next.js
- React
- Tailwind CSS

## Current Status
- ✅ API server running successfully
- ✅ RAG functionality working
- ✅ Response storage implemented
- ✅ Test script working
- ⚠️ Some deprecation warnings in LangChain (non-critical)

## Areas for Improvement
1. Error handling could be more robust
2. Add input validation for game combinations
3. Implement rate limiting
4. Add authentication
5. Expand the knowledge base for RAG
6. Add more sophisticated game generation logic

## Contributing
Feel free to submit issues and enhancement requests!

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Co-creation Agent API

A FastAPI-based application that combines sports/activities to create new games using RAG (Retrieval-Augmented Generation) with LangChain and OpenAI.

### Project Structure
```
HB_Agent_old/
├── main.py              # Main FastAPI application
├── demo_runner.py       # Test script for API endpoints
├── requirements.txt     # Project dependencies
├── .env                # Environment variables (API keys)
└── game_library.jsonl  # Generated game responses
```

### Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create a .env file with your OpenAI API key:
```
OPENAI_API_KEY=your_api_key_here
```

4. Run the server:
```bash
python main.py
```

5. Test the API:
```bash
python demo_runner.py
```

### Frontend Configuration
```
frontend/node_modules/
frontend/.next/
frontend/.cache/
frontend/build/
frontend/dist/
frontend/.env.local
frontend/.env
frontend/.env.development.local
frontend/.env.test.local
frontend/.env.production.local
frontend/npm-debug.log*
frontend/yarn-debug.log*
frontend/yarn-error.log*
```

### Dependencies
```
package-lock.json
yarn.lock
```

### Testing
```
frontend/coverage/
```

### Production
```
frontend/build/
```

### Misc
```
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local
```
