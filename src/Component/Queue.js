import { useEffect, useState } from "react";
import { v4 } from "uuid";
import { motion, AnimatePresence } from "framer-motion";
import "./Queue.css";

export const Queue = () => {
  const [items, setItems] = useState(1);
  const [queues, setQueues] = useState([[], [], [], []]);
  const handleSubmit = (e) => {
    e.preventDefault();
    let leastCost = Infinity;
    let queueWithLeastCost;
    for (const queue of queues) {
      const totalInQueue = queue.reduce((acc, { value }) => acc + value, 1);
      if (leastCost > totalInQueue) {
        leastCost = totalInQueue;
        queueWithLeastCost = queue;
      }
    }
    requestAnimationFrame(() => {
      setQueues((prev) =>
        prev.map((queue) =>
          queue === queueWithLeastCost
            ? [...queue, { value: items, id: v4() }]
            : queue
        )
      );
    }, 0);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      requestAnimationFrame(() => {
        setQueues((prev) =>
          prev.map((queue) =>
            [
              { ...queue[0], value: queue[0]?.value - 1 },
              ...queue.slice(1)
            ].filter(({ value }) => value > 0)
          )
        );
      }, 0);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const deleteItem = (itemId) => {
    requestAnimationFrame(() => {
      setQueues((prev) =>
        prev.map((queue) => queue.filter(({ id }) => id !== itemId))
      );
    }, 1);
  };

  function secondsToTime(seconds) {
    if (isNaN(seconds) || seconds < 0) {
      return "Invalid input";
    }

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formattedTime = `${String(hours).padStart(2, "0")}:${String(
      minutes
    ).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
    return formattedTime;
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Enter Items"
          min="1"
          required
          onChange={(e) => setItems(e.target.valueAsNumber)}
        />
        <button type="submit">Add to queue</button>
      </form>
      <div className="container">
        {queues.map((queue, idx) => (
          <div key={idx} className="queue">
            <div data-processing={queue.length > 0} className="counter">
              Queue {idx + 1}
              <div className="time">
                {secondsToTime(
                  queue.reduce((acc, { value }) => acc + value, 0)
                )}
              </div>
            </div>
            <AnimatePresence mode="popLayout" initial={false}>
              {queue.map(({ value, id }, i) => (
                <motion.div
                  layout
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", delay: 0.05 * i }}
                  key={id}
                  onClick={() => deleteItem(id)}
                  className="item"
                  data-processing={i === 0}
                >
                  {value}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};
