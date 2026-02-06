// Application State
let currentStep = 1;
const totalSteps = 5;

// DOM Elements
const form = document.getElementById('applicationForm');
const formSteps = document.querySelectorAll('.form-step');
const backBtn = document.getElementById('backBtn');
const continueBtn = document.getElementById('continueBtn');
const submitBtn = document.getElementById('submitBtn');
const progressFill = document.getElementById('progressFill');
const stepLabel = document.getElementById('stepLabel');
const stepIndicator = document.getElementById('stepIndicator');
const processingScreen = document.getElementById('processingScreen');

// Step Labels
const stepLabels = {
    1: 'Basic Information',
    2: 'Business Information',
    3: 'Owner Information',
    4: 'Acknowledge & Agree',
    5: 'Bank Activity'
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateUI();
    setupFileInputs();
    setupPhoneInputs();
    setupSSNInput();
    setupTaxIDInput();
});

// Update UI based on current step
function updateUI() {
    // Update progress bar
    const progress = (currentStep / totalSteps) * 100;
    progressFill.style.width = `${progress}%`;
    
    // Update step label and indicator
    stepLabel.textContent = stepLabels[currentStep];
    stepIndicator.textContent = `Step ${currentStep} of ${totalSteps}`;
    
    // Show/hide form steps
    formSteps.forEach((step, index) => {
        if (index + 1 === currentStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
    
    // Show/hide buttons
    backBtn.style.display = currentStep === 1 ? 'none' : 'inline-block';
    continueBtn.style.display = currentStep === totalSteps ? 'none' : 'inline-block';
    submitBtn.style.display = currentStep === totalSteps ? 'inline-block' : 'none';
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Validate current step
function validateStep(step) {
    const currentStepElement = document.querySelector(`.form-step[data-step="${step}"]`);
    const inputs = currentStepElement.querySelectorAll('input[required], select[required]');
    const checkboxes = currentStepElement.querySelectorAll('input[type="checkbox"][required]');
    const radios = currentStepElement.querySelectorAll('input[type="radio"][required]');
    
    let isValid = true;
    
    // Validate regular inputs
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = '#ef4444';
            isValid = false;
        } else {
            input.style.borderColor = '';
        }
    });
    
    // Validate checkboxes
    checkboxes.forEach(checkbox => {
        if (!checkbox.checked) {
            isValid = false;
        }
    });
    
    // Validate radio buttons (check if at least one in each group is checked)
    const radioNames = new Set();
    radios.forEach(radio => radioNames.add(radio.name));
    
    radioNames.forEach(name => {
        const group = currentStepElement.querySelectorAll(`input[name="${name}"]`);
        const isChecked = Array.from(group).some(radio => radio.checked);
        if (!isChecked) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Continue button handler
continueBtn.addEventListener('click', () => {
    if (validateStep(currentStep)) {
        currentStep++;
        updateUI();
    } else {
        alert('Please fill in all required fields before continuing.');
    }
});

// Back button handler
backBtn.addEventListener('click', () => {
    if (currentStep > 1) {
        currentStep--;
        updateUI();
    }
});

// Form submission
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (validateStep(currentStep)) {
        // Show processing screen
        processingScreen.style.display = 'flex';
        
        // Simulate processing (in real app, send data to server)
        setTimeout(() => {
            // Here you would handle the actual form submission
            console.log('Application submitted!');
            
            // For demo purposes, show a success message after 3 seconds
            setTimeout(() => {
                alert('Thank you for your application! Our team will contact you within 4 hours.');
                // Redirect to home page
                window.location.href = 'index.html';
            }, 3000);
        }, 1000);
    } else {
        alert('Please fill in all required fields and upload all bank statements.');
    }
});

// File input handlers
function setupFileInputs() {
    const fileInputs = document.querySelectorAll('.file-input');
    
    fileInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            const fileName = e.target.files[0]?.name || 'No file chosen';
            const fileNameDisplay = document.getElementById(`fileName${input.id.slice(-1)}`);
            if (fileNameDisplay) {
                fileNameDisplay.textContent = fileName;
                fileNameDisplay.style.color = e.target.files[0] ? 'var(--text-color)' : 'var(--text-light)';
            }
            
            // Validate file size (5MB max)
            if (e.target.files[0] && e.target.files[0].size > 5 * 1024 * 1024) {
                alert('File size must be less than 5MB');
                e.target.value = '';
                if (fileNameDisplay) {
                    fileNameDisplay.textContent = 'No file chosen';
                }
            }
        });
    });
}

// Phone number formatting
function setupPhoneInputs() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    
    phoneInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 10) value = value.slice(0, 10);
            
            if (value.length >= 6) {
                value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`;
            } else if (value.length >= 3) {
                value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
            }
            
            e.target.value = value;
        });
    });
}

// SSN formatting
function setupSSNInput() {
    const ssnInput = document.getElementById('ssn');
    
    if (ssnInput) {
        ssnInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 9) value = value.slice(0, 9);
            
            if (value.length >= 5) {
                value = `${value.slice(0, 3)}-${value.slice(3, 5)}-${value.slice(5)}`;
            } else if (value.length >= 3) {
                value = `${value.slice(0, 3)}-${value.slice(3)}`;
            }
            
            e.target.value = value;
        });
    }
}

// Tax ID formatting
function setupTaxIDInput() {
    const taxIdInput = document.getElementById('taxId');
    
    if (taxIdInput) {
        taxIdInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 9) value = value.slice(0, 9);
            
            if (value.length >= 2) {
                value = `${value.slice(0, 2)}-${value.slice(2)}`;
            }
            
            e.target.value = value;
        });
    }
}

// ZIP code validation
const zipInputs = document.querySelectorAll('input[id$="Zip"]');
zipInputs.forEach(input => {
    input.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 5);
    });
});