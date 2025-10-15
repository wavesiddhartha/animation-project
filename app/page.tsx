'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GenerationResult {
  explanation: string;
  manimCode: string;
  videoPath?: string;
  audioPath?: string;
}

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  videoPath?: string;
  timestamp: Date;
}

export default function Home() {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'input' | 'generating' | 'rendering' | 'audio' | 'complete'>('input');
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [progress, setProgress] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);

  // Auto-scroll to latest message
  useEffect(() => {
    if (messages.length > 0) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  // Download video function
  const handleDownload = (videoPath: string, topicName: string) => {
    const link = document.createElement('a');
    link.href = videoPath;
    link.download = `${topicName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_animation.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleGenerate = async () => {
    if (!topic.trim()) return;

    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: topic,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      setLoading(true);
      setStep('generating');
      setProgress(10);
      setTopic(''); // Clear input immediately

      // Step 1: Generate explanation and Manim code with DeepSeek R1
      const generateRes = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, difficulty: 'advanced' }), // Always use advanced level
      });

      if (!generateRes.ok) {
        throw new Error('Failed to generate content');
      }

      const generateData = await generateRes.json();
      setProgress(40);

      if (!generateData.success) {
        throw new Error(generateData.error);
      }

      const { explanation, manimCode } = generateData.data;
      setResult({ explanation, manimCode });

      // Step 2: Render Manim animation
      setStep('rendering');
      setProgress(50);

      const renderRes = await fetch('/api/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: manimCode, quality: 'medium' }),
      });

      if (!renderRes.ok) {
        throw new Error('Failed to render animation');
      }

      const renderData = await renderRes.json();
      setProgress(70);

      if (!renderData.success) {
        const errorMsg = renderData.details || renderData.error || 'Unknown rendering error';
        console.error('Render error details:', renderData);
        throw new Error(`Rendering failed: ${errorMsg}`);
      }

      // Skip audio for now - focus on animation
      setProgress(100);

      // Add assistant message with video
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: explanation,
        videoPath: renderData.videoPath,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);

      setStep('complete');
    } catch (error: any) {
      console.error('Generation error:', error);

      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `Sorry, I encountered an error: ${error.message || 'Unknown error'}. Please try again.`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);

      setStep('input');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-white">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-8 py-5 flex items-center justify-between">
          <motion.h1
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold text-black tracking-tight"
          >
            ihavenoenemy
          </motion.h1>
          <motion.button
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setMessages([]);
              setStep('input');
              setResult(null);
            }}
            className="text-sm font-medium text-gray-700 hover:text-black transition-all duration-200 px-5 py-2.5 rounded-xl hover:bg-gray-100 border border-gray-200 hover:border-gray-300"
          >
            ✨ New Chat
          </motion.button>
        </div>
      </header>

      {/* Chat Container */}
      <div className="flex-1 flex flex-col pt-20 pb-8">
        {/* Empty State or Messages */}
        {messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto px-6"
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-6xl font-bold text-black mb-6 text-center tracking-tight"
            >
              What would you like to learn?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 mb-12 text-center max-w-2xl leading-relaxed"
            >
              Enter any mathematical concept and I&apos;ll create a beautiful animated explanation
            </motion.p>

            {/* Centered Search Input on Homepage */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="w-full max-w-2xl mb-12"
            >
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !loading && handleGenerate()}
                  placeholder="Ask me anything about mathematics..."
                  disabled={loading}
                  className="w-full pl-5 pr-14 py-4 rounded-full border-2 border-gray-300 focus:border-gray-500 focus:outline-none transition-all text-base disabled:opacity-50 disabled:bg-gray-50 disabled:cursor-not-allowed bg-white shadow-md placeholder:text-gray-400 hover:border-gray-400 hover:shadow-lg"
                />

                {/* Send Button - ChatGPT Style (Circular) */}
                <button
                  onClick={handleGenerate}
                  disabled={!topic.trim() || loading}
                  className={`absolute right-2 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                    !topic.trim() || loading
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-black text-white hover:bg-gray-800 cursor-pointer hover:scale-105 active:scale-95'
                  }`}
                >
                  {loading ? (
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                  )}
                </button>
              </div>
            </motion.div>

            {/* Example prompts - Enhanced */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl">
              {[
                'Explain the Pythagorean Theorem',
                'How does calculus work?',
                'What are prime numbers?',
                'Visualize the Fibonacci sequence',
              ].map((example, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + 0.1 * i, type: 'spring', stiffness: 100 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setTopic(example)}
                  className="text-left p-6 rounded-2xl border border-gray-200 hover:border-gray-400 hover:bg-gray-50 hover:shadow-md transition-all duration-300 text-base text-gray-800 font-medium group"
                >
                  <span className="group-hover:text-black transition-colors">{example}</span>
                  <svg className="w-5 h-5 inline-block ml-2 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">
              <AnimatePresence mode="popLayout">
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.type === 'user' ? (
                      <motion.div
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        className="bg-black text-white px-6 py-4 rounded-2xl max-w-[80%] shadow-md"
                      >
                        <p className="text-sm md:text-base font-medium">{message.content}</p>
                      </motion.div>
                    ) : (
                      <div className="max-w-full space-y-5">
                        {/* Video with Download Button */}
                        {message.videoPath && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring' }}
                            className="relative group"
                          >
                            <div className="rounded-3xl overflow-hidden border-2 border-gray-200 bg-black shadow-lg hover:shadow-xl transition-shadow">
                              <video
                                controls
                                autoPlay
                                loop
                                className="w-full"
                                src={message.videoPath}
                              />
                            </div>

                            {/* Download Button - Apple Style */}
                            <motion.button
                              onClick={() => handleDownload(message.videoPath!, messages[index - 1]?.content || 'animation')}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm hover:bg-white text-black p-3 rounded-full shadow-lg border border-gray-200 opacity-0 group-hover:opacity-100 transition-all duration-200"
                              title="Download video"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                            </motion.button>
                          </motion.div>
                        )}

                        {/* Explanation */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="bg-gradient-to-br from-gray-50 to-gray-100 px-7 py-5 rounded-3xl border border-gray-200 shadow-sm"
                        >
                          <p className="text-sm md:text-base text-gray-800 leading-relaxed whitespace-pre-wrap">
                            {message.content}
                          </p>
                        </motion.div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Loading State */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-50 px-6 py-4 rounded-2xl">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {step === 'generating' && 'Creating animation...'}
                      {step === 'rendering' && 'Rendering video...'}
                      {step === 'audio' && 'Generating audio...'}
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        )}
      </div>

    </main>
  );
}
