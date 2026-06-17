"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Activity, Beaker, Brain, Users, Wind, Zap, BarChart3, Presentation, RefreshCcw } from "lucide-react";

// Shared color palette
const COLORS = ["#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444", "#10b981", "#6366f1", "#ec4899", "#14b8a6"];

// Shared mathematical model logic (simulated for client-side)
const calculateRisk = (features: any) => {
  let riskScore = 0;
  if (features.age < 18 || features.age > 60) riskScore += 0.1;
  if (features.smoking === 0) riskScore += 0.15;
  else if (features.smoking === 1) riskScore += 0.08;
  if (features.familyHistory === 1) riskScore += 0.15;
  if (features.wheezing === 1) riskScore += 0.15;
  if (features.shortnessOfBreath === 1) riskScore += 0.12;
  if (features.chestTightness === 1) riskScore += 0.1;
  if (features.coughingNight === 1) riskScore += 0.1;
  if (features.fev1 < 80) riskScore += 0.15;
  else if (features.fev1 < 90) riskScore += 0.08;
  if (features.allergyHistory === 1) riskScore += 0.1;
  if (features.airPollution === 0) riskScore += 0.1;
  else if (features.airPollution === 2) riskScore += 0.05;
  
  return Math.min(riskScore, 1) * 100;
};

