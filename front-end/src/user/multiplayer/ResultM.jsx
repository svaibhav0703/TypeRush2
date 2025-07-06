import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { socket } from "./socket.js";
import { useNavigate, useParams } from "react-router";
import confetti from "canvas-confetti";
import { FaTrophy } from "react-icons/fa";

const ResultM = () => {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const [roomdata, setroomdata] = useState(undefined);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    window.history.pushState(null, null, window.location.href);

    const handleBack = () => {
      socket.emit("playerLeaving", roomCode);
      navigate("/user-page/challenge");
    };
    window.addEventListener("popstate", handleBack);

    socket.emit("getRoomData", roomCode);

    socket.on("roomData", (roomData) => {
      setroomdata(roomData);
    });

    socket.on("updateRoom", ({ newRoomData, message }) => {
      setroomdata(newRoomData);
      if (message === "") return;
      toast.success(message);
    });

    return () => {
      socket.off("roomData");
      socket.off("updateRoom");
      socket.off("settingsChanged");
      window.removeEventListener("popstate", handleBack);
    };
  }, []);

  useEffect(() => {
    if (roomdata && roomdata.result && roomdata.result.length > 0) {
      const sortedResults = [...roomdata.result].sort(
        (a, b) => b.currScore - a.currScore
      );

      if (sortedResults[0].playerName === userInfo?.userName) {
        const interval = setInterval(() => {
          // Trigger confetti from different random origins
          confetti({
            particleCount: 500,
            spread: 100,
            origin: { x: Math.random(), y: 0.5 },
          });
          confetti({
            particleCount: 500,
            spread: 100,
            origin: { x: 0.5, y: Math.random() * 0.5 },
          });
          confetti({
            particleCount: 500,
            spread: 100,
            origin: { x: 0.1, y: Math.random() * 0.5 },
          });
          confetti({
            particleCount: 500,
            spread: 100,
            origin: { x: 0.8, y: Math.random() * 0.5 },
          });
          confetti({
            particleCount: 500,
            spread: 100,
            origin: { x: 0.6, y: Math.random() * 0.5 },
          });
        }, 800); // Fire every 300ms

        setTimeout(() => {
          clearInterval(interval);
        }, 2000); // Stop after 3 seconds
      }
    }
  }, [roomdata, userInfo]);

  const handleLeave = () => {
    socket.emit("playerLeaving", roomCode);
    navigate("/user-page/challenge");
  };

  const handleRematch = () => {
    socket.emit("rematch", roomCode);
    navigate(
      `/room/${roomCode}/${
        roomdata.players.find((ele) => ele.socketId === roomdata.host)
          .playerName
      }`
    );
  };

  return (
    <div
      className="relative font-smooch-sans w-screen flex flex-col items-center justify-center overflow-hidden px-4"
      style={{
        minHeight: "100dvh",
        backgroundColor: "black",
        backgroundImage:
          "linear-gradient(0deg, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
        backgroundSize: "100px 100px",
      }}
    >
      {/* Title */}
      <h1 className="text-6xl font-bold  text-gray-300 mb-4 tracking-widest ">
        Final Standings
      </h1>

      {/* Divider */}
      <div className="w-40 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 mb-8  rounded-full"></div>

      {/* Leaderboard */}
      <div className="w-full flex flex-col items-center space-y-6 z-10">
        {roomdata ? (
          <>
            {[...roomdata.result]
              .sort((a, b) => b.currScore - a.currScore)
              .map((result, ind) => {
                const isWinner = ind === 0;
                const width = `${30 + ind * 10}%`;
                const bgColor = isWinner
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white border border-indigo-300 shadow-lg animate-pulse"
                  : "backdrop-blur-md bg-white/10 text-gray-300 shadow";

                const initials = result.playerName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase();

                return (
                  <div
                    key={ind}
                    className={`flex justify-between items-center p-4 rounded-xl ${bgColor} transition-all relative`}
                    style={{ width }}
                  >
                    {/* Rank and glow for top 3 */}
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold">{ind + 1}</span>
                      {ind < 3 && (
                        <span className="w-2 h-2 bg-yellow-400 rounded-full animate-ping"></span>
                      )}
                    </div>

                    {/* Player Avatar and Name */}
                    <span className="flex items-center gap-3 text-xl font-semibold">
                      <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white">
                        {initials}
                      </div>
                      {result.playerName}
                      {isWinner && (
                        <FaTrophy className="text-yellow-400 animate-bounce" />
                      )}
                    </span>

                    {/* Score */}
                    <span className="text-xl font-bold">
                      {result.currScore}
                    </span>
                  </div>
                );
              })}
          </>
        ) : (
          <p className="text-gray-400 text-xl">Loading Result...</p>
        )}
      </div>

      {/* Buttons */}
      {roomdata && (
        <div className="flex items-center justify-center mt-12 space-x-8 w-full max-w-[600px] z-10">
          <button
            onClick={handleLeave}
            className="h-12 w-1/2  hover:bg-gradient-to-r from-indigo-500 to-purple-600 hover:border-transparent border-1 border-[#2C2C2C] font-bold  text-gray-400 hover:text-white rounded-4xl transition ease-in delay-100 hover:scale-105 flex items-center justify-center text-lg shadow-lg"
          >
            Leave
          </button>

          <button
            onClick={handleRematch}
            className="h-12 w-1/2 text-gray-400 border-1 font-bold transition delay-150 hover:scale-105 ease-in  hover:text-white hover:bg-gradient-to-r from-indigo-500 to-purple-600 border-[#2C2C2C] rounded-4xl p-3 "
          >
            Rematch
          </button>
        </div>
      )}
    </div>
  );
};

export default ResultM;
