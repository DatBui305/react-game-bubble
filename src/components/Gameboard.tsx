"use client";
import { createBubbles } from "@/app/services/gameService";
import { useEffect, useState } from "react";
const GameBoard = () => {
  const [point, setPoint] = useState(5);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [nextValue, setNextValue] = useState(1);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [isAllCleared, setIsAllCleared] = useState(false);
  const [headerValue, setHeaderValue] = useState("LET PLAYS");
  const [isGameOver, setIsGameOver] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(() => {
        setBubbles((prevBubbles) => {
          const nextBubble = prevBubbles.find((b) => b.number === nextValue);
          if (nextBubble) {
            setNextValue(nextValue + 1); // Tính trước rồi set
            return prevBubbles.map((b) =>
              b.id === nextBubble.id ? { ...b, isClick: true } : b
            );
          } else {
            setIsAutoPlaying(false);
            clearInterval(interval);
          }
          return prevBubbles;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, nextValue]);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setTime((prevTime) => prevTime + 0.1);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (isGameOver) return;

    const interval = setInterval(() => {
      setBubbles((prev) =>
        prev
          .map((b) =>
            b.isClick
              ? {
                  ...b,
                  timeDisappear: b.timeDisappear - 0.1,
                  opacity: Math.max(0, b.opacity - 0.03),
                }
              : b
          )
          .filter((b) => b.timeDisappear > 0)
      );
    }, 100);

    return () => clearInterval(interval);
  }, [isGameOver]);
  const handlePlay = () => {
    setTime(0);
    setNextValue(1);
    const newBubbles = createBubbles(point);
    setBubbles(newBubbles.sort((a, b) => a.number - b.number));
    setIsPlaying(true);
    setHeaderValue("LET PLAYS");
  };

  const handleRestart = () => {
    const newBubbles = createBubbles(point);
    setBubbles(newBubbles.sort((a, b) => a.number - b.number));
    setIsPlaying(true);
    setTime(0);
    setNextValue(1);
  };
  const handleAutoPlay = () => {
    setIsAutoPlaying((prev) => !prev);
  };
  const handleBubbleClick = (id: number, number: number) => {
    if (number === nextValue) {
      setNextValue((prev) => prev + 1);
      setBubbles((prev) =>
        prev.map((b) => (b.id === id ? { ...b, isClick: true } : b))
      );
    } else {
      setIsPlaying(false);
      setHeaderValue("GAME OVER");
      setIsGameOver(true);
    }
  };
  useEffect(() => {
    if (bubbles.length === 0 && isPlaying) {
      setIsPlaying(false);
      setIsAllCleared(true);
      setHeaderValue("All Cleared");
    }
  }, [bubbles]);
  return (
    <div className="grid grid-cols-4">
      <div className="col-span-2 col-start-2 p-10 border">
        <h1
          className="font-bold"
          style={{
            color:
              headerValue === "All Cleared"
                ? "green"
                : headerValue === "GAME OVER"
                ? "red"
                : "black",
          }}
        >
          {headerValue}
        </h1>

        <div className="grid grid-cols-3 pt-5 pb-5">
          <h2 className="col-span-1">Point: </h2>
          <input
            type="text"
            className="col-span-1 border"
            placeholder="1"
            value={point}
            onChange={(e) => setPoint(Number(e.target.value))}
          />
        </div>
        <div className="grid grid-cols-3 pb-5">
          <h2 className="col-span-1">Time: </h2>
          <h2 className="col-span-1">{time.toFixed(1)}s</h2>
        </div>

        {isPlaying ? (
          <div className="grid grid-cols-3 pb-5 gap-4">
            <button className="col-span-1 border" onClick={handleRestart}>
              Restart
            </button>
            <button className="col-span-1 border" onClick={handleAutoPlay}>
              {isAutoPlaying ? "Auto Play Off" : "Auto Play On"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 pb-5 gap-4">
            <button className="col-span-1 border" onClick={handlePlay}>
              Play
            </button>
          </div>
        )}

        <div className="relative border h-96 w-full bg-gray-200">
          {[...bubbles]
            .sort((a, b) => a.number - b.number)
            .map((bubble) => (
              <div
                key={bubble.id}
                className="absolute flex flex-col rounded-full border border-red-400 h-12 w-12 items-center justify-center"
                style={{
                  top: bubble.y,
                  left: bubble.x,
                  backgroundColor: bubble.isClick
                    ? `rgba(255, 0, 0, ${bubble.opacity})`
                    : "white", // Màu ban đầu
                  zIndex: point - bubble.number,
                  transition: "opacity 0.1s linear",
                }}
                onClick={() => handleBubbleClick(bubble.id, bubble.number)}
              >
                <h1 className="text-black text-sm">{bubble.number}</h1>
                {bubble.isClick ? (
                  <h2 className="text-black text-xs">
                    {bubble.timeDisappear.toFixed(1)}s
                  </h2>
                ) : (
                  <></>
                )}
              </div>
            ))}
        </div>
        {nextValue - 1 === point ? (
          <></>
        ) : (
          <div className="pt-5">Next: {nextValue}</div>
        )}
      </div>
    </div>
  );
};
export default GameBoard;
