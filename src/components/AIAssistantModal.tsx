import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { isTelugu } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: isTelugu
        ? "నమస్తే! నేను శ్రీ సంకల్ప హాస్పిటల్ AI అసిస్టెంట్‌ని. డాక్టర్ అపాయింట్‌మెంట్స్, గైనకాలజీ & సర్జరీ సేవల సమాచారం లేదా సాధారణ ఆరోగ్య సలహాల గురించి నన్ను అడగవచ్చు."
        : "Hello! I'm Sri Sankalpa Hospital's AI Assistant. How can I help you today? You can ask me about doctor appointments, Gynecology & Laparoscopic surgery services, or general healthcare advice.",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.content,
          history: messages,
          language: isTelugu ? 'te' : 'en',
        }),
      });

      const data = await response.json();
      if (data.text) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: data.text },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: isTelugu
              ? "ప్రస్తుతం AI సేవ అందుబాటులో లేదు. దయచేసి మా హెల్ప్‌లైన్ నంబర్లకు 7095330066 / 7095330077 కు కాల్ చేయండి."
              : "I'm currently unable to connect to AI services, but our hospital team is available 24/7 at 7095330066 / 7095330077!",
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: isTelugu
            ? "ఆఫ్‌లైన్‌లో ఉంది. అత్యవసర సంప్రదింపులకు: 7095330066 / 7095330077."
            : "I'm currently offline, but you can call Sri Sankalpa Hospital helpline at 7095330066 / 7095330077.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex justify-end animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest w-full max-w-md h-full shadow-2xl flex flex-col justify-between border-l border-outline-variant/30">
        {/* Header */}
        <div className="p-4 border-b border-surface-variant flex justify-between items-center bg-teal-mist/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">smart_toy</span>
            </div>
            <div>
              <h3 className="font-bold text-sm text-primary">
                {isTelugu ? 'శ్రీ సంకల్ప లైవ్ AI అసిస్టెంట్' : 'Sri Sankalpa Live Support AI'}
              </h3>
              <p className="text-[10px] text-teal-deep font-semibold">
                {isTelugu ? 'ఆన్‌లైన్ • జెమిని AI మద్దతుతో' : 'Online • Powered by Gemini AI'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-surface-variant text-outline"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Chat Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${
                m.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-primary text-on-primary rounded-br-xs'
                    : 'bg-sand-soft text-on-surface rounded-bl-xs border border-surface-variant'
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-sand-soft p-3 rounded-2xl text-xs text-outline flex items-center gap-2">
                <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                {isTelugu ? 'శ్రీ సంకల్ప AI టైప్ చేస్తోంది...' : 'AI is typing...'}
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-surface-variant bg-surface">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={isTelugu ? 'ఏదైనా ప్రశ్న అడగండి లేదా సమస్యను తెలియజేయండి...' : 'Ask a question or describe an issue...'}
              className="flex-1 bg-sand-soft px-4 py-3 rounded-full text-xs text-on-surface outline-none border border-transparent focus:border-primary"
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="bg-primary text-on-primary p-3 rounded-full hover:bg-teal-deep transition-all disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-sm">send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
