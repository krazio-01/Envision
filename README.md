# Envision 🎬

Stream movies and TV shows straight from your browser. Envision is a custom-built platform featuring instant playback, smart AI recommendations based on your watch history, and a fast, responsive UI.

<img src="https://github.com/user-attachments/assets/17867187-7727-4d2a-b67e-dda9a80b564c" width="100%" alt="Envision Hero Screenshot" />

## Live Demo 🌐
Check out the live demo of the application [here](https://envision-watch.vercel.app/).

## Screenshots
<p align="center">
  <img src="https://github.com/user-attachments/assets/0d011df2-b71c-422f-b6f2-7302a9318df9" width="49%" />
  <img src="https://github.com/user-attachments/assets/146dd0b3-0c1a-416f-9f6e-fa747a876397" width="49%" />
  <img src="https://github.com/user-attachments/assets/635bbf24-5af5-4053-b370-05cf67c9db10" width="49%" />
  <img src="https://github.com/user-attachments/assets/67114fad-6ade-4d07-961b-22bc1609bfc0" width="49%" />
</p>

## Features
- **Smart AI Search:** Ask for movie ideas based on your mood or specific vibes. It uses your watch history—like what you’ve finished or dropped—to give you suggestions that actually fit your taste.
- **Authentication:** This application has full authentication with verify-email, forgot-password functionality
- **Easy Streaming:** Watch movies and shows directly in the browser. You can quickly switch between seasons, episodes, or backup servers if one is slow.
- **Explore different Sections**: It has Trending, Polpular and Most-rated sectins along with Explore pages
- **Progress Tracking:** The app tracks how much you've watched and automatically marks shows as "Completed" or "Dropped" based on your watch time.
- **Bookmarks:** Save anything you're interested in to your personal library so you can find it again later.

## Technologies Used 🛠️

- **Frontend**: React, Zustand
- **Backend**: Node.js, Express.js
- **API**: TMDB, Vidsrc, and Google Gemini AI
- **Styling**: CSS

## Installation 🚀

1. **Clone the repository**
   ```bash
   git clone https://github.com/krazio-01/Envision.git
   cd Envision

2. **Install dependencies**
   ```bash
   cd client
   npm install
   cd ../server
   npm install

3. **Set up environment variables**
   set up environment variables using ".env copy" file by renaming it to ".env" and patch correct values.

4. **Start the application**
   1. Terminal for Backend
      ```bash
      cd server
      npx nodemon index.js
    2. Terminal for frontend
       ```bash
       cd client
       npm run dev

5. **Access Application at this url**
Open your browser and navigate to http://localhost:5173.

## Usage
1. Start Watching 🍿: Dive into the verse of shows
2. Find the One for You 🔎: Explore different sections of it and find the one show which suits you.

## Contributions
Contributions are welcome! Please fork the repository and create a pull request with your changes. Make sure to follow the coding guidelines and include relevant tests.

## Contact
For any questions or inquiries, please contact md.krazio@gmail.com.
