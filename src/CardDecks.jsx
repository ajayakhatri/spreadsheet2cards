import React, { useEffect, useState, useMemo, useRef } from "react";
import TinderCard from "react-tinder-card";
import { toTitleCase } from "./spreadsheet2cards";

function CardDecks({ wordsData }) {
  const [currentIndex, setCurrentIndex] = useState(wordsData.length - 1);
  const [lastDirection, setLastDirection] = useState();
  const [showDeckAns, setShowDeckAns] = useState(false);
  const [showAns, setShowAns] = useState(false);
  const [right, setRight] = useState(0);
  const [allDirection, setAllDirection] = useState([]);

  useEffect(() => {
    if (typeof document != undefined) {
      const cardDivs = document.querySelectorAll(".card");
      const colors = ["#2e3856", "#2e3e56"];
      let colorIndex = 0;
      cardDivs.forEach((card) => {
        card.style.backgroundColor = colors[colorIndex];
        colorIndex = (colorIndex + 1) % colors.length;
      });
    }
  }, []);
  const addNumberToLast = (number) => {
    setAllDirection([...allDirection, number]);
  };

  const removeNumberFromLast = () => {
    if (allDirection.length > 0) {
      const updatedDirections = allDirection.slice(0, -1);
      setAllDirection(updatedDirections);
    }
  };

  const [wrong, setWrong] = useState(0);
  // used for outOfFrame closure
  const currentIndexRef = useRef(currentIndex);

  const childRefs = useMemo(
    () =>
      Array(wordsData.length)
        .fill(0)
        .map((i) => React.createRef()),
    []
  );

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const canGoBack = currentIndex < wordsData.length - 1;

  const canSwipe = currentIndex >= 0;

  // set last direction and decrease current index
  const swiped = (direction, index) => {
    if (typeof document != undefined) {
      const a = document.querySelector(`.word-${index}`);
      if (a) {
        a.style.display = "none";
      }
    }
    setShowDeckAns(false);
    if (direction == "right") {
      setRight(right + 1);
      addNumberToLast(1);
    } else if (direction == "left") {
      setWrong(wrong + 1);
      addNumberToLast(0);
    }
    setLastDirection(direction);
    updateCurrentIndex(index - 1);
  };

  const outOfFrame = (name, idx) => {
    console.log(`${name} (${idx}) left the screen!`, currentIndexRef.current);
    currentIndexRef.current >= idx && childRefs[idx].current.restoreCard();
  };

  const swipe = async (dir) => {
    if (canSwipe && currentIndex < wordsData.length) {
      await childRefs[currentIndex].current.swipe(dir); // Swipe the card!
    }
  };

  // increase current index and show card
  const goBack = async () => {
    if (!canGoBack) return;
    const newIndex = currentIndex + 1;
    updateCurrentIndex(newIndex);

    const lastNumber =
      allDirection.length > 0 ? allDirection[allDirection.length - 1] : null;
    if (lastNumber == 1) {
      setRight(right - 1);
    } else if (lastNumber == 0) {
      setWrong(wrong - 1);
    }
    if (typeof document != undefined) {
      const a = document.querySelector(`.word-${newIndex}`);
      if (a) {
        a.style.display = "block";
      }
    }

    removeNumberFromLast();
    await childRefs[newIndex].current.restoreCard();
    console.log(childRefs[newIndex].current);
  };

  return (
    <div
      id="cardDecks"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        userSelect: "none",
      }}
    >
      <div
        style={{
          fontSize: "16px",
          minWidth: "300px",
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <div
          style={{
            border: "1px solid orange",
            color: "orange",
            fontWeight: "bolder",
            height: "24px",
            width: "24px",
            textAlign: "center",
            borderRadius: "50%",
          }}
        >
          {wrong}
        </div>
        <div
          style={{
            border: "1px solid #17df0d",
            color: "#17df0d",
            fontWeight: "bolder",
            height: "24px",
            width: "24px",
            textAlign: "center",
            borderRadius: "50%",
          }}
        >
          {right}
        </div>
      </div>
      <div className="cardContainer">
        {wordsData.map((item, index) => (
          <TinderCard
            ref={childRefs[index]}
            className={`swipe word-${item.number - 1}`}
            key={item.number}
            onSwipe={(dir) => {
              swiped(dir, index);
            }}
            onCardLeftScreen={() => outOfFrame(item.word, index)}
            preventSwipe={["up", "down"]}
          >
            <div style={{ border: `white 1px solid` }} className="card">
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  height: "100%",
                }}
              >
                <h3
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                  onClick={() => setShowDeckAns(!showDeckAns)}
                  onTouchEnd={() => setShowDeckAns(!showDeckAns)}
                >
                  <div style={{ fontWeight: "bold", fontSize: "24px" }}>
                    {toTitleCase(item.word)}
                  </div>
                  <div
                    style={{
                      fontWeight: "normal",
                      fontSize: "18px",
                      marginTop: "20px",
                    }}
                  >
                    {showDeckAns || showAns ? item.meaning : " "}
                  </div>
                </h3>
              </div>
            </div>
          </TinderCard>
        ))}
      </div>
      <div className="buttons" style={{ fontSize: "16px" }}>
        <button
          style={{ backgroundColor: !canSwipe && "#c3c4d3" }}
          onClick={() => swipe("left")}
        >
          Left👍
        </button>
        <button
          style={{ margin: "10px", backgroundColor: !canGoBack && "#c3c4d3" }}
          onClick={() => goBack()}
        >
          Undo
        </button>
        <button
          style={{ marginRight: "10px", border: showAns && "white 2px solid" }}
          onClick={() => setShowAns(!showAns)}
        >
          Ans
        </button>
        <button
          style={{ backgroundColor: !canSwipe && "#c3c4d3" }}
          onClick={() => swipe("right")}
        >
          Right👎
        </button>
      </div>
    </div>
  );
}

export default CardDecks;
