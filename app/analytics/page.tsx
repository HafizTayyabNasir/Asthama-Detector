"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, BarChart3, PieChart as PieChartIcon, LineChart as LineChartIcon, ActivitySquare } from "lucide-react"
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  LineChart, Line, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts"

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6']

// --- Initial Mock Data for 8 Different Graphs ---
const initialAgeRiskData = [
  { age: '0-10', risk: 15 }, { age: '11-20', risk: 25 }, { age: '21-30', risk: 32 },
  { age: '31-40', risk: 38 }, { age: '41-50', risk: 45 }, { age: '51-60', risk: 60 },
  { age: '61-70', risk: 78 }, { age: '71+', risk: 90 }
]

const initialSymptomsData = [
  { name: 'Wheezing', value: 350 }, { name: 'Shortness of Breath', value: 250 },
  { name: 'Night Cough', value: 200 }, { name: 'Chest Tightness', value: 200 }
]

const initialGenderRiskData = [
  { name: 'Male', Low: 600, Moderate: 250, High: 150 },
  { name: 'Female', Low: 500, Moderate: 300, High: 200 }
]

const initialPollutionLungData = Array.from({ length: 30 }, (_, i) => {
  const pollution = (i * 17) % 100;
  let fev1 = 90 - (pollution * 0.4) + ((i * 13) % 20 - 10);
  return { id: i, pollution, fev1: Math.max(30, Math.round(fev1)) };
});

const initialFeatureImportanceData = [
  { feature: 'Genetics', impact: 85, fullMark: 100 },
  { feature: 'Smoking', impact: 90, fullMark: 100 },
  { feature: 'Pollution', impact: 70, fullMark: 100 },
  { feature: 'Age', impact: 65, fullMark: 100 },
  { feature: 'Allergies', impact: 75, fullMark: 100 },
  { feature: 'Obesity', impact: 50, fullMark: 100 }
]

const initialSmokingLungData = [
  { years: '0', never: 100, former: 100, current: 100 },
  { years: '5', never: 98, former: 94, current: 88 },
  { years: '10', never: 95, former: 86, current: 72 },
  { years: '15', never: 91, former: 78, current: 58 },
  { years: '20', never: 86, former: 68, current: 45 },
]

const initialRiskDistributionData = [
  { name: 'Low Risk', value: 6500 },
  { name: 'Moderate Risk', value: 2500 },
  { name: 'High Risk', value: 1000 }
]

const initialTreatmentData = [
  { level: 'Low', patients: 650, successRate: 95 },
  { level: 'Moderate', patients: 250, successRate: 82 },
  { level: 'High', patients: 100, successRate: 60 }
]

