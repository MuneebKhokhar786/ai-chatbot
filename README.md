# AI Assistant Chatbot

An interactive AI-powered chatbot web application built with Next.js, React, and TypeScript. Supports multiple AI models, web search, source citation, and rich UI features.

## Features

- Chat with advanced AI models (GPT-4o, Deepseek R1)
- Toggle web search for enhanced answers
- Source citation and reasoning display
- Modern, responsive UI with custom components
- Fast, auto-updating development experience

## Getting Started

### Prerequisites
- Node.js (18+ recommended)
- pnpm, npm, yarn, or bun

### Installation
Clone the repo and install dependencies:

```bash
pnpm install # or npm install, yarn install, bun install
```

### Running Locally
Start the development server:

```bash
pnpm dev # or npm run dev, yarn dev, bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `app/page.tsx` — Main chatbot UI and logic
- `app/api/chat/route.ts` — Chat API endpoint (model selection, web search)
- `components/ai-elements/` — Specialized chat UI components
- `components/ui/` — Generic UI primitives
- `lib/utils.ts` — Utility functions
- `public/` — Static assets (SVGs, favicon)

## Customization

- Change AI models in `app/page.tsx`
- Update UI components in `components/`
- Replace favicon with your own in `public/android-avatar.svg`

## Deployment

Deploy easily on [Vercel](https://vercel.com/) or any platform supporting Next.js.

## License

MIT
