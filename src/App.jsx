import React from "react";
import Calendar from "./components/Calendar";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500">
      <header className="py-6 bg-opacity-90 bg-black text-white text-center shadow-lg">
        <h1 className="text-4xl font-extrabold tracking-wide">My Event Planner</h1>
        <p className="text-lg font-light mt-2">Organize your life, one day at a time</p>
      </header>
      <main className="p-6">
        <div className="bg-white shadow-xl rounded-xl p-4">
          <Calendar />
        </div>
      </main>
      <footer className="py-4 text-center text-white bg-black bg-opacity-90">
        <p className="text-sm">© 2024 Event Planner Inc. | All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
