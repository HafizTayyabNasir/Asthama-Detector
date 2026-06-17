import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import json
import pickle

print("Loading dataset...")
df = pd.read_csv('data/asthma_patient_dataset_3000.csv')

print(f"Dataset shape: {df.shape}")
print("\nFirst few rows:")
print(df.head())

print("\nDataset info:")
print(df.info())

print("\nChecking for missing values:")
print(df.isnull().sum())
print("\n" + "="*50)
print("Starting Data Preprocessing...")
print("="*50)

le_gender = LabelEncoder()
le_smoking = LabelEncoder()
le_pollution = LabelEncoder()

df['Gender_Encoded'] = le_gender.fit_transform(df['Gender'])
df['Smoking_Encoded'] = le_smoking.fit_transform(df['Smoking_Status'])
df['Pollution_Encoded'] = le_pollution.fit_transform(df['Air_Pollution_Exposure'])

feature_columns = [
    'Age', 'Gender_Encoded', 'Smoking_Encoded', 'Family_History_Asthma',
    'Wheezing', 'Shortness_of_Breath', 'Chest_Tightness', 'Coughing_Night',
    'FEV1_Percent', 'Allergy_History', 'Pollution_Encoded'
]

X = df[feature_columns]
y = df['Asthma']

print(f"\nFeatures shape: {X.shape}")
print(f"Target shape: {y.shape}")
print(f"\nTarget distribution:")
print(y.value_counts())

print("\nSplitting data into training and testing sets (80-20 split)...")
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

print(f"Training set size: {X_train.shape[0]}")
print(f"Testing set size: {X_test.shape[0]}")

print("\nApplying feature scaling...")
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

print("\n" + "="*50)
print("Training Logistic Regression Model...")
print("="*50)

model = LogisticRegression(random_state=42, max_iter=1000)
model.fit(X_train_scaled, y_train)

print("Model training completed!")

print("\nMaking predictions on test set...")
y_pred = model.predict(X_test_scaled)

print("\n" + "="*50)
print("Model Evaluation")
print("="*50)

accuracy = accuracy_score(y_test, y_pred)
print(f"\nAccuracy: {accuracy:.4f} ({accuracy*100:.2f}%)")

print("\nConfusion Matrix:")
cm = confusion_matrix(y_test, y_pred)
print(cm)

print("\nClassification Report:")
print(classification_report(y_test, y_pred, target_names=['No Asthma', 'Asthma']))

print("\nFeature Importance (Coefficients):")
feature_importance = pd.DataFrame({
    'Feature': feature_columns,
    'Coefficient': model.coef_[0]
}).sort_values(by='Coefficient', ascending=False)
print(feature_importance)

print("\n" + "="*50)
print("Saving model and preprocessing objects...")
print("="*50)

with open('public/model.pkl', 'wb') as f:
    pickle.dump(model, f)
print("✓ Model saved to public/model.pkl")

with open('public/scaler.pkl', 'wb') as f:
    pickle.dump(scaler, f)
print("✓ Scaler saved to public/scaler.pkl")

encoders = {
    'gender': {
        'classes': le_gender.classes_.tolist(),
        'mapping': {label: int(idx) for idx, label in enumerate(le_gender.classes_)}
    },
    'smoking': {
        'classes': le_smoking.classes_.tolist(),
        'mapping': {label: int(idx) for idx, label in enumerate(le_smoking.classes_)}
    },
    'pollution': {
        'classes': le_pollution.classes_.tolist(),
        'mapping': {label: int(idx) for idx, label in enumerate(le_pollution.classes_)}
    }
}

with open('public/encoders.json', 'w') as f:
    json.dump(encoders, f, indent=2)
print("✓ Encoders saved to public/encoders.json")

metadata = {
    'accuracy': float(accuracy),
    'feature_columns': feature_columns,
    'model_type': 'Logistic Regression',
    'training_samples': int(X_train.shape[0]),
    'testing_samples': int(X_test.shape[0])
}

with open('public/model_metadata.json', 'w') as f:
    json.dump(metadata, f, indent=2)
print("✓ Metadata saved to public/model_metadata.json")

print("\n" + "="*50)
print("Model training and evaluation completed successfully!")
print("="*50)