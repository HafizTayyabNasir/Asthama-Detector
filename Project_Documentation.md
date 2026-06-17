# Asthma Risk Prediction Using Machine Learning - Project Documentation

## 1. Project Overview (Introduction)
**What is this project and what is it used for?**
This project is a comprehensive web-based application that leverages Machine Learning to predict the risk of asthma in patients. It provides an intuitive interface where users can input various health and demographic details (such as age, smoking habits, environmental factors, and symptoms). Based on this data, the integrated Machine Learning model calculates and predicts whether the individual is at risk of having asthma. 
This tool is highly beneficial for early diagnosis, risk assessment, and raising health awareness among users.

## 2. Technology Stack (Tech Stacks)
The project is built using a modern, full-stack approach, dividing responsibilities between a robust front-end framework and powerful data science libraries.

### Web Application (Frontend & Backend)
- **Framework**: **Next.js 16+** (A React framework for building fast web applications).
- **Language**: TypeScript / JavaScript.
- **Styling**: **Tailwind CSS** (for utility-first, responsive design).
- **UI Components**: **Radix UI** (for accessible, unstyled components like dialogs, menus, and forms).
- **Form Handling & Validation**: `react-hook-form` along with `zod` for strict schema validation.
- **Data Visualization**: `recharts` for displaying statistics and data visually.
- **Icons**: `lucide-react`.

### Machine Learning (Data Science)
- **Language**: **Python 3**.
- **Libraries**:
  - `pandas` and `numpy`: For data manipulation, reading CSVs, and structuring datasets.
  - `scikit-learn`: The core library used for model training, preprocessing, and evaluation.
  - `pickle` & `json`: For exporting the trained model and encoders so they can be consumed by the web application.

## 3. Machine Learning Model Details (ML Model & Data)

**Which ML Model is used?**
The core machine learning algorithm powering the prediction is **Logistic Regression** (`sklearn.linear_model.LogisticRegression`). It is a classification algorithm well-suited for binary outcomes (e.g., Asthma: Yes or No).

### Dataset & Features
- **Dataset**: `asthma_patient_dataset_3000.csv` (Contains data of 3,000 patients).
- **Features (Input Variables)**: The model considers 11 key factors to make a prediction:
  1. Age
  2. Gender
  3. Smoking Status
  4. Family History of Asthma
  5. Wheezing
  6. Shortness of Breath
  7. Chest Tightness
  8. Coughing at Night
  9. FEV1 Percent (Lung function test metric)
  10. Allergy History
  11. Air Pollution Exposure

### Data Preprocessing & Training
1. **Encoding**: Categorical variables like Gender, Smoking Status, and Pollution Exposure are converted into numerical formats using `LabelEncoder`.
2. **Scaling**: To ensure the Logistic Regression model performs optimally, all features are normalized using `StandardScaler`.
3. **Train/Test Split**: The dataset is split into an 80-20 ratio (80% of data is used to train the model, and 20% is used to test its accuracy).
4. **Export**: The final trained model (`model.pkl`), the scaler (`scaler.pkl`), and the encoder mappings (`encoders.json`) are saved directly into the Next.js `public/` directory so the application can utilize them for real-time predictions.