import React from 'react';
import { QuoteIcon } from '../icons';

const quotes = [
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "Well done is better than well said.", author: "Benjamin Franklin" },
    { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" }
];

const getDailyQuote = () => {
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    return quotes[dayOfYear % quotes.length];
};

const QuoteWidget: React.FC = () => {
    const { text, author } = getDailyQuote();

    return (
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm p-6 space-y-4 border border-black/5 dark:border-white/5">
            <div className="flex items-center space-x-3">
                <div className="bg-green-100 dark:bg-green-900/50 p-2 rounded-full">
                    <QuoteIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-neutral-100">Daily Quote</h2>
            </div>
            <figure>
                <blockquote className="text-gray-600 dark:text-neutral-300 italic">
                    <p>"{text}"</p>
                </blockquote>
                <figcaption className="text-right text-gray-500 dark:text-neutral-400 text-sm mt-2">
                    - {author}
                </figcaption>
            </figure>
        </div>
    );
};

export default QuoteWidget;