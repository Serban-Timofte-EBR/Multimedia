let canvas = document.querySelector("#canvas");
const context = canvas.getContext("2d");

let drawing = false;
let startX, startY;
let tool = "ellipse"; // default tool
let color = "black"; // default color
let lineWidth = 1; // The default line width

let draws = [];

/**
 *
 * @param {HTMLCanvasElement} canvas
 */
function getMouseCoord(canvas, e) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
}

// Start drawing
canvas.addEventListener("mousedown", (e) => {
  drawing = true;
  const { x, y } = getMouseCoord(canvas, e);
  startX = x;
  startY = y;
});

// Draw
canvas.addEventListener("mousemove", (e) => {
  if (!drawing) {
    return;
  }

  const { x, y } = getMouseCoord(canvas, e);

  drawShapes();
  context.beginPath();
  context.strokeStyle = color;
  context.lineWidth = lineWidth;

  if (tool === "ellipse") {
    context.ellipse(
      startX,
      startY,
      Math.abs(x - startX),
      Math.abs(y - startY),
      0,
      0,
      Math.PI * 2
    );
  } else if (tool === "rectangle") {
    context.rect(startX, startY, x - startX, y - startY);
  } else if (tool === "line") {
    context.moveTo(startX, startY);
    context.lineTo(x, y);
  }
  context.stroke();
});

// Stop drawing
canvas.addEventListener("mouseup", (e) => {
  if (!drawing) {
    return;
  }
  drawing = false;

  const { x, y } = getMouseCoord(canvas, e);

  draws.push({
    tool: tool,
    startX: startX,
    startY: startY,
    endX: x,
    endY: y,
    color: color,
    lineWidth: lineWidth,
  });

  drawShapes();
});

function drawShapes() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  draws.forEach((shape) => {
    context.beginPath();
    context.strokeStyle = shape.color;
    context.lineWidth = shape.lineWidth;

    const startX = shape.startX;
    const startY = shape.startY;
    const endX = shape.endX;
    const endY = shape.endY;

    if (shape.tool === "ellipse") {
      context.ellipse(
        startX,
        startY,
        Math.abs(endX - startX),
        Math.abs(endY - startY),
        0,
        0,
        Math.PI * 2
      );
    } else if (shape.tool === "rectangle") {
      context.rect(startX, startY, endX - startX, endY - startY);
    } else if (shape.tool === "line") {
      context.moveTo(startX, startY);
      context.lineTo(endX, endY);
    }
    context.stroke();
  });
}

document.getElementById("clear").addEventListener("click", () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  draws = [];
});
