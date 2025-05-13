import { StoryGenerator } from '@/components/story-generator';
import { PenLine } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-background text-foreground">
      <header className="mb-8 sm:mb-10 text-center">
        <div className="flex items-center justify-center mb-3 sm:mb-4">
          <PenLine className="h-10 w-10 sm:h-12 sm:w-12 mr-2 sm:mr-3 text-primary" />
          <h1 className="text-4xl sm:text-5xl font-bold">Word Weaver</h1>
        </div>
        <p className="text-md sm:text-lg text-muted-foreground max-w-prose">
          Spin tales from a single word. Let your imagination weave wonders with the help of AI.
        </p>
      </header>
      <main className="w-full max-w-2xl">
        <StoryGenerator />
      </main>
      <footer className="mt-10 sm:mt-16 text-center text-xs sm:text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Word Weaver. Crafted with imagination and AI.</p>
      </footer>
    </div>
  );
}
