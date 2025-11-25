# 📊 TensorSap AI – Smart Data Analysis Agent  
**Upload → Clean → EDA → Model Suggestions → Preprocessing → Analysis & Visualization**

TensorSap AI is an end-to-end intelligent data analysis tool built with **Next.js, TypeScript, Genkit, and Google Gemini Pro models**.  
It processes CSV/Excel datasets, performs automated cleaning, generates EDA insights, suggests suitable ML tasks, and produces analysis-ready results.

---

## 🚀 Features

### ✅ **1. Dataset Upload**
- Supports CSV/Excel files  
- Reads the file automatically and extracts text content  

### ✅ **2. Automated Data Cleaning**
- Missing value detection  
- Suggests imputation strategies (mean, median, mode, category encoding, etc.)  
- Provides a summarized cleaned-dataset report  

### ✅ **3. EDA Generation**
- High-level dataset understanding  
- Summary statistics  
- Column-wise profiling  
- Shape, types, and distribution insights  

### ✅ **4. Analysis Type Suggestions**
Gemini Pro recommends the most appropriate ML task:
- Regression  
- Classification  
- Clustering  
- Time Series  
- Recommendation  

Each suggestion includes a **reasoning explanation**.

### ✅ **5. Preprocessing Pipeline**
- Scaling  
- Encoding  
- Train-test split  
- Feature engineering  
- Domain-aware preprocessing  

### ✅ **6. Analysis & Visualization**
- Model results text output  
- Visualization descriptions (bar chart, scatter plot, line chart, etc.)  
- All generated through Gemini Pro reasoning  

---

## 🧠 AI Stack

- **Genkit** for prompt flows + model invocation  
- **Google Gemini 2.x models** (e.g., `gemini-2.5-pro` or `gemini-pro-latest`)  
- Modular AI pipelines:
  - `handle-missing-data.ts`
  - `generate-eda-report.ts`
  - `suggest-analysis-types.ts`
  - `automate-preprocessing.ts`
  - `analyze-and-visualize.ts`

Gemini handles:
- Reasoning  
- Cleaning logic  
- Statistical EDA  
- ML task understanding  
- Visualization narrative generation  

---

## 🏗️ Tech Stack

| Layer | Tools |
|------|-------|
| Frontend | Next.js, TypeScript, Tailwind CSS |
| Backend | Genkit AI runtime |
| AI Models | Google Gemini Pro |
| UI Library | ShadCN + Lucide Icons |
| Deployment | Local (can be deployed to Firebase Hosting / Vercel) |
| File Handling | Browser File API |

---
