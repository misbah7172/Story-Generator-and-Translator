# Word Weaver

A modern web application built with Next.js and Tailwind CSS that offers an interactive writing experience. The application leverages AI capabilities and provides a rich text editing environment.

## Features
- Built with Next.js 13+ App Router
- Styled using Tailwind CSS for responsive design
- AI integration capabilities using Google Gemini
- Server and client components architecture
- TypeScript for type safety

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory and add your Google Gemini API key:
```properties
GEMINI_API_KEY=your_gemini_api_key_here
```

3. Run development server:
```bash
npm run dev
```

## Project Structure
```
src/
  ai/         # AI integration related code
  app/        # Next.js app router pages
  components/ # React components
  hooks/      # Custom React hooks
  lib/        # Shared utilities and libraries
```

## Environment Variables

Make sure to set up the following environment variables in your `.env` file:

| Variable | Description |
|----------|-------------|
| GEMINI_API_KEY | Your Google Gemini API key |

> **Note**: You'll need to obtain a Google Gemini API key from the Google AI Studio to use the AI features. Never commit your API key to version control.

## License

MIT License
