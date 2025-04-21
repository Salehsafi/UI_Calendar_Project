
import React, { useState, useEffect } from 'react';
import { Trash2, Calendar, BarChart, Moon, Sun, Plus, ArrowLeft, CheckCircle2, ListTodo, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useTheme } from 'next-themes';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

interface LongTermTask {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  dueDate?: Date;
}

const LongTermTasks = () => {
  const [tasks, setTasks] = useState<LongTermTask[]>([]);
  const [newTask, setNewTask] = useState('');
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const isLightMode = theme === 'light';

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const storedTasks = localStorage.getItem('longTermTasks');
    if (storedTasks) {
      try {
        const parsedTasks = JSON.parse(storedTasks).map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined
        }));
        setTasks(parsedTasks);
      } catch (error) {
        console.error('Error parsing stored long-term tasks:', error);
      }
    }
  }, []);

  // Save tasks to localStorage whenever the tasks state changes
  useEffect(() => {
    localStorage.setItem('longTermTasks', JSON.stringify(tasks));
    // Dispatch event for other components (like Progress) to know tasks changed
    const event = new Event('storage');
    window.dispatchEvent(event);
  }, [tasks]);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim() === '') return;
    
    const task: LongTermTask = {
      id: uuidv4(),
      text: newTask,
      completed: false,
      createdAt: new Date(),
    };
    
    setTasks([...tasks, task]);
    setNewTask('');
    
    toast({
      title: "Long-term goal added",
      description: "Your long-term goal was added successfully",
    });
  };

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
    
    toast({
      title: "Goal deleted",
      description: "Your long-term goal was deleted successfully",
      variant: "destructive",
    });
  };

  const clearCompleted = () => {
    setTasks(tasks.filter(task => !task.completed));
    
    toast({
      title: "Completed goals cleared",
      description: "All completed goals have been removed",
    });
  };

  // Sort tasks: incomplete first, then by creation date (newest first)
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground py-8 px-4">
      <Card className={`w-full max-w-2xl shadow-lg ${isLightMode ? 'light-mode-shadow' : ''}`}>
        <CardHeader className="pb-2">
          <div className="flex items-center mb-3">
            <Link to="/">
              <Button variant="outline" size="icon" className="mr-3">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <CardTitle className="text-2xl font-bold text-purple-500">Long-Term Goals</CardTitle>
              <CardDescription>Plan your future achievements</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Add task form */}
          <form onSubmit={addTask}>
            <div className="relative flex items-center">
              <Input 
                placeholder="Add a new long-term goal..." 
                value={newTask} 
                onChange={(e) => setNewTask(e.target.value)}
                className="pr-20 border-purple-500/30 focus-visible:ring-purple-500/30"
              />
              <Button 
                type="submit"
                size="sm"
                className="absolute right-0 rounded-l-none text-primary-foreground"
                disabled={!newTask.trim()}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </form>

          {/* Task list */}
          <div className="bg-card rounded-lg overflow-hidden border border-purple-500/20">
            {sortedTasks.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center justify-center space-y-4 py-12">
                <div className="bg-purple-100 dark:bg-purple-900/30 p-4 rounded-full">
                  <Clock className="h-12 w-12 text-purple-500" />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">No long-term goals yet</h3>
                  <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                    Add your first long-term goal using the field above and start planning your future!
                  </p>
                </div>
                <Button 
                  onClick={() => document.querySelector('input')?.focus()} 
                  variant="outline" 
                  size="sm"
                  className="mt-2 border-purple-500/30 text-purple-500 hover:bg-purple-500/10"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Create First Goal
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-purple-500/10">
                {sortedTasks.map((task) => (
                  <div 
                    key={task.id} 
                    className="flex items-center gap-3 p-3 hover:bg-accent/10 transition-colors"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`rounded-full p-0 h-6 w-6 ${
                        task.completed 
                          ? "text-purple-600 bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30 dark:hover:bg-purple-900/50" 
                          : "text-muted-foreground hover:text-purple-500"
                      }`}
                      onClick={() => toggleTask(task.id)}
                    >
                      <CheckCircle2 className={`h-5 w-5 ${task.completed ? "fill-purple-200 dark:fill-purple-900/50" : ""}`} />
                    </Button>
                    <span 
                      className={`${
                        task.completed 
                          ? "line-through text-muted-foreground" 
                          : "text-foreground"
                      } flex-grow transition-colors`}
                      onClick={() => toggleTask(task.id)}
                    >
                      {task.text}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => deleteTask(task.id)}
                      className="h-7 w-7 rounded-full text-muted-foreground hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Clear completed button */}
          {tasks.some(task => task.completed) && (
            <div className="text-center">
              <Button 
                variant="outline"
                size="sm"
                onClick={clearCompleted}
                className="border-purple-500/30 text-purple-500 hover:bg-purple-500/10 transition-colors"
              >
                Clear Completed
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Bottom navigation */}
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
              className={`${isLightMode ? 'text-purple-600 hover:bg-purple-100' : 'text-purple-500 hover:text-purple-600 hover:bg-accent/30'}`}
            >
              <Clock className="h-5 w-5" />
            </Button>
          </Link>
          <Link to="/progress">
            <Button 
              variant="ghost" 
              size="icon" 
              className={`${isLightMode ? 'text-gray-600 hover:text-gray-800 hover:bg-gray-100' : 'text-muted-foreground hover:text-foreground hover:bg-accent/30'}`}
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

export default LongTermTasks;
