//FRONTEND VARIANT OF COMPONENT
import React, { useState, useEffect } from "react"; //WP version being loaded
import ReactDOM from "react-dom"; //WP version being loaded
import "./frontend.scss";
import { EmojiSmile, EmojiFrown, Check, X } from "react-bootstrap-icons";

const divsToUpdate = document.querySelectorAll(".anchor");

divsToUpdate.forEach(function (div) {
  //the data variable pulls the data passed from PHP via the HTML
  const data = JSON.parse(div.querySelector("pre").innerHTML);
  //Renders the quiz block
  ReactDOM.render(<Quiz {...data} />, div);
  div.classList.remove("anchor");
});

function Quiz(props) {
  const [isCorrect, setIsCorrect] = useState(undefined);
  const [isCorrectDelayed, setIsCorrectDelayed] = useState(undefined);

  useEffect(() => {
    //Resets state to undefined so that multiple wrong answers can be chosen
    if (isCorrect === false) {
      setTimeout(() => {
        setIsCorrect(undefined);
      }, 2600);
    }

    if (isCorrect === true) {
      setTimeout(() => {
        setIsCorrectDelayed(true);
      }, 1000);
    }
  }, [isCorrect]);

  function handleAnswer(index) {
    if (index == props.correctAnswer) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  }

  return (
    <>
      <div
        className='quiz-container'
        style={{ backgroundColor: props.bgColor, textAlign: props.alignment }}
      >
        <p>{props.question}</p>
        <ul>
          {props.answers.map(function (answer, index) {
            return (
              <li
                className={
                  (isCorrectDelayed == true && index == props.correctAnswer
                    ? "no-click"
                    : "") +
                  (isCorrectDelayed == true && index != props.correctAnswer
                    ? "fade-incorrect"
                    : "")
                }
                onClick={
                  isCorrect === true ? undefined : () => handleAnswer(index)
                }
              >
                {isCorrectDelayed === true && index === props.correctAnswer && (
                  <Check size={20} />
                )}
                {isCorrectDelayed === true && index != props.correctAnswer && (
                  <X size={20} />
                )}
                {answer}
              </li>
            );
          })}
        </ul>
        <div
          className={
            "correct-message" +
            (isCorrect === true ? " correct-message--visible" : "")
          }
        >
          <EmojiSmile size={25} />
          <p>Correct! Nice work.</p>
        </div>
        <div
          className={
            "incorrect-message" +
            (isCorrect === false ? " correct-message--visible" : "")
          }
        >
          <EmojiFrown size={25} />
          <p>Incorrect, try again.</p>
        </div>
      </div>
    </>
  );
}
