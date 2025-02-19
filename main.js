const body = document.querySelector("body");
const previewBox = document.querySelector("#gradient-preview");
const inputDirection = document.querySelector("#direction");
const colorOne = document.querySelector("#color-one");
const colorTwo = document.querySelector("#color-two");
const input = document.querySelector("#result");
const copyButton = document.querySelector("#copy-button");
const resetButton = document.querySelector("#reset-button");

document.addEventListener("DOMContentLoaded", setGradient);

// FUNCTIONS
// generate random colors
function getColor() {
  let newColor = "#";
  let hexLetters = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "0",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
  ];
  for (let i = 0; i < hexLetters.length; i += 1) {
    newColor += hexLetters[Math.floor(Math.random() * hexLetters.length)];
  }
  newColor = newColor.slice(0, 7);
  return newColor;
}

// get data for new linear gradient
function generateGradient() {
  let results = [];
  let firstColor = getColor();
  let secondColor = getColor();
  let degree = inputDirection.value;
  results.push(firstColor, secondColor, degree);

  return results;
}

// store the generated gradient
let randomGradient = generateGradient();

// set the gradient generated
function setGradient() {
  let data = randomGradient.slice();
  let backgroundColor = `background: ${data[0]};`;
  let linearGradient = `background: linear-gradient(${data[2]}, ${data[0]}, ${data[1]});`;

  return (
    (body.style.cssText = `${(backgroundColor, linearGradient)}`),
    (previewBox.style.cssText = `${(backgroundColor, linearGradient)}`),
    (copyButton.style.cssText = `${(backgroundColor, linearGradient)}`),
    (colorOne.value = data[0]),
    (colorTwo.value = data[1]),
    (input.value = `${backgroundColor}\x0A${linearGradient}`)
  );
}

// reset new selected direction (degree)
function setDegree() {
  let newValue = inputDirection.value;

  return (randomGradient[2] = newValue);
}

// copy the result gradient
function copyResult() {
  return (
    navigator.clipboard.writeText(input.value),
    (copyButton.innerText = "Copied!"),
    setTimeout(() => {
      copyButton.innerText = "Copy Css Result";
    }, 2000)
  );
}

// EVENT LISTENERS
// reset new direction (degree)
inputDirection.addEventListener("change", () => {
  setDegree();
  setGradient();
});

// copy result to the clipboard
copyButton.addEventListener("click", copyResult);
previewBox.addEventListener("click", copyResult);

resetButton.addEventListener("click", () => {
  window.location.reload();
});
