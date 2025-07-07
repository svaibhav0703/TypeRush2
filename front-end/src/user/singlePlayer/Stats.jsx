import React, { useEffect, useState } from "react";
import NavBar from "../NavBar.jsx";
import {
  useGetavgSpeedAndAccuracyMutation,
  useGetRecentTestMutation,
  useGetTopTestQuery,
  useGetTotalTestsMutation,
  useGetMostAccurateTestQuery,
} from "../../../redux/api/test.js";
import ResultChart from "./ResultChart.jsx";
import { useSelector } from "react-redux";
import { NavLink } from "react-router";
import DataCard from "./DataCard.jsx";
const Stats = () => {
  // for getting the speed and accuracy
  const [performanceData, setPerformanceData] = useState({
    easy: {
      15: { speed: 0, accuracy: 0 },
      30: { speed: 0, accuracy: 0 },
      60: { speed: 0, accuracy: 0 },
    },
    medium: {
      15: { speed: 0, accuracy: 0 },
      30: { speed: 0, accuracy: 0 },
      60: { speed: 0, accuracy: 0 },
    },
    hard: {
      15: { speed: 0, accuracy: 0 },
      30: { speed: 0, accuracy: 0 },
      60: { speed: 0, accuracy: 0 },
    },
  });
  // to get total number of tests taken by the user
  const [TotalTests, setTotalTests] = useState({ 15: 0, 30: 0, 60: 0 });

  // getting the userInfo from the store
  const { userInfo } = useSelector((state) => state.auth);

  // custom hook for getting average speed and accuracy
  const [getAvgSpeedAndAccuracy, { isLoading }] =
    useGetavgSpeedAndAccuracyMutation();

  // custom hook for getting total number of tests
  const [getTotalTests, { isLoading: loadingTotal }] =
    useGetTotalTestsMutation();

  const { data: TopTests, refetch: tfetch } = useGetTopTestQuery();
  const { data: AccurateTests, refetch } = useGetMostAccurateTestQuery();

  const [getRecentTests] = useGetRecentTestMutation();
  // to set difficulty, count and duration to fetch the recent tests
  const [difficulty, setdifficulty] = useState("easy");
  const [Count, setCount] = useState(100);
  const [Duration, setDuration] = useState(15);

  const [speedData, setspeedData] = useState([]);

  // for getting data for the chart

  useEffect(() => {
    const ChartData = async () => {
      try {
        console.log(Count, Duration, difficulty, userInfo._id);

        const response = await getRecentTests({
          userId: userInfo._id,
          difficulty,
          duration: Duration,
          count: Count,
        }).unwrap();

        console.log(response);

        let arr = Object.values(response);

        arr = arr.map((key) => key.speed);
        arr.reverse();
        setspeedData(arr);
        console.log("recent tests", arr);
      } catch (error) {
        console.log(error);
      }
    };
    ChartData();
  }, [Count, difficulty, Duration]);

  // to fetch data whenever the page reloods
  useEffect(() => {
    refetch();
    tfetch();
    console.log(TopTests, AccurateTests);
    const fetchData = async () => {
      const difficulties = ["easy", "medium", "hard"];
      const durations = [15, 30, 60];

      try {
        // finding recent tests initially
        const response = await getRecentTests({
          userId: userInfo._id,
          difficulty,
          duration: Duration,
          count: Count,
        }).unwrap();

        let arr = Object.values(response);
        arr = arr.map((key) => key.speed);
        arr.reverse();
        setspeedData(arr);

        console.log("recent tests", arr);
        const newPerformanceData = { easy: {}, medium: {}, hard: {} };
        const newTotalTests = { 15: 0, 30: 0, 60: 0 };
        for (const duration of durations) {
          const res = await getTotalTests({
            difficulty,
            duration,
            userId: userInfo._id,
          }).unwrap();
          newTotalTests[duration] = res.total || 0;
        }
        console.log(newTotalTests);
        setTotalTests(newTotalTests);
        for (const diff of difficulties) {
          for (const dur of durations) {
            const res = await getAvgSpeedAndAccuracy({
              duration: dur,
              userId: userInfo._id,
              difficulty: diff,
            }).unwrap();

            newPerformanceData[diff][dur] = {
              speed: Math.round(res?.averageSpeed, 2) || 0,
              accuracy: Math.round(res?.averageAccuracy, 2) || 0,
            };
          }
        }
        console.log(newPerformanceData);
        setPerformanceData(newPerformanceData);
      } catch (err) {
        console.log("Error fetching performance data:", err);
      }
    };

    fetchData();
  }, [userInfo?._id]);

  const [currState, setcurrState] = useState("accurate");

  return (
    <>
      <NavBar></NavBar>
      <div
        className=" min-h-200vh h-fit font-smooch-sans text-xl "
        style={{
          backgroundColor: "#050509",
          backgroundImage:
            "linear-gradient(0deg, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      >
        <div className=" h-fit w-[80%] gap-10  ml-auto mr-auto  text-white flex items-center justify-evenly pt-5">
          <div className="min-h-40 w-[50%] h-[100%] border-1 rounded-4xl  border-[#2C2C2C] text-center p-5 flex flex-col justify-center items-center bg-[#050509]">
            <svg
              className="ml-auto mr-auto"
              width="74px"
              height="74px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <path
                  opacity="0.1"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M3 12C3 4.5885 4.5885 3 12 3C19.4115 3 21 4.5885 21 12C21 16.3106 20.4627 18.6515 18.5549 19.8557L18.2395 18.878C17.9043 17.6699 17.2931 16.8681 16.262 16.3834C15.2532 15.9092 13.8644 15.75 12 15.75C10.134 15.75 8.74481 15.922 7.73554 16.4097C6.70593 16.9073 6.09582 17.7207 5.7608 18.927L5.45019 19.8589C3.53829 18.6556 3 16.3144 3 12ZM8.75 10C8.75 8.20507 10.2051 6.75 12 6.75C13.7949 6.75 15.25 8.20507 15.25 10C15.25 11.7949 13.7949 13.25 12 13.25C10.2051 13.25 8.75 11.7949 8.75 10Z"
                  fill="#fff"
                ></path>{" "}
                <path
                  d="M3 12C3 4.5885 4.5885 3 12 3C19.4115 3 21 4.5885 21 12C21 19.4115 19.4115 21 12 21C4.5885 21 3 19.4115 3 12Z"
                  stroke="#fff"
                  strokeWidth="1"
                ></path>{" "}
                <path
                  d="M15 10C15 11.6569 13.6569 13 12 13C10.3431 13 9 11.6569 9 10C9 8.34315 10.3431 7 12 7C13.6569 7 15 8.34315 15 10Z"
                  stroke="#fff"
                  strokeWidth="1"
                ></path>{" "}
                <path
                  d="M6 19C6.63819 16.6928 8.27998 16 12 16C15.72 16 17.3618 16.6425 18 18.9497"
                  stroke="#fff"
                  strokeWidth="1"
                  stroke-linecap="round"
                ></path>{" "}
              </g>
            </svg>
            <span>{userInfo?.userName}</span>
          </div>
          <div className="border-1 min-h-40 w-[100%] rounded-4xl  border-[#2C2C2C] text-center p-5 flex flex-col justify-around items-stretch bg-[#050509]">
            <div className="text-3xl">Tests </div>
            <div className=" grid grid-cols-3 gap-20 p-2 ">
              {loadingTotal ? (
                <>
                  <div className="w-[100%] mb-auto mt-auto text-2xl ">
                    Loading Accuracy...
                  </div>
                </>
              ) : (
                <>
                  <DataCard
                    upperText={TotalTests[15]}
                    lowerText={"15 seconds"}
                    type={"tests"}
                  />
                  <DataCard
                    upperText={TotalTests[30]}
                    lowerText={"30 seconds"}
                    type={"tests"}
                  />
                  <DataCard
                    upperText={TotalTests[60]}
                    lowerText={"60 seconds"}
                    type={"tests"}
                  />
                </>
              )}
            </div>
          </div>
          <div className="border-1 w-[50%] min-h-40 rounded-4xl  border-[#2C2C2C] text-center p-5 flex flex-col justify-around items-stretch bg-[#050509]">
            <div className="text-3xl">Total Tests</div>
            <div className="  p-2 ">
              <DataCard
                upperText={TotalTests[15] + TotalTests[30] + TotalTests[60]}
                lowerText={"15/30/60 seconds"}
                type={"tests"}
              />
            </div>
          </div>
        </div>

        <div className="w-[80%] h-[11%] min-h-40 gap-10 flex justify-evenly ml-auto mr-auto text-white mt-5 ">
          {isLoading ? (
            <>
              <div className="border-1 w-[100%] h-[100%] rounded-4xl  border-[#2C2C2C] text-center p-5 flex flex-col justify-around items-stretch bg-[#050509]">
                <div className="w-[100%]  text-2xl mt-auto mb-auto">
                  Loading Speed...
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="border-1 w-[100%] rounded-4xl  border-[#2C2C2C] text-center p-5 flex flex-col justify-around items-stretch bg-[#050509]">
                <div className="text-3xl">Speed </div>
                <div className=" grid grid-cols-3 gap-20 p-2 ">
                  {difficulty === "easy" ? (
                    <>
                      <DataCard
                        upperText={performanceData.easy[15].speed}
                        lowerText={"15 seconds"}
                        type={"wpm"}
                      />
                      <DataCard
                        upperText={performanceData.easy[30].speed}
                        lowerText={"30 seconds"}
                        type={"wpm"}
                      />
                      <DataCard
                        upperText={performanceData.easy[60].speed}
                        lowerText={"60 seconds"}
                        type={"wpm"}
                      />
                    </>
                  ) : (
                    <></>
                  )}

                  {difficulty === "medium" ? (
                    <>
                      <DataCard
                        upperText={performanceData.medium[15].speed}
                        lowerText={"15 seconds"}
                        type={"wpm"}
                      />
                      <DataCard
                        upperText={performanceData.medium[30].speed}
                        lowerText={"30 seconds"}
                        type={"wpm"}
                      />
                      <DataCard
                        upperText={performanceData.medium[60].speed}
                        lowerText={"60 seconds"}
                        type={"wpm"}
                      />
                    </>
                  ) : (
                    <></>
                  )}

                  {difficulty === "hard" ? (
                    <>
                      <DataCard
                        upperText={performanceData.hard[15].speed}
                        lowerText={"15 seconds"}
                        type={"wpm"}
                      />
                      <DataCard
                        upperText={performanceData.hard[30].speed}
                        lowerText={"30 seconds"}
                        type={"wpm"}
                      />
                      <DataCard
                        upperText={performanceData.hard[60].speed}
                        lowerText={"60 seconds"}
                        type={"wpm"}
                      />
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </>
          )}

          <div className="border-1 w-[100%]  h-[100%] rounded-4xl  border-[#2C2C2C] text-center p-5 flex flex-col justify-around items-stretch bg-[#050509]">
            {isLoading ? (
              <>
                <div className="w-[100%] mb-auto mt-auto text-2xl ">
                  Loading Accuracy...
                </div>
              </>
            ) : (
              <>
                <div className="text-3xl">Accuracy </div>
                <div className=" grid grid-cols-3 gap-20 p-2 ">
                  {difficulty === "easy" && (
                    <>
                      <DataCard
                        upperText={performanceData.easy[15].accuracy}
                        lowerText={"15 seconds"}
                        type={"%"}
                      />
                      <DataCard
                        upperText={performanceData.easy[30].accuracy}
                        lowerText={"30 seconds"}
                        type={"%"}
                      />
                      <DataCard
                        upperText={performanceData.easy[60].accuracy}
                        lowerText={"60 seconds"}
                        type={"%"}
                      />
                    </>
                  )}

                  {difficulty === "medium" && (
                    <>
                      <DataCard
                        upperText={performanceData.medium[15].accuracy}
                        lowerText={"15 seconds"}
                        type={"%"}
                      />
                      <DataCard
                        upperText={performanceData.medium[30].accuracy}
                        lowerText={"30 seconds"}
                        type={"%"}
                      />
                      <DataCard
                        upperText={performanceData.medium[60].accuracy}
                        lowerText={"60 seconds"}
                        type={"%"}
                      />
                    </>
                  )}

                  {difficulty === "hard" && (
                    <>
                      <DataCard
                        upperText={performanceData.hard[15].accuracy}
                        lowerText={"15 seconds"}
                        type={"%"}
                      />
                      <DataCard
                        upperText={performanceData.hard[30].accuracy}
                        lowerText={"30 seconds"}
                        type={"%"}
                      />
                      <DataCard
                        upperText={performanceData.hard[60].accuracy}
                        lowerText={"60 seconds"}
                        type={"%"}
                      />
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
        <div className="text-2xl text-center p-5 flex flex-row justify-around items-center w-[50%] ml-auto mr-auto text-white ">
          <div
            className={` pr-8 pl-8 pt-2 pb-2  ${
              difficulty === "easy"
                ? "border-1 bg-gradient-to-r from-indigo-500 to-purple-600 border-[#2C2C2C] rounded-4xl"
                : ""
            }`}
            onClick={() => setdifficulty("easy")}
          >
            Easy
          </div>
          <div
            className={` pr-8 pl-8 pt-2 pb-2 ${
              difficulty === "medium"
                ? " border-1 bg-gradient-to-r from-indigo-500 to-purple-600 border-[#2C2C2C] rounded-4xl"
                : ""
            }`}
            onClick={() => setdifficulty("medium")}
          >
            Medium
          </div>
          <div
            className={` pr-8 pl-8 pt-2 pb-2 ${
              difficulty === "hard"
                ? " border-1 bg-gradient-to-r from-indigo-500 to-purple-600 border-[#2C2C2C] rounded-4xl"
                : ""
            }`}
            onClick={() => setdifficulty("hard")}
          >
            Hard
          </div>
        </div>
        <div className="w-[80%] min-h-40 h-fit gap-10 flex justify-evenly ml-auto mr-auto text-white  ">
          <div className="min-h-60 h-fit border-1 border-[#2C2C2C] rounded-4xl p-10 bg-[#050509]">
            <div className="text-center pt-2 pb-2">No of tests</div>
            <div
              className={` pr-8 pl-8 pt-2 pb-2 ${
                Count === 10
                  ? " border-1 bg-gradient-to-r from-indigo-500 to-purple-600 border-[#2C2C2C] rounded-4xl"
                  : ""
              }`}
              onClick={() => setCount(10)}
              data-t="10"
            >
              10
            </div>
            <div
              className={` pr-8 pl-8 pt-2 pb-2 ${
                Count === 50
                  ? " border-1 bg-gradient-to-r from-indigo-500 to-purple-600 border-[#2C2C2C] rounded-4xl"
                  : ""
              }`}
              onClick={() => setCount(50)}
              data-t="50"
            >
              50
            </div>
            <div
              className={` pr-8 pl-8 pt-2 pb-2 ${
                Count === 100
                  ? " border-1 bg-gradient-to-r from-indigo-500 to-purple-600 border-[#2C2C2C] rounded-4xl"
                  : ""
              }`}
              onClick={() => setCount(100)}
              data-t="100"
            >
              100
            </div>
          </div>
          <div className="min-h-60 h-fit border-1 border-[#2C2C2C] rounded-4xl p-10 bg-[#050509]">
            <div className="text-center pt-2 pb-2">Duration</div>
            <div
              className={` pr-8 pl-8 pt-2 pb-2 ${
                Duration === 15
                  ? " border-1 bg-gradient-to-r from-indigo-500 to-purple-600 border-[#2C2C2C] rounded-4xl"
                  : ""
              }`}
              onClick={() => setDuration(15)}
              data-d="15"
            >
              15
            </div>
            <div
              className={` pr-8 pl-8 pt-2 pb-2 ${
                Duration === 30
                  ? " border-1 bg-gradient-to-r from-indigo-500 to-purple-600 border-[#2C2C2C] rounded-4xl"
                  : ""
              }`}
              onClick={() => setDuration(30)}
              data-d="30"
            >
              30
            </div>
            <div
              className={` pr-8 pl-8 pt-2 pb-2 ${
                Duration === 60
                  ? " border-1 bg-gradient-to-r from-indigo-500 to-purple-600 border-[#2C2C2C] rounded-4xl"
                  : ""
              }`}
              onClick={() => setDuration(60)}
              data-d="60"
            >
              60
            </div>
          </div>
          <div className=" w-full min-h-60 flex justify-evenly items-center border-1 border-[#2C2C2C] rounded-4xl p-10 bg-[#050509]">
            {speedData.length ? (
              <ResultChart secondData={speedData} />
            ) : (
              <>No test Found</>
            )}
          </div>
        </div>

        <div className="text-2xl text-center p-5 flex flex-row justify-around items-center w-[50%] ml-auto mr-auto text-white mt-2 mb-2 ">
          <div
            className={` pr-8 pl-8 pt-2 pb-2 ${
              currState === "accurate"
                ? " border-1 bg-gradient-to-r from-indigo-500 to-purple-600 border-[#2C2C2C] rounded-4xl"
                : ""
            }`}
            onClick={() => setcurrState("accurate")}
          >
            Most Accurate
          </div>
          <div
            className={` pr-8 pl-8 pt-2 pb-2  ${
              currState === "fastest"
                ? " border-1 bg-gradient-to-r from-indigo-500 to-purple-600 border-[#2C2C2C] rounded-4xl"
                : ""
            }`}
            onClick={() => setcurrState("fastest")}
          >
            Fastest
          </div>
        </div>

        <div className="border-1 rounded-4xl  border-[#2C2C2C] w-[80%] ml-auto mr-auto p-5 bg-[#050509]">
          {currState === "fastest" ? (
            <div>
              {/* Heading Row */}
              <div className="w-[90%] ml-auto mr-auto text-gray-400 text-lg flex justify-between mb-2">
                <div className="w-[5%] text-start pl-[1%]">#</div>
                <div className="w-[10%] text-end">Speed (WPM)</div>
                <div className="w-[10%] text-end">Accuracy (%)</div>

                <div className="w-[30%] text-end">Date</div>
              </div>

              {/* Fastest Leaderboard */}
              {TopTests?.map((ele, ind) => (
                <a
                  href={`/user-page/result?testId=${ele?._id}`}
                  key={ind}
                  className={`w-[90%] ml-auto mr-auto text-white text-xl ${
                    ind % 2 === 0 ? "bg-[#2C2C2C]" : ""
                  } rounded-4xl min-h-14 h-fit pl-5 pr-5 flex items-center justify-between mb-2 hover:scale-[1.01] transition`}
                >
                  <div className="w-[5%] text-start pl-[1%]">{ind + 1}</div>
                  <div className="w-[10%] text-end">
                    {Math.round(ele?.speed * 100) / 100}
                  </div>
                  <div className="w-[10%] text-end">
                    {Math.round(ele?.accuracy * 100) / 100}
                  </div>

                  <div className="w-[30%] text-end text-gray-400 text-sm">
                    {new Date(ele?.createdAt).toLocaleDateString()}
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div>
              {/* Heading Row */}
              <div className="w-[90%] ml-auto mr-auto text-gray-400 text-lg flex justify-between mb-2">
                <div className="w-[5%] text-start pl-[1%]">#</div>
                <div className="w-[10%] text-end">Speed (WPM)</div>
                <div className="w-[10%] text-end">Accuracy (%)</div>
                <div className="w-[30%] text-end">Date</div>
              </div>

              {/* Most Accurate Leaderboard */}
              {AccurateTests?.map((ele, ind) => (
                <a
                  href={`/user-page/result?testId=${ele?._id}`}
                  key={ind}
                  className={`w-[90%] ml-auto mr-auto text-white text-xl ${
                    ind % 2 === 0 ? "bg-[#2C2C2C]" : ""
                  } rounded-4xl min-h-14 h-fit pl-5 pr-5 flex items-center justify-between mb-2 hover:scale-[1.01] transition`}
                >
                  <div className="w-[5%] text-start pl-[1%]">{ind + 1}</div>

                  <div className="w-[10%] text-end">
                    {Math.round(ele?.speed * 100) / 100}
                  </div>
                  <div className="w-[10%] text-end">
                    {Math.round(ele?.accuracy * 100) / 100}
                  </div>

                  <div className="w-[30%] text-end text-gray-400 text-sm">
                    {new Date(ele?.createdAt).toLocaleDateString()}
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Stats;
