import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import Overview from "./pages/Overview";
import RealTimeAnalytics from "./pages/RealTimeAnalytics";
import CustomReports from "./pages/CustomReports";
import AIInsights from "./pages/AIInsights";
import MLModels from "./pages/MLModels";
import Predictions from "./pages/Predictions";
import DataSources from "./pages/DataSources";
import Users from "./pages/Users";
import APILogs from "./pages/APILogs";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/overview" element={<Overview />} />
            <Route path="/analytics/realtime" element={<RealTimeAnalytics />} />
            <Route path="/analytics/reports" element={<CustomReports />} />
            <Route path="/ai/insights" element={<AIInsights />} />
            <Route path="/ai/models" element={<MLModels />} />
            <Route path="/ai/predictions" element={<Predictions />} />
            <Route path="/data/sources" element={<DataSources />} />
            <Route path="/data/users" element={<Users />} />
            <Route path="/data/logs" element={<APILogs />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
