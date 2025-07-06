import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import TiltImage from "../TiltImage.jsx";
import PracticeImg from "../assets/Pracimg.png";
import RoomImg from "../assets/Roomimg2.png";
import LeadImg from "../assets/Leadimg.png";
import StatImg from "../assets/Statimg.png";
import { FaChevronDown } from "react-icons/fa";

const Home = () => {
  const navigate = useNavigate();

  const practiceRef = useRef(null);
  const multiplayerRef = useRef(null);
  const leaderboardRef = useRef(null);
  const statsRef = useRef(null);

  const scrollTo = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className="w-full"
      style={{
        backgroundColor: "#050509",
        backgroundImage:
          "linear-gradient(0deg, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
        backgroundSize: "80px 80px",
      }}
    >
      {/* HERO SECTION */}
      <div className="h-screen flex flex-col items-center justify-center relative px-4 text-center">
        <h1 className="font-smooch-sans text-[110px] text-indigo-500 mb-6 leading-tight">
          Type Rush
        </h1>
        <p className="text-white text-2xl max-w-3xl mb-12">
          This website has leaderboards, personal statistics, multiple test
          settings for beginner to pro level, and an engaging multiplayer mode
          to compete with your friends and showcase your typing speed.
        </p>
        <div className="flex flex-col gap-5 mb-12">
          <button
            onClick={() => navigate("login")}
            className="h-12 px-8 border border-gray-400 text-gray-400 hover:text-white hover:bg-gradient-to-r from-indigo-500 to-purple-600 hover:border-none rounded-4xl font-bold transition"
          >
            Login
          </button>
          <button
            onClick={() => navigate("register")}
            className="h-12 px-8 border border-gray-400 text-gray-400 hover:text-white hover:bg-gradient-to-r from-indigo-500 to-purple-600 hover:border-none rounded-4xl font-bold transition"
          >
            Register
          </button>
        </div>
        <button
          onClick={() => scrollTo(practiceRef)}
          className="absolute bottom-10 text-gray-500 hover:text-indigo-500 flex flex-col items-center animate-bounce"
        >
          <FaChevronDown size={25} />
        </button>
      </div>

      {/* PRACTICE TESTS */}
      <div
        ref={practiceRef}
        className=" font-smooch-sans  h-screen flex flex-col items-center justify-center border-t px-6 gap-10 relative"
      >
        <div className="flex flex-col justify-center items-start text-left max-w-xl">
          <h3 className="text-5xl text-indigo-500 mb-4">Practice Tests</h3>
          <p className="text-2xl text-gray-400">
            Timed typing tests for every difficulty level — improve your speed
            at your own pace.
          </p>
        </div>
        <TiltImage
          src={PracticeImg}
          alt="Practice"
          className="h-[25%] md:h-[60%] object-contain border-1 border-[#2C2C2C] rounded-4xl"
        />
        <button
          onClick={() => scrollTo(multiplayerRef)}
          className="absolute bottom-10 text-gray-500 hover:text-indigo-500 flex flex-col items-center animate-bounce"
        >
          <FaChevronDown size={25} />
        </button>
      </div>

      {/* MULTIPLAYER */}
      <div
        ref={multiplayerRef}
        className=" font-smooch-sans  h-screen flex flex-col-reverse items-center justify-center border-t px-6 gap-10 relative"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <div className="flex flex-col justify-center items-start text-left max-w-xl">
          <h3 className="text-5xl text-indigo-500 mb-4">Live Multiplayer</h3>
          <p className="text-2xl text-gray-400">
            Compete in real-time typing races and climb the global leaderboard.
          </p>
        </div>
        <TiltImage
          src={RoomImg}
          alt="Multiplayer"
          className="h-[25%] md:h-[60%] object-contain border-1 border-[#2C2C2C] rounded-4xl"
        />
        <button
          onClick={() => scrollTo(leaderboardRef)}
          className="absolute bottom-10 text-gray-500 hover:text-indigo-500 flex flex-col items-center animate-bounce"
        >
          <FaChevronDown size={25} />
        </button>
      </div>

      {/* LEADERBOARDS */}
      <div
        ref={leaderboardRef}
        className=" font-smooch-sans  h-screen flex flex-col items-center justify-center border-t px-6 gap-10 relative"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <div className="flex flex-col justify-center items-start text-left max-w-xl">
          <h3 className="text-5xl text-indigo-500 mb-4">Leaderboards</h3>
          <p className="text-2xl text-gray-400">
            Track your rankings in solo practice and multiplayer games.
          </p>
        </div>
        <TiltImage
          src={LeadImg}
          alt="Leaderboards"
          className="h-[25%] md:h-[60%] object-contain border-1 border-[#2C2C2C] rounded-4xl"
        />
        <button
          onClick={() => scrollTo(statsRef)}
          className="absolute bottom-10 text-gray-500 hover:text-indigo-500 flex flex-col items-center animate-bounce"
        >
          <FaChevronDown size={25} />
        </button>
      </div>

      {/* STATS */}
      <div
        ref={statsRef}
        className=" font-smooch-sans  h-screen flex flex-col-reverse items-center justify-center border-t border-b px-6 gap-10 relative"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <div className="flex flex-col justify-center items-start text-left max-w-xl">
          <h3 className="text-5xl text-indigo-500 mb-4">Your Stats</h3>
          <p className="text-2xl text-gray-400">
            Get a complete overview of your tests, recent scores, and personal
            bests.
          </p>
        </div>
        <TiltImage
          src={StatImg}
          alt="Stats"
          className="h-[25%] md:h-[60%] object-contain border-1 border-[#2C2C2C] rounded-4xl"
        />
      </div>
    </div>
  );
};

export default Home;
