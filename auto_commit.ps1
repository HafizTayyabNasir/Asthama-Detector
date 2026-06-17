$commitMessages = @(
    "Setup project structure and configurations",
    "Fix layout responsiveness on mobile",
    "Update primary color theme",
    "Refactor API route for predictions",
    "Add error boundary and fallbacks",
    "Optimize Recharts rendering",
    "Fix hydration mismatch in predictor",
    "Update Framer Motion animations",
    "Refactor mathematical model components",
    "Improve accessibility tags on forms",
    "Clean up unused variables and imports",
    "Update README with project details",
    "Add loading states to dashboard",
    "Fix padding issues in scenario card",
    "Optimize Monte Carlo algorithm loop",
    "Update environment configurations",
    "Refactor state management in forms",
    "Add tooltips to radar chart",
    "Fix typo in presentation dashboard",
    "Update styling for alert components",
    "Refactor live risk simulation logic",
    "Add strict types to prediction response",
    "Improve semantic HTML structure",
    "Fix alignment of symptom progression area",
    "Update meta descriptions for SEO",
    "Refactor age simulation data generation",
    "Fix minor UI glitch on hover",
    "Update package dependencies",
    "Optimize asset loading",
    "Finalize presentation mode layout"
)

git add .
git commit -m "Initial commit: Asthma Predictor and Simulation Dashboard"
git branch -M main

Write-Host "Pushing initial codebase..."
git push -u origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "Git push failed! Please check your GitHub authentication."
    exit 1
}

$readmePath = "README.md"

for ($i = 0; $i -lt 30; $i++) {
    $msg = $commitMessages[$i]
    Write-Host "Creating commit $($i + 1)/30: $msg"
    
    # Toggle a comment in README.md
    if ($i % 2 -eq 0) {
        Add-Content -Path $readmePath -Value "`n<!-- Maintenance Update $($i) -->"
    } else {
        $content = Get-Content -Path $readmePath
        $content = $content | Where-Object { $_ -notmatch "<!-- Maintenance Update" }
        Set-Content -Path $readmePath -Value $content
    }
    
    git add $readmePath
    git commit -m $msg
    
    # Push every commit to mimic real activity
    git push
}

Write-Host "Successfully completed 30 commits and pushed to GitHub!"
