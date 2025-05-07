# Arvolaskuri Frontend

Frontend application for the Älyä project's Arvolaskuri. The application uses AI to identify furniture from images and provides users with information about furniture pricing and advice on recycling and circular economy.

## Core Features

1. Upload and analyze furniture images using AI
2. Select AI model for recognition (O3, GPT-4.1, Claude-3-7, Gemini-2.5)
3. Verify and edit identified furniture information
4. Get AI-based price estimates and recommendations
5. Discuss recycling and circular economy topics with an AI chatbot

## Technical Implementation

- **React + TypeScript + Vite**
- **State Management**: Zustand (furniture data and price analysis)
- **Chat UI**: Vercel AI SDK (useChat hook) for streaming responses
- **Forms**: React Hook Form + Zod validation
- **UI**: Tailwind CSS + Shadcn/UI components

## Installation

Follow these instructions to install the application:

**1. Clone the Github repository:**

```
git clone https://github.com/team-alya/kaluste-frontend.git
```

**2. Install dependencies:**

```
npm install
```

**3. Copy environment variables:**

```bash
cp .env.example .env
```

**4. Start the application:**

```
npm run dev
```

### Note

The application requires a backend service, which you can find documented here:
https://github.com/team-alya/kaluste-backend

## Application Use Case

Value Calculator is an application that allows users to:

1. Take or upload a picture of furniture
2. Select which AI model to use for recognition
3. Verify and correct the furniture details identified by AI
4. Get a price estimate for the furniture
5. Ask the chatbot for additional information about recycling, reuse, and circular economy

## License

See the [LICENSE](LICENSE) file for more information.
