import React from "react";
import { Bubble as BubbleType } from "@/app/types/Bubble";

const Bubble = ({
  bubble,
  onClick,
}: {
  bubble: BubbleType;
  onClick: () => void;
}) => {
  return (
    <div
      className="absolute flex flex-col rounded-full border border-red-400 h-12 w-12 items-center justify-center"
      style={{
        top: bubble.y,
        left: bubble.x,
        backgroundColor: bubble.isClick
          ? `rgba(255, 0, 0, ${bubble.opacity})`
          : "white",
        zIndex: 100 - bubble.number,
        transition: "opacity 0.1s linear",
      }}
      onClick={onClick}
    >
      <h1 className="text-black text-sm">{bubble.number}</h1>
      {bubble.isClick && (
        <h2 className="text-black text-xs">
          {bubble.timeDisappear.toFixed(1)}s
        </h2>
      )}
    </div>
  );
};

export default Bubble;
