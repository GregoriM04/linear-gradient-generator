const body = document.querySelector("body");
const previewBox = document.querySelector("#gradient-preview");
const inputDirection = document.querySelector("#direction");
const colorOne = document.querySelector("#color-one");
const colorTwo = document.querySelector("#color-two");
const input = document.querySelector("#result");
const copyButton = document.querySelector("#copy-button");
const resetButton = document.querySelector("#reset-button");
const colorWheelContainer = document.querySelector("#color-wheel-container");
const colorWheelBoxContainer = document.querySelector(
  "#selected-color-box-container"
);
const selectedColorBoxContainer = document.querySelector("#selected-color-box-container")
const selectedColorBox = document.querySelector("#selected-color-box");
const selectedColorText = document.querySelector("#selected-color-text");

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
    (colorOne.style.background = data[0]),
    (colorTwo.style.background = data[1]),
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

// get new random gradient
resetButton.addEventListener("click", () => {
  window.location.reload();
});

// reset new colors
colorOne.addEventListener("click", () => {
  colorWheelContainer.style.display = "flex";
  selectedColorBoxContainer.style.display = "flex";
  selectedColorBox.style.background = randomGradient[0];
  selectedColorText.value = randomGradient[0];
});

colorTwo.addEventListener("click", () => {
  colorWheelContainer.style.display = "flex";
  selectedColorBoxContainer.style.display = "flex";
  selectedColorBox.style.background = randomGradient[1];
  selectedColorText.value = randomGradient[1];
});

// needed to close colorWheel / Canvas when click away
const colorPickerContainer = document.querySelector("#color-picker");
let tagElements = colorPickerContainer.getElementsByTagName("*");
let colorWheelTagNames = ["color-picker"];
for (let i = 0; i < tagElements.length; i += 1) {
  colorWheelTagNames.push(tagElements[i].className);
}

body.addEventListener("click", (e) => {
  let clickTarget = e.target.className;

  let found = colorWheelTagNames.find((element) => element == clickTarget);
  if (found == undefined) {
    colorWheelContainer.style.display = "none";
    selectedColorBoxContainer.style.display = "none";
  }
});

// ColorWheel / Canvas
const canvas = document.querySelector("#color-wheel");
const ctx = canvas.getContext("2d");

function drawColorWheel() {
  const radius = canvas.width / 2;
  const image = ctx.createImageData(canvas.width, canvas.height);
  const data = image.data;

  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const dx = x - radius;
      const dy = y - radius;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance <= radius) {
        const angle = Math.atan2(dy, dx) + Math.PI;
        const hue = (angle / (2 * Math.PI)) * 360;
        const saturation = distance / radius;
        const rgb = hslToRgb(hue, saturation, 0.5);

        const index = (y * canvas.width + x) * 4;
        data[index] = rgb[0]; // Red
        data[index + 1] = rgb[1]; // Green
        data[index + 2] = rgb[2]; // Blue
        data[index + 3] = 255; // Alpha
      }
    }
  }

  ctx.putImageData(image, 0, 0);
}

// call it to draw the colorWheel before is needed
drawColorWheel();

function hslToRgb(h, s, l) {
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // Achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h / 360 + 1 / 3);
    g = hue2rgb(p, q, h / 360);
    b = hue2rgb(p, q, h / 360 - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function getColorAtPosition(x, y) {
  const pixel = ctx.getImageData(x, y, 1, 1).data;
  return `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
}

function rgbToHex(rgb) {
  const result = rgb
    .match(/\d+/g)
    .map((num) => parseInt(num).toString(16).padStart(2, "0"));
  return `#${result.join("")}`;
}

canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const color = getColorAtPosition(x, y);

  const newColor = rgbToHex(color);
  if (whichColor == 1) {
    randomGradient[0] = newColor;
    setGradient();
  } else if (whichColor == 2) {
    randomGradient[1] = newColor;
    setGradient();
  }

  if (color !== "rgb(0, 0, 0)") {
    // Avoid clicking outside the wheel
    selectedColorBox.style.backgroundColor = color;
    selectedColorText.value = rgbToHex(color);
  }
});



let whichColor = 0; // needed to check which option color was selected before changed
colorPickerContainer.addEventListener("click", (e) => {
  let newTarget = e.target.className;
  if (newTarget == "color-one") {
    whichColor = 1; // first option
  } else if (newTarget == "color-two") {
    whichColor = 2; // second option
  }
});


// handle the manual input in the colorWheel / Canvas
selectedColorText.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    let newValue = selectedColorText.value;
    if (newValue[0] !== "#") {
      return console.log(`Your code must have '#' at the beginning.`);
    } else if (newValue.length < 7) {
      return console.log(`Your code must have 6 hex characters.`);
    } else {
      if (whichColor == 1) {
        randomGradient[0] = newValue;
        selectedColorBox.style.backgroundColor = newValue;
        setGradient();
      } else if (whichColor == 2) {
        randomGradient[1] = newValue;
        selectedColorBox.style.backgroundColor = newValue;
        setGradient();
      }
    }
  }
});
