import React from "react";

const DataCard = ({ upperText, lowerText, type }) => {
  return (
    <div className="flex flex-col items-center justify-center text-gray-400">
      <div className="text-5xl ">
        <span className="font-bold">{upperText}</span>{" "}
        <span className="text-lg">{type}</span>
      </div>
      <div className="text-xl">{lowerText}</div>
    </div>
  );
};

export default DataCard;
