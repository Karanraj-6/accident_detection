# Accident Detection Visualization

This project is designed to visualize car accidents using 3D graphics. It leverages the Three.js library to create impactful visualizations that demonstrate various accident scenarios based on sample data.


## * backend not added 

## Project Structure

The project consists of the following files and directories:

- **index.html**: The main HTML file that serves as the entry point for the webpage.
- **css/**: Contains stylesheets for the project.
  - **main.css**: Main styles for the webpage.
  - **normalize.css**: CSS reset for consistent styling across browsers.
- **js/**: Contains JavaScript files for functionality.
  - **main.js**: Initializes the webpage and manages overall functionality.
  - **visualization.js**: Handles 3D visualizations of car crashes.
  - **accident-detection.js**: Logic for detecting accidents based on provided data.
  - **lib/**: Contains third-party libraries.
    - **three.min.js**: Minified version of the Three.js library.
- **models/**: Contains 3D models used in the visualizations.
  - **car.glb**: 3D model of a car.
  - **scene.glb**: 3D scene setup.
- **data/**: Contains sample data for testing.
  - **sample-accident-data.json**: Simulated accident scenarios.
- **assets/**: Contains texture images for enhancing realism.
  - **textures/**: Textures used in the 3D scene.
    - **road.jpg**: Texture for the road.
    - **environment.jpg**: Texture for the environment.

## Setup Instructions

1. Clone the repository to your local machine.
2. Open `index.html` in a web browser to view the accident detection visualizations.
3. Ensure that you have a local server running if you encounter issues with loading local files.

## Usage Guidelines

- The visualizations will automatically load and display based on the sample accident data provided in `data/sample-accident-data.json`.
- You can modify the JSON file to test different accident scenarios and see how the visualizations change.

## Technologies Used

- **HTML/CSS**: For structuring and styling the webpage.
- **JavaScript**: For implementing functionality and interactivity.
- **Three.js**: A JavaScript library for creating 3D graphics in the browser.
- **GLB Models**: Used for 3D representations of cars and scenes.

## Contributing

Feel free to contribute to this project by submitting issues or pull requests. Your feedback and contributions are welcome!

## License

This project is licensed under the MIT License. See the LICENSE file for more details.