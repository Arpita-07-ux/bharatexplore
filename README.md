# BharatExplore 🌏

BharatExplore is a premium full-stack tourism discovery platform for India. It allows users to explore states, cities, and hidden gems with detailed historical context, cultural highlights, and AI-powered hotel recommendations.

## ✨ Features

- **Comprehensive Tourism Data**: Detailed information on 15+ Indian states and their top destinations.
- **Intelligent Search**: Real-time autocomplete search for states and places.
- **Interactive Maps**: Integrated Google Maps view for every destination.
- **AI-Powered Hotels**: Real-time hotel recommendations near tourist spots using Gemini AI.
- **User Authentication**: Secure JWT-based login and registration.
- **Personalized Dashboard**: Save and manage your favorite destinations.
- **Responsive Design**: Modern, mobile-first UI built with Tailwind CSS.

## 🚀 Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS 4, Framer Motion, Lucide React.
- **Backend**: Node.js, Express.
- **Database**: SQLite (via `better-sqlite3`).
- **AI**: Google Gemini API (with Google Search Grounding).
- **State Management**: Zustand.

## 🛠️ Setup Instructions for VS Code

Follow these steps to get the project running locally on your machine:

### 1. Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Git](https://git-scm.com/)
- [VS Code](https://code.visualstudio.com/)

### 2. Clone the Repository
Open your terminal and run:
```bash
git clone <your-repository-url>
cd bharatexplore
```

### 3. Install Dependencies
In the project root directory, run:
```bash
npm install
```

### 4. Environment Variables
Create a `.env` file in the root directory and add the following:
```env
GEMINI_API_KEY=your_gemini_api_key_here
JWT_SECRET=your_random_secret_string
NODE_ENV=development
```
*Note: You can get a Gemini API key from [Google AI Studio](https://aistudio.google.com/).*

### 5. Run the Application
Start the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:3000`.

### 6. VS Code Recommended Extensions
For the best development experience, install these extensions:
- **ESLint**: For code linting.
- **Prettier**: For code formatting.
- **Tailwind CSS IntelliSense**: For CSS utility class suggestions.
- **ES7+ React/Redux/React-Native snippets**: For faster React development.

## 📞 Contact
**Developer**: Arpita Kumari Sahu
**Email**: arpitakumarisahu222@gmail.com
**LinkedIn**: [Profile](https://www.linkedin.com/in/arpita-kumari-sahu-19bb2234a)
