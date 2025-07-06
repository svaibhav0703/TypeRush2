import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { socket } from "./socket.js";
import { NavLink } from "react-router";
import toast, { Toaster } from "react-hot-toast";
import { useSelectTextQuery } from "../../../redux/api/paragraph.js";
const Room = () => {
  const { roomCode, host } = useParams();
  const [roomdata, setroomdata] = useState(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    window.history.pushState(null, null, window.location.href);

    const handleBack = () => {
      console.log("Back button pressed!");
      socket.emit("playerLeaving", roomCode);
      navigate("/user-page/challenge");
    };
    window.addEventListener("popstate", handleBack);

    socket.emit("getRoomData", roomCode);

    socket.on("roomData", (roomData) => {
      setroomdata(roomData);
      console.log(roomData);
      setDuration(Number(roomData.time));
      setdifficulty(String(roomData.difficulty));
    });

    socket.on("updateRoom", ({ newRoomData, message }) => {
      console.log("Room Updated:", newRoomData);
      toast.success(message);
      console.log("host is ", newRoomData.host);
      setroomdata(newRoomData);
    });

    socket.on("settingsChanged", ({ time, difficulty }) => {
      console.log("settings changed by socket", time, difficulty);
      setDuration(Number(time));
      setdifficulty(String(difficulty));
    });

    socket.once("roomStarted", () => {
      setTimeout(() => {
        navigate(`/challenge/${roomCode}`);
      }, 1000);
    });

    socket.on("textChanged", (newRoomData) => {
      console.log("text changed new room is ", newRoomData);
    });
    console.log(difficulty, Duration, text);
    return () => {
      socket.off("roomData");
      socket.off("updateRoom");
      socket.off("settingsChanged");
      window.removeEventListener("popstate", handleBack);
    };
  }, []);

  const [Ready, setReady] = useState(false);
  const [difficulty, setdifficulty] = useState("easy");
  const [Duration, setDuration] = useState(15);

  const {
    data: text,
    refetch,
    isLoading: loadingText,
  } = useSelectTextQuery(difficulty);

  useEffect(() => {
    if (!text) return;
    console.log("text change request", text.text);
    socket.emit("textChange", { text: text.text, roomCode });
  }, [text]);

  const handleClick = (e) => {
    const newDuration = e.target.dataset.t
      ? Number(e.target.dataset.t)
      : Duration;
    let newDiff = e.target.dataset.d ? String(e.target.dataset.d) : difficulty;
    console.log(newDiff, newDuration);
    setDuration(newDuration);
    setdifficulty(newDiff);

    console.log("setting chagnes initiated ", difficulty, Duration);
    socket.emit("settingsChange", {
      roomCode,
      Duration: newDuration,
      difficulty: newDiff,
    });
  };

  const [roomst, setroomst] = useState(false);
  const handleReady = () => {
    setReady((prev) => !prev); // if ready is true then it makes it false
    socket.emit("playerReady", roomCode);
  };
  const handleStart = () => {
    if (roomst) return;
    setroomst(true);
    socket.emit("startRequested", roomCode);
  };

  const handleLeave = () => {
    socket.emit("playerLeaving", roomCode);
  };
  return (
    <>
      <div
        className="font-smooch-sans bg-black "
        style={{
          minHeight: "100dvh",
          backgroundColor: "#050509",
          backgroundImage:
            "linear-gradient(0deg, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      >
        <div className="text-gray-400 font-bold text-end text-xl pt-1 pr-2 ">
          Do not refresh this page
        </div>
        <Toaster position="top-center"></Toaster>
        <div className="text-white font-bold text-center text-6xl pt-[2%]">
          {host}'s Room
        </div>
        <div className="text-gray-400 border-b-2 border-gray-400 w-fit ml-auto mr-auto text-3xl font-bold text-center">
          Room Code : {roomCode}
        </div>
        <div className="h-[80%] flex justify-evenly p-[5%]">
          <div className="w-[50%] flex flex-col justify-evenly   rounded-4xl h-[100%] min-h-125 ">
            <div className="text-3xl text-white font-bold text-center">
              Players
            </div>
            <div className="text-gray-400  grid grid-rows-2 grid-cols-2 gap-x-10 gap-y-10 h-[70%] p-[5%] ">
              {roomdata ? (
                <>
                  {roomdata.players.map((player, ind) => {
                    return (
                      <>
                        <div
                          key={player.playerName}
                          className="bg-[#050509] relative border-1 border-[#2C2C2C] rounded-4xl p-5 text-center min-h-40 flex flex-col justify-center items-center  "
                        >
                          <div
                            className={`${
                              player.isReady
                                ? "absolute text-gray-400  -top-2  -right-4 border-1 border-gray-400 rounded-4xl bg-[#121212] p-[2%]"
                                : ""
                            }`}
                          >
                            {player.isReady ? "Ready" : ""}
                          </div>
                          <div className="font-bold text-5xl">{ind + 1}</div>
                          <span className="text-3xl">{player.playerName}</span>
                          <span className="text-white">
                            {roomdata?.host == player.socketId ? (
                              <>
                                <span className="">(host)</span>
                              </>
                            ) : (
                              <></>
                            )}
                            {socket.id === player.socketId ? "(You)" : ""}
                          </span>
                        </div>
                      </>
                    );
                  })}
                </>
              ) : (
                <></>
              )}
            </div>
          </div>

          <div className={`w-[40%] `}>
            <div className="w-[100%] border-1 border-[#2C2C2C] rounded-4xl h-[35%] min-h-85 flex flex-col justify-evenly bg-[#050509]">
              <div className="text-3xl text-white font-bold text-center">
                Room Settings
              </div>
              <div>
                <div className="text-center pt-2 pb-2 text-gray-400 text-2xl font-semibold">
                  Difficulty
                </div>
                <div
                  className={`border-1 border-[#2C2C2C] rounded-4xl text-2xl text-center flex flex-row justify-between items-center w-[65%] ml-auto mr-auto text-white ${
                    roomdata?.host === socket.id ? "" : "pointer-events-none"
                  }`}
                >
                  <div
                    className={` pr-8 pl-8 pt-2 pb-2  ${
                      difficulty === "easy"
                        ? "border-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-shtie border-[#2C2C2C] rounded-4xl"
                        : ""
                    }`}
                    onClick={(e) => handleClick(e)}
                    data-d="easy"
                  >
                    Easy
                  </div>
                  <div
                    className={` pr-8 pl-8 pt-2 pb-2 ${
                      difficulty === "medium"
                        ? "border-1 border-[#2C2C2C] rounded-4xl bg-gradient-to-r from-indigo-500 to-purple-600 text-shtie"
                        : ""
                    }`}
                    onClick={(e) => handleClick(e)}
                    data-d="medium"
                  >
                    Medium
                  </div>
                  <div
                    className={` pr-8 pl-8 pt-2 pb-2 ${
                      difficulty === "hard"
                        ? "border-1 border-[#2C2C2C] rounded-4xl bg-gradient-to-r from-indigo-500 to-purple-600 text-shtie"
                        : ""
                    }`}
                    onClick={(e) => handleClick(e)}
                    data-d="hard"
                  >
                    Hard
                  </div>
                </div>
                <div className="text-center pt-2 pb-2 text-gray-400 text-2xl font-semibold">
                  Duration
                </div>
                <div
                  className={`border-1 border-[#2C2C2C] rounded-4xl flex justify-between w-[50%] ml-auto mr-auto text-2xl text-gray-400 ${
                    roomdata?.host === socket.id ? "" : "pointer-events-none"
                  }`}
                >
                  <div
                    className={` pr-8 pl-8 pt-2 pb-2 text-white ${
                      Duration === 15
                        ? "border-1 border-[#2C2C2C] rounded-4xl bg-gradient-to-r from-indigo-500 to-purple-600 text-shtie "
                        : ""
                    }`}
                    onClick={(e) => handleClick(e)}
                    data-t={15}
                  >
                    15
                  </div>
                  <div
                    className={` pr-8 pl-8 pt-2 pb-2 text-white ${
                      Duration === 30
                        ? "border-1 border-[#2C2C2C] rounded-4xl bg-gradient-to-r from-indigo-500 to-purple-600 text-shtie "
                        : ""
                    }`}
                    onClick={(e) => handleClick(e)}
                    data-t={30}
                  >
                    30
                  </div>
                  <div
                    className={` pr-8 pl-8 pt-2 pb-2 text-white ${
                      Duration === 60
                        ? "border-1 border-[#2C2C2C] rounded-4xl bg-gradient-to-r from-indigo-500 to-purple-600 text-shtie "
                        : ""
                    }`}
                    onClick={(e) => handleClick(e)}
                    data-t={60}
                  >
                    60
                  </div>
                </div>
              </div>
            </div>
            {roomdata?.host === socket.id ? (
              <>
                <NavLink
                  className="bg-[#050509] ml-auto mr-auto mt-10 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-600  transition delay-100 border-1 border-[#2C2C2C] h-10 text-white font-bold  rounded-4xl  w-[90%] flex justify-center items-center"
                  onClick={() => handleStart()}
                >
                  Start
                </NavLink>
              </>
            ) : (
              <>
                <NavLink
                  className={`h-10 w-[80%] hover:bg-gradient-to-r from-indigo-500 to-purple-600 text-shtie text-xl ${
                    Ready
                      ? "bg-[#050509] bg-gradient-to-r from-indigo-500 to-purple-600 text-shtie text-white"
                      : ""
                  }  hover:border-transparent border-1 border-[#2C2C2C] text-gray-400 hover:text-white rounded-4xl transition delay-50  flex items-center justify-center mt-10 ml-auto mr-auto `}
                  onClick={() => handleReady()}
                >
                  {Ready ? "Ready" : "Not ready"}
                </NavLink>
              </>
            )}

            <NavLink
              to="/user-page/challenge"
              className="ml-auto mr-auto mt-10 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-600  transition delay-100 border-1 border-[#2C2C2C] h-10 text-white font-bold  rounded-4xl  w-[90%] flex justify-center items-center bg-[#050509]"
              onClick={() => handleLeave()}
            >
              Leave Room
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
};

export default Room;
