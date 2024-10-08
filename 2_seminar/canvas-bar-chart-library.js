class BarChar {
  /**
   * The canvas on which the bar chart will be displayed
   */
  #canvas; //private attribute

  // Comentariu JSDoc pentru a face type in Vanilla JS -> type-ul nu se aplica in browser
  /**
   * Constructs a new instance
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    this.#canvas = canvas;
  }

  /**
   * Draws the bar chart
   * @param {Array<number>} values
   */
  draw(values) {
    const contex = this.#canvas.getContext("2d");

    const barWidth = this.#canvas.width / values.length;

    const maxValue = Math.max(...values);
    const ratio = this.#canvas.height / maxValue;

    for (let i = 0; i < values.length; i++) {
      const barX = barWidth * i;
      const barHeight = values[i] * ratio * 0.9;    // 0.9 is a scaling factor
      const barY = this.#canvas.height - barHeight;

      contex.fillRect(barX + barWidth / 4, barY, barWidth / 2, barHeight);  // barWidth / 4 and barWidth / 2 are scaling factors
    }
  }
}
