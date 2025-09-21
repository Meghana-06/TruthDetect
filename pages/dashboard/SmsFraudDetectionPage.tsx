import React, { useState } from 'react';
import { Page, SmsAnalysisResult } from '../../types';
import DashboardCard from '../../components/DashboardCard';
import { ICONS } from '../../constants';
import { analyzeSmsForFraud } from '../../services/geminiService';

const SmsFraudDetectionPage: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => {
    const [smsText, setSmsText] = useState('');
    const [messageType, setMessageType] = useState('alphanumeric');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<SmsAnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleAnalyze = async () => {
        if (!smsText.trim()) {
            setError("SMS message cannot be empty.");
            return;
        }
        setIsLoading(true);
        setResult(null);
        setError(null);

        try {
            const analysisResult = await analyzeSmsForFraud(smsText, messageType);
            setResult(analysisResult);
        } catch (err) {
            console.error(err);
            setError("Failed to analyze the SMS. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const getResultContent = () => {
        if (!result) return null;

        if (result.classification === 'safe') {
            return (
                <div className="text-center">
                    <div className="mx-auto bg-green-100 dark:bg-green-900/50 rounded-full h-16 w-16 flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <h4 className="font-bold text-xl text-green-600 dark:text-green-400">Message Appears Safe</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{result.explanation}</p>
                </div>
            );
        }
        if (result.classification === 'fraud') {
            return (
                 <div className="text-center">
                     <div className="mx-auto bg-red-100 dark:bg-red-900/50 rounded-full h-16 w-16 flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    </div>
                    <h4 className="font-bold text-xl text-red-600 dark:text-red-400">Potential Fraud Detected</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{result.explanation}</p>
                    <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <p className="font-semibold">If you suspect fraud, report it immediately:</p>
                        <p className="mt-2">Cybercrime Helpline: <strong className="text-lg">1930</strong></p>
                        <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" className="mt-2 inline-block bg-black text-white dark:bg-white dark:text-black font-bold py-2 px-4 rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 text-sm transition-colors">
                            Report on Portal
                        </a>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div>
            <button onClick={() => onNavigate('dashboard')} className="text-sm font-medium text-black dark:text-white underline hover:opacity-80 mb-4">
                &larr; Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold mb-2 text-center text-black dark:text-white">SMS Fraud Detection</h1>
            <p className="text-center text-gray-500 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                Paste an SMS message and select the sender ID type to check for potential signs of fraud.
            </p>

            <div className="max-w-2xl mx-auto">
                <DashboardCard title="SMS Analysis" icon={ICONS.sms}>
                    <div className="flex flex-col items-center space-y-4">
                        <textarea
                            value={smsText}
                            onChange={(e) => setSmsText(e.target.value)}
                            placeholder="Paste the suspicious SMS message here..."
                            className="w-full h-32 p-3 bg-gray-100 dark:bg-gray-800 rounded-md border border-gray-300 dark:border-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
                            disabled={isLoading}
                        />
                        <div className="w-full">
                            <label htmlFor="message-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Sender ID Type
                            </label>
                            <select
                                id="message-type"
                                value={messageType}
                                onChange={(e) => setMessageType(e.target.value)}
                                className="w-full p-3 bg-gray-100 dark:bg-gray-800 rounded-md border border-gray-300 dark:border-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
                                disabled={isLoading}
                            >
                                <option value="alphanumeric">Alphanumeric (e.g., VM-NOTICE)</option>
                                <option value="alphabetic">Alphabetic (e.g., CompanyName)</option>
                                <option value="numeric">Numeric (e.g., +911234567890)</option>
                                <option value="otp">6-8 digits company OTP message</option>
                            </select>
                        </div>

                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        
                        <button
                            onClick={handleAnalyze}
                            disabled={isLoading || !smsText}
                            className="w-full bg-black hover:bg-gray-800 text-white dark:bg-white dark:hover:bg-gray-200 dark:text-black font-bold py-3 px-4 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Analyzing...
                                </>
                            ) : (
                                "Analyze SMS"
                            )}
                        </button>
                    </div>
                </DashboardCard>
                
                {result && (
                    <div className="mt-8 animate-fade-in-up">
                        <DashboardCard title="Analysis Result" icon={ICONS.insights}>
                            {getResultContent()}
                        </DashboardCard>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SmsFraudDetectionPage;