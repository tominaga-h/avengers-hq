import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Tasks } from './pages/Tasks';
import { TaskDetail } from './pages/TaskDetail';
import { Agents } from './pages/Agents';
import { AgentDetail } from './pages/AgentDetail';
import { SendMessage } from './pages/SendMessage';
import { Inbox } from './pages/Inbox';
import { Alerts } from './pages/Alerts';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-shield-dark flex flex-col">
        <Header onMenuClick={() => setSidebarOpen(prev => !prev)} />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            <Routes>
              <Route path="/"           element={<Dashboard />} />
              <Route path="/tasks"      element={<Tasks />} />
              <Route path="/tasks/:id" element={<TaskDetail />} />
              <Route path="/agents"     element={<Agents />} />
              <Route path="/agents/:id" element={<AgentDetail />} />
              <Route path="/send"       element={<SendMessage />} />
              <Route path="/inbox"      element={<Inbox />} />
              <Route path="/alerts"     element={<Alerts />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}
