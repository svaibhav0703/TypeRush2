import React, { useState } from "react";
import NavBar from "../NavBar";
import { socket } from "./socket.js";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { Toaster, toast } from "react-hot-toast";
const Multiplayer = () => {
  const navigate = useNavigate();
  const [code, setcode] = useState(" ");
  const { userInfo } = useSelector((state) => state.auth);

  const createRoom = () => {
    socket.on("roomCreated", ({ roomCode, host }) => {
      console.log("roomCreated", roomCode);
      navigate(`/room/${roomCode}/${host}`);
    });

    socket.emit("createRoom", userInfo?.userName);
  };

  const joinRoom = () => {
    socket.emit("joinRoom", { code, playerName: userInfo?.userName }); // we send the code and the username to the socket server
    socket.once("RoomDoesNotExists", ({ message }) => {
      toast.error(message);
    });
    socket.once("roomJoined", (data) => {
      const { code, playerName, host } = data;
      console.log("room joined ", code, playerName, host);
      navigate(`/room/${code}/${host}`);
    });
  };

  return (
    <>
      <NavBar />

      <div
        className="font-smooch-sans flex flex-col justify-start gap-30 items-center h-[90vh]  w-screen bg-[#121212] pt-[2%]"
        style={{
          backgroundColor: "#050509",
          backgroundImage:
            "linear-gradient(0deg, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      >
        <Toaster position="top-center"></Toaster>
        <div className="text-white text-6xl  font-bold flex justify-center gap-10 items-center ">
          Arena
        </div>
        <div className="flex w-[100%] justify-center gap-10 items-center">
          <div className="min-h-80 h-[28%]  w-[25%] border-1 border-[#2C2C2C] rounded-4xl p-5 flex flex-col justify-evenly items-center bg-[#050509]">
            <span className="text-white text-4xl text-center font-semibold">
              Create the arena
            </span>
            <p className="text-center text-xl text-gray-400 ">
              Create a private room and invite your friends for a real-time
              typing race. Only people with the room code can join.
            </p>
            <button
              className="hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-600 hover:border-transparent transition delay-100 border-1 border-[#2C2C2C] min-h-10 h-[15%] text-white font-bold rounded-4xl  w-[90%] flex justify-center items-center"
              onClick={() => createRoom()}
            >
              Host
            </button>
          </div>
          <div className="min-h-80 h-[28%]  w-[25%] border-1 border-[#2C2C2C] rounded-4xl p-5 flex flex-col justify-evenly items-center bg-[#050509]">
            <span className="text-white text-4xl text-center font-semibold">
              Join an arena
            </span>
            <p className="text-center text-xl text-gray-400">
              Got a room code? Enter it below to join a live typing race with
              your friends.
            </p>
            <input
              type="text"
              className="text-white border-1 border-[#2C2C2C] min-h-10 h-[15%] rounded-4xl pl-4 pr-4 w-[90%]"
              placeholder="Enter room code"
              onChange={(e) => setcode(e.target.value)}
            />
            <button
              className="hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-600 hover:border-transparent transition delay-100 border-1 border-[#2C2C2C] min-h-10 h-[15%] text-white font-bold  rounded-4xl  w-[90%] flex justify-center items-center"
              onClick={() => joinRoom()}
            >
              Join
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Multiplayer;
