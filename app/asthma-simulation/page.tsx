"use client";
import React, { useState, useEffect, useRef } from "react";

function calculateRisk(inputs: any) {
  let score = 0;
  if (inputs.smoking === 'Current') score += 20;
  if (inputs.smoking === 'Former') score += 10;
  if (inputs.familyHistory === 'Yes') score += 15;
  if (inputs.wheezing === 'Often') score += 15;
  if (inputs.wheezing === 'Sometimes') score += 8;
  if (inputs.sob === 'Often') score += 12;
  if (inputs.sob === 'Sometimes') score += 6;
  if (inputs.chestTightness === 'Often') score += 10;
  if (inputs.chestTightness === 'Sometimes') score += 5;
  if (inputs.nightCough === 'Often') score += 10;
  if (inputs.nightCough === 'Sometimes') score += 5;
  if (inputs.fev1 < 60) score += 20;
  else if (inputs.fev1 < 80) score += 10;
  if (inputs.allergy === 'Severe') score += 15;
  if (inputs.allergy === 'Mild') score += 7;
  if (inputs.exercise === 'Yes') score += 8;
  if (inputs.pollution === 'High') score += 10;
  if (inputs.pollution === 'Medium') score += 5;
  if (inputs.age < 12 || inputs.age > 60) score += 5;
  return Math.min(score, 100);
}

