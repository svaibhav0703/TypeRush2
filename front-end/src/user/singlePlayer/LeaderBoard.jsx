import React, { useEffect, useState } from "react";
import NavBar from "../NavBar.jsx";
import {
  useGetFastestUsersMutation,
  useGetMySpeedRankMutation,
} from "../../../redux/api/users.js";
import { useSelector } from "react-redux";
const LeaderBoard = () => {
  const [fetchFastestUsers, { isLoading }] = useGetFastestUsersMutation();
  const [fetchMyRank, { isLoading: loadingMyRank }] =
    useGetMySpeedRankMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const [Duration, setDuration] = useState(15);
  const [Fastest, setFastest] = useState([]);
  const [Rank, setRank] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const rank = await fetchMyRank({ duration: Duration }).unwrap();
        setRank(rank.Rank);
        const TopRanks = await fetchFastestUsers({
          duration: Duration,
        }).unwrap();
        console.log(TopRanks);
        setFastest(TopRanks);
      } catch (error) {
        console.log(error);
      }
    };
    console.log(userInfo);
    fetchData();
  }, [userInfo, Duration]); // runs when page reloads

  return (
    <>
      <NavBar />
      <div
        className="min-h-screen h-fit bg-[#121212] font-smooch-sans"
        style={{
          backgroundColor: "#050509",
          backgroundImage:
            "linear-gradient(0deg, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      >
        <div className="text-gray-400 font-bold text-6xl text-center">
          Fastest Fingers
        </div>
        <div className="flex min-h-10 h-fit w-fit border-1 border-[#2C2C2C] rounded-4xl ml-auto mr-auto mt-10 text-gray-400">
          <div
            className={`pr-8 pl-8 pt-2 pb-2 ${
              Duration === 15
                ? "border-1 border-[#2C2C2C] rounded-4xl bg-indigo-500 text-white"
                : ""
            }`}
            onClick={() => setDuration(15)}
            data-d="15"
          >
            15
          </div>
          <div
            className={`pr-8 pl-8 pt-2 pb-2 ${
              Duration === 30
                ? "border-1 border-[#2C2C2C] rounded-4xl bg-indigo-500 text-white"
                : ""
            }`}
            onClick={() => setDuration(30)}
            data-d="30"
          >
            30
          </div>
          <div
            className={`pr-8 pl-8 pt-2 pb-2 ${
              Duration === 60
                ? "border-1 border-[#2C2C2C] rounded-4xl bg-indigo-500 text-white"
                : ""
            }`}
            onClick={() => setDuration(60)}
            data-d="60"
          >
            60
          </div>
        </div>
        <div className="text-white text-xl w-[80%] text-start ml-auto mr-auto pl-[1.5%]">
          You
        </div>
        <div className="text-white w-[80%] ml-auto mr-auto text-xl">
          <div className=" bg-indigo-500 rounded-4xl min-h-10 h-fit pl-5 pr-5 flex items-center justify-between">
            <div className="w-[5%] text-start pl-[1%]">{Rank}</div>
            <div className="w-[75%] text-start">{userInfo?.userName}</div>

            <div className="w-[10%] text-end">
              {Math.round(
                (Duration === 15
                  ? userInfo?.score15
                  : Duration === 30
                  ? userInfo?.score30
                  : userInfo?.score60) * 100
              ) / 100}
            </div>
            <div className="w-[10%] text-end pr-[2%]">{userInfo?.tests}</div>
          </div>
        </div>
        <div className="text-white  font-semibold text-2xl flex justify-between items-center w-[80%] ml-auto mr-auto pl-5 pr-5 mt-2 mb-2">
          <div className="w-[5%] text-start">Rank</div>
          <div className="w-[75%] text-start">Username</div>

          <div className="w-[10%] text-end">T-score</div>
          <div className="w-[10%] text-end">Tests</div>
        </div>
        <div>
          {Fastest.map((ele, ind) => {
            return (
              <>
                <div
                  id={ind}
                  className="text-white w-[80%] ml-auto mr-auto text-xl"
                >
                  <div
                    className={` ${
                      ind % 2 == 0 ? "bg-[#2C2C2C]" : ""
                    } rounded-4xl min-h-10 h-fit pl-5 pr-5 flex items-center justify-between`}
                  >
                    <div className="w-[5%] text-start pl-[1%]">{ind + 1}</div>
                    <div className="w-[75%] text-start">{ele?.userName}</div>

                    <div className="w-[10%] text-end">
                      {Math.round(
                        (Duration === 15
                          ? ele?.score15
                          : Duration === 30
                          ? ele?.score30
                          : ele?.score60) * 100
                      ) / 100}
                    </div>
                    <div className="w-[10%] text-end pr-[2%]">{ele?.tests}</div>
                  </div>
                </div>
              </>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default LeaderBoard;
