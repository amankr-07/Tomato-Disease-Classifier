// Configuration
const API_URL = getApiUrl();

function getApiUrl() {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:8000';
    }
    // For production, use the environment variable or default
    return window.API_URL || 'https://your-render-backend.onrender.com';
}

// DOM Elements
const uploadBox = document.getElementById('uploadBox');
const fileInput = document.getElementById('fileInput');
const previewSection = document.getElementById('previewSection');
const previewImage = document.getElementById('previewImage');
const predictBtn = document.getElementById('predictBtn');
const resetBtn = document.getElementById('resetBtn');
const resultsSection = document.getElementById('resultsSection');
const diseaseName = document.getElementById('diseaseName');
const confidenceValue = document.getElementById('confidenceValue');
const confidenceFill = document.getElementById('confidenceFill');
const allPredictionsContainer = document.getElementById('allPredictionsContainer');
const newImageBtn = document.getElementById('newImageBtn');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('errorMessage');

let selectedFile = null;

// Event Listeners
uploadBox.addEventListener('click', () => fileInput.click());
uploadBox.addEventListener('dragover', handleDragOver);
uploadBox.addEventListener('dragleave', handleDragLeave);
uploadBox.addEventListener('drop', handleDrop);

fileInput.addEventListener('change', handleFileSelect);
predictBtn.addEventListener('click', sendPrediction);
resetBtn.addEventListener('click', resetUpload);
newImageBtn.addEventListener('click', resetAll);

// File Handling
function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        selectFile(file);
    }
}

function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    uploadBox.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    uploadBox.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    uploadBox.classList.remove('drag-over');

    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('image/')) {
        selectFile(files[0]);
    } else {
        showError('Please drop a valid image file');
    }
}

function selectFile(file) {
    selectedFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
        previewImage.src = e.target.result;
        uploadBox.style.display = 'none';
        previewSection.style.display = 'block';
        resultsSection.style.display = 'none';
        errorMessage.style.display = 'none';
    };
    reader.readAsDataURL(file);
}

function resetUpload() {
    selectedFile = null;
    fileInput.value = '';
    uploadBox.style.display = 'block';
    previewSection.style.display = 'none';
    resultsSection.style.display = 'none';
    errorMessage.style.display = 'none';
}

function resetAll() {
    resetUpload();
}

// Prediction
async function sendPrediction() {
    if (!selectedFile) {
        showError('Please select an image first');
        return;
    }

    loading.style.display = 'block';
    previewSection.style.display = 'none';
    errorMessage.style.display = 'none';

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
        const response = await fetch(`${API_URL}/predict`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        displayResults(result);
    } catch (error) {
        showError(`Error: ${error.message}. Make sure the backend is running at ${API_URL}`);
    } finally {
        loading.style.display = 'none';
    }
}

function displayResults(result) {
    diseaseName.textContent = result.class;
    confidenceValue.textContent = result.confidence;
    confidenceFill.style.width = `${result.confidence}%`;

    // Display all predictions
    allPredictionsContainer.innerHTML = '';
    const sortedPredictions = Object.entries(result.all_predictions)
        .sort((a, b) => b[1] - a[1]);

    sortedPredictions.forEach(([disease, confidence]) => {
        const div = document.createElement('div');
        div.className = 'prediction-item';
        div.innerHTML = `
            <div class="prediction-name">${disease}</div>
            <div class="prediction-confidence">${confidence}%</div>
        `;
        allPredictionsContainer.appendChild(div);
    });

    resultsSection.style.display = 'block';
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

// Initialize
console.log(`API URL: ${API_URL}`);
