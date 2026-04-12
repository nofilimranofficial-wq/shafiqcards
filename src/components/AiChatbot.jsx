import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import avatarImg from '../assets/ShafiqCards_Logo.jpg';

// A simple frontend-only AI chatbot that examines the user's prompt and
// navigates to the appropriate collection page with the search query.
// No backend or Python runtime is required; redirection gives the results.
const AiChatbot = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  // we no longer display results inside chatbot; navigation handles filtering
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  // chat messages for UI
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Welcome to Shafiq Cards! How can I help you today?' }
  ]);
  const quickOptions = [
    { label: 'Invitations', value: 'show elegant invitation cards' },
    { label: 'Corporate Boxes', value: 'show corporate box designs' },
    { label: 'Envelopes', value: 'show envelope designs' }
  ];


  const sendPrompt = async () => {
    if (!prompt.trim()) return;
    // add user message
    setMessages((m) => [...m, { from: 'user', text: prompt }]);

    // redirect logic based on keywords
    const lower = prompt.toLowerCase();
    // improved redirection: send to invitations whenever user mentions cards,
    // elegant/elegance keywords or explicit 'invitation'
    if (
      lower.includes('invitation') ||
      lower.includes('card') ||
      lower.includes('elegant') ||
      lower.includes('elegance')
    ) {
      navigate(`/invitations?search=${encodeURIComponent(prompt)}`);
    } else if (lower.includes('box') || lower.includes('corporate')) {
      navigate('/box-packaging');
    } else if (lower.includes('envelope')) {
      navigate(`/envelopes?search=${encodeURIComponent(prompt)}`);
    }

    // user message added above; bot closing
    setMessages((m) => [...m, { from: 'bot', text: 'Redirecting you...' }]);
    // clear and close chat after redirect
    setPrompt('');
    setVisible(false);
    setLoading(false);
    return;
  };

  return (
    <>
      <button
        onClick={() => setVisible((v) => !v)}
        className="fixed bottom-6 right-6 sm:bottom-6 sm:right-6 bg-gray-600 hover:bg-gray-700 text-white rounded-full w-20 h-20 sm:w-16 sm:h-16 shadow-lg flex items-center justify-center text-2xl sm:text-xl z-50 transform hover:scale-110 transition-transform duration-200"
        title="AI Assistant"
      >
        Ai
      </button>
      {visible && (
        <div className="fixed bottom-20 right-6 sm:right-4 sm:bottom-16 w-80 max-w-full sm:w-72 md:w-80 bg-gray-100 rounded-3xl shadow-2xl z-50 flex flex-col ring-2 ring-gray-300">
          <div className="p-4 border-b border-gray-300 bg-gray-200 rounded-t-3xl flex items-center gap-2">
            <img src={avatarImg} alt="avatar" className="w-8 h-8 rounded-full" />
            <h2 className="text-lg font-semibold text-gray-800">Chat with AI</h2>
            <span className="ml-auto text-xs text-gray-600">We are online!</span>
            <button
              onClick={() => setVisible(false)}
              className="ml-2 text-gray-500 hover:text-gray-700"
              title="Close chat"
            >
              ✕
            </button>
          </div>
          <div className="p-4 flex-grow overflow-y-auto flex flex-col gap-3">
            {/* message history */}
            <div className="flex flex-col space-y-2 mb-2">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`max-w-[80%] px-3 py-2 rounded-lg ${
                    msg.from === 'bot' ? 'bg-gray-200 self-start' : 'bg-gray-600 text-white self-end'
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>
            {/* quick options */}
            <div className="flex flex-wrap gap-2">
              {quickOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setPrompt(opt.value);
                    sendPrompt();
                  }}
                  className="px-3 py-1 bg-gray-200 rounded-full text-sm hover:bg-gray-300"
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {/* manual input */}
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you need..."
              className="w-full h-20 p-3 border border-gray-300 rounded-xl resize-none outline-none focus:border-gray-500"
            />
            <button
              onClick={sendPrompt}
              disabled={loading}
              className="mt-1 px-4 py-2 bg-gray-600 text-white rounded-full w-full hover:bg-gray-700 disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Go'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AiChatbot;
