// This file initializes the webpage, sets up event listeners, and manages the overall functionality of the application.

document.addEventListener('DOMContentLoaded', () => {
    console.log('Accident Detection Visualization Initialized');
    
    // DOM elements
    const startButton = document.getElementById('start-visualization');
    const visualizationContainer = document.getElementById('visualization-container');
    
    // Add controls panel to DOM
    const controlsPanel = document.createElement('div');
    controlsPanel.id = 'controls-panel';
    visualizationContainer.insertAdjacentElement('afterend', controlsPanel);
    
    // Create scenario buttons
    const scenarios = [
        { id: 'head-on', name: 'Head-on Collision' },
        { id: 'rear-end', name: 'Rear-end Collision' },
        { id: 'side-impact', name: 'Side Impact (T-bone)' }
    ];
    
    scenarios.forEach(scenario => {
        const button = document.createElement('button');
        button.classList.add('scenario-btn');
        button.dataset.scenario = scenario.id;
        button.textContent = scenario.name;
        button.addEventListener('click', () => {
            // Reset stats before loading new scenario
            document.getElementById('confidence-value').textContent = '0%';
            document.getElementById('collision-type').textContent = scenario.name;
            document.getElementById('impact-force').textContent = '0 kN';
            
            // Load the scenario
            visualization.loadScenario(scenario.id);
        });
        controlsPanel.appendChild(button);
    });
    
    // Add stats panel
    const statsPanel = document.createElement('div');
    statsPanel.classList.add('stats-panel');
    statsPanel.innerHTML = `
        <h3>Accident Detection Stats</h3>
        <p>Detection Confidence: <span id="confidence-value">0%</span></p>
        <p>Collision Type: <span id="collision-type">None</span></p>
        <p>Estimated Impact Force: <span id="impact-force">0 kN</span></p>
    `;
    visualizationContainer.appendChild(statsPanel);
    
    // Add detection alert
    const detectionAlert = document.createElement('div');
    detectionAlert.classList.add('detection-alert');
    detectionAlert.textContent = 'ACCIDENT DETECTED!';
    visualizationContainer.appendChild(detectionAlert);
    
    // Initialize visualization on button click
    startButton.addEventListener('click', () => {
        startButton.disabled = true;
        startButton.textContent = 'Loading...';
        
        // Initialize visualization and detection systems
        visualization.init(visualizationContainer)
            .then(() => {
                accidentDetection.init();
                
                // Update button state
                startButton.textContent = 'Restart Visualization';
                startButton.disabled = false;
                
                // Auto-start default scenario
                visualization.loadScenario('head-on');
            })
            .catch(error => {
                console.error('Failed to initialize visualization:', error);
                startButton.textContent = 'Retry';
                startButton.disabled = false;
            });
    });
    
    // Connect accident detection to visualization
    visualization.onUpdate = (data) => {
        accidentDetection.analyzeFrame(data);
    };
    
    // Update UI with detection results
    accidentDetection.onDetection = (result) => {
        document.getElementById('confidence-value').textContent = `${Math.round(result.confidence * 100)}%`;
        document.getElementById('collision-type').textContent = result.collisionType || 'None';
        document.getElementById('impact-force').textContent = `${result.impactForce.toFixed(1)} kN`;
        
        if (result.isAccident && result.confidence > 0.75) {
            detectionAlert.classList.add('visible');
            setTimeout(() => {
                detectionAlert.classList.remove('visible');
            }, 3000);
        }
    };

    // REMOVE THIS - it's causing duplicate initialization
    // initApp();
});

// REMOVE THESE UNDEFINED FUNCTIONS
// function initApp() {
//     setupVisualization();
//     fetchAccidentData().then(data => {
//         processAccidentData(data);
//     });
//     setupEventListeners();
// }