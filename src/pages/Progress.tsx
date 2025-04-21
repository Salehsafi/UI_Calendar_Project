import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun, Calendar, CheckCircle2, BarChart, ArrowLeft, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const TaskProgress = () => {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [completedTasks, setCompletedTasks] = useState<number>(0);
  const [totalTasks, setTotalTasks] = useState<number>(0);
  const [completedLongTermTasks, setCompletedLongTermTasks] = useState<number>(0);
  const [totalLongTermTasks, setTotalLongTermTasks] = useState<number>(0);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [longTermProgressPercent, setLongTermProgressPercent] = useState<number>(0);
  const [quote] = useState<string>(
    "A dream does not become reality through magic, it takes sweat, determination and hard work."
  );

  useEffect(() => {
    const loadTaskProgress = () => {
      try {
        const storedTasks = localStorage.getItem('todos');
        if (storedTasks) {
          const parsedTasks = JSON.parse(storedTasks);
          const completed = parsedTasks.filter((task: any) => task.completed).length;
          const total = parsedTasks.length;
          
          setCompletedTasks(completed);
          setTotalTasks(total);
          setProgressPercent(total > 0 ? Math.round((completed / total) * 100) : 0);
        }

        const storedLongTermTasks = localStorage.getItem('longTermTasks');
        if (storedLongTermTasks) {
          const parsedTasks = JSON.parse(storedLongTermTasks);
          const completed = parsedTasks.filter((task: any) => task.completed).length;
          const total = parsedTasks.length;
          
          setCompletedLongTermTasks(completed);
          setTotalLongTermTasks(total);
          setLongTermProgressPercent(total > 0 ? Math.round((completed / total) * 100) : 0);
        }
      } catch (error) {
        console.error('Error loading task progress:', error);
        toast({
          title: "Error loading progress",
          description: "There was a problem loading your progress data",
          variant: "destructive",
        });
      }
    };

    loadTaskProgress();

    const handleStorageChange = () => loadTaskProgress();
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [toast]);

  const resetProgress = () => {
    try {
      const storedTasks = localStorage.getItem('todos');
      const storedLongTermTasks = localStorage.getItem('longTermTasks');
      
      localStorage.setItem('progress_last_reset', new Date().toISOString());
      
      if (storedTasks) {
        const parsedTasks = JSON.parse(storedTasks);
        const completed = parsedTasks.filter((task: any) => task.completed).length;
        const total = parsedTasks.length;
        
        setCompletedTasks(completed);
        setTotalTasks(total);
        setProgressPercent(total > 0 ? Math.round((completed / total) * 100) : 0);
      }
      
      if (storedLongTermTasks) {
        const parsedTasks = JSON.parse(storedLongTermTasks);
        const completed = parsedTasks.filter((task: any) => task.completed).length;
        const total = parsedTasks.length;
        
        setCompletedLongTermTasks(completed);
        setTotalLongTermTasks(total);
        setLongTermProgressPercent(total > 0 ? Math.round((completed / total) * 100) : 0);
      }
      
      toast({
        title: "Progress stats refreshed",
        description: "Your progress tracking has been reset",
      });
    } catch (error) {
      console.error('Error resetting progress:', error);
      toast({
        title: "Error resetting progress",
        description: "There was a problem resetting your progress data",
        variant: "destructive",
      });
    }
  };

  const isLightMode = theme === 'light';

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center py-8 px-4">
      <Card className={`w-full max-w-4xl ${isLightMode ? 'shadow-lg light-mode-shadow' : 'shadow-lg'}`}>
        <CardHeader className="pb-2">
          <div className="flex items-center mb-3">
            <Link to="/">
              <Button variant="outline" size="icon" className={`mr-3 ${isLightMode ? 'hover:bg-gray-100' : ''}`}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <CardTitle className="text-2xl font-bold text-purple-500">Tasks Progress</CardTitle>
              <CardDescription>Track your productivity</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center px-4 md:px-12">
            <blockquote className={`text-foreground text-xl italic ${isLightMode ? 'text-gray-600' : ''}`}>
              {quote}
            </blockquote>
          </div>
          
          <div className="md:flex md:gap-6">
            <div className="mb-6 md:mb-0 md:flex-1">
              <h3 className="text-lg font-medium mb-2 text-purple-500">Daily Tasks</h3>
              <div className="flex justify-between items-center gap-4 px-2 mb-4">
                <Card className={`p-4 text-center bg-card border-purple-500/30 flex-1 ${isLightMode ? 'shadow-sm' : ''}`}>
                  <h3 className="text-3xl font-bold text-purple-500">{completedTasks}</h3>
                  <p className="text-sm text-muted-foreground">Completed Tasks</p>
                </Card>
                
                <Card className={`p-4 text-center bg-card border-purple-500/30 flex-1 ${isLightMode ? 'shadow-sm' : ''}`}>
                  <h3 className="text-3xl font-bold text-purple-500">{totalTasks}</h3>
                  <p className="text-sm text-muted-foreground">Total Tasks</p>
                </Card>
              </div>
              
              <div className="relative pt-2 mb-6">
                <Progress 
                  value={progressPercent} 
                  className="h-8" 
                />
                <div className="text-center font-bold text-md mt-2 text-purple-400">
                  {progressPercent}% Complete
                </div>
              </div>
            </div>
            
            <div className="md:flex-1">
              <h3 className="text-lg font-medium mb-2 text-purple-500">Long-Term Goals</h3>
              <div className="flex justify-between items-center gap-4 px-2 mb-4">
                <Card className={`p-4 text-center bg-card border-purple-500/30 flex-1 ${isLightMode ? 'shadow-sm' : ''}`}>
                  <h3 className="text-3xl font-bold text-purple-500">{completedLongTermTasks}</h3>
                  <p className="text-sm text-muted-foreground">Completed Goals</p>
                </Card>
                
                <Card className={`p-4 text-center bg-card border-purple-500/30 flex-1 ${isLightMode ? 'shadow-sm' : ''}`}>
                  <h3 className="text-3xl font-bold text-purple-500">{totalLongTermTasks}</h3>
                  <p className="text-sm text-muted-foreground">Total Goals</p>
                </Card>
              </div>
              
              <div className="relative pt-2 mb-4">
                <Progress 
                  value={longTermProgressPercent} 
                  className="h-8" 
                />
                <div className="text-center font-bold text-md mt-2 text-purple-400">
                  {longTermProgressPercent}% Complete
                </div>
              </div>
            </div>
          </div>
            
          <div className="mt-8 flex justify-center">
            <Button 
              variant="outline" 
              onClick={resetProgress}
              className={`border-purple-500 text-purple-400 ${isLightMode ? 'hover:bg-purple-100' : 'hover:bg-purple-500/20'}`}
            >
              Reset Progress Tracking
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className={`fixed bottom-0 left-0 right-0 bg-card border-t border-border py-2 px-4 flex justify-between items-center shadow-lg ${isLightMode ? 'bg-white' : ''}`}>
        <div className="flex justify-center gap-8 w-full">
          <Link to="/">
            <Button 
              variant="ghost" 
              size="icon" 
              className={`${isLightMode ? 'text-gray-600 hover:text-gray-800 hover:bg-gray-100' : 'text-muted-foreground hover:text-foreground hover:bg-accent/30'}`}
            >
              <Calendar className="h-5 w-5" />
            </Button>
          </Link>
          <Link to="/todos">
            <Button 
              variant="ghost" 
              size="icon" 
              className={`${isLightMode ? 'text-gray-600 hover:text-gray-800 hover:bg-gray-100' : 'text-muted-foreground hover:text-foreground hover:bg-accent/30'}`}
            >
              <CheckCircle2 className="h-5 w-5" />
            </Button>
          </Link>
          <Link to="/long-term">
            <Button 
              variant="ghost" 
              size="icon" 
              className={`${isLightMode ? 'text-gray-600 hover:text-gray-800 hover:bg-gray-100' : 'text-muted-foreground hover:text-foreground hover:bg-accent/30'}`}
            >
              <Clock className="h-5 w-5" />
            </Button>
          </Link>
          <Link to="/progress">
            <Button 
              variant="ghost" 
              size="icon" 
              className={`${isLightMode ? 'text-purple-600 hover:bg-purple-100' : 'text-purple-500 hover:text-purple-600 hover:bg-accent/30'}`}
            >
              <BarChart className="h-5 w-5" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
            className={`${isLightMode ? 'text-amber-500 hover:text-amber-600 hover:bg-amber-50' : 'text-muted-foreground hover:text-foreground hover:bg-accent/30'}`}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskProgress;
