import React, { useEffect } from "react";
import NavBar from "../NavBar";
import { useParams, useSearchParams } from "react-router";
import { useGetTestQuery } from "../../../redux/api/test";
import ResultChart from "./ResultChart";
import confetti from "canvas-confetti";
import DataCard from "./DataCard.jsx";
const Result = () => {
  const [params] = useSearchParams();
  const testId = params.get("testId");
  const { data: Test, loading: loadingTest } = useGetTestQuery(testId);
  const fireConfettiMultiple = () => {
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
  };
  useEffect(() => {
    if (Test?.fastest) {
      fireConfettiMultiple();
    }
  }, [Test]);

  useEffect(() => {
    console.log("this is the result of the test ", Test);
  }, [Test]);
  return loadingTest ? (
    <>Loading the test</>
  ) : (
    <>
      <NavBar />

      <div
        className="h-[90vh] bg-[#121212] flex flex-col justify-start gap-20 items-center text-gray-400 font-smooch-sans text-2xl pt-10"
        style={{
          backgroundColor: "#050509",
          backgroundImage:
            "linear-gradient(0deg, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      >
        {Test?.fastest ? (
          <>
            <div className="text-6xl animate-pulse font-bold">
              New Record!!!
            </div>
          </>
        ) : (
          <></>
        )}
        <div className="h-[500px] w-[80%] flex flex-col justify-evenly items-center p-5 border-1 border-[#2C2C2C] rounded-4xl bg-[#050509]">
          <div className="h-[5%] w-full grid grid-cols-4 grid-rows-1">
            <DataCard
              upperText={Test?.duration ?? "-"}
              lowerText={"Duration"}
              type={"s"}
            ></DataCard>
            <DataCard
              upperText={
                Test?.accuracy != null ? Math.round(Test.accuracy) : "-"
              }
              lowerText={"Accuracy"}
              type={"%"}
            ></DataCard>
            <DataCard
              upperText={Test?.speed != null ? Math.round(Test.speed) : "-"}
              lowerText={"Speed"}
              type={"WPM"}
            ></DataCard>

            <DataCard
              upperText={Test?.mistakes.reduce((acc, curr) => acc + curr, 0)}
              lowerText={"Mistakes"}
              type={""}
            ></DataCard>
          </div>

          <div className="h-[30%] w-[90%] flex justify-evenly items-center">
            {Test?.secondData && Test?.mistakes && Test?.duration ? (
              <ResultChart
                secondData={Test.secondData}
                name={"speed"}
                duration={Test.duration}
              />
            ) : (
              <>Loading the Graph</>
            )}
          </div>
          <div className="h-[30%] w-[90%] flex justify-evenly items-center">
            {Test?.secondData && Test?.mistakes && Test?.duration ? (
              <ResultChart
                name={"mistakes"}
                secondData={Test.mistakes}
                duration={Test.duration}
              />
            ) : (
              <>Loading the Graph</>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Result;