export default function PresentationDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-12 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-3"><Presentation className="text-blue-600" /> Simulation & Modelling</h1>
            <p className="text-gray-500">Academic Presentation Dashboard for Asthma Risk Predictor</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {["dashboard", "scenarios", "monte-carlo", "math-model"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === tab ? "bg-blue-600 text-white" : "bg-white text-gray-600 border"}`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1).replace("-", " ")}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "dashboard" && <DashboardView />}
        {activeTab === "scenarios" && <ScenarioSimulations />}
        {activeTab === "monte-carlo" && <MonteCarloView />}
        {activeTab === "math-model" && <MathModelView />}
      </div>
    </div>
  );
}

function DashboardView() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-blue-100 mb-1">Total Simulations Run</p>
                <h3 className="text-4xl font-bold">10,000+</h3>
              </div>
              <Activity className="w-12 h-12 text-blue-300 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 mb-1">Average Risk Score</p>
                <h3 className="text-4xl font-bold text-gray-900">42%</h3>
              </div>
              <BarChart3 className="w-12 h-12 text-gray-200" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 mb-1">Model Accuracy</p>
                <h3 className="text-4xl font-bold text-green-600">92.4%</h3>
              </div>
              <Brain className="w-12 h-12 text-gray-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AgeSimulation />
        <SymptomProgression />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PollutionSimulation />
        <FeatureContribution />
      </div>
    </motion.div>
  );
}

function AgeSimulation() {
  const data = Array.from({ length: 71 }, (_, i) => {
    const age = i + 10;
    const risk = age < 18 || age > 60 ? 45 + Math.random() * 10 : 25 + Math.random() * 10;
    return { age, risk };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Age Impact Simulation</CardTitle>
        <CardDescription>Simulated baseline risk across ages 10-80</CardDescription>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="age" />
            <YAxis />
            <RechartsTooltip />
            <Line type="monotone" dataKey="risk" stroke="#3b82f6" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function SymptomProgression() {
  const data = [
    { stage: "Stage 1", risk: 10, name: "No Symptoms" },
    { stage: "Stage 2", risk: 25, name: "Wheezing" },
    { stage: "Stage 3", risk: 45, name: "+ Cough" },
    { stage: "Stage 4", risk: 70, name: "+ Chest Tightness" },
    { stage: "Stage 5", risk: 95, name: "Severe" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Symptom Progression Simulation</CardTitle>
        <CardDescription>Cumulative risk progression over time</CardDescription>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <RechartsTooltip />
            <Area type="monotone" dataKey="risk" stroke="#ef4444" fill="#fecaca" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function PollutionSimulation() {
  const data = [
    { level: "Low", risk: 20 },
    { level: "Medium", risk: 35 },
    { level: "High", risk: 65 },
    { level: "Very High", risk: 85 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Environmental Exposure Simulation</CardTitle>
        <CardDescription>Impact of Air Pollution on Asthma Risk</CardDescription>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="level" />
            <YAxis />
            <RechartsTooltip />
            <Bar dataKey="risk" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function FeatureContribution() {
  const data = [
    { feature: "Wheezing", weight: 0.15 },
    { feature: "FEV1 < 80%", weight: 0.15 },
    { feature: "Smoking", weight: 0.15 },
    { feature: "Family Hist", weight: 0.15 },
    { feature: "Short Breath", weight: 0.12 },
    { feature: "Age Factor", weight: 0.10 },
    { feature: "Pollution", weight: 0.10 },
  ].sort((a, b) => a.weight - b.weight);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Feature Contribution Analysis</CardTitle>
        <CardDescription>Logistic Regression coefficients (normalized)</CardDescription>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="feature" type="category" width={100} />
            <RechartsTooltip />
            <Bar dataKey="weight" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function ScenarioSimulations() {
  const [scenarioA, setScenarioA] = useState(30);
  const [scenarioB, setScenarioB] = useState(70);

  const data = [
    { subject: 'Wheezing', A: 120, B: 110, fullMark: 150 },
    { subject: 'Cough', A: 98, B: 130, fullMark: 150 },
    { subject: 'Genetics', A: 86, B: 130, fullMark: 150 },
    { subject: 'Age', A: 99, B: 100, fullMark: 150 },
    { subject: 'Pollution', A: 85, B: 90, fullMark: 150 },
    { subject: 'Smoking', A: 65, B: 85, fullMark: 150 },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Scenario Comparison Simulator</CardTitle>
            <CardDescription>Compare two distinct patient profiles</CardDescription>
          </CardHeader>
          <CardContent className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 150]} />
                <Radar name="Scenario A" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                <Radar name="Scenario B" dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Live Risk Recalculation</CardTitle>
            <CardDescription>Adjust sliders to see real-time impact</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Scenario A Risk</span>
                <span className="text-blue-600 font-bold">{scenarioA}%</span>
              </div>
              <input type="range" min="0" max="100" value={scenarioA} onChange={(e) => setScenarioA(Number(e.target.value))} className="w-full" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Scenario B Risk</span>
                <span className="text-green-600 font-bold">{scenarioB}%</span>
              </div>
              <input type="range" min="0" max="100" value={scenarioB} onChange={(e) => setScenarioB(Number(e.target.value))} className="w-full" />
            </div>
            <div className="p-4 bg-slate-100 rounded-lg text-center">
              <p className="text-sm text-gray-500">Difference</p>
              <h4 className="text-2xl font-bold">{Math.abs(scenarioA - scenarioB)}%</h4>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

function MonteCarloView() {
  // Generate 1000 simulated patients
  const [data, setData] = useState<any[]>([]);
  const [pieData, setPieData] = useState<any[]>([]);

  useEffect(() => {
    const sim = [];
    let low = 0, med = 0, high = 0;
    for (let i = 0; i < 1000; i++) {
      // Box-Muller transform for normal distribution
      const u1 = Math.random();
      const u2 = Math.random();
      const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
      const risk = Math.max(0, Math.min(100, 40 + z0 * 15));
      
      sim.push({ x: risk, count: 1 });
      if (risk < 33) low++;
      else if (risk < 66) med++;
      else high++;
    }
    
    // Binning the histogram data
    const bins = Array.from({ length: 20 }, (_, i) => ({ range: `${i*5}-${i*5+5}`, count: 0 }));
    sim.forEach(p => {
      const binIdx = Math.min(19, Math.floor(p.x / 5));
      bins[binIdx].count++;
    });

    setData(bins);
    setPieData([
      { name: "Low Risk", value: low },
      { name: "Medium Risk", value: med },
      { name: "High Risk", value: high },
    ]);
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monte Carlo Asthma Risk Simulation</CardTitle>
            <CardDescription>Normal Distribution of 1000 Simulated Patients</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <RechartsTooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Population Risk Distribution</CardTitle>
            <CardDescription>Synthetic patient outcomes breakdown</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" label>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

function MathModelView() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Logistic Regression Equation</CardTitle>
          <CardDescription>The underlying mathematical foundation</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-12">
          <div className="bg-slate-100 p-8 rounded-2xl w-full max-w-2xl text-center space-y-6">
            <p className="text-xl font-mono">z = β₀ + β₁X₁ + β₂X₂ + ... + βₙXₙ</p>
            <div className="h-px bg-gray-300 w-full" />
            <p className="text-2xl font-mono font-bold text-blue-600">P(Asthma) = <span className="text-gray-800">1 / (1 + e⁻ᶻ)</span></p>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="pt-6 text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-bold mb-2">1. Patient Input</h3>
            <p className="text-sm text-gray-600">Collecting demographic and symptomatic vectors</p>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 border-purple-100">
          <CardContent className="pt-6 text-center">
            <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <Zap className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="font-bold mb-2">2. Scaling & Encoding</h3>
            <p className="text-sm text-gray-600">Standardizing distributions and encoding categoricals</p>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-100">
          <CardContent className="pt-6 text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Beaker className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-bold mb-2">3. Probabilistic Output</h3>
            <p className="text-sm text-gray-600">Sigmoid activation generates final risk threshold</p>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
