
import React from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun, CheckSquare, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Calendar from './Calendar';
import { Link } from 'react-router-dom';

const Index = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold text-gradient">QUESTLOG</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/progress">
              <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2">
                <BarChart className="h-4 w-4" />
                <span>Progress</span>
              </Button>
              <Button variant="outline" size="icon" className="sm:hidden">
                <BarChart className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/todos">
              <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2">
                <CheckSquare className="h-4 w-4" />
                <span>To-do List</span>
              </Button>
              <Button variant="outline" size="icon" className="sm:hidden">
                <CheckSquare className="h-4 w-4" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-grow">
        <Calendar />
      </main>
    </div>
  );
};

export default Index;
