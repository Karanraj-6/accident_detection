// visualization.js - No imports, uses global THREE

const visualization = (() => {
    // Private variables
    let scene, camera, renderer, controls;
    let cars = [];
    let road;
    let animationFrameId = null;
    let isInitialized = false;
    let currentScenario = 'head-on';
    
    console.log("Visualization module loaded");
    
    // Create a simple car using basic shapes
    function createSimpleCar(color) {
        console.log("Creating simple car with color", color);
        const carGroup = new THREE.Group();
        
        // Car body
        const bodyGeometry = new THREE.BoxGeometry(3, 1.2, 1.8);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: color || 0xff0000,
            roughness: 0.5,
            metalness: 0.7
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.castShadow = true;
        body.receiveShadow = true;
        carGroup.add(body);
        
        // Car roof
        const roofGeometry = new THREE.BoxGeometry(2, 1, 1.7);
        const roof = new THREE.Mesh(roofGeometry, bodyMaterial);
        roof.position.set(-0.2, 1, 0);
        roof.castShadow = true;
        roof.receiveShadow = true;
        carGroup.add(roof);
        
        // Wheels
        const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 16);
        const wheelMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            roughness: 0.8,
            metalness: 0.2
        });
        
        // Add four wheels
        const wheelPositions = [
            [1, -0.5, 1],   // Front left
            [1, -0.5, -1],  // Front right
            [-1, -0.5, 1],  // Rear left
            [-1, -0.5, -1]  // Rear right
        ];
        
        wheelPositions.forEach(position => {
            const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
            wheel.rotation.z = Math.PI / 2;
            wheel.position.set(...position);
            wheel.castShadow = true;
            carGroup.add(wheel);
        });
        
        return carGroup;
    }
    
    // Create a road
    function createRoad() {
        console.log("Creating road");
        const roadGeometry = new THREE.PlaneGeometry(50, 20);
        const roadMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            roughness: 0.8,
            metalness: 0.2
        });
        
        const road = new THREE.Mesh(roadGeometry, roadMaterial);
        road.rotation.x = -Math.PI / 2;
        road.position.y = -0.1;
        road.receiveShadow = true;
        
        // Add lane markings
        const markingGeometry = new THREE.PlaneGeometry(1, 0.2);
        const markingMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
        
        for (let i = -20; i < 20; i += 4) {
            const marking = new THREE.Mesh(markingGeometry, markingMaterial);
            marking.rotation.x = -Math.PI / 2;
            marking.position.set(i, -0.09, 0);
            road.add(marking);
        }
        
        return road;
    }
    
    // Main render loop
    function animate() {
        animationFrameId = requestAnimationFrame(animate);
        
        // Update car positions based on velocity
        cars.forEach(car => {
            if (!car.userData.collided) {
                car.position.x += car.userData.velocity.x;
                car.position.y += car.userData.velocity.y;
                car.position.z += car.userData.velocity.z;
            } else {
                // Apply post-collision physics
                car.position.x += car.userData.velocity.x;
                car.position.y += car.userData.velocity.y;
                car.position.z += car.userData.velocity.z;
                
                // Apply angular velocity
                car.rotation.x += car.userData.angularVelocity.x;
                car.rotation.y += car.userData.angularVelocity.y;
                car.rotation.z += car.userData.angularVelocity.z;
                
                // Apply gravity
                if (car.position.y > 0) {
                    car.userData.velocity.y -= 0.01;
                } else {
                    car.userData.velocity.y = 0;
                    car.position.y = 0;
                }
            }
        });
        
        // Check for collisions
        if (cars.length >= 2) {
            const car1 = cars[0];
            const car2 = cars[1];
            
            // Simple distance-based collision detection
            const distance = car1.position.distanceTo(car2.position);
            if (distance < 3 && !car1.userData.collided) {
                console.log("Collision detected!");
                car1.userData.collided = true;
                car2.userData.collided = true;
                
                // Add random post-collision velocities
                car1.userData.velocity = {
                    x: (Math.random() - 0.5) * 0.2,
                    y: 0.1,
                    z: (Math.random() - 0.5) * 0.2
                };
                
                car2.userData.velocity = {
                    x: (Math.random() - 0.5) * 0.2,
                    y: 0.1,
                    z: (Math.random() - 0.5) * 0.2
                };
                
                car1.userData.angularVelocity = {
                    x: (Math.random() - 0.5) * 0.05,
                    y: (Math.random() - 0.5) * 0.05,
                    z: (Math.random() - 0.5) * 0.05
                };
                
                car2.userData.angularVelocity = {
                    x: (Math.random() - 0.5) * 0.05,
                    y: (Math.random() - 0.5) * 0.05,
                    z: (Math.random() - 0.5) * 0.05
                };
                
                // Notify collision
                if (visualization.onUpdate) {
                    // Map scenario ID to proper display name
                    let collisionTypeName;
                    switch (currentScenario) {
                        case 'head-on':
                            collisionTypeName = "Head-on Collision";
                            break;
                        case 'rear-end':
                            collisionTypeName = "Rear-end Collision";
                            break;
                        case 'side-impact':
                            collisionTypeName = "Side Impact (T-bone)";
                            break;
                        default:
                            collisionTypeName = "Unknown Collision";
                    }
                    
                    visualization.onUpdate({
                        collisionOccurred: true,
                        impactForce: 25 + Math.random() * 20,
                        collisionType: collisionTypeName,
                        scenarioId: currentScenario
                    });
                }
            }
        }
        
        if (controls) controls.update();
        renderer.render(scene, camera);
    }
    
    // Define scenarios
    const scenarios = {
        'head-on': {
            cars: [
                {
                    position: { x: -10, y: 0, z: 0 },
                    rotation: { x: 0, y: Math.PI, z: 0 },
                    color: 0x3498db,
                    velocity: { x: 0.15, y: 0, z: 0 }
                },
                {
                    position: { x: 10, y: 0, z: 0 },
                    rotation: { x: 0, y: 0, z: 0 },
                    color: 0xe74c3c,
                    velocity: { x: -0.12, y: 0, z: 0 }
                }
            ]
        },
        'rear-end': {
            cars: [
                {
                    position: { x: 0, y: 0, z: 0 },
                    rotation: { x: 0, y: 0, z: 0 },
                    color: 0x2ecc71,
                    velocity: { x: 0.05, y: 0, z: 0 }
                },
                {
                    position: { x: -8, y: 0, z: 0 },
                    rotation: { x: 0, y: 0, z: 0 },
                    color: 0xf39c12,
                    velocity: { x: 0.2, y: 0, z: 0 }
                }
            ]
        },
        'side-impact': {
            cars: [
                {
                    position: { x: 0, y: 0, z: -8 },
                    rotation: { x: 0, y: Math.PI / 2, z: 0 },
                    color: 0x9b59b6,
                    velocity: { x: 0, y: 0, z: 0.18 }
                },
                {
                    position: { x: 0, y: 0, z: 0 },
                    rotation: { x: 0, y: 0, z: 0 },
                    color: 0x1abc9c,
                    velocity: { x: 0, y: 0, z: 0 }
                }
            ]
        }
    };
    
    return {
        init: function(container) {
            console.log("Visualization.init called with container", container);
            return new Promise((resolve, reject) => {
                try {
                    // Setup renderer
                    renderer = new THREE.WebGLRenderer({ antialias: true });
                    renderer.setSize(container.clientWidth, container.clientHeight);
                    renderer.setPixelRatio(window.devicePixelRatio);
                    renderer.shadowMap.enabled = true;
                    container.appendChild(renderer.domElement);
                    
                    console.log("Renderer created and added to container");
                    
                    // Setup scene
                    scene = new THREE.Scene();
                    scene.background = new THREE.Color(0x87CEEB);
                    
                    // Setup camera
                    camera = new THREE.PerspectiveCamera(
                        60,
                        container.clientWidth / container.clientHeight,
                        0.1,
                        1000
                    );
                    camera.position.set(0, 5, 15);
                    
                    console.log("Camera set up at position", camera.position);
                    
                    // Setup lights
                    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
                    scene.add(ambientLight);
                    
                    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
                    directionalLight.position.set(10, 20, 10);
                    directionalLight.castShadow = true;
                    scene.add(directionalLight);
                    
                    console.log("Lights added to scene");
                    
                    // Create road
                    road = createRoad();
                    scene.add(road);
                    
                    // Setup controls if OrbitControls is available
                    if (typeof THREE.OrbitControls === 'function') {
                        controls = new THREE.OrbitControls(camera, renderer.domElement);
                        controls.enableDamping = true;
                        controls.dampingFactor = 0.05;
                        console.log("OrbitControls initialized");
                    } else {
                        console.warn("THREE.OrbitControls not found, skipping camera controls");
                    }
                    
                    // Add a test cube to make sure something is visible
                    const testCube = new THREE.Mesh(
                        new THREE.BoxGeometry(1, 1, 1),
                        new THREE.MeshStandardMaterial({ color: 0xffff00 })
                    );
                    testCube.position.set(0, 1, 0);
                    scene.add(testCube);
                    
                    console.log("Test cube added to scene");
                    
                    // Handle window resize
                    window.addEventListener('resize', () => {
                        camera.aspect = container.clientWidth / container.clientHeight;
                        camera.updateProjectionMatrix();
                        renderer.setSize(container.clientWidth, container.clientHeight);
                    });
                    
                    isInitialized = true;
                    console.log("Visualization initialized successfully");
                    
                    // Start rendering
                    animate();
                    
                    resolve();
                } catch (error) {
                    console.error("Visualization initialization error:", error);
                    reject(error);
                }
            });
        },
        
        loadScenario: function(scenarioId) {
            console.log("Loading scenario:", scenarioId);
            
            if (!isInitialized) {
                console.error("Visualization not initialized");
                return;
            }
            
            // IMPORTANT: Store the current scenario ID
            currentScenario = scenarioId;
            
            // Reset collision flags for all cars
            cars.forEach(car => {
                if (car.userData) {
                    car.userData.collided = false;
                }
            });
            
            // Clear existing cars
            cars.forEach(car => {
                scene.remove(car);
            });
            cars = [];
            
            // Get scenario data
            const scenario = scenarios[scenarioId];
            if (!scenario) {
                console.error("Scenario not found:", scenarioId);
                return;
            }
            
            console.log("Creating cars for scenario:", scenarioId);
            
            // Create cars for this scenario
            scenario.cars.forEach(carData => {
                const car = createSimpleCar(carData.color);
                
                // Position and rotate car
                car.position.copy(carData.position);
                car.rotation.copy(carData.rotation);
                
                // Store car data for physics
                car.userData = {
                    velocity: {...carData.velocity},
                    angularVelocity: { x: 0, y: 0, z: 0 },
                    collided: false
                };
                
                cars.push(car);
                scene.add(car);
                
                console.log("Car added at position", car.position);
            });
            
            // IMPORTANT: Notify accident detection of scenario change
            if (visualization.onUpdate) {
                visualization.onUpdate({
                    scenarioChanged: true,
                    newScenario: currentScenario
                });
            }
        },
        
        onUpdate: null // Will be set from main.js
    };
})();

// Make sure visualization is globally accessible
window.visualization = visualization;
console.log("Visualization object created and exposed to window");