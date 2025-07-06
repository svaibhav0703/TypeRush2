import { createRoot } from "react-dom/client";
import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "../src/auth/Login.jsx";
import Register from "../src/auth/Register.jsx";
import Home from "./auth/Home.jsx";
import { Provider } from "react-redux";
import store from "../redux/store.js";
import Practice from "../src/user/singlePlayer/Practice.jsx";
import Profile from "../src/auth/Profile.jsx";
import Stats from "./user/singlePlayer/Stats.jsx";
import StartPage from "./user/StartPage.jsx";
import Choose from "./user/Choose.jsx";
import Result from "./user/singlePlayer/Result.jsx";
import Multiplayer from "./user/multiplayer/Multiplayer.jsx";
import LeaderBoard from "./user/singlePlayer/LeaderBoard.jsx";
import Room from "./user/multiplayer/Room.jsx";
import Challenge from "./user/multiplayer/Challenge.jsx";
import ResultM from "./user/multiplayer/ResultM.jsx";
import CustomCursor from "./CustomCursor.jsx";
window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  if (preloader) {
    preloader.style.display = "none";
  }
});
const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/room/:roomCode/:host", element: <Room /> },
  { path: "/challenge/:roomCode", element: <Challenge /> },
  { path: "/result/:roomCode", element: <ResultM /> },
  {
    path: "/user-page",
    element: <StartPage />,
    children: [
      { path: "", element: <Choose /> },
      {
        path: "practice",
        element: <Practice />,
      },
      {
        path: "challenge",
        element: <Multiplayer />,
      },
      {
        path: "update-profile",
        element: <Profile />,
      },
      {
        path: "stats",
        element: <Stats />,
      },
      {
        path: "result",
        element: <Result />,
      },
      {
        path: "fastest-fingers",
        element: <LeaderBoard />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <CustomCursor />
    <RouterProvider router={router} />
  </Provider>
);
