<h1 align="center">GPAlytics</h1>

<p align="center">
    <td><img src="https://github.com/fikriaf/GPAlytics_FrontEnd/blob/main/Preview.png" width="500px"></td>
</p>

<p align="center">
    <a href="#"><img src="https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black"></a>
    <a href="#"><img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white"></a>
    <a href="#"><img src="https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white"></a>
    <a href="#"><img src="https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white"></a>
    <a href="#"><img src="https://img.shields.io/badge/Bootstrap-7952B3?style=flat&logo=bootstrap&logoColor=white"></a>
</p>

<p align="center">
  <a href="#"><img src="https://img.shields.io/github/repo-size/fikriaf/GPAlytics_FrontEnd?color=blue"></a>
  <a href="#"><img src="https://img.shields.io/github/languages/code-size/fikriaf/GPAlytics_FrontEnd?color=green"></a>
</p>

<p align="center">
  Live UI:
  <a href="https://gpalytics-two.vercel.app/" target="_blank">https://gpalytics-two.vercel.app/</a>
</p>

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
