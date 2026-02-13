
import React, { useState, useEffect, useRef } from 'react';
import { Layout } from './components/Layout';
import { ProgressChart } from './components/ProgressChart';
import { SKILLS, INITIAL_PROGRESS } from './constants';
import { SkillType, SkillDetails, Tutorial } from './types';
import { generateTutorial } from './services/geminiService';
import { GoogleGenAI } from "@google/genai";

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'skill' | 'chat'>('home');
  const [selectedSkill, setSelectedSkill] = useState<SkillDetails | null>(null);
  const [tutorial, setTutorial] = useState<Tutorial | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(INITIAL_PROGRESS);
  const [xpEvents, setXpEvents] = useState<{ id: number, x: number, y: number }[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'curator', text: string}[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  const addXpAnimation = (e: React.MouseEvent | React.TouchEvent | any) => {
    const id = Date.now();
    const x = e.clientX || (e.target as HTMLElement).getBoundingClientRect().left + 20;
    const y = e.clientY || (e.target as HTMLElement).getBoundingClientRect().top;
    
    setXpEvents(prev => [...prev, { id, x, y }]);
    setIsShaking(true);
    setTimeout(() => {
      setXpEvents(prev => prev.filter(ev => ev.id !== id));
      setIsShaking(false);
    }, 1200);
  };

  const handleSelectSkill = (skill: SkillDetails) => {
    setSelectedSkill(skill);
    setView('skill');
    loadTutorial(skill.id, "Pythonic Arcana: The First Incantation");
  };

  const loadTutorial = async (type: SkillType, topic: string) => {
    setLoading(true);
    try {
      const result = await generateTutorial(type, topic);
      setTutorial(result);
    } catch (error) {
      console.error("Failed to load tutorial:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTask = (skillName: string, e: any) => {
    addXpAnimation(e);
    setProgress(prev => prev.map(p => 
      p.skill === skillName ? { ...p, level: Math.min(100, p.level + 5) } : p
    ));
  };

  const handlePaymentRitual = async () => {
    setIsPaying(true);
    // Mimic arcane verification
    await new Promise(r => setTimeout(r, 2000));
    setHasPaid(true);
    setIsPaying(false);
    setShowPaymentModal(false);
    setView('chat');
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;
    const userMsg = { role: 'user' as const, text: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are the Curator, a dark fantasy mentor. The user asks: ${chatInput}. Reply in a gothic, helpful tone.`,
      });
      setChatMessages(prev => [...prev, { role: 'curator' as const, text: response.text || "The abyss is silent..." }]);
    } catch (e) {
      setChatMessages(prev => [...prev, { role: 'curator' as const, text: "The spectral connection faltered." }]);
    }
  };

  return (
    <Layout>
      <div className={isShaking ? 'screen-shake' : ''}>
        {/* Floating XP Effects */}
        {xpEvents.map(ev => (
          <div 
            key={ev.id} 
            className="fixed z-[100] pointer-events-none pixel-font text-yellow-500 text-sm animate-float-xp"
            style={{ left: ev.x, top: ev.y }}
          >
            +5 XP
          </div>
        ))}

        {/* Ritual of Contribution Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 animate-fadeIn">
            <div className="pixel-border bg-[#1a1a1c] w-full max-w-lg p-10 text-center space-y-8">
              <h3 className="text-3xl pixel-font text-red-600">RITUAL OF CONTRIBUTION</h3>
              <div className="relative w-32 h-32 mx-auto">
                <div className="absolute inset-0 bg-yellow-600/20 animate-pulse rounded-full blur-xl"></div>
                <div className="relative w-full h-full bg-[#2a2a2d] pixel-border flex items-center justify-center text-6xl">🪙</div>
              </div>
              <div className="space-y-4 text-gray-400">
                <p className="pixel-font text-xs">"Access to the Curator's Sanctum requires a tether of 15 Gold (USD)."</p>
                <p className="text-sm italic font-serif">"Support the scribes who maintain this Grimoire and unlock direct arcane guidance."</p>
              </div>
              <div className="flex flex-col gap-4">
                <button 
                  onClick={handlePaymentRitual}
                  disabled={isPaying}
                  className="pixel-button bg-red-900 text-xl py-4"
                >
                  {isPaying ? "VERIFYING TRIBUTE..." : "INITIATE RITUAL"}
                </button>
                <button 
                  onClick={() => setShowPaymentModal(false)}
                  className="text-gray-600 pixel-font text-[10px] uppercase hover:text-white"
                >
                  Return to Library
                </button>
              </div>
            </div>
          </div>
        )}

        {view === 'home' ? (
          <div className="space-y-12">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-1 space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold pixel-font leading-tight text-white">
                  ARCANE <span className="text-red-700">PYTHON</span> & MORE
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  {Object.values(SKILLS).map((skill) => (
                    <button
                      key={skill.id}
                      onClick={() => handleSelectSkill(skill)}
                      className="skill-card group text-left p-6 pixel-border bg-[#1a1a1c] hover:bg-[#252528] transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center gap-6">
                        <span className="text-4xl group-hover:scale-110 transition-transform">{skill.icon}</span>
                        <div>
                          <h3 className="text-2xl pixel-font group-hover:text-red-500 transition-colors uppercase">
                            {skill.fantasyName}
                          </h3>
                          <p className="text-[10px] pixel-font text-gray-500 mt-1">LVL {progress.find(p => p.skill.includes(skill.name))?.level || 0} APPRENTICE</p>
                        </div>
                      </div>
                      <div className="pixel-font text-[10px] text-red-900 hidden md:block">ENTER PATH →</div>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="w-full md:w-[400px]">
                <ProgressChart data={progress} />
                <div className="mt-4 p-6 pixel-border bg-[#1a1a1c] space-y-4">
                  <h4 className="pixel-font text-xs text-red-500">YOUR SOUL STATUS</h4>
                  <div className="h-4 bg-black pixel-border p-1 overflow-hidden">
                    <div 
                      className="h-full bg-red-700 transition-all duration-1000" 
                      style={{ width: `${(progress.reduce((a, b) => a + b.level, 0) / 300) * 100}%` }}
                    ></div>
                  </div>
                  <button 
                    onClick={() => hasPaid ? setView('chat') : setShowPaymentModal(true)}
                    className="w-full pixel-button bg-yellow-900/40 text-yellow-500 border-yellow-700"
                  >
                    {hasPaid ? "ENTER SANCTUM" : "SUMMON CURATOR"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : view === 'chat' ? (
          <div className="max-w-4xl mx-auto space-y-6">
             <button onClick={() => setView('home')} className="pixel-font text-xs text-red-500">← EXIT SANCTUM</button>
             <div className="pixel-border bg-[#050505] h-[600px] flex flex-col terminal-area">
                <div className="p-4 border-b-4 border-[#3d3d41] bg-[#1a1a1c] flex justify-between">
                   <span className="pixel-font text-xs text-yellow-600">CURATOR'S SANCTUM CHAT</span>
                   <div className="flex gap-2">
                      <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                   </div>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-4 font-serif text-lg">
                   {chatMessages.length === 0 && <p className="text-gray-500 italic">"The Curator awaits your query, student of the Pythonic arts..."</p>}
                   {chatMessages.map((m, i) => (
                      <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                         <div className={`max-w-[80%] p-4 pixel-border ${m.role === 'user' ? 'bg-red-900/20 text-white border-red-900' : 'bg-gray-900 text-gray-300'}`}>
                            <span className="block text-[10px] pixel-font mb-2 opacity-50 uppercase">{m.role}</span>
                            {m.text}
                         </div>
                      </div>
                   ))}
                </div>
                <div className="p-4 bg-[#1a1a1c] flex gap-2">
                   <input 
                      className="flex-1 bg-black border-4 border-[#3d3d41] p-3 text-white pixel-font text-xs outline-none focus:border-red-600"
                      placeholder="Whisper your question..."
                      value={chatInput}
                      onChange={e => setChatInput(e.target.value)}
                      onKeyPress={e => e.key === 'Enter' && sendChatMessage()}
                   />
                   <button onClick={sendChatMessage} className="pixel-button bg-red-900">SEND</button>
                </div>
             </div>
          </div>
        ) : (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex justify-between items-center">
              <button onClick={() => setView('home')} className="pixel-font text-xs text-red-500">← BACK TO CITADEL</button>
              <button 
                onClick={() => hasPaid ? setView('chat') : setShowPaymentModal(true)}
                className="pixel-font text-xs text-yellow-500"
              >
                {hasPaid ? "💬 CURATOR CHAT" : "🔒 SUMMON CURATOR"}
              </button>
            </div>

            {selectedSkill && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                  <div className="pixel-border bg-[#1a1a1c] p-6 text-center">
                    <div className="text-7xl mb-4">{selectedSkill.icon}</div>
                    <h2 className="text-2xl pixel-font text-red-600 mb-2">{selectedSkill.fantasyName}</h2>
                    <p className="text-xs italic text-gray-400">{selectedSkill.lore}</p>
                  </div>
                  
                  {selectedSkill.id === SkillType.PYTHON && (
                    <div className="pixel-border bg-black terminal-area p-4 min-h-[200px]">
                      <h4 className="pixel-font text-[8px] text-green-500 mb-2">ARCANE_SHELL_V1.0.py</h4>
                      <div className="text-green-500 pixel-font text-[10px] space-y-2 opacity-80">
                         <p>>>> from arcane import spells</p>
                         <p>>>> spells.ignite(logic="clean")</p>
                         <p className="text-red-500">[SYSTEM]: Logic fuel detected...</p>
                         <p className="animate-pulse">_</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="lg:col-span-2 space-y-6">
                  {loading ? (
                    <div className="pixel-border bg-[#1a1a1c] p-20 flex flex-col items-center justify-center space-y-6">
                      <div className="w-16 h-16 border-4 border-red-600 border-t-transparent animate-spin"></div>
                      <p className="pixel-font text-sm">REVEALING THE INVISIBLE INK...</p>
                    </div>
                  ) : tutorial && (
                    <div className="pixel-border bg-[#1a1a1c] p-8 space-y-8">
                      <div className="border-b-4 border-red-900 pb-4">
                         <h3 className="text-3xl pixel-font text-white">{tutorial.title}</h3>
                         <span className="text-[10px] pixel-font text-gray-500">{tutorial.difficulty} PATH</span>
                      </div>
                      
                      <div className="font-serif text-xl leading-relaxed whitespace-pre-wrap">
                        {tutorial.content}
                      </div>

                      <div className="grid gap-4">
                        {tutorial.tasks.map((task, idx) => (
                          <div key={idx} className="flex items-center gap-6 p-6 pixel-border bg-black/40 group hover:bg-red-900/10 transition-all cursor-pointer" onClick={(e) => handleCompleteTask(selectedSkill.name, e)}>
                            <div className="w-8 h-8 pixel-border flex items-center justify-center group-hover:bg-red-900 transition-colors">⚡</div>
                            <p className="pixel-font text-xs flex-1">{task}</p>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-end gap-4">
                        <button className="pixel-button bg-gray-800" onClick={() => setView('home')}>REPOSE</button>
                        <button className="pixel-button bg-red-900" onClick={() => loadTutorial(selectedSkill.id, "Advanced Python Sorcery")}>NEXT RITUAL</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default App;
