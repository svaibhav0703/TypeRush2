import React from "react";
import { Chart } from "react-charts";

const ResultChart = ({ secondData = [], name }) => {
  const chartData = secondData.map((speed, index) => [index + 1, speed]);

  const data = [
    {
      label: "Speed",
      data: chartData,
    },
  ];

  const primaryAxis = React.useMemo(
    () => ({
      getValue: (datum) => datum[0],
      title: "Time (seconds)", // X-axis title
    }),
    []
  );

  const secondaryAxes = React.useMemo(
    () => [
      {
        getValue: (datum) => datum[1],
        title: "Speed (WPM)", // Y-axis title
        min: 0,
      },
    ],
    []
  );

  return (
    <>
      <div className="text-end rotate-270">{name}</div>
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
        }}
      >
        <Chart
          options={{
            data,
            primaryAxis,
            secondaryAxes,
            dark: true,

            getSeriesStyle: () => ({
              color: "#818CF8",
            }),
            theme: {
              axis: {
                tickColor: "white",
                tickLabel: {
                  color: "white",
                },
                gridColor: "rgba(255,255,255,0.2)",
                label: {
                  color: "white",
                },
              },
            },
          }}
        />
      </div>
    </>
  );
};

export default ResultChart;
