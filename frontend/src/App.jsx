import React, { useState } from 'react';
import ChatArea from './components/ChatArea';
import InputArea from './components/InputArea';
import { Sparkles } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/chat';

function App() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (text) => {
    // Add user message immediately
    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Prepared messages for API (cleaner format if needed, but our backend accepts standard same format)
      // Note: Backend expects context. 
      // We pass only text content for simplicity in UI, but backend handles tool_results. 
      // For this MVP, we will send just the text history to the backend endpoint which acts as "Claude".
      // BUT WAIT: Our backend `processChat` takes `messages[]`. 
      // If we just send what we display, `content` might be an object (the Quote JSON).
      // We need to transform previous JSON responses back to string or handle them correctly.
      // For simplicity, we'll re-format our state messages to stringified content for the API if they are objects.

      const apiMessages = newMessages.map(msg => ({
        role: msg.role,
        content: typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content)
      }));

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Check if this is a token limit error
        if (data.mensaje && data.mensaje.includes('Se agotaron los tokens')) {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: { tipo: 'error_tokens', mensaje: data.mensaje }
          }]);
        } else {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: { tipo: 'error', mensaje: data.mensaje || 'Error del servidor' }
          }]);
        }
        return;
      }

      // Add assistant response
      setMessages(prev => [...prev, { role: 'assistant', content: data }]);

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: { tipo: 'error', mensaje: 'Error conectando con el servidor. Verifica tu conexión.' }
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionSelect = (option) => {
    handleSend(option);
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans selection:bg-primary/30">
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[120px]" />
      </div>

      <main className="flex-1 flex flex-col relative z-10 min-w-0">
        {/* Header Mobile / Desktop */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#0f0f12]/50 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              QuoteMaster
            </h1>
            <div className="px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] text-primary font-medium flex items-center gap-1">
              <Sparkles size={10} />
              AI Beta
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-xs text-gray-500 hidden sm:block">v1.2.0</div>
          </div>
        </header>

        <ChatArea
          messages={messages}
          isLoading={isLoading}
          onOptionSelect={handleOptionSelect}
        />

        <InputArea onSend={handleSend} disabled={isLoading} />
      </main>
    </div>
  );
}

export default App;