export default function AnalyticsDashboard() {
  const [ageRiskData, setAgeRiskData] = useState(initialAgeRiskData)
  const [symptomsData, setSymptomsData] = useState(initialSymptomsData)
  const [genderRiskData, setGenderRiskData] = useState(initialGenderRiskData)
  const [pollutionLungData, setPollutionLungData] = useState(initialPollutionLungData)
  const [featureImportanceData, setFeatureImportanceData] = useState(initialFeatureImportanceData)
  const [smokingLungData, setSmokingLungData] = useState(initialSmokingLungData)
  const [riskDistributionData, setRiskDistributionData] = useState(initialRiskDistributionData)
  const [treatmentData, setTreatmentData] = useState(initialTreatmentData)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1)
      
      // 1. Age vs Risk: Simulating Live Model Fine-Tuning (Breathing effect)
      setAgeRiskData(prev => prev.map((d, i) => ({
        ...d,
        risk: Math.max(0, Math.min(100, Math.round(initialAgeRiskData[i].risk + Math.sin(Date.now() / 1000 + i) * 2)))
      })))

      // 2. Symptoms: Simulating incoming patients
      setSymptomsData(prev => prev.map(d => ({
        ...d, value: d.value + Math.floor(Math.random() * 3)
      })))

      // 3. Gender Risk: Incoming patients maintaining logical distribution
      setGenderRiskData(prev => prev.map(d => ({ 
        ...d, 
        Low: d.Low + Math.floor(Math.random() * 4),
        Moderate: d.Moderate + Math.floor(Math.random() * 2),
        High: d.High + Math.floor(Math.random() * 1)
      })))
      
      // 4. Scatter Plot: Moving stream (Real-time monitoring)
      setPollutionLungData(prev => {
        const newData = [...prev.slice(1)];
        const lastId = prev[prev.length - 1].id;
        const pollution = Math.floor(Math.random() * 100);
        const fev1Base = 90 - (pollution * 0.4);
        const noise = Math.floor(Math.random() * 20) - 10;
        newData.push({ id: lastId + 1, pollution, fev1: Math.max(30, Math.round(fev1Base + noise)) });
        return newData;
      });

      // 5. Feature Importance: Model weights stabilizing
      setFeatureImportanceData(prev => prev.map((d, i) => ({
        ...d, impact: Math.max(40, Math.min(100, Math.round(initialFeatureImportanceData[i].impact + Math.cos(Date.now() / 1500 + i) * 1.5)))
      })))
      
      // 6. Line Chart: Lung Capacity remains strictly logical
      setSmokingLungData(prev => prev.map((d, i) => {
        if(i === 0) return d; // Start point static
        return {
          ...d,
          never: Math.round(initialSmokingLungData[i].never + Math.sin(Date.now()/2000)*0.5),
          former: Math.round(initialSmokingLungData[i].former + Math.sin(Date.now()/2000)*1),
          current: Math.round(initialSmokingLungData[i].current + Math.sin(Date.now()/2000)*1.5)
        }
      }))

      // 7. Donut Chart: Aggregating massive population
      setRiskDistributionData(prev => [
        { name: 'Low Risk', value: prev[0].value + Math.floor(Math.random() * 10) + 5 },
        { name: 'Moderate Risk', value: prev[1].value + Math.floor(Math.random() * 5) + 2 },
        { name: 'High Risk', value: prev[2].value + Math.floor(Math.random() * 2) + 1 }
      ])
      
      // 8. Composed Chart: Treatment tracking
      setTreatmentData(prev => prev.map((d, i) => ({
        ...d,
        patients: d.patients + Math.floor(Math.random() * 3),
        successRate: Math.round(initialTreatmentData[i].successRate + Math.sin(Date.now()/3000)*1)
      })))
      
    }, 1500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-4 mb-12">
          <div className="flex items-center justify-center gap-3">
            <ActivitySquare className="w-12 h-12 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Comprehensive Analytics Dashboard</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            A complete visual breakdown of asthma predictors, patient demographics, and machine learning feature insights. Designed for detailed academic explanation.
          </p>
        </div>

        {/* Grid of 8 Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">

          {/* 1. Area Chart */}
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">1. Age Progression vs Asthma Risk</CardTitle>
              <CardDescription>Visualizing how asthma vulnerability increases exponentially in later life stages.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ageRiskData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="age" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="risk" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRisk)" name="Risk %" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* 2. Pie Chart */}
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">2. Symptom Prevalence</CardTitle>
              <CardDescription>Proportional distribution of primary symptoms observed in diagnosed patients.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={symptomsData} cx="50%" cy="50%" outerRadius={100} label dataKey="value" nameKey="name">
                    {symptomsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* 3. Bar Chart */}
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">3. Gender-based Risk Categories</CardTitle>
              <CardDescription>Stacked comparison showing asthma severity distribution across genders.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={genderRiskData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Low" stackId="a" fill="#10b981" />
                  <Bar dataKey="Moderate" stackId="a" fill="#f59e0b" />
                  <Bar dataKey="High" stackId="a" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* 4. Scatter Chart */}
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">4. Air Pollution vs Lung Function (FEV1)</CardTitle>
              <CardDescription>Scatter plot demonstrating the negative correlation between pollution exposure and lung capacity.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" dataKey="pollution" name="Pollution Index" />
                  <YAxis type="number" dataKey="fev1" name="FEV1 %" domain={[30, 100]} />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter name="Patients" data={pollutionLungData} fill="#8b5cf6" />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* 5. Radar Chart */}
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">5. ML Feature Importance Matrix</CardTitle>
              <CardDescription>Radar map highlighting the weight of individual factors in the Logistic Regression model.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius={90} data={featureImportanceData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="feature" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="Impact Weight" dataKey="impact" stroke="#ec4899" fill="#ec4899" fillOpacity={0.5} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* 6. Line Chart */}
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">6. Smoking Impact Over Time</CardTitle>
              <CardDescription>Tracking the progressive decline of lung function based on smoking habits.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={smokingLungData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="years" label={{ value: 'Years', position: 'insideBottomRight', offset: -5 }} />
                  <YAxis domain={[40, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="never" stroke="#10b981" strokeWidth={2} name="Never Smoked" />
                  <Line type="monotone" dataKey="former" stroke="#f59e0b" strokeWidth={2} name="Former Smoker" />
                  <Line type="monotone" dataKey="current" stroke="#ef4444" strokeWidth={2} name="Current Smoker" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* 7. Donut Chart */}
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">7. Population Risk Distribution</CardTitle>
              <CardDescription>Overall ratio of asthma risk levels in a simulated 10,000 patient dataset.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={riskDistributionData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value" nameKey="name">
                    <Cell fill="#10b981" />
                    <Cell fill="#f59e0b" />
                    <Cell fill="#ef4444" />
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* 8. Composed Chart */}
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">8. Patient Volume vs Treatment Success</CardTitle>
              <CardDescription>A composed view showing the number of patients (bars) vs the treatment success rate (line).</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={treatmentData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid stroke="#f5f5f5" vertical={false} />
                  <XAxis dataKey="level" />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="patients" barSize={40} fill="#3b82f6" name="Total Patients" />
                  <Line yAxisId="right" type="monotone" dataKey="successRate" stroke="#ef4444" strokeWidth={3} name="Success Rate %" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}
