/**
 * This file handles user input interactions for selecting drawing tools, colors, and line width.
 * It manages event listeners that capture changes in the tool type (ellipse, rectangle, line, pencil),
 * stroke color, and line width, and updates these values accordingly.
 *
 * The logic is separated into this file to keep concerns modular:
 * - This file focuses only on user inputs and updates the corresponding variables.
 * - The actual drawing logic is handled separately in the drawing-library.js file.
 **/
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
