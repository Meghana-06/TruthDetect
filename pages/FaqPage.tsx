import React, { useState } from 'react';
import { FAQ_DATA } from '../constants';

const FaqItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 dark:border-gray-800 py-4">
      <button
        className="w-full flex justify-between items-center text-left text-lg font-semibold text-black dark:text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{question}</span>
        <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>
      {isOpen && (
        <div className="mt-4 text-black dark:text-gray-300 animate-fade-in-down">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

const FaqPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold text-center mb-8 text-black dark:text-white">Frequently Asked Questions</h1>
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-800">
        {FAQ_DATA.map((item, index) => (
          <FaqItem key={index} question={item.question} answer={item.answer} />
        ))}
      </div>
       <div className="text-center mt-12">
        <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">Still have questions?</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-4">Contact our support team for further assistance.</p>
        <a href="tel:+1234567890" className="inline-block bg-black text-white dark:bg-white dark:text-black font-bold py-3 px-6 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
          Call Support
        </a>
      </div>
    </div>
  );
};

export default FaqPage;