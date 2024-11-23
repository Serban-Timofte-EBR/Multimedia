# Canvas Drawing Project

This project implements a drawing tool using the HTML `<canvas>` element. The user can select different tools, choose colors, adjust line widths, and export drawings in both raster and vector formats. Below is a breakdown of the functionality, where each feature is implemented, and explanations for the logic behind some key parts of the code.

## Feature Breakdown

### 1. Drawing with a single tool (Ellipse) - **1p**

- **Implemented in:** `drawing-library.js`
- **Key Logic:**
  - The ellipse tool is selected by default, allowing the user to draw ellipses immediately. The logic for drawing ellipses is implemented within the `mousemove` event handler in the `canvas.addEventListener('mousemove', ...)` function.
  - **Explanation:**
    ```javascript
    if (drawing_tool === "ellipse") {
      ctx.ellipse(
        start_x,
        start_y,
        Math.abs(x - start_x),
        Math.abs(y - start_y),
        0,
        0,
        Math.PI * 2
      );
    }
    ```
    The `Math.abs` function ensures the width and height of the ellipse are positive, regardless of how the user drags the mouse. This ensures the shape is drawn correctly regardless of the drag direction.

### 2. Drawing with the mouse and preview - **1p**

- **Implemented in:** `drawing-library.js`
- **Key Logic:**
  - The preview feature is handled by clearing the canvas on every `mousemove` event and redrawing the shapes, allowing for live preview as the user draws.
  - **Explanation:**
    ```javascript
    canvas.addEventListener("mousemove", (e) => {
      if (!drawing) return;
      // Redraw all shapes to preview current shape
      drawShapes();
      // Continue drawing the current shape with updated mouse position
    });
    ```
    The `drawShapes` function is responsible for redrawing all previous shapes during the `mousemove` event, providing real-time feedback to the user.

### 3. Multiple tools (Ellipse, Rectangle, Line) - **1.5p**

- **Implemented in:** `drawing-library.js`, `selecting-tools-library.js`
- **Key Logic:**
  - Users can select between different tools (ellipse, rectangle, line) using a dropdown menu. The `drawing_tool` variable is updated to reflect the selected tool, and different drawing logic is applied based on the tool.
  - **Explanation:**
    ```javascript
    document.querySelector("#tool").addEventListener("change", (e) => {
      drawing_tool = e.target.value;
    });
    ```
    The `change` event updates the `drawing_tool` variable, and the appropriate drawing logic is applied during the `mousemove` event.

### 3.1* Drawing Events Logic

- **Implemented in:** `drawing-library.js`
- **Key Logic:**
  - The drawing functionality relies on three main events: `mousedown`, `mousemove`, and `mouseup`. These events are used to track the user's interaction with the canvas and provide live feedback as the user draws shapes with the mouse.
  
  - **Explanation:**
    
    1. **`mousedown` event:**
        - This event fires when the user presses the mouse button down on the canvas. It initiates the drawing process by recording the starting coordinates (`startX`, `startY`). Depending on the selected tool, it either starts a freehand drawing (for the pencil tool) or stores the start point for other shapes like rectangles or ellipses.
        
        ```javascript
        canvas.addEventListener("mousedown", (e) => {
          drawing = true;
          const { x, y } = getMouseCoord(canvas, e);
          startX = x;
          startY = y;

          if (drawing_tool === "pencil") {
            ctx.beginPath();
            ctx.moveTo(x, y);
          }

          draws.push({
            id: identifier++,
            tool: drawing_tool,
            startX: startX,
            startY: startY,
            endX: null,
            endY: null,
            color: color_selected_by_user,
            lineWidth: line_width_selected,
          });
        });
        ```

    2. **`mousemove` event:**
        - This event fires when the user moves the mouse on the canvas while the mouse button is held down. It allows for the real-time rendering of the shape or drawing. For freehand drawing (pencil), the path is continuously updated, while for shapes like rectangles or ellipses, the shape preview is shown by updating the canvas in real-time.

        ```javascript
        canvas.addEventListener("mousemove", (e) => {
          if (!drawing) return;
          const { x, y } = getMouseCoord(canvas, e);

          if (drawing_tool === "pencil") {
            ctx.lineTo(x, y);
            ctx.strokeStyle = color_selected_by_user;
            ctx.lineWidth = line_width_selected;
            ctx.stroke();
          } else {
            draw_shapes(); // Re-draws all shapes to prevent overlap
            ctx.beginPath();
            ctx.strokeStyle = color_selected_by_user;
            ctx.lineWidth = line_width_selected;

            if (drawing_tool === "ellipse") {
              ctx.ellipse(
                startX,
                startY,
                Math.abs(x - startX),
                Math.abs(y - startY),
                0,
                0,
                Math.PI * 2
              );
            } else if (drawing_tool === "rectangle") {
              ctx.rect(startX, startY, x - startX, y - startY);
            } else if (drawing_tool === "line") {
              ctx.moveTo(startX, startY);
              ctx.lineTo(x, y);
            }
            ctx.stroke();
          }
        });
        ```

    3. **`mouseup` event:**
        - This event is triggered when the user releases the mouse button. It completes the drawing process by saving the final coordinates (`endX`, `endY`) of the shape. Afterward, the shape is pushed into the list of drawn objects for persistence, and the canvas is re-rendered.

        ```javascript
        canvas.addEventListener("mouseup", (e) => {
          if (!drawing) return;
          drawing = false;

          const { x, y } = getMouseCoord(canvas, e);
          let current_shape = draws[draws.length - 1]; // Last added shape
          current_shape.endX = x;
          current_shape.endY = y;

          // Update shape list and redraw
          update_shapes_list();
          draw_shapes();
        });
        ``` 

