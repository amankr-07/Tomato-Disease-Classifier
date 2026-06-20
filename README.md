# Tomato Disease Classification - Full Stack Application

A complete full-stack application for classifying tomato diseases using deep learning. Upload a leaf image to identify diseases with confidence scores.

## 🎯 Features

- **Real-time Classification**: Classify tomato diseases from leaf images
- **Confidence Scores**: Get prediction confidence for each disease
- **All Predictions**: See confidence percentages for all 10 disease classes
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Drag & Drop Upload**: Easy image selection with drag-and-drop support
- **Lightweight Frontend**: Pure HTML/CSS/JavaScript, no build step needed
- **Fast Backend**: FastAPI with optimized model loading

## 🍅 Supported Diseases

1. Bacterial Spot
2. Early Blight
3. Late Blight
4. Leaf Mold
5. Septoria Leaf Spot
6. Spider Mites
7. Target Spot
8. Yellow Leaf Curl Virus
9. Tomato Mosaic Virus
10. Healthy

## 🚀 Quick Start - Local Development

### Prerequisites

- Python 3.9+
- pip
- Git

### 1. Clone/Setup Project

```bash
cd "Tomato Disease Classification"
```

### 2. Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
cd ..
```

### 3. Start Backend Server

```bash
cd backend
uvicorn app:app --reload
```

The API will be available at `http://localhost:8000`. Check docs at `http://localhost:8000/docs`

### 4. Start Frontend Server

In a new terminal:

```bash
cd frontend
python -m http.server 5000
```

Or using any other HTTP server (e.g., `npx http-server` if Node.js is installed).

### 5. Open Browser

Navigate to `http://localhost:5000` and start classifying tomato leaves!

## 📁 Project Structure

```
.
├── backend/
│   ├── app.py                # FastAPI application with model loading
│   ├── requirements.txt      # Python dependencies
│   ├── Dockerfile            # Docker configuration for Render
│   ├── render.yaml           # Render deployment config
│   └── .env                  # Local environment variables
├── frontend/
│   ├── index.html            # Main HTML file
│   ├── style.css             # Styling
│   ├── script.js             # Frontend logic
│   ├── vercel.json           # Vercel deployment config
│   └── .env.local            # Local environment variables
├── saved_models/
│   └── best_model.h5         # Trained TensorFlow model
├── training/
│   └──training.ipynb         # Training file of model
├── README.md                 # This file
└── start-dev.sh/bat          # Startup scripts
```

## 🌐 Deployment

### Deploy Backend to Render

1. **Create Render Account**: Go to [render.com](https://render.com)

2. **Connect GitHub Repository**:
   - Push this project to GitHub
   - Sign up/login to Render
   - Connect your GitHub account

3. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Select the repository
   - Configure:
     - **Name**: `tomato-disease-classifier`
     - **Environment**: `Python 3`
     - **Build Command**: `pip install -r requirements.txt`
     - **Start Command**: `uvicorn app:app --host 0.0.0.0 --port 8000`
     - **Root Directory**: `backend`

4. **Set Environment Variables** (if needed):
   - Add `FRONTEND_URL` (your Vercel domain when deployed)

5. **Deploy**:
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Copy the service URL (e.g., `https://tomato-disease-classifier.onrender.com`)

### Deploy Frontend to Vercel

1. **Create Vercel Account**: Go to [vercel.com](https://vercel.com)

2. **Import Project**:
   - Click "Add New..." → "Project"
   - Select the GitHub repository

3. **Configure**:
   - **Framework**: `Other` (static site)
   - **Root Directory**: `frontend`
   - **Build Command**: (leave empty or `echo ''`)
   - **Output Directory**: `.` (current directory)

4. **Environment Variables**:
   - Add: `VITE_API_URL=https://tomato-disease-classifier.onrender.com` (or your Render URL)

5. **Deploy**:
   - Click "Deploy"
   - Wait for deployment to complete
   - Your site will be live at the provided Vercel URL

### API Endpoints

**Health Check**
```
GET /health
Response: {"status": "ok", "model_loaded": true}
```

**Predict Disease**
```
POST /predict
Content-Type: multipart/form-data
Body: file=<image_file>

Response:
{
    "class": "Early Blight",
    "confidence": 92.5,
    "all_predictions": {
        "Bacterial Spot": 1.2,
        "Early Blight": 92.5,
        ...
    }
}
```

**API Documentation**
```
GET /docs
```

## 🛠 Development

### Backend Development

The FastAPI backend automatically reloads changes:

```bash
cd backend
uvicorn app:app --reload
```

Visit `http://localhost:8000/docs` for interactive API documentation.

### Frontend Development

Edit the frontend files and refresh the browser. No build step required!

## 📊 Model Information

- **Architecture**: Convolutional Neural Network (CNN)
- **Input**: 256×256 RGB images
- **Output**: 10 disease classes
- **Test Accuracy**: 85.9%
- **Framework**: TensorFlow/Keras

## 🐛 Troubleshooting

**Backend won't start**:
- Ensure Python 3.9+ is installed
- Check all dependencies: `pip install -r requirements.txt`
- Verify port 8000 is available

**Frontend can't reach backend**:
- Make sure backend is running at `http://localhost:8000`
- Check CORS configuration in `backend/app.py`
- Check browser console for errors

**Image upload not working**:
- Ensure file is a valid image (JPG, PNG, etc.)
- Maximum file size depends on server configuration
- Check network tab in browser developer tools

**Model not loading on Render**:
- Ensure `saved_models/best_model.h5` is in the repository
- Check Render logs for TensorFlow errors
- Verify enough storage space on Render instance

## 📝 Environment Variables

### Backend (.env)
```
FRONTEND_URL=http://localhost:5000
```

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:8000
```

For production, update these URLs to your deployed services.

## 🔒 Security

- **CORS Enabled**: Configure frontend domain on backend
- **File Validation**: Only image files accepted
- **Input Validation**: Image size and format checked
- **No Authentication**: Consider adding if needed for production

## 📝 License

This project is provided as-is for educational purposes.

## 🤝 Contributing

Feel free to improve the model, UI, or deployment process!

## 📧 Support

For issues or questions, check:
1. Browser console for frontend errors
2. Terminal output for backend errors
3. Render/Vercel logs for deployment issues

---

**Happy classifying! 🍅**
