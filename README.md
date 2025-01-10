# KalusteArvio Frontend

Frontend application for the Älyä-hanke KalusteArvio-project. The app uses AI to analyze furniture images and provide recommendations for selling, donating, recycling, or repairing used furniture.

## Core Features

1. Upload furniture image for AI analysis
2. Validate and edit detected furniture information
3. Get AI-powered price estimates and recommendations
4. Chat with AI assistant

## Tech Stack

- **React + TypeScript + Vite**
- **State Management**: Zustand for global state (furniture details and price analysis)
- **Chat Interface**: Vercel AI SDK (useChat hook) for streaming AI responses
- **Form Handling**: React Hook Form + Zod validation
- **UI**: Tailwind CSS + Shadcn/UI components

## Installation

To run the program follow the instructions below:

**1. Clone the Github repository:**

` git clone https://github.com/team-alya/kaluste-frontend.git`

**2. Install dependencies:**

` npm install`

**3. Copy envs:**

```bash
cp .env.example .env
```

**3. Start the app:**

`npm run dev`

### Notice

⚠️ **Old implementation pics - corresponds to git TAG v1.0.**

For this app to work with all its functionalities you also need to have the back-end set up which can be found with its own documentation here: https://github.com/team-alya/kaluste-backend.

## Images of the user interface

#### Welcome page

![image](https://github.com/user-attachments/assets/a0fb099a-a229-4515-8203-b3682c99cf03)

#### Image upload page:

![image](https://github.com/user-attachments/assets/5141177c-e5f3-49eb-8e04-ef476624e90b)

#### Information confirmation page:

![image](https://github.com/user-attachments/assets/7f6d7b32-837c-45bf-a1d5-311f48bb2098)

## Price estimation

- €3.00/month (150 process usage)
- Model recognition from image (€0.01-0.02)
- Price estimation (€0.01-0.015) per estimate

## Lisenssi

License - katso [LICENSE](LICENSE) tiedosto lisätietoja varten.
