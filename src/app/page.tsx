// app/page.tsx
'use client'
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

// Import canvas-confetti dynamically to avoid SSR issues
const ConfettiModule = dynamic(() => import('canvas-confetti'), { ssr: false });

// Define types for our command objects
interface Command {
  command: string;
  delay: number;
  isSystem?: boolean;
  final?: boolean;
  response?: string;
  text?: string;
}

interface CommandHistoryItem {
  text: string;
  isSystem: boolean;
}

export default function Home() {
  const [isLaunching, setIsLaunching] = useState(false);
  const [commandHistory, setCommandHistory] = useState<CommandHistoryItem[]>([]);
  const [currentLine, setCurrentLine] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [launchComplete, setLaunchComplete] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Enhanced commands to run in sequence
  const launchCommands: Command[] = [
    { command: 'sudo initialize-fest-environment', delay: 2000 },
    { command: 'npm install --save fest-dependencies', delay: 2000 },
    { command: 'Loading event modules... [████████░░] 80%', delay: 1000, isSystem: true },
    { command: 'Loading event modules... [██████████] 100%', delay: 800, isSystem: true },
    { command: 'Configuring stage lights... [██████░░░░] 60%', delay: 1000, isSystem: true },
    { command: 'Configuring stage lights... [██████████] 100%', delay: 800, isSystem: true },
    { command: 'Setting up sound system... [███░░░░░░░] 30%', delay: 1000, isSystem: true },
    { command: 'Setting up sound system... [███████░░░] 70%', delay: 800, isSystem: true },
    { command: 'Setting up sound system... [██████████] 100%', delay: 800, isSystem: true },
    { command: 'Preparing confetti launchers... [█████░░░░░] 50%', delay: 1000, isSystem: true },
    { command: 'Preparing confetti launchers... [██████████] 100%', delay: 800, isSystem: true },
    { command: 'chmod +x launch.sh && ./launch.sh', delay: 1500 },
    { command: '> Initializing security protocols...', delay: 800, isSystem: true },
    { command: '> Establishing network connections...', delay: 800, isSystem: true },
    { command: '> Creating access tokens...', delay: 800, isSystem: true },
    { command: 'npm run launch-event --force --no-cache', delay: 1500 },
    { command: 'Launching Hostel Fest 2025...', delay: 1000, isSystem: true },
    { command: '[INFO] Launch sequence initiated', delay: 800, isSystem: true },
    { command: '[INFO] Server nodes connected', delay: 800, isSystem: true },
    { command: '[SUCCESS] LAUNCH SUCCESSFUL! Redirecting...', delay: 1500, isSystem: true, final: true }
  ];

  // Cursor blink effect
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    
    return () => clearInterval(blinkInterval);
  }, []);

  // Handle terminal automation and scroll
  useEffect(() => {
    if (isLaunching) {
      let currentCommandIndex = 0;
      
      const typeNextCommand = () => {
        if (currentCommandIndex < launchCommands.length) {
          const command = launchCommands[currentCommandIndex];
          
          // For system messages, just add them directly
          if (command.isSystem) {
            setCommandHistory(prev => [...prev, { text: command.text || command.command, isSystem: true }]);
            
            // Handle final command
            if (command.final) {
              setTimeout(() => {
                triggerConfetti();
                setTimeout(() => {
                  window.location.href = 'https://farouche25.tech';
                }, 2000);
              }, 500);
            }
            
            currentCommandIndex++;
            setTimeout(typeNextCommand, command.delay);
          } 
          // For user commands, simulate typing
          else {
            let typedCommand = '';
            const fullCommand = command.command;
            let charIndex = 0;
            
            const typeCharacter = () => {
              if (charIndex < fullCommand.length) {
                typedCommand += fullCommand.charAt(charIndex);
                setCurrentLine(typedCommand);
                charIndex++;
                setTimeout(typeCharacter, 30 + Math.random() * 40); // Faster more realistic typing
              } else {
                // Command finished typing
                setCurrentLine('');
                setCommandHistory(prev => [...prev, { text: fullCommand, isSystem: false }]);
                
                // Add response after a short delay
                setTimeout(() => {
                  setCommandHistory(prev => [...prev, { 
                    text: command.response || `> ${fullCommand} executed successfully`, 
                    isSystem: true 
                  }]);
                  
                  currentCommandIndex++;
                  setTimeout(typeNextCommand, command.delay);
                }, 300);
              }
            };
            
            typeCharacter();
          }
        } else {
          setLaunchComplete(true);
        }
      };
      
      // Start the command sequence
      typeNextCommand();
    }
  }, [isLaunching]);
  
  // Auto-scroll terminal with smooth behavior
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTo({
        top: terminalRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [commandHistory, currentLine]);

  const triggerConfetti = () => {
    if (typeof window !== 'undefined' && ConfettiModule) {
      const confetti = ConfettiModule.default || ConfettiModule;
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { 
        startVelocity: 30, 
        spread: 360, 
        ticks: 60, 
        zIndex: 0, 
        colors: ['#4169E1', '#00ff00', '#4169E1', '#E91E63', '#00BCD4'] 
      };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        
        // Launch confetti from both sides and top
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: randomInRange(0.1, 0.3) }
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: randomInRange(0.1, 0.3) }
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.4, 0.6), y: 0.1 }
        });
      }, 250);
    }
  };

  const handleLaunch = () => {
    setIsLaunching(true);
    // Small confetti burst on button click
    if (typeof window !== 'undefined' && ConfettiModule) {
      const confetti = ConfettiModule.default || ConfettiModule;
      confetti({
        particleCount: 30,
        spread: 70,
        origin: { y: 0.6, x: 0.5 },
        colors: ['#4169E1', '#00ff00', '#4169E1', '#E91E63', '#00BCD4']
      });
    }
  };

  return (
    <div className="terminal-page">
      <head>
        <title>Hostel Fest 2025 | Terminal Launch</title>
        <meta name="description" content="Hostel Fest 2025 - Terminal Launch Experience" />
        <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;600&family=Orbitron:wght@400;700&display=swap" rel="stylesheet" />
      </head>

      <main className="main-content">
        {/* Enhanced Background Patterns with animated gradients */}
        <div className="bg-patterns">
          <div className="gradient-sphere sphere-1"></div>
          <div className="gradient-sphere sphere-2"></div>
          <div className="gradient-sphere sphere-3"></div>
          <div className="grid-overlay"></div>
          <div className="scan-line"></div>
        </div>

        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="header"
          >
            <h1>FAROUCHE <span>2025</span></h1>
            <div className="animated-tag">
              <span className="tag-line">TERMINAL LAUNCH SYSTEM</span>
              <div className="tag-animation"></div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="terminal-container scale-[1.2] py-20"
          >
            <div className="terminal-header">
              <div className="terminal-buttons">
                <span className="terminal-button red"></span>
                <span className="terminal-button yellow"></span>
                <span className="terminal-button green"></span>
              </div>
              <div className="terminal-title">hostel-fest-launcher</div>
              <div className="terminal-status">
                {isLaunching ? (
                  <span className="status online">ACTIVE</span>
                ) : (
                  <span className="status idle">STANDBY</span>
                )}
              </div>
            </div>
            
            <div className="terminal" ref={terminalRef}>
              <div className="terminal-content">
                <div className="welcome-message">
                  <span className="ascii-art">
                    {`  _    _           _       _   _____         _   
 | |  | |         | |     | | |  ___|       | |  
 | |__| | ___  ___| |_ ___| | | |__ ___  ___| |_ 
 |  __  |/ _ \\/ __| __/ _ \\ | |  __/ _ \\/ __| __|
 | |  | | (_) \\__ \\ ||  __/ | | | |  __/\\__ \\ |_ 
 |_|  |_|\\___/|___/\\__\\___|_| \\_|  \\___||___/\\__|
                                                 `}
                  </span>
                  <span className="system-text">Welcome to Farouche 2025 Secure Terminal</span>
                  <span className="system-text">----------------------------------------------------------------------------------</span>
                  <span className="system-text">[SYSTEM] Terminal v3.5.1 | User: guest | Permission: restricted</span>
                  <span className="system-text">[INFO] Type 'launch' or click the button below to initiate the launch sequence</span>
                  <span className="system-text">----------------------------------------------------------------------------------</span>
                </div>
                
                {commandHistory.map((item, index) => (
                  <div key={index} className={item.isSystem ? "system-line" : "command-line"}>
                    {!item.isSystem && <span className="prompt">guest@hostelfest:~$ </span>}
                    <span className={item.isSystem ? "system-text" : ""}>{item.text}</span>
                  </div>
                ))}
                
                {isLaunching && !launchComplete && (
                  <div className="command-line current">
                    <span className="prompt">guest@hostelfest:~$ </span>
                    <span>{currentLine}</span>
                    {showCursor && <span className="cursor">█</span>}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
          
          {!isLaunching && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="launch-button-container"
            >
              <button className="launch-button" onClick={handleLaunch}>
                <div className="button-glow"></div>
                <span className="button-text">LAUNCH SYSTEM</span>
                <div className="button-border"></div>
              </button>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="event-info"
          >
            <div className="date-container">
              <div className="date-badge">
                <span className="pulse-dot"></span>
                <span>April - May</span>
              </div>
              <div className="location-badge">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>Hostel Fest</span>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <style jsx>{`
        @keyframes gradientFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes float {
          0% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }
        
        @keyframes pulse {
          0% { transform: scale(0.8); opacity: 0.7; box-shadow: 0 0 0 0 rgba(0, 255, 0, 0.7); }
          50% { transform: scale(1.2); opacity: 1; box-shadow: 0 0 0 10px rgba(0, 255, 0, 0); }
          100% { transform: scale(0.8); opacity: 0.7; box-shadow: 0 0 0 0 rgba(0, 255, 0, 0); }
        }
        
        @keyframes blink {
          50% { opacity: 0; }
        }
        
        @keyframes tagSlide {
          0% { width: 0; }
          100% { width: 100%; }
        }
        
        @keyframes buttonGlow {
          0% { box-shadow: 0 0 5px rgba(0, 255, 0, 0.5); }
          50% { box-shadow: 0 0 30px rgba(0, 255, 0, 0.8); }
          100% { box-shadow: 0 0 5px rgba(0, 255, 0, 0.5); }
        }
        
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        
        @keyframes textGlow {
          0% { text-shadow: 0 0 5px rgba(0, 255, 0, 0.7); }
          50% { text-shadow: 0 0 10px rgba(0, 255, 0, 1); }
          100% { text-shadow: 0 0 5px rgba(0, 255, 0, 0.7); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .terminal-page {
          min-height: 100vh;
          background-color: #0a0a0a;
          color: #f0f0f0;
          position: relative;
          overflow: hidden;
          font-family: 'Source Code Pro', monospace;
        }
        
        .main-content {
          min-height: 100vh;
          position: relative;
          z-index: 1;
          padding: 2rem 1rem;
        }
        
        .bg-patterns {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          overflow: hidden;
        }
        
        .gradient-sphere {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.4;
          animation: float 15s infinite ease-in-out;
        }
        
        .sphere-1 {
          background: radial-gradient(circle, rgba(65, 105, 225, 0.8) 0%, rgba(65, 105, 225, 0.1) 70%);
          width: 50vw;
          height: 50vw;
          top: -10%;
          left: -10%;
          animation-delay: 0s;
        }
        
        .sphere-2 {
          background: radial-gradient(circle, rgba(0, 255, 0, 0.8) 0%, rgba(0, 255, 0, 0.1) 70%);
          width: 40vw;
          height: 40vw;
          bottom: -10%;
          right: -10%;
          animation-delay: -5s;
        }
        
        .sphere-3 {
          background: radial-gradient(circle, rgba(233, 30, 99, 0.8) 0%, rgba(233, 30, 99, 0.1) 70%);
          width: 30vw;
          height: 30vw;
          bottom: 30%;
          left: 20%;
          animation-delay: -10s;
        }
        
        .grid-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          background-size: 20px 20px;
          z-index: 1;
        }
        
        .scan-line {
          position: absolute;
          width: 100%;
          height: 2px;
          background: linear-gradient(to right, 
            rgba(0, 255, 0, 0), 
            rgba(0, 255, 0, 0.5), 
            rgba(0, 255, 0, 0.7), 
            rgba(0, 255, 0, 0.5), 
            rgba(0, 255, 0, 0)
          );
          opacity: 0.3;
          z-index: 2;
          animation: scanline 6s linear infinite;
          pointer-events: none;
        }
        
        .container {
          max-width: 900px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
        }
        
        .header {
          text-align: center;
          margin-bottom: 1rem;
          position: relative;
        }
        
        .header h1 {
          font-size: 3.5rem;
          font-weight: 700;
          color: #4169E1;
          font-family: 'Orbitron', sans-serif;
          letter-spacing: 2px;
          margin-bottom: 0.5rem;
          text-shadow: 0 0 10px rgba(65, 105, 225, 0.7);
        }
        
        .header h1 span {
          color: #00ff00;
          text-shadow: 0 0 10px rgba(0, 255, 0, 0.7);
        }
        
        .animated-tag {
          position: relative;
          display: inline-block;
          overflow: hidden;
          padding: 5px 10px;
          border: 1px solid rgba(65, 105, 225, 0.5);
          background: rgba(0, 0, 0, 0.5);
        }
        
        .tag-line {
          position: relative;
          z-index: 2;
          font-size: 1rem;
          font-weight: 600;
          letter-spacing: 2px;
          color: #ffffff;
        }
        
        .tag-animation {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 0;
          background: linear-gradient(90deg, rgba(65, 105, 225, 0.2), rgba(0, 255, 0, 0.2));
          animation: tagSlide 3s infinite alternate ease-in-out;
          z-index: 1;
        }
        
        .terminal-container {
          width: 100%;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7), 
                     0 0 20px rgba(65, 105, 225, 0.3),
                     0 0 2px rgba(0, 255, 0, 0.5);
          background-color: #121212;
          border: 1px solid #333;
          position: relative;
        }
        
        .terminal-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.15),
            rgba(0, 0, 0, 0.15) 1px,
            transparent 1px,
            transparent 2px
          );
          pointer-events: none;
          z-index: 10;
          opacity: 0.3;
        }
        
        .terminal-header {
          background: linear-gradient(90deg, #1a1a1a, #2a2a2a);
          padding: 0.7rem 1rem;
          display: flex;
          align-items: center;
          border-bottom: 1px solid #333;
        }
        
        .terminal-buttons {
          display: flex;
          gap: 0.5rem;
          margin-right: 1rem;
        }
        
        .terminal-button {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
        }
        
        .terminal-button.red {
          background-color: #ff5f56;
        }
        
        .terminal-button.yellow {
          background-color: #ffbd2e;
        }
        
        .terminal-button.green {
          background-color: #27c93f;
        }
        
        .terminal-title {
          color: #aaa;
          font-size: 0.9rem;
          flex-grow: 1;
          text-align: center;
        }
        
        .terminal-status {
          margin-left: auto;
        }
        
        .status {
          display: inline-block;
          padding: 3px 8px;
          border-radius: 3px;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 1px;
        }
        
        .status.idle {
          background-color: rgba(255, 189, 46, 0.2);
          color: #ffbd2e;
          border: 1px solid rgba(255, 189, 46, 0.5);
        }
        
        .status.online {
          background-color: rgba(39, 201, 63, 0.2);
          color: #27c93f;
          border: 1px solid rgba(39, 201, 63, 0.5);
        }
        
        .terminal {
          padding: 1rem;
          height: 400px;
          overflow-y: auto;
          font-family: 'Source Code Pro', monospace;
          font-size: 0.9rem;
          color: #00ff00;
          background-color: rgba(0, 0, 0, 0.7);
          scrollbar-width: thin;
          scrollbar-color: #333 #1a1a1a;
          position: relative;
        }
        
        .terminal::-webkit-scrollbar {
          width: 8px;
        }
        
        .terminal::-webkit-scrollbar-track {
          background: #1a1a1a;
        }
        
        .terminal::-webkit-scrollbar-thumb {
          background-color: #333;
          border-radius: 10px;
        }
        
        .terminal-content {
          display: flex;
          flex-direction: column;
          margin-bottom: 1rem;
        }
        
        .command-line {
          display: flex;
          margin-bottom: 0.2rem;
          animation: fadeIn 0.3s ease;
        }
        
        .system-line {
          color: #aaa;
          margin-bottom: 0.2rem;
          padding-left: 2rem;
          animation: fadeIn 0.3s ease;
        }
        
        .prompt {
          color: #4169E1;
          margin-right: 0.5rem;
        }
        
        .system-text {
          color: #aaa;
        }
        
        .cursor {
          color: #00ff00;
          animation: blink 1s step-end infinite;
        }
        
        .launch-button-container {
          display: flex;
          justify-content: center;
          margin: 1.5rem 0;
        }
        
        .launch-button {
          position: relative;
          background: #000;
          border: none;
          color: #00ff00;
          cursor: pointer;
          font-family: 'Orbitron', sans-serif;
          font-weight: 600;
          font-size: 1.2rem;
          padding: 1rem 2.5rem;
          letter-spacing: 2px;
          overflow: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
          z-index: 1;
        }
        
        .button-border {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border: 2px solid #00ff00;
          box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
          animation: buttonGlow 2s infinite;
          z-index: -1;
        }
        
        .button-glow {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, rgba(0,255,0,0.2), rgba(65,105,225,0.2));
          filter: blur(10px);
          z-index: -1;
        }
        
        .button-text {
          position: relative;
          z-index: 1;
        }
        
        .launch-button:hover {
          transform: translateY(-2px);
          color: #fff;
          background: linear-gradient(45deg, rgba(0,255,0,0.2), rgba(65,105,225,0.2));
        }
        
        .launch-button:active {
          transform: translateY(1px);
        }
        
        .event-info {
          margin-top: 1rem;
          width: 100%;
        }
        
        .date-container {
          display: flex;
          justify-content: center;
          gap: 2rem;
          flex-wrap: wrap;
          margin-bottom: 2rem;
        }
        
        .date-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.7rem;
          background-color: rgba(65, 105, 225, 0.2);
          border: 1px solid rgba(65, 105, 225, 0.4);
          border-radius: 30px;
          padding: 0.5rem 1.2rem;
          color: #4169E1;
          font-weight: 600;
        }
        
        .location-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.7rem;
          background-color: rgba(0, 255, 0, 0.2);
          border: 1px solid rgba(0, 255, 0, 0.4);
          border-radius: 30px;
          padding: 0.5rem 1.2rem;
          color: #00ff00;
          font-weight: 600;
        }
        
        .pulse-dot {
          width: 8px;
          height: 8px;
          background-color: #00ff00;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }
        
        .event-highlights {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 1.5rem;
          margin-top: 1rem;
          margin-bottom: 2rem;
        }
        
        .highlight-item {
          display: flex;
          flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}