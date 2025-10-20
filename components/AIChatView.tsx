import React, { useState, useRef, useEffect } from 'react';
import { useAPIKey } from '../contexts/APIKeyContext';
import { useJournal } from '../hooks/useDataHooks';
import { useHabits } from '../hooks/useDataHooks';
import { useProjects } from '../hooks/useDataHooks';
import { LogoIcon, SparklesIcon } from './icons';

// Define types locally to avoid top-level import that breaks the build
type Chat = any;

interface Message {
    role: 'user' | 'model';
    text: string;
}

const AIChatView: React.FC = () => {
    const { apiKey } = useAPIKey();
    const { entries: journalEntries } = useJournal();
    const { habits } = useHabits();
    const { projects } = useProjects();

    const [genAI, setGenAI] = useState<{ GoogleGenAI: new (args: { apiKey: string }) => any } | null>(null);
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Effect to dynamically load the library from its full URL
    useEffect(() => {
        import('https://aistudiocdn.com/google-genai@0.0.0-20240723-163450-beta/beta')
            .then(module => {
                setGenAI(module);
            })
            .catch(e => {
                console.error("Failed to load @google/genai module", e);
                setError("Failed to load AI library.");
            });
    }, []);
    
    const initializeChat = () => {
        if (!apiKey) {
            setError("API Key is not set. Please add it in the 'More' tab under Settings.");
            return;
        }
        if (!genAI) {
            // Library isn't loaded yet, this will be called again by the effect
            return;
        }
        setError(null);
        
        const context = `
            USER'S DATA CONTEXT:
            - Today's Date: ${new Date().toLocaleDateString()}
            - Journal Entries: ${JSON.stringify(journalEntries.slice(0, 30))}
            - Habits: ${JSON.stringify(habits)}
            - Projects: ${JSON.stringify(projects)}
        `;

        const systemInstruction = `You are a helpful and insightful assistant for the '7k Life' personal tracking app. Your name is Kai.
        Analyze the user's data (provided below) to answer their questions. Be encouraging, observant, and help them find patterns or insights in their logs, habits, and projects.
        Keep your answers concise and conversational. Use markdown for formatting if it helps readability.
        ${context}
        `;
        
        try {
            const ai = new genAI.GoogleGenAI({ apiKey });
            const newChat = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: {
                    systemInstruction,
                },
            });
            setChat(newChat);
        } catch (e) {
            console.error(e);
            setError("Failed to initialize the AI model. Please check your API key and try again.");
        }
    };
    
    // Effect to initialize chat when API key and library are ready
    useEffect(() => {
        initializeChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [apiKey, genAI, journalEntries, habits, projects]);


    const sendMessage = async () => {
        if (!input.trim() || loading) return;

        if (!chat) {
            setError("Chat is not ready. Please wait a moment.");
            initializeChat(); // Attempt to re-initialize
            return;
        }

        const userMessage: Message = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const result = await chat.sendMessage({ message: input });
            const modelMessage: Message = { role: 'model', text: result.text };
            setMessages(prev => [...prev, modelMessage]);
        } catch (e) {
            console.error(e);
            const errorMessage: Message = { role: 'model', text: "Sorry, I encountered an error. Please check your API Key and network connection." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    return (
        <div className="bg-gray-50 dark:bg-neutral-800 rounded-2xl shadow-inner h-[70vh] flex flex-col p-4 border border-black/5 dark:border-white/5">
            {!apiKey ? (
                 <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <SparklesIcon className="w-16 h-16 text-gray-300 dark:text-neutral-600 mb-4" />
                    <h3 className="font-bold text-lg text-gray-800 dark:text-neutral-100">AI Assistant is Offline</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-1 max-w-xs">Please set your Gemini API key in the 'More' tab to enable this feature.</p>
                </div>
            ) : (
                <>
                    <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                        {messages.length === 0 && !loading && (
                            <div className="flex-1 flex flex-col items-center justify-center text-center">
                                <LogoIcon className="w-16 h-16 opacity-70 mb-4" />
                                <h3 className="font-bold text-lg text-gray-800 dark:text-neutral-100">Hi, I'm Kai</h3>
                                <p className="text-gray-500 dark:text-gray-400 mt-1 max-w-xs">Ask me about your habits, journal entries, or projects!</p>
                            </div>
                        )}
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-neutral-700'}`}>
                                    <p className="text-sm" dangerouslySetInnerHTML={{__html: msg.text.replace(/\n/g, '<br />')}}></p>
                                </div>
                            </div>
                        ))}
                         {loading && (
                            <div className="flex justify-start">
                                <div className="max-w-xs md:max-w-md p-3 rounded-2xl bg-white dark:bg-neutral-700">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                     <div className="mt-4 flex items-center space-x-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask about your data..."
                            disabled={loading || !!error || !genAI}
                            className="flex-grow w-full px-4 py-2 bg-white dark:bg-neutral-700 border border-gray-300 dark:border-neutral-600 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button onClick={sendMessage} disabled={loading || !input.trim() || !genAI} className="bg-indigo-600 text-white p-2 rounded-full shadow hover:bg-indigo-700 transition-colors disabled:bg-indigo-300 disabled:cursor-not-allowed">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                            </svg>
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default AIChatView;