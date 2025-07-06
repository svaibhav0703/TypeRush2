import React, { useEffect, useRef, useState } from "react";
import { useSelectTextQuery } from "../../../redux/api/paragraph";
import { useAddTestMutation } from "../../../redux/api/test.js";
import NavBar from "../NavBar.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRotateLeft,
  faRectangleList,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import {
  useGetUserQuery,
  useProfileMutation,
} from "../../../redux/api/users.js";
const Practice = () => {
  const [rt, setrt] = useState(30);
  const [time, setTime] = useState("30"); // by default the typing test will be 30 seconds long
  const [difficulty, setDifficulty] = useState("easy"); // by default the typing test difficulty will be set to easy
  const navigate = useNavigate();
  const User = useSelector((state) => state.auth.userInfo);
  const { data: UserData, refetch: fetchUser } = useGetUserQuery();
  const [updateProfile] = useProfileMutation();

  const {
    data: text,
    refetch,
    isLoading: loadingText,
  } = useSelectTextQuery(difficulty);

  const [submitTest] = useAddTestMutation();

  const timeArray = ["15", "30", "60"];
  const difficultyArray = ["easy", "medium", "hard"];

  const handleClick = (e) => {
    const val = e.target.closest("button")?.value;
    console.log(val);
    if (timeArray.includes(val)) {
      setTime(val);
      setrt(val);
    } else if (difficultyArray.includes(val)) {
      setDifficulty(val);
    } else if (val === "refresh") {
      refetch();
    } else {
      console.log("wrong click");
    }
  };

  const pointerRef = useRef(0);
  const textDiv = useRef(null);
  const [hidden, sethidden] = useState(false);
  const outerDiv = useRef(null);
  const [started, setStarted] = useState(false);
  const right = useRef(0);
  const wrong = useRef(0);

  const mistakesRef = useRef(0);
  const mistakesArr = useRef([]);
  const speed = useRef(0);
  const secondArr = useRef([]);

  useEffect(() => {
    console.log("hi remounted");
    const fetchagain = async () => {
      try {
        await fetchUser();
      } catch (error) {
        console.log(error);
      }
    };
    fetchagain();

    // when page loads the most outer most div is in focus so that we can press space to start the t
    if (outerDiv.current) {
      /*  console.log(outerDiv.current); */
      outerDiv.current.focus();
    }
  }, [location.pathname]);

  useEffect(() => {
    console.log(UserData);
  }, [UserData]);

  const endTest = (timer) => {
    /* console.log(secondArr.current); */
    clearInterval(timer);
    sethidden(false);
    textDiv.current.removeEventListener("keydown", () => {
      console.log("event listner removed");
    });
  };

  const handleTest = (e) => {
    try {
      // test started hide the text to start the test

      sethidden(true);

      let remTime = time; // the time set by the user
      textDiv.current.focus();

      outerDiv.current.addEventListener("mousedown", (e) => {
        e.preventDefault();
        endTest(timer);
        textDiv.current.innerText = "Exiting test...";
        textDiv.current.classList.add("text-center");
        setTimeout(() => {
          window.location.href = window.location.href;
        }, 1000);
      });

      textDiv.current.addEventListener("keydown", (e) => {
        if (e.key === " ") {
          e.preventDefault();
        }

        if (e.key === "Backspace" && pointerRef.current > 0) {
          console.log(textDiv.current.children[pointerRef.current]);
          pointerRef.current--;
          let prev = textDiv.current.children[pointerRef.current];
          /* console.log(textDiv.current.children[pointerRef.current]); */
          let prevprev = textDiv.current.children[pointerRef.current - 1];
          if (prevprev) prevprev.classList.add("border-r-2");
          if (prev && prev.classList.contains("text-indigo-500")) {
            wrong.current -= 1;
          } else {
            right.current -= 1;
            console.log("right updated:", right.current);
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
            mistakesRef.current++;
            console.log("mistake count", mistakesRef.current);
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
        const currentMis = mistakesRef.current;
        mistakesArr.current.push(currentMis);
        console.log("mistakes", mistakesArr.current);
        mistakesRef.current = 0;

        speed.current =
          ((right.current + wrong.current) / 5 / (time - remTime)) * 60;

        let currentspeed = speed.current;
        secondArr.current.push(Math.max(0, Math.ceil(currentspeed)));
        console.log("speed", secondArr.current);
      }, 1000);

      setTimeout(async () => {
        try {
          endTest(timer);
          textDiv.current.innerText = "calculating Results...";
          textDiv.current.classList.add("text-center");

          const currScore =
            (speed.current / 256) * 40 +
            (right.current == 0 && wrong.current == 0
              ? 100
              : (right.current / (right.current + wrong.current)) * 100 * 0.6); // calculated the score for this test

          let total = UserData.tests;
          let newScore = 0;
          let response = {};
          if (Number(time) === 15) {
            const prevScore = UserData.score15;

            newScore = (prevScore * total + currScore) / (total + 1);
            response = await updateProfile({
              score15: newScore,
              tests: total + 1,
            }).unwrap();
          }
          if (Number(time) === 30) {
            const prevScore = UserData.score30;

            newScore = (prevScore * total + currScore) / (total + 1);

            response = await updateProfile({
              score30: newScore,
              tests: total + 1,
            }).unwrap();
          }
          if (Number(time) === 60) {
            const prevScore = UserData.score60;
            newScore = (prevScore * total + currScore) / (total + 1);

            response = await updateProfile({
              score60: newScore,
              tests: total + 1,
            }).unwrap();
          }

          console.log("updated User", response);
          response = await submitTest({
            userId: User._id,
            duration: time,
            difficulty,
            speed: speed.current,
            accuracy:
              right.current == 0 && wrong.current == 0
                ? 100
                : (right.current / (right.current + wrong.current)) * 100,
            secondData: secondArr.current,
            mistakes: mistakesArr.current,
          }).unwrap();

          console.log(response.testId);
          setTimeout(() => {
            navigate(`/user-page/result?testId=${response.testId}`);
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
      className="font-smooch-sans font-bold min-h-screen h-fit bg-[#121212] relative text-gray-400 "
      style={{
        backgroundColor: "#050509",
        backgroundImage:
          "linear-gradient(0deg, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
        backgroundSize: "80px 80px",
      }}
      tabIndex={0}
      ref={outerDiv}
      onKeyDown={(e) => {
        if (e.key === " " && !started) {
          e.preventDefault();
          handleTest(e);
          setStarted(true);
        }
      }}
    >
      <NavBar Hidden={started} />
      {hidden ? (
        <>
          <div className="text-2xl text-center border-2 border-gray-400 rounded-4xl w-fit pt-2 pl-4 pr-4 pb-2 ml-auto mr-auto mt-[10vh]">
            {rt}
          </div>
        </>
      ) : (
        <>
          <div
            hidden={started}
            className="text-xl setting-bar min-h-[8%] f-fit w-[50%]  rounded-4xl ml-auto mr-auto mt-[10vh]  flex justify-evenly items-center  "
            onClick={(e) => handleClick(e)}
          >
            <button
              className={`w-[12%] h-[80%]  p-3 ${
                time === "15"
                  ? "border-1 bg-gradient-to-r from-indigo-500 to-purple-600 border-[#2C2C2C] rounded-4xl text-white"
                  : ""
              }`}
              value={15}
            >
              15s
            </button>
            <button
              className={`w-[12%] h-[80%]   p-3 ${
                time === "30"
                  ? "border-1 bg-gradient-to-r from-indigo-500 to-purple-600 border-[#2C2C2C] rounded-4xl text-white"
                  : ""
              }`}
              value={30}
            >
              30s
            </button>
            <button
              className={`w-[12%] h-[80%]   p-3 ${
                time === "60"
                  ? "border-1 bg-gradient-to-r from-indigo-500 to-purple-600 border-[#2C2C2C] rounded-4xl text-white"
                  : ""
              }`}
              value={60}
            >
              60s
            </button>
            <button
              className={`w-[12%] h-[80%]  rounded-3xl   p-3 ${
                difficulty === "easy"
                  ? "border-1 bg-gradient-to-r from-indigo-500 to-purple-600 border-[#2C2C2C] rounded-4xl text-white"
                  : ""
              }`}
              value="easy"
            >
              Easy
            </button>
            <button
              className={`w-[12%] h-[80%]   p-3 ${
                difficulty === "medium"
                  ? "border-1 bg-gradient-to-r from-indigo-500 to-purple-600 border-[#2C2C2C] rounded-4xl text-white"
                  : ""
              }`}
              value="medium"
            >
              Medium
            </button>
            <button
              className={`w-[12%] h-[80%]  p-3 ${
                difficulty === "hard"
                  ? "border-1 bg-gradient-to-r from-indigo-500 to-purple-600 border-[#2C2C2C] rounded-4xl text-white"
                  : ""
              }`}
              value="hard"
            >
              Hard
            </button>
            <button
              className="w-[12%] h-[80%]  hover:text-white hover:bg-gradient-to-r from-indigo-500 to-purple-600 border-[#2C2C2C] rounded-4xl p-3 "
              value="refresh"
            >
              <FontAwesomeIcon icon={faRotateLeft} className="z-0" />
            </button>
          </div>
        </>
      )}

      <div
        className="h-[240px] w-[80%] ml-auto mr-auto mt-[50px] text-[38px] leading-[60px] rounded-3xl bg-[#050509] p-2 overflow-auto focus:outline-none "
        ref={textDiv}
        tabIndex="-1"
      >
        {loadingText ? (
          <>
            <span className="">Loading...</span>
          </>
        ) : (
          text?.text.split("").map((character, index) => {
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
        )}
      </div>
      <p className="text-xl text-gray-400 w-fit ml-auto mr-auto mt-10 border-b-2 border-gray-400">
        {hidden
          ? "click outside the text to EXIT"
          : "press SPACE BAR to START the test"}
      </p>
    </div>
  );
};

export default Practice;
