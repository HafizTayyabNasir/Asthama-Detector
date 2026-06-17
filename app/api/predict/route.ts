import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // In a real application, you would load the Python model here
    // For this demo, we'll simulate the prediction using the logistic regression logic

    const {
      age,
      gender,
      smoking,
      familyHistory,
      wheezing,
      shortnessOfBreath,
      chestTightness,
      coughingNight,
      fev1,
      allergyHistory,
      airPollution,
    } = data

    // Encode categorical variables (matching Python encoding)
    const genderEncoded = gender === "Male" ? 1 : 0
    const smokingEncoded = smoking === "Current" ? 0 : smoking === "Former" ? 1 : 2
    const pollutionEncoded = airPollution === "High" ? 0 : airPollution === "Low" ? 1 : 2

    // Feature array in the same order as training
    const features = [
      age,
      genderEncoded,
      smokingEncoded,
      familyHistory,
      wheezing,
      shortnessOfBreath,
      chestTightness,
      coughingNight,
      fev1,
      allergyHistory,
      pollutionEncoded,
    ]

    // Simple risk calculation based on common patterns
    let riskScore = 0

    // Age factor
    if (age < 18 || age > 60) riskScore += 0.1

    // Smoking
    if (smokingEncoded === 0)
      riskScore += 0.15 // Current smoker
    else if (smokingEncoded === 1) riskScore += 0.08 // Former smoker

    // Family history
    if (familyHistory === 1) riskScore += 0.15

    // Symptoms
    if (wheezing === 1) riskScore += 0.15
    if (shortnessOfBreath === 1) riskScore += 0.12
    if (chestTightness === 1) riskScore += 0.1
    if (coughingNight === 1) riskScore += 0.1

    // Lung function
    if (fev1 < 80) riskScore += 0.15
    else if (fev1 < 90) riskScore += 0.08

    // Allergy history
    if (allergyHistory === 1) riskScore += 0.1

    // Air pollution
    if (pollutionEncoded === 0)
      riskScore += 0.1 // High pollution
    else if (pollutionEncoded === 2) riskScore += 0.05 // Medium pollution

    // Normalize to 0-1 range
    riskScore = Math.min(riskScore, 1)

    const prediction = riskScore > 0.5 ? 1 : 0
    const confidence = prediction === 1 ? riskScore : 1 - riskScore

    return NextResponse.json({
      prediction,
      confidence: Math.round(confidence * 100),
      riskLevel: prediction === 1 ? (confidence > 0.7 ? "High" : "Moderate") : "Low",
      features,
    })
  } catch (error) {
    console.error("Prediction error:", error)
    return NextResponse.json({ error: "Failed to make prediction" }, { status: 500 })
  }
}
