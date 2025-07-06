import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { socket } from "./socket.js";
import { Toaster, toast } from "react-hot-toast";
import { useRef } from "react";
import { useSelector } from "react-redux";
const Challenge = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { roomCode } = useParams();
  const [roomdata, setroomdata] = useState(undefined);
  const [time, setTime] = useState(0);
  const [rt, setrt] = useState(0);
  const [difficulty, setDifficulty] = useState("");
  const navigate = useNavigate();
  const textDiv = useRef();

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
      setTime(roomData.time);
      setrt(roomData.time - 1);
      setDifficulty(roomData.difficulty);
    });

    socket.on("updateRoom", ({ newRoomData, message }) => {
      console.log("Room Updated:", newRoomData);
      toast.success(message);
      console.log("host is ", newRoomData.host);
      setroomdata(newRoomData);
    });

    socket.on("testSubmitted", (newRoomData) => {
      console.log(newRoomData);
      toast.success("test submitted");
      navigate(`/result/${roomCode}`);
    });
    return () => {
      socket.off("roomData");
      socket.off("updateRoom");
      socket.off("settingsChanged");
      window.removeEventListener("popstate", handleBack);
    };
  }, []);

  const [testStarted, setTestStarted] = useState(false);

  useEffect(() => {
    if (!roomdata) return;
    console.log(textDiv.current);
    if (!testStarted && roomdata) {
      console.log("test started");
      handleTest(); // when time and difficulty is set by getroom data this will get triggered
      setTestStarted(true);
    }
  }, [roomdata]);

  const pointerRef = useRef(0);
  const right = useRef(0);
  const wrong = useRef(0);

  const endTest = (timer) => {
    // clears the interval and removes the listener

    clearInterval(timer);

    textDiv.current.removeEventListener("keydown", () => {
      console.log("event listner removed");
    });
  };

  const handleTest = () => {
    try {
      // test started hide the text to start the test

      let remTime = time; // the time set by the user
      textDiv.current.focus();

      textDiv.current.addEventListener("keydown", (e) => {
        if (e.key === " ") {
          e.preventDefault();
        }

        if (e.key === "Backspace" && pointerRef.current > 0) {
          /* console.log(textDiv.current.children[pointerRef.current]); */

          pointerRef.current--;
          let prev = textDiv.current.children[pointerRef.current];

          /* console.log(textDiv.current.children[pointerRef.current]); */

          let prevprev = textDiv.current.children[pointerRef.current - 1];
          if (prevprev) prevprev.classList.add("border-r-2");
          if (prev && prev.classList.contains("text-indigo-500")) {
            wrong.current -= 1;
          } else {
            right.current -= 1;
            /* console.log("right updated:", right.current); */
          }
          prev.classList.remove(
            "text-indigo-500",
            "text-white",
            "border-r-2",
            "border-white",
            "border-indigo-500",
            "border-b-2"
          );
        } else if (e.key !== "Shift" && e.key !== "CapsLock") {
          let curr = textDiv.current.children[pointerRef.current];
          let prev = textDiv.current.children[pointerRef.current - 1];
          if (prev) prev.classList.remove("border-r-2");
          if (curr) curr.classList.add("border-r-2");
          if (curr) {
            curr.scrollIntoView({
              behavior: "smooth",
              block: "center", // or "start" if you prefer top-aligned
              inline: "nearest",
            });
          }

          if (curr) curr.classList.remove("border-green-500");
          if (curr && curr.innerText === e.key) {
            if (curr) curr.classList.add("border-white", "text-white");
            right.current += 1;
          } else {
            if (curr)
              curr.classList.add("border-indigo-500", "text-indigo-500");
            if (curr && curr.innerText === " ")
              if (curr) curr.classList.add("border-b-2");
            wrong.current += 1;
          }
          pointerRef.current++;
        }

        console.log("key pressed");
      });

      const timer = setInterval(() => {
        --remTime;
        setrt((prev) => prev - 1);
      }, 1000);

      setTimeout(async () => {
        try {
          endTest(timer);
          textDiv.current.innerText = "calculating Results...";
          textDiv.current.classList.add("text-center");

          const currScore =
            (((right.current / 4) * 60) / time / 256) * 40 +
            (right.current == 0 && wrong.current == 0
              ? 0
              : (right.current / (right.current + wrong.current)) * 100 * 0.6); // calculated the score for this test
          console.log(currScore);

          setTimeout(() => {
            socket.emit("submitTest", {
              roomCode,
              currScore,
              playerName: userInfo.userName,
              userId: userInfo._id,
            });
          }, 1000);
        } catch (error) {
          console.log(error);
        }
      }, time * 1000);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div
      className="font-smooch-sans font-bold min-h-screen h-fit bg-[#121212] relative text-gray-400 flex flex-col justify-center "
      style={{
        backgroundColor: "#050509",
        backgroundImage:
          "linear-gradient(0deg, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
        backgroundSize: "80px 80px",
      }}
    >
      <Toaster position="top-center" />
      <div className="text-2xl text-center border-2 border-gray-400 rounded-4xl w-fit pt-2 pl-4 pr-4 pb-2 ml-auto mr-auto bg-[#050509]">
        {rt}
      </div>

      <div
        className="h-[240px] w-[80%] ml-auto mr-auto mt-[50px] text-[38px] leading-[60px] rounded-3xl  p-2 overflow-auto focus:outline-none bg-[#050509] "
        ref={textDiv}
        tabIndex="-1"
      >
        {roomdata ? (
          roomdata.text.split("").map((character, index) => {
            return (
              <span
                id={index}
                key={index}
                className="whitespace-pre-wrap tracking-widest"
              >
                {character}
              </span>
            );
          })
        ) : (
          <>
            <span className="">Loading...</span>
          </>
        )}
      </div>
    </div>
  );
};

export default Challenge;
