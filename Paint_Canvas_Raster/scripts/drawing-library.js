let canvas = document.querySelector("#canvas");
const context = canvas.getContext("2d");

let drawing = false;
let startX, startY;
let tool = "ellipse"; // default tool
let color = "black"; // default color
let lineWidth = 1; // The default line width
let backColor = "white"; // The default background color

let draws = [];
const shapes_list = document.querySelector("#shapes_list");

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

document.querySelector("#backColor").addEventListener("change", (e) => {
  backColor = e.target.value;
  canvas.style.backgroundColor = backColor; // nu este corect
  // facem un fill rectangle pe toata suprafata canvasului cu culoarea aleasa
});

// Start drawing
canvas.addEventListener("mousedown", (e) => {
  drawing = true;
  const { x, y } = getMouseCoord(canvas, e);
  startX = x;
  startY = y;

  if (tool === "pencil") {
    context.beginPath();
    context.moveTo(x, y);
  }

  draws.push({
    tool: "pencil",
    startX: x,
    startY: y,
  });
});

// Draw
canvas.addEventListener("mousemove", (e) => {
  if (!drawing) {
    return;
  }

  const { x, y } = getMouseCoord(canvas, e);

  if (tool === "pencil") {
    context.lineTo(x, y);
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.stroke();
  } else {
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
  }
});

// Stop drawing
canvas.addEventListener("mouseup", (e) => {
  if (!drawing) {
    return;
  }
  drawing = false;

  const { x, y } = getMouseCoord(canvas, e);

  if (tool !== "pencil") {
    draws.push({
      id: draws.length - 1,
      tool: tool,
      startX: startX,
      startY: startY,
      endX: x,
      endY: y,
      color: color,
      lineWidth: lineWidth,
    });

    drawShapes();
  }

  shapes_list.innerHTML += `<li id="li-${draws.length - 1}">ID: ${
    draws.length - 1
  } - Tool: ${tool} - Color: ${color} - Line Width: ${lineWidth} - Start X: ${startX} - End X: ${x} - Start Y: ${startY} - End Y: ${y}</li>`;
});

function drawShapes() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = backColor;

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
  const lis = document.querySelectorAll("LI");
  lis.forEach(function (li) {
    li.remove();
  });
});

const btn_save_png = document.querySelector("#expPNG");

btn_save_png.addEventListener("click", (e) => {
  const dataURL = canvas.toDataURL("image/png");
  const anchor = document.createElement("a");
  anchor.href = dataURL;
  anchor.download = "canvas.png";
  anchor.click();
});

const btn_delete_shape = document.querySelector("#submit_delete_id");

btn_delete_shape.addEventListener("click", () => {
  const input_id = document.querySelector("#input_shape_id").value;
  // console.log(input_id);
  // console.log(typeof input_id);

  // draws.forEach((element) => {
  //   console.log(element);
  // });

  if (input_id) {
    const int_id = parseInt(input_id);
    draws.forEach(item => console.log(item.id))
    const shape_to_be_deleted = draws.findIndex((item) => item.id === int_id - 1);
    if (shape_to_be_deleted !== -1) {
      draws.splice(shape_to_be_deleted, 1)
      document.getElementById(`li-${shape_to_be_deleted}`).remove();
      drawShapes();
    }
    else {
      window.alert("Nu exista o forma cu acest ID!")
    }
    
  } 
});

const btn_edit_shape = document.querySelector("#submit_modify_id");

btn_edit_shape.addEventListener("click", () => {
  const edit_id = document.querySelector("#modify_shape_id").value;
  const edit_startX = document.querySelector("#modify_shape_startX").value;
  const edit_startY = document.querySelector("#modify_shape_startY").value;
  const edit_endX = document.querySelector("#modify_shape_endX").value;
  const edit_endY = document.querySelector("#modify_shape_endY").value;
  const edit_line_width = document.querySelector("#modify_shape_line").value;

  if(edit_id && edit_startX && edit_startY && edit_endX && edit_endY && edit_line_width) {
    const int_id = parseInt(edit_id);
    const int_startX = parseFloat(edit_startX)
    const int_startY = parseFloat(edit_startY)
    const int_endX = parseFloat(edit_endX)
    const int_endY = parseFloat(edit_endY)
    const int_line = parseInt(edit_line_width)

    const shape_to_be_edited = draws.find((item) => item.id === int_id - 1);

    if(shape_to_be_edited !== - 1) {
      // shape_to_be_edited.lineWidth = int_startX
      shape_to_be_edited.startX = int_startX
      shape_to_be_edited.startY = int_startY
      shape_to_be_edited.endX = int_endX
      shape_to_be_edited.endY = int_endY
      shape_to_be_edited.lineWidth = int_line;

      document.getElementById(`li-${int_id}`).remove();
      shapes_list.innerHTML += `<li id="li-${int_id}">ID: ${
        int_id
      } - Tool: ${shape_to_be_edited.tool} - Color: ${shape_to_be_edited.color} - Line Width: ${int_line} - Start X: ${int_startX} - End X: ${int_endX} - Start Y: ${int_startY} - End Y: ${int_endY}</li>`

      drawShapes();
    } else {
      window.alert("Nu exista o forma cu acest ID!")
    }
  } else {
    window.alert("Completeaza toate campurile pentru a edit un element")
  }
})
