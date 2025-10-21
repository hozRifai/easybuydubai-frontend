import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Hero, Services, About, Contact, Navigation, ChatWidget, Footer } from '@components';
import EnhancedChat from '@pages/Chat/EnhancedChat';
import './App.css';

function HomePage() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="app">
      <Navigation />

      <main className="main-content">
        <Hero />
        <Services />
        <About />
        <Contact />
      </main>

      <Footer />

      <ChatWidget
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen(!isChatOpen)}
      />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chat" element={<EnhancedChat />} />
      </Routes>
    </Router>
  );
}

export default App;