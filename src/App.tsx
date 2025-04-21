
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import TodoList from "./pages/TodoList";
import TaskProgress from "./pages/Progress";
import LongTermTasks from "./pages/LongTermTasks";
import Calendar from "./pages/Calendar";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="system" enableSystem attribute="class">
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/todos" element={<TodoList />} />
            <Route path="/long-term" element={<LongTermTasks />} />
            <Route path="/progress" element={<TaskProgress />} />
            <Route path="/calendar" element={<Calendar />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
