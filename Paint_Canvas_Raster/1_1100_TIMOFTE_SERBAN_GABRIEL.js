// Initial setup for the canvas and its drawing context.
const canvas_element = document.querySelector("#canvas");
const ctx = canvas_element.getContext("2d");

// Define state variables that control drawing behavior, selected tools, and visual properties.
let is_drawing = false;
let start_x, start_y;
let drawing_tool = "ellipse"; // Default drawing tool
let color_selected_by_user = "black"; // Default color for shapes
let line_width_selected = 1; // Default line width
let background_color_selected = "white"; // Default background color
let shape_id = 1; // A unique identifier for each shape

// Store all the shapes drawn on the canvas
let shapes_array = [];
const shape_list_element = document.querySelector("#shapes_list");

/**
 * Retrieve the mouse coordinates relative to the canvas.
 * This ensures that mouse events can be translated into the canvas space, regardless of its position on the page.
 */
function getMouseCoordinates(canvas_element, event) {
  const rect = canvas_element.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

// When the user presses down the mouse, initiate the drawing process.
// This function begins drawing a new shape and stores its starting coordinates.
canvas_element.addEventListener("mousedown", (event) => {
  is_drawing = true;
  const { x, y } = getMouseCoordinates(canvas_element, event);
  start_x = x;
  start_y = y;

  // If the pencil tool is selected, begin a new path for freehand drawing.
  if (drawing_tool === "pencil") {
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  // Add the new shape to the shapes array, marking its start position.
  shapes_array.push({
    id: shape_id++,
    tool: drawing_tool,
    startX: start_x,
    startY: start_y,
    endX: null, // The end coordinates will be set when the user releases the mouse
    endY: null,
    color: color_selected_by_user,
    lineWidth: line_width_selected,
  });
});

/**
 * Render all shapes stored in the shapes_array to the canvas.
 * This function clears the canvas and redraws all the shapes to ensure consistency when shapes are edited, added, or removed.
 */
function renderShapes() {
  ctx.clearRect(0, 0, canvas_element.width, canvas_element.height);
  ctx.fillStyle = background_color_selected;
  ctx.fillRect(0, 0, canvas_element.width, canvas_element.height);

  shapes_array.forEach((shape) => {
    if (shape.endX === null || shape.endY === null) {
      return;
    }

    ctx.beginPath();
    ctx.strokeStyle = shape.color;
    ctx.lineWidth = shape.lineWidth;

    if (shape.tool === "ellipse") {
      ctx.ellipse(
        shape.startX,
        shape.startY,
        Math.abs(shape.endX - shape.startX),
        Math.abs(shape.endY - shape.startY),
        0,
        0,
        Math.PI * 2
      );
    } else if (shape.tool === "rectangle") {
      ctx.rect(
        shape.startX,
        shape.startY,
        shape.endX - shape.startX,
        shape.endY - shape.startY
      );
    } else if (shape.tool === "line") {
      ctx.moveTo(shape.startX, shape.startY);
      ctx.lineTo(shape.endX, shape.endY);
    }
    ctx.stroke();
  });
}

// This event handles mouse movement when drawing shapes.
// For freehand drawing (pencil), it continually draws as the mouse moves.
canvas_element.addEventListener("mousemove", (event) => {
  if (!is_drawing) return;

  const { x, y } = getMouseCoordinates(canvas_element, event);

  if (drawing_tool === "pencil") {
    ctx.lineTo(x, y);
    ctx.strokeStyle = color_selected_by_user;
    ctx.lineWidth = line_width_selected;
    ctx.stroke();
  } else {
    // For other shapes (ellipse, rectangle, line), clear the canvas and render all shapes including the new one.
    renderShapes();
    ctx.beginPath();
    ctx.strokeStyle = color_selected_by_user;
    ctx.lineWidth = line_width_selected;

    if (drawing_tool === "ellipse") {
      ctx.ellipse(
        start_x,
        start_y,
        Math.abs(x - start_x), // Ensure the width (horizontal radius) of the ellipse is positive, regardless of the direction drawn.
        Math.abs(y - start_y), // Ensure the height (vertical radius) of the ellipse is positive, so the ellipse is drawn correctly even if the user drags upward.
        0,
        0,
        Math.PI * 2
      );
    } else if (drawing_tool === "rectangle") {
      ctx.rect(start_x, start_y, x - start_x, y - start_y);
    } else if (drawing_tool === "line") {
      ctx.moveTo(start_x, start_y);
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
});

// When the mouse button is released, finalize the shape's coordinates.
// This stores the final position of the shape and updates the canvas.
canvas_element.addEventListener("mouseup", (event) => {
  if (!is_drawing) return;
  is_drawing = false;

  const { x, y } = getMouseCoordinates(canvas_element, event);

  // Only update the shape's end coordinates if the tool is not "pencil".
  if (drawing_tool !== "pencil") {
    let current_shape = shapes_array[shapes_array.length - 1];
    current_shape.endX = x;
    current_shape.endY = y;

    // Update the shape list and redraw everything
    refreshShapeList();
    renderShapes();
  }
});

/**
 * Updates the shape list displayed in the DOM.
 * This reflects any additions, deletions, or modifications made to the shapes.
 */
function refreshShapeList() {
  shape_list_element.innerHTML = "";

  // For each shape, add an entry to the list showing its properties
  shapes_array.forEach((shape) => {
    shape_list_element.innerHTML += `<li id="li-${shape.id}">ID: ${shape.id} - Tool: ${shape.tool} - Color: ${shape.color} - Line Width: ${shape.lineWidth} - Start X: ${shape.startX} - End X: ${shape.endX} - Start Y: ${shape.startY} - End Y: ${shape.endY}</li>`;
  });
}

// Handle background color change and re-render all shapes.
document.querySelector("#backColor").addEventListener("change", (e) => {
  background_color_selected = e.target.value;
  renderShapes();
});

// Clears the canvas and shape list when the clear button is clicked.
document.getElementById("clear").addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas_element.width, canvas_element.height);
  shapes_array = [];
  shape_list_element.innerHTML = "";
});

// Save the canvas content as a PNG image when the save button is clicked.
const btn_save_png = document.querySelector("#expPNG");

btn_save_png.addEventListener("click", (e) => {
  const data_url = canvas_element.toDataURL("image/png");
  const anchor = document.createElement("a");
  anchor.href = data_url;
  anchor.download = "canvas.png";
  anchor.click();
});

// Save the canvas content as a SVG image when the save button is clicked.
const btn_save_svg = document.querySelector("#exp_svg");

btn_save_svg.addEventListener("click", () => {
  let svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}">
      <rect width="100%" height="100%" fill="${backColor}" />
  `;

  shapes_array.forEach((shape) => {
    if (shape.tool === "ellipse") {
      svg += `
        <ellipse cx="${shape.startX}" cy="${shape.startY}" rx="${Math.abs(
        shape.endX - shape.startX
      )}" ry="${Math.abs(shape.endY - shape.startY)}" 
        stroke="${shape.color}" stroke-width="${shape.lineWidth}" fill="none" />
      `;
    } else if (shape.tool === "rectangle") {
      svg += `
        <rect x="${shape.startX}" y="${shape.startY}" width="${Math.abs(
        shape.endX - shape.startX
      )}" height="${Math.abs(shape.endY - shape.startY)}" 
        stroke="${shape.color}" stroke-width="${shape.lineWidth}" fill="none" />
      `;
    } else if (shape.tool === "line") {
      svg += `
        <line x1="${shape.startX}" y1="${shape.startY}" x2="${shape.endX}" y2="${shape.endY}" 
        stroke="${shape.color}" stroke-width="${shape.lineWidth}" />
      `;
    }
  });

  svg += `</svg>`;

  const svg_blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const svg_url = URL.createObjectURL(svg_blob);
  const download_link = document.createElement("a");
  download_link.href = svg_url;
  download_link.download = "canvas_drawing.svg";
  download_link.click();

  // Clean up the object URL after the download
  URL.revokeObjectURL(svg_url);
});

// Delete a shape from the shapes array based on its ID.
const btn_delete_shape = document.querySelector("#submit_delete_id");

btn_delete_shape.addEventListener("click", () => {
  const input_id = document.querySelector("#input_shape_id").value;
  if (input_id) {
    const int_id = parseInt(input_id);
    const shape_to_be_deleted = shapes_array.findIndex(
      (item) => item.id === int_id
    );

    if (shape_to_be_deleted !== -1) {
      shapes_array.splice(shape_to_be_deleted, 1);
      refreshShapeList();
      renderShapes();
    } else {
      window.alert("No shape found with this ID!");
    }
  }
});

// Allows editing of an existing shape's properties based on its ID.
const btn_edit_shape = document.querySelector("#submit_modify_id");

btn_edit_shape.addEventListener("click", () => {
  const edit_id = document.querySelector("#modify_shape_id").value;
  const edit_start_x = document.querySelector("#modify_shape_startX").value;
  const edit_start_y = document.querySelector("#modify_shape_startY").value;
  const edit_end_x = document.querySelector("#modify_shape_endX").value;
  const edit_end_y = document.querySelector("#modify_shape_endY").value;
  const edit_line_width = document.querySelector("#modify_shape_line").value;
  const edit_color = document.querySelector("#modify_shape_color").value;

  if (
    edit_id &&
    edit_start_x &&
    edit_start_y &&
    edit_end_x &&
    edit_end_y &&
    edit_line_width &&
    edit_color
  ) {
    const int_id = parseInt(edit_id);
    const int_start_x = parseFloat(edit_start_x);
    const int_start_y = parseFloat(edit_start_y);
    const int_end_x = parseFloat(edit_end_x);
    const int_end_y = parseFloat(edit_end_y);
    const int_line_width = parseInt(edit_line_width);

    const shape_to_be_edited = shapes_array.find((item) => item.id === int_id);

    if (shape_to_be_edited) {
      // Update shape's properties based on user input
      shape_to_be_edited.startX = int_start_x;
      shape_to_be_edited.startY = int_start_y;
      shape_to_be_edited.endX = int_end_x;
      shape_to_be_edited.endY = int_end_y;
      shape_to_be_edited.lineWidth = int_line_width;
      shape_to_be_edited.color = edit_color;

      // Update the shape list and re-render the canvas
      refreshShapeList();
      renderShapes();
    } else {
      window.alert("No shape found with this ID!");
    }
  } else {
    window.alert("Please complete all fields to edit the shape.");
  }
});

// Handle user input interactions for selecting drawing tools, colors, and line width.
document.querySelector("#tool").addEventListener("change", (e) => {
  drawing_tool = e.target.value;
  console.log(drawing_tool);
});

document.querySelector("#color").addEventListener("change", (e) => {
  color_selected_by_user = e.target.value;
});

document.querySelector("#lineWidth").addEventListener("change", (e) => {
  line_width_selected = e.target.value;
});
