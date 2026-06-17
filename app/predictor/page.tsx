"use client"

import type React from "react"
import Link from "next/link"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Activity, AlertCircle, CheckCircle2, Info, ArrowUpRight, ArrowDownRight, RefreshCcw, BarChart3 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid } from "recharts"

interface PredictionResult {
  prediction: number
  confidence: number
  riskLevel: string
}

// Shared mathematical model logic (simulated for client-side live engine)
const calculateLiveRisk = (features: any) => {
  if (!features.age || !features.gender) return 0;
  let riskScore = 0;
  const age = Number(features.age);
  if (age < 18 || age > 60) riskScore += 0.1;
  if (features.smoking === "Current") riskScore += 0.15;
  else if (features.smoking === "Former") riskScore += 0.08;
  if (features.familyHistory === "1") riskScore += 0.15;
  if (features.wheezing === "1") riskScore += 0.15;
  if (features.shortnessOfBreath === "1") riskScore += 0.12;
  if (features.chestTightness === "1") riskScore += 0.1;
  if (features.coughingNight === "1") riskScore += 0.1;
  
  const fev1 = Number(features.fev1);
  if (fev1 && fev1 < 80) riskScore += 0.15;
  else if (fev1 && fev1 < 90) riskScore += 0.08;
  
  if (features.allergyHistory === "1") riskScore += 0.1;
  
  const pollutionEncoded = features.airPollution === "High" ? 0 : features.airPollution === "Low" ? 1 : 2;
  if (pollutionEncoded === 0) riskScore += 0.1;
  else if (pollutionEncoded === 2) riskScore += 0.05;
  
  // The API returns riskScore * 100 for confidence when riskScore > 0.5, 
  // or (1 - riskScore) * 100 when riskScore <= 0.5.
  // The "Live Risk" represents the raw risk percentage.
  return Math.round(Math.min(riskScore, 1) * 100);
}