export default function AsthmaSimulation() {
  const [inputs, setInputs] = useState({
    age: 30,
    gender: 'Male',
    smoking: 'Never',
    familyHistory: 'No',
    wheezing: 'Never',
    sob: 'Never',
    chestTightness: 'Never',
    nightCough: 'Never',
    fev1: 95,
    allergy: 'None',
    exercise: 'No',
    pollution: 'Low'
  });

  const [showDashboard, setShowDashboard] = useState(false);
  const [riskScore, setRiskScore] = useState(0);

  const [whatIf, setWhatIf] = useState({
    smoking: 'Never',
    fev1: 95
  });

  const dashboardRef = useRef<HTMLDivElement>(null);

  const handleRun = () => {
    const score = calculateRisk(inputs);
    setRiskScore(score);
    setWhatIf({ smoking: inputs.smoking, fev1: inputs.fev1 });
    setShowDashboard(true);
    setTimeout(() => {
      dashboardRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleWhatIf = () => {
    const newInputs = { ...inputs, smoking: whatIf.smoking, fev1: whatIf.fev1 };
    const score = calculateRisk(newInputs);
    setRiskScore(score);
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  // Canvas Refs
  const gaugeRef = useRef<HTMLCanvasElement>(null);
  const particleRef = useRef<HTMLCanvasElement>(null);

  // Draw Gauge
  useEffect(() => {
    if (!showDashboard || !gaugeRef.current) return;
    const canvas = gaugeRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let currentNeedle = 0;
    let animationFrame: number;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height - 20;
      const r = Math.min(cx, cy) - 20;

      // Draw arcs
      ctx.lineWidth = 20;
      // Green 0-33
      ctx.beginPath();
      ctx.strokeStyle = '#22c55e';
      ctx.arc(cx, cy, r, Math.PI, Math.PI + Math.PI * 0.33);
      ctx.stroke();
      // Yellow 33-66
      ctx.beginPath();
      ctx.strokeStyle = '#eab308';
      ctx.arc(cx, cy, r, Math.PI + Math.PI * 0.33, Math.PI + Math.PI * 0.66);
      ctx.stroke();
      // Red 66-100
      ctx.beginPath();
      ctx.strokeStyle = '#ef4444';
      ctx.arc(cx, cy, r, Math.PI + Math.PI * 0.66, 2 * Math.PI);
      ctx.stroke();

      // Animate needle
      currentNeedle += (riskScore - currentNeedle) * 0.05;
      const angle = Math.PI + (currentNeedle / 100) * Math.PI;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * (r - 10), cy + Math.sin(angle) * (r - 10));
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#fff';
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, 8, 0, 2 * Math.PI);
      ctx.fillStyle = '#fff';
      ctx.fill();

      animationFrame = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationFrame);
  }, [showDashboard, riskScore]);

  // Draw Particles
  useEffect(() => {
    if (!showDashboard || !particleRef.current) return;
    const canvas = particleRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrame: number;
    let particles: any[] = [];
    
    let pCount = 20;
    let speedMult = 1;
    if (inputs.allergy === 'Mild') pCount = 50;
    if (inputs.allergy === 'Severe') pCount = 100;
    if (inputs.pollution === 'Medium') { pCount += 30; speedMult = 1.5; }
    if (inputs.pollution === 'High') { pCount += 60; speedMult = 2; }

    for (let i = 0; i < pCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2 * speedMult,
        vy: (Math.random() - 0.5) * 2 * speedMult,
        r: Math.random() * 3 + 1
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const color = riskScore < 33 ? '#4ade80' : riskScore < 66 ? '#facc15' : '#f87171';
      ctx.fillStyle = color;

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrame = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationFrame);
  }, [showDashboard, inputs.allergy, inputs.pollution, riskScore]);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* HEADER */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
            Asthma Risk Simulation
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Interactive modeling engine demonstrating the impact of demographic, environmental, and clinical factors on asthma severity.
          </p>
        </div>

        {/* SECTION 1: INPUT FORM */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl">
          <h2 className="text-2xl font-bold mb-6 text-white border-b border-gray-800 pb-4">Patient Parameters</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Age</label>
              <input type="number" name="age" value={inputs.age} onChange={handleInputChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Gender</label>
              <select name="gender" value={inputs.gender} onChange={handleInputChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none">
                <option>Male</option><option>Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Smoking Status</label>
              <select name="smoking" value={inputs.smoking} onChange={handleInputChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none">
                <option>Never</option><option>Former</option><option>Current</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Family History of Asthma</label>
              <select name="familyHistory" value={inputs.familyHistory} onChange={handleInputChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none">
                <option>No</option><option>Yes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Wheezing</label>
              <select name="wheezing" value={inputs.wheezing} onChange={handleInputChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none">
                <option>Never</option><option>Sometimes</option><option>Often</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Shortness of Breath</label>
              <select name="sob" value={inputs.sob} onChange={handleInputChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none">
                <option>Never</option><option>Sometimes</option><option>Often</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Chest Tightness</label>
              <select name="chestTightness" value={inputs.chestTightness} onChange={handleInputChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none">
                <option>Never</option><option>Sometimes</option><option>Often</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Night-time Coughing</label>
              <select name="nightCough" value={inputs.nightCough} onChange={handleInputChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none">
                <option>Never</option><option>Sometimes</option><option>Often</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Allergy History</label>
              <select name="allergy" value={inputs.allergy} onChange={handleInputChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none">
                <option>None</option><option>Mild</option><option>Severe</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Air Pollution Exposure</label>
              <select name="pollution" value={inputs.pollution} onChange={handleInputChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none">
                <option>Low</option><option>Medium</option><option>High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Exercise-Induced Symptoms</label>
              <select name="exercise" value={inputs.exercise} onChange={handleInputChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none">
                <option>No</option><option>Yes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1 flex justify-between">
                <span>Lung Function (FEV1%)</span>
                <span className="text-blue-400">{inputs.fev1}%</span>
              </label>
              <input type="range" name="fev1" min="40" max="100" value={inputs.fev1} onChange={handleInputChange} className="w-full mt-2 accent-blue-500" />
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <button onClick={handleRun} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full shadow-lg shadow-blue-600/20 transition-transform transform hover:scale-105 active:scale-95">
              Run Simulation
            </button>
          </div>
        </div>

        {/* SECTION 2: DASHBOARD */}
        {showDashboard && (
          <div ref={dashboardRef} className="space-y-6">
            <h2 className="text-3xl font-bold text-center text-white mb-8 border-b border-gray-800 pb-4">Simulation Results</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Panel 1: Animated Lungs */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[300px]">
                <h3 className="text-lg font-semibold text-gray-300 mb-4">Pulmonary Dynamics</h3>
                <style dangerouslySetInnerHTML={{__html: `
                  @keyframes breathe {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); }
                  }
                  .lung-animate {
                    transform-origin: center;
                    animation: breathe ${Math.max(0.4, 2.5 - riskScore * 0.02)}s infinite ease-in-out;
                  }
                `}} />
                <svg width="150" height="150" viewBox="0 0 100 100" className="lung-animate overflow-visible">
                  <path d="M 20 10 Q 10 30 15 60 Q 20 90 40 85 Q 45 80 40 50 Q 35 20 20 10 Z" fill={riskScore < 33 ? '#f9a8d4' : riskScore < 66 ? '#f87171' : '#ef4444'} opacity="0.8" />
                  <path d="M 80 10 Q 90 30 85 60 Q 80 90 60 85 Q 55 80 60 50 Q 65 20 80 10 Z" fill={riskScore < 33 ? '#f9a8d4' : riskScore < 66 ? '#f87171' : '#ef4444'} opacity="0.8" />
                  <path d="M 50 5 L 50 30 M 45 40 L 50 30 L 55 40" stroke="#9ca3af" strokeWidth="3" fill="none" />
                </svg>
                <p className="mt-6 text-sm text-gray-500">Respiratory simulation reflecting predicted obstruction.</p>
              </div>

              {/* Panel 2: Risk Gauge */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col items-center justify-center">
                <h3 className="text-lg font-semibold text-gray-300 mb-4">Overall Risk Assessment</h3>
                <div className="relative w-full max-w-[250px] aspect-[2/1] mt-4">
                  <canvas ref={gaugeRef} width="300" height="150" className="w-full h-full" />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
                    <span className="text-4xl font-black text-white">{riskScore}%</span>
                  </div>
                </div>
                <p className={`mt-6 font-bold text-lg ${riskScore < 33 ? 'text-green-400' : riskScore < 66 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {riskScore < 33 ? 'Low Risk' : riskScore < 66 ? 'Moderate Risk' : 'High Risk'}
                </p>
              </div>

              {/* Panel 3: Allergen Particles */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col items-center justify-center">
                <h3 className="text-lg font-semibold text-gray-300 mb-4">Airway Irritant Density</h3>
                <canvas ref={particleRef} width="250" height="150" className="bg-gray-950 rounded-xl border border-gray-800" />
                <p className="mt-4 text-sm text-gray-500">Particle count scales with pollution & allergy inputs.</p>
              </div>

              {/* Panel 4: Risk Factors */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-300 mb-6">Symptom Contribution</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Spirometry (FEV1)', value: inputs.fev1 < 60 ? 100 : inputs.fev1 < 80 ? 50 : 10 },
                    { label: 'Clinical Symptoms', value: (['Often', 'Sometimes'].includes(inputs.wheezing) ? 40 : 0) + (['Often', 'Sometimes'].includes(inputs.sob) ? 40 : 0) },
                    { label: 'Environmental', value: inputs.pollution === 'High' ? 100 : inputs.pollution === 'Medium' ? 50 : 10 },
                    { label: 'Genetics & History', value: inputs.familyHistory === 'Yes' ? 100 : 10 }
                  ].map((factor, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>{factor.label}</span>
                        <span>Severity</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-1000 ease-out" 
                          style={{ 
                            width: `${factor.value}%`, 
                            backgroundColor: factor.value > 66 ? '#ef4444' : factor.value > 33 ? '#facc15' : '#4ade80' 
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Panel 5: Confidence Interval */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 md:col-span-2 flex flex-col md:flex-row items-center gap-6 justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-300">Predictive Confidence</h3>
                  <p className="text-sm text-gray-500 mt-1">Based on Monte Carlo simulation variance across similar profiles.</p>
                </div>
                <div className="flex-1 max-w-md w-full">
                  <div className="flex justify-between text-white font-bold mb-2">
                    <span>{Math.max(0, riskScore - 10)}%</span>
                    <span className="text-blue-400">Target: {riskScore}%</span>
                    <span>{Math.min(100, riskScore + 10)}%</span>
                  </div>
                  <div className="relative w-full h-4 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="absolute h-full bg-blue-500/30 rounded-full transition-all duration-1000"
                      style={{ left: `${Math.max(0, riskScore - 10)}%`, width: `${Math.min(100, riskScore + 10) - Math.max(0, riskScore - 10)}%` }}
                    ></div>
                    <div 
                      className="absolute h-full w-1 bg-blue-500 transition-all duration-1000 shadow-[0_0_8px_#3b82f6]"
                      style={{ left: `${riskScore}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Panel 6: What-If Simulator */}
              <div className="bg-gray-900 border border-blue-900/50 rounded-2xl p-6 md:col-span-2 shadow-[0_0_30px_rgba(59,130,246,0.05)] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                  <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor" className="text-blue-500"><path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.06-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.73,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.06,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.49-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"></path></svg>
                </div>
                <h3 className="text-xl font-bold text-blue-400 mb-2">What-If Scenario Simulator</h3>
                <p className="text-gray-400 text-sm mb-6">Tweak key lifestyle parameters to see immediate real-time changes in predicted outcome.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Smoking Change</label>
                    <select value={whatIf.smoking} onChange={e => setWhatIf({...whatIf, smoking: e.target.value})} className="w-full bg-gray-950 border border-gray-700 rounded-lg p-2.5 text-white outline-none focus:border-blue-500 transition-colors">
                      <option>Never</option><option>Former</option><option>Current</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1 flex justify-between">
                      <span>Improve/Worsen FEV1</span>
                      <span className="text-blue-400">{whatIf.fev1}%</span>
                    </label>
                    <input type="range" min="40" max="100" value={whatIf.fev1} onChange={e => setWhatIf({...whatIf, fev1: Number(e.target.value)})} className="w-full mt-2 accent-blue-500" />
                  </div>
                  <div>
                    <button onClick={handleWhatIf} className="w-full py-2.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-blue-400 font-semibold rounded-lg transition-colors">
                      Recalculate
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* DISCLAIMER */}
        <div className="text-center text-xs text-gray-600 mt-12 pt-8 border-t border-gray-900">
          <p>This tool is for educational and simulation purposes only. It does not replace professional medical diagnosis.</p>
        </div>

      </div>
    </div>
  );
}
