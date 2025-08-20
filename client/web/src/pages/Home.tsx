import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card } from '../ui';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10 bg-gradient-to-b from-black to-transparent">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-[#e50914]">
            <span className="h-6 w-1 bg-[#e50914] shadow-neon-red" />
            Netflix UI Kit
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link to="/" className="text-[#b3b3b3] hover:text-white transition-colors">Home</Link>
            <Link to="/sample" className="text-[#b3b3b3] hover:text-white transition-colors">Sample</Link>
            <a href="https://tailwindcss.com" target="_blank" rel="noreferrer" className="text-[#b3b3b3] hover:text-white transition-colors">Tailwind</a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10 space-y-10">
        <section className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
          <div className="space-y-5">
            <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">
              Build Netflix-like experiences with reusable UI components
            </h1>
            <p className="text-lg text-[#b3b3b3]">
              A lightweight Tailwind + React component set styled with the Netflix aesthetic. Explore the showcase to see all atoms and patterns.
            </p>
            <div className="flex gap-3">
              <Link to="/sample">
                <Button size="lg">Open Sample</Button>
              </Link>
              <a href="/sample" className="hidden md:inline-block">
                <Button variant="outline" size="lg">Browse Components</Button>
              </a>
            </div>
          </div>
          <Card variant="elevated" hover className="p-6">
            <div className="space-y-3">
              <h2 className="text-xl font-semibold">What’s inside</h2>
              <ul className="list-disc space-y-1 pl-5 text-[#b3b3b3]">
                <li>Buttons, Inputs, Cards, Avatars, Badges</li>
                <li>Dropdowns, Modals, Toasts, Loaders</li>
                <li>Checkbox, Radio, Textarea, Slider</li>
                <li>Dark, high-contrast Netflix theme</li>
              </ul>
            </div>
          </Card>
        </section>

        <section>
          <h3 className="mb-4 text-2xl font-semibold">Get started</h3>
          <Card className="p-6">
            <ol className="list-decimal space-y-2 pl-6 text-[#b3b3b3]">
              <li>Use the navigation above to open the UI showcase.</li>
              <li>Copy component snippets and compose them as atoms/molecules.</li>
              <li>Customize using Tailwind utilities defined in the theme.</li>
            </ol>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default Home;