### 4. Color and line width selection - **1p**

- **Implemented in:** `selecting-tools-library.js`
- **Key Logic:**

  - The user can select the stroke color and line width for the shapes using a color picker and number input. These values are updated in the `color_selected_by_user` and `line_width_selected` variables respectively.
  - **Explanation:**

    ```javascript
    document.querySelector("#color").addEventListener("change", (e) => {
      color_selected_by_user = e.target.value;
    });

    document.querySelector("#lineWidth").addEventListener("change", (e) => {
      line_width_selected = e.target.value;
    });
    ```

    These listeners ensure that the color and line width are updated dynamically based on user input and are applied when shapes are drawn.

### 5. Export current image as raster (PNG/JPEG) - **0.5p**

- **Implemented in:** `drawing-library.js`
- **Key Logic:**
  - The `toDataURL` method is used to generate a PNG or JPEG image of the current canvas content, which is then downloaded.
  - **Explanation:**
    ```javascript
    btn_save_png.addEventListener("click", (e) => {
      const dataURL = canvas.toDataURL("image/png");
      const anchor = document.createElement("a");
      anchor.href = dataURL;
      anchor.download = "canvas.png";
      anchor.click();
    });
    ```
    This functionality allows the user to save the current canvas drawing as a PNG file.

### 6. Export current image as vector (SVG) - **1p**

- **Implemented in:** `drawing-library.js`
- **Key Logic:**
  - The export to SVG logic will use the shapes' properties (such as position, dimensions, and color) to construct an SVG file representing the drawn shapes, rather than simply rasterizing the image.
  - **Explanation:** This feature exports the shapes drawn to a true vector format (SVG), retaining the editable properties of each shape. The `createSVG` function is expected to loop through all shapes and create SVG elements corresponding to them.

### 7. Background color selection with option to change after drawing, included in export - **1p**

- **Implemented in:** `drawing-library.js`
- **Key Logic:**
  - The background color of the canvas is set using the `fillRect` method. This color is dynamically updated based on user input and is included in both raster and vector exports.
  - **Explanation:**
    ```javascript
    document.querySelector("#backColor").addEventListener("change", (e) => {
      back_color_selected_by_user = e.target.value;
      drawShapes();
    });
    ```
    The background color is filled on the canvas every time the shapes are redrawn, ensuring it is included in the final export.

### 8. Display list of shapes and ability to delete a shape - **2p**

- **Implemented in:** `drawing-library.js`
- **Key Logic:**
  - The shapes drawn are displayed in a list, and each shape has an ID that allows users to select and delete a specific shape. The `splice` method is used to remove the shape from the array and the canvas is redrawn to reflect the changes.
  - **Explanation:**
    ```javascript
    btn_delete_shape.addEventListener("click", () => {
      const input_id = document.querySelector("#input_shape_id").value;
      const shape_to_be_deleted = draws.findIndex(
        (item) => item.id === parseInt(input_id)
      );
      if (shape_to_be_deleted !== -1) {
        draws.splice(shape_to_be_deleted, 1);
        updateShapesList();
        drawShapes();
      }
    });
    ```
    This functionality allows the user to delete a shape from the canvas and the list.

### 9. Modify shape properties from the list (coordinates, size) - **2p**

- **Implemented in:** `drawing-library.js`
- **Key Logic:**
  - Users can modify the properties (coordinates, dimensions, color, line width) of any shape by entering its ID and the desired changes. The `find` method is used to locate the shape in the `draws` array, and the canvas is redrawn to reflect the modifications.
  - **Explanation:**
    ```javascript
    btn_edit_shape.addEventListener("click", () => {
      const shape_to_be_edited = draws.find(
        (item) => item.id === parseInt(edit_id)
      );
      shape_to_be_edited.startX = parseFloat(edit_startX);
      shape_to_be_edited.startY = parseFloat(edit_startY);
      shape_to_be_edited.endX = parseFloat(edit_endX);
      shape_to_be_edited.endY = parseFloat(edit_endY);
      shape_to_be_edited.lineWidth = parseInt(edit_line_width);
      shape_to_be_edited.color = edit_color;
      updateShapesList();
      drawShapes();
    });
    ```
    This functionality allows users to modify shape attributes through the UI and update the canvas in real-time.
