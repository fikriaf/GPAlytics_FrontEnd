
# GPAlytics

The `gpalytics` subfolder is part of the GPAlytics FrontEnd project, designed to handle key features of an academic GPA data analysis system.

# Main Features

- Visualizes student GPA data
- Predicts GPA based on academic history
- Modular React components for flexible use
- API integration with backend systems (Node.js, Laravel, etc.)

# Folder Structure

```bash
gpalytics/

├── components/          # Modular React components (tables, charts, etc.)
├── pages/               # Main pages and React routes
├── services/            # Functions to fetch data from backend
├── hooks/               # Custom React hooks
├── utils/               # Utility functions (conversion, calculation, etc.)
└── index.js             # Submodule entry point
```
# How to Run

Make sure you are in the root folder of GPAlytics_FrontEnd.

1. Install dependencies
   npm install

2. Run development server
   npm sun dev

3. Access gpalytics module
   Usually integrated as part of the main React routing. Check App.js or routes.js.

# Key Dependencies

- React (v17/v18)
- axios – for API communication
- chart.js / recharts – for charting
- bootstrap / tailwind – for styling (depending on implementation)

# Testing

If using Jest or React Testing Library, test cases for `gpalytics` can be placed in __tests__/gpalytics.

   npm test

# Contributors

- fikriaf – Programmer developer
- daffa - Design and Testing Developer

License

This project is licensed under the MIT License – feel free to use, modify, and contribute.

The gpalytics module plays a vital role in supporting accurate and interactive academic reporting systems. It is designed for flexibility, ease of integration, and an optimal user experience.
