// accident-detection.js

const accidentDetection = (() => {
    let isInitialized = false;
    let currentScenario = 'head-on';  // Add this line
    
    console.log("Accident detection module loaded");
    
    // Add this function to map scenario IDs to display names
    function getCollisionTypeName(scenarioId) {
        switch (scenarioId) {
            case 'head-on':
                return "Head-on Collision";
            case 'rear-end':
                return "Rear-end Collision";
            case 'side-impact':
                return "Side Impact (T-bone)";
            default:
                return "Unknown Collision";
        }
    }
    
    // Add this function to get scenario-specific confidence
    function getScenarioConfidence(scenarioId) {
        switch (scenarioId) {
            case 'head-on':
                return 1.0 // 90-100%
            case 'rear-end':
                return 1.0; // 85%
            case 'side-impact':
                return 1.0; // 88%
            default:
                return 0.75; // 75%
        }
    }
    
    // Add this function to get scenario-specific impact force
    function getScenarioImpactForce(scenarioId) {
        switch (scenarioId) {
            case 'head-on':
                return 35 + (Math.random() * 15); // 35-50 kN
            case 'rear-end':
                return 20 + (Math.random() * 15); // 20-35 kN
            case 'side-impact':
                return 28 + (Math.random() * 12); // 28-40 kN
            default:
                return 25 + (Math.random() * 10); // 25-35 kN
        }
    }
    
    return {
        init: function() {
            console.log("Accident detection initialized");
            isInitialized = true;
            return Promise.resolve();
        },
        
        analyzeFrame: function(data) {
            if (!data) return;
            
            // Handle scenario change
            if (data.scenarioChanged) {
                currentScenario = data.newScenario;
                console.log("Accident detection: Scenario changed to", currentScenario);
                
                // Send initial stats even before collision
                if (this.onDetection) {
                    this.onDetection({
                        isAccident: false,
                        confidence: 0,
                        impactForce: 0,
                        collisionType: getCollisionTypeName(currentScenario),
                    });
                }
                return;
            }
            
            // Handle collision
            if (data.collisionOccurred && this.onDetection) {
                // Update scenario if provided
                if (data.scenarioId) {
                    currentScenario = data.scenarioId;
                }
                
                // Get scenario-specific values
                const confidence = getScenarioConfidence(currentScenario);
                const impactForce = getScenarioImpactForce(currentScenario);
                const collisionType = getCollisionTypeName(currentScenario);
                
                console.log(`Collision detected: ${collisionType} with confidence ${confidence}`);
                
                this.onDetection({
                    isAccident: true,
                    confidence: confidence,
                    impactForce: impactForce,
                    collisionType: collisionType
                });
            }
        },
        
        onDetection: null
    };
})();

// Make sure accidentDetection is globally accessible
window.accidentDetection = accidentDetection;
console.log("Accident Detection object created and exposed to window");

// Instead of fetching, use hardcoded data for testing
// Remove the fetch that was causing CORS errors
const sampleData = {
  "accidents": [
    {
      "id": 1,
      "location": {
        "latitude": 34.0522,
        "longitude": -118.2437
      },
      "time": "2023-10-01T14:30:00Z",
      "severity": "high",
      "vehicles": [
        {
          "type": "car",
          "model": "sedan",
          "color": "red",
          "damage": "front-end collision"
        },
        {
          "type": "car",
          "model": "SUV",
          "color": "blue",
          "damage": "rear-end collision"
        }
      ]
    }
  ],
  "scenarios": [
    {
      "id": "head-on",
      "name": "Head-on Collision",
      "description": "Two vehicles traveling in opposite directions collide front-to-front",
      "avgImpactForce": 45.2,
      "fatalityRate": 0.42,
      "commonCauses": ["Distracted driving", "Lane departure", "Drunk driving"]
    },
    {
      "id": "rear-end",
      "name": "Rear-end Collision",
      "description": "One vehicle impacts the back of another vehicle",
      "avgImpactForce": 25.8,
      "fatalityRate": 0.07,
      "commonCauses": ["Following too closely", "Sudden stops", "Distracted driving"]
    },
    {
      "id": "side-impact",
      "name": "Side Impact (T-bone)",
      "description": "One vehicle impacts the side of another vehicle, forming a T-shape",
      "avgImpactForce": 32.6,
      "fatalityRate": 0.26,
      "commonCauses": ["Running red lights", "Failure to yield", "Impaired visibility"]
    }
  ]
};

// Process the hardcoded data instead
console.log("Processing hardcoded sample data");
processAccidentData(sampleData);

// Function to process accident data
function processAccidentData(data) {
    console.log("Processing accident data:", data);
    // No need for forEach, just log the data received
}

// Simplified functions to avoid errors
function detectAccident(accident) {
    return true;
}

function triggerVisualization(accident) {
    console.log('Would visualize accident:', accident);
}

function visualizeAccident(accident) {
    console.log('Visualization placeholder for:', accident);
}