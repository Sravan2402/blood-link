import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";

import NotificationBell from "./components/NotificationBell";

function App() {
  return (
    <div>
      <h1>BloodLink</h1>

      <NotificationBell />
    </div>
  );
}

export default App;
