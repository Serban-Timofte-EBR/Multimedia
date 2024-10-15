class BarChart {
  /**
   * The canvas on which the bar chart will be displayed
   */
  #canvas;

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
    const context = this.#canvas.getContext("2d");
    context.clearRect(0, 0, this.#canvas.width, this.#canvas.height);

    const barWidth = this.#canvas.width / values.length;

    const maxValue = Math.max(...values);
    const ratio = this.#canvas.height / maxValue;

    for (let i = 0; i < values.length; i++) {
      const barX = i * barWidth;
      const barHeight = values[i] * ratio * 0.9;
      const barY = this.#canvas.height - barHeight;

      context.fillStyle = "red";
      context.fillRect(barX + barWidth / 4, barY, barWidth / 2, barHeight);

      context.strokeStyle = "orange";
      context.lineWidth = 2;
      context.strokeRect(barX + barWidth / 4, barY, barWidth / 2, barHeight);

      context.fillStyle = "black";
      context.font = "16px Times New Roman";
      context.textAlign = "center";

      const textX = barX + barWidth / 2;
      const textY = barY + 20;

      context.fillText(values[i], textX, textY);
    }
  }
}