export default function AsthmaPredictor() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    smoking: "",
    familyHistory: "",
    wheezing: "",
    shortnessOfBreath: "",
    chestTightness: "",
    coughingNight: "",
    fev1: "",
    allergyHistory: "",
    airPollution: "",
  })
  const [liveRisk, setLiveRisk] = useState(0)
  const [prevRisk, setPrevRisk] = useState(0)
  const [animating, setAnimating] = useState(false)

  // Real-time Risk Engine
  useEffect(() => {
    const newRisk = calculateLiveRisk(formData);
    if (newRisk !== liveRisk) {
      setPrevRisk(liveRisk);
      setLiveRisk(newRisk);
    }
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setAnimating(true)
    setResult(null)
    
    // Simulate prediction animation delay for presentation
    await new Promise(r => setTimeout(r, 1500))

    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          age: Number.parseFloat(formData.age),
          gender: formData.gender,
          smoking: formData.smoking,
          familyHistory: Number.parseInt(formData.familyHistory),
          wheezing: Number.parseInt(formData.wheezing),
          shortnessOfBreath: Number.parseInt(formData.shortnessOfBreath),
          chestTightness: Number.parseInt(formData.chestTightness),
          coughingNight: Number.parseInt(formData.coughingNight),
          fev1: Number.parseFloat(formData.fev1),
          allergyHistory: Number.parseInt(formData.allergyHistory),
          airPollution: formData.airPollution,
        }),
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
      setAnimating(false)
    }
  }

  // Calculate graph data dynamically from form data
  const getGraphData = () => {
    return [
      { factor: "Age", risk: (Number(formData.age) < 18 || Number(formData.age) > 60) ? 10 : 2 },
      { factor: "Smoking", risk: formData.smoking === "Current" ? 15 : formData.smoking === "Former" ? 8 : 0 },
      { factor: "Genetics", risk: formData.familyHistory === "1" ? 15 : 0 },
      { factor: "Symptoms", risk: (formData.wheezing === "1" ? 15 : 0) + (formData.shortnessOfBreath === "1" ? 12 : 0) + (formData.chestTightness === "1" ? 10 : 0) + (formData.coughingNight === "1" ? 10 : 0) },
      { factor: "Lung Func", risk: (Number(formData.fev1) && Number(formData.fev1) < 80) ? 15 : (Number(formData.fev1) && Number(formData.fev1) < 90) ? 8 : 0 },
      { factor: "Environment", risk: formData.airPollution === "High" ? 10 : formData.airPollution === "Medium" ? 5 : 0 }
    ].filter(d => d.risk > 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Activity className="w-12 h-12 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Asthma Risk Predictor</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            AI-powered system to assess asthma risk based on patient symptoms, lifestyle factors, and clinical
            indicators
          </p>
          <Alert className="max-w-2xl mx-auto">
            <Info className="h-4 w-4" />
            <AlertTitle>Educational Purpose Only</AlertTitle>
            <AlertDescription>
              This tool is for educational purposes and does not replace professional medical diagnosis.
            </AlertDescription>
          </Alert>

          <div className="flex justify-center pt-2">
            <Button asChild variant="outline" className="gap-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50 transition-colors">
              <Link href="/analytics">
                <BarChart3 className="w-4 h-4" />
                View Detailed Analytics Dashboard
              </Link>
            </Button>
          </div>
          
          {/* Feature 1: Real-Time Risk Simulation Engine */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg border border-blue-100 p-6 flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div>
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2"><RefreshCcw className="w-5 h-5 text-blue-500" /> Live Risk Simulation Engine</h3>
              <p className="text-sm text-gray-500">Continuously recalculates based on form inputs without page refresh.</p>
            </div>
            <div className="flex items-center gap-6 bg-slate-50 py-3 px-6 rounded-lg border border-slate-100">
              <div className="text-center">
                <p className="text-xs text-gray-500 uppercase font-bold">Current Risk</p>
                <p className="text-3xl font-extrabold text-blue-600">{liveRisk}%</p>
              </div>
              <div className="h-12 w-px bg-gray-300"></div>
              <div className="text-center">
                <p className="text-xs text-gray-500 uppercase font-bold">Change</p>
                <div className="flex items-center justify-center gap-1">
                  {liveRisk > prevRisk ? <ArrowUpRight className="w-5 h-5 text-red-500" /> : liveRisk < prevRisk ? <ArrowDownRight className="w-5 h-5 text-green-500" /> : <span className="w-5 h-5" />}
                  <span className={`text-xl font-bold ${liveRisk > prevRisk ? 'text-red-500' : liveRisk < prevRisk ? 'text-green-500' : 'text-gray-400'}`}>
                    {liveRisk > prevRisk ? '+' : ''}{liveRisk - prevRisk}%
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Prediction Form */}
        <Card>
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
            <CardDescription>Please fill in all the fields below to get an asthma risk assessment</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Demographics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Enter age"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    required
                    min="1"
                    max="120"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => setFormData({ ...formData, gender: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smoking">Smoking Status</Label>
                  <Select
                    value={formData.smoking}
                    onValueChange={(value) => setFormData({ ...formData, smoking: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Never">Never</SelectItem>
                      <SelectItem value="Former">Former</SelectItem>
                      <SelectItem value="Current">Current</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="familyHistory">Family History of Asthma</Label>
                  <Select
                    value={formData.familyHistory}
                    onValueChange={(value) => setFormData({ ...formData, familyHistory: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">No</SelectItem>
                      <SelectItem value="1">Yes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Symptoms */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Symptoms</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="wheezing">Wheezing</Label>
                    <Select
                      value={formData.wheezing}
                      onValueChange={(value) => setFormData({ ...formData, wheezing: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">No</SelectItem>
                        <SelectItem value="1">Yes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shortnessOfBreath">Shortness of Breath</Label>
                    <Select
                      value={formData.shortnessOfBreath}
                      onValueChange={(value) => setFormData({ ...formData, shortnessOfBreath: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">No</SelectItem>
                        <SelectItem value="1">Yes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="chestTightness">Chest Tightness</Label>
                    <Select
                      value={formData.chestTightness}
                      onValueChange={(value) => setFormData({ ...formData, chestTightness: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">No</SelectItem>
                        <SelectItem value="1">Yes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="coughingNight">Night-time Coughing</Label>
                    <Select
                      value={formData.coughingNight}
                      onValueChange={(value) => setFormData({ ...formData, coughingNight: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">No</SelectItem>
                        <SelectItem value="1">Yes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Clinical Indicators */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Clinical Indicators</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fev1">Lung Function (FEV1 %)</Label>
                    <Input
                      id="fev1"
                      type="number"
                      placeholder="Enter FEV1 percentage"
                      value={formData.fev1}
                      onChange={(e) => setFormData({ ...formData, fev1: e.target.value })}
                      required
                      min="0"
                      max="150"
                      step="0.1"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="allergyHistory">Allergy History</Label>
                    <Select
                      value={formData.allergyHistory}
                      onValueChange={(value) => setFormData({ ...formData, allergyHistory: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">No</SelectItem>
                        <SelectItem value="1">Yes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="airPollution">Air Pollution Exposure</Label>
                    <Select
                      value={formData.airPollution}
                      onValueChange={(value) => setFormData({ ...formData, airPollution: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? "Analyzing..." : "Predict Asthma Risk"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <Card className={result.prediction === 1 ? "border-orange-300" : "border-green-300"}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {result.prediction === 1 ? (
                  <>
                    <AlertCircle className="w-6 h-6 text-orange-600" />
                    <span>Asthma Risk Detected</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                    <span>Low Asthma Risk</span>
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Prediction Result</p>
                  <p className="text-2xl font-bold">{result.prediction === 1 ? "Likely Asthma" : "Unlikely Asthma"}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Confidence Level</p>
                  <p className="text-2xl font-bold">{result.confidence}%</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">Risk Level</p>
                <div className="flex items-center gap-2">
                  <div
                    className={`px-4 py-2 rounded-lg font-semibold ${
                      result.riskLevel === "High"
                        ? "bg-red-100 text-red-800"
                        : result.riskLevel === "Moderate"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-green-100 text-green-800"
                    }`}
                  >
                    {result.riskLevel} Risk
                  </div>
                </div>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Important Note</AlertTitle>
                <AlertDescription>
                  This prediction is based on machine learning analysis and should not replace professional medical
                  consultation. Please consult with a healthcare provider for proper diagnosis and treatment.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}
        </div>

        {/* Graphical Representation Panel */}
        <div className="lg:col-span-1 space-y-8">
          <Card className="sticky top-24 shadow-lg border-blue-100">
            <CardHeader className="bg-slate-50 border-b pb-4">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Live Risk Factors
              </CardTitle>
              <CardDescription>Visual breakdown of current active risk factors based on inputs.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 h-[400px]">
              {getGraphData().length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getGraphData()} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" hide />
                    <YAxis dataKey="factor" type="category" width={90} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="risk" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={24} animationDuration={1000} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 space-y-3">
                  <Activity className="w-12 h-12 text-slate-200" />
                  <p>Start filling out the form to see your active risk factors represented here.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

        <AnimatePresence>
          {animating && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center"
            >
              <Activity className="w-16 h-16 text-blue-600 animate-spin mb-6" />
              <div className="space-y-4 w-64">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="flex justify-between font-medium"><span className="text-gray-500">1. Encoding Features</span><CheckCircle2 className="w-5 h-5 text-green-500" /></motion.div>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} className="flex justify-between font-medium"><span className="text-gray-500">2. Scaling Inputs</span><CheckCircle2 className="w-5 h-5 text-green-500" /></motion.div>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.0 }} className="flex justify-between font-medium"><span className="text-blue-600">3. Running Model...</span><Activity className="w-5 h-5 text-blue-600 animate-pulse" /></motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 pt-8">
          <p>Built with Logistic Regression • Trained on 3,000 patient records</p>
          <p className="mt-2">AI Hackathon Project - Educational Purpose Only</p>
        </div>
      </div>
    </div>
  )
}
