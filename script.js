// Get references to HTML elements
const focalLengthInput = document.getElementById('focalLength');
const sensorTypeSelect = document.getElementById('sensorType');
const convertButton = document.getElementById('convertButton');
const resultDisplay = document.getElementById('result');
const modeToFFRadio = document.getElementById('modeToFF');
const modeFromFFRadio = document.getElementById('modeFromFF');
const inputLabel = document.getElementById('inputLabel');
const resultLabel = document.getElementById('resultLabel');
const toolDescription = document.getElementById('toolDescription');
const sensorSelectLabel = document.getElementById('sensorSelectLabel'); // Label for the dropdown

// --- Function to Update Labels Based on Mode ---
function updateLabels() {
    if (modeToFFRadio.checked) {
        toolDescription.textContent = "Convert a lens focal length on a specific sensor TO its Full Frame equivalent.";
        inputLabel.textContent = "Lens Focal Length (mm):";
        sensorSelectLabel.textContent = "Original Sensor Type:";
        resultLabel.textContent = "Full Frame Equivalent:";
    } else {
        toolDescription.textContent = "Convert a Full Frame focal length TO its equivalent on a specific sensor.";
        inputLabel.textContent = "Full Frame Focal Length (mm):";
        sensorSelectLabel.textContent = "Target Sensor Type:";
        // Result label text will be set more specifically during calculation
        resultLabel.textContent = "Equivalent on Selected Sensor:";
    }
    // Clear previous result when mode changes
    resultDisplay.textContent = "-- mm";
    resultDisplay.style.color = '#666'; // Reset color if it was red
}

// --- Function to Perform Conversion ---
function performConversion() {
    // 1. Get selected sensor option details
    const selectedOption = sensorTypeSelect.options[sensorTypeSelect.selectedIndex];
    const cropFactor = parseFloat(selectedOption.value);
    const selectedSensorName = selectedOption.text; // Full text like "APSC (Canon, ~1.6x)"

    // 2. Get the input focal length
    const inputFocalLength = parseFloat(focalLengthInput.value);

    // 3. Validate the input
    if (isNaN(inputFocalLength) || inputFocalLength <= 0) {
        resultDisplay.textContent = "Invalid input";
        resultDisplay.style.color = 'red';
        // Ensure result label is generic in case of error
        resultLabel.textContent = modeToFFRadio.checked ? "Full Frame Equivalent:" : "Equivalent on Selected Sensor:";
        return;
    }

    // 4. Determine calculation based on mode and perform it
    let equivalentFocalLength;
    let currentResultLabelText;

    if (modeToFFRadio.checked) {
        // Mode: Sensor -> Full Frame
        equivalentFocalLength = inputFocalLength * cropFactor;
        currentResultLabelText = "Full Frame Equivalent:"; // Label is fixed for this mode
    } else {
        // Mode: Full Frame -> Sensor
        if (cropFactor === 0) { // Avoid division by zero if a value is somehow 0
             resultDisplay.textContent = "Invalid crop factor";
             resultDisplay.style.color = 'red';
             return;
        }
        equivalentFocalLength = inputFocalLength / cropFactor;
        // Try to get a cleaner sensor name for the label
        let cleanSensorName = selectedSensorName.split('(')[0].trim(); // e.g., "APSC", "Micro Four Thirds"
        currentResultLabelText = `Equivalent on ${cleanSensorName}:`;
    }

    // 5. Display the result
    resultLabel.textContent = currentResultLabelText; // Update the result heading
    // Round to 1 decimal place, use more if needed (e.g., toFixed(2))
    resultDisplay.textContent = equivalentFocalLength.toFixed(1) + " mm";
    resultDisplay.style.color = '#333'; // Reset result text color
}

// --- Event Listeners ---

// Calculate when the button is clicked
convertButton.addEventListener('click', performConversion);

// Calculate when Enter key is pressed in the input field
focalLengthInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter' || event.keyCode === 13) {
        // Optionally prevent form submission if it were inside a form
        event.preventDefault();
        performConversion();
    }
});

// Update labels and clear result when the conversion mode changes
modeToFFRadio.addEventListener('change', updateLabels);
modeFromFFRadio.addEventListener('change', updateLabels);

// --- Initial Setup ---
// Set the correct labels when the page loads
updateLabels();