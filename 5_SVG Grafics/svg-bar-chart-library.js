export class BarChar {
  #svg;
  #svgns;
  /**
   * We receive the element where we render the Bar Char
   * @param {divElement} divElement
   */
  constructor(divElement) {
    this.#svgns = "http://www.w3.org/2000/svg";
    this.#svg = document.createElementNS(this.#svgns, "svg");
    this.#svg.style.backgroundColor = "WhiteSmoke";
    this.#svg.style.border = "2px solid black";
    divElement.appendChild(this.#svg);
  }

  /**
   * We receive the values to draw the Bar Char
   * @param {Array<Array<>>} values
   */
  draw(values) {
    const maxVal = Math.max(...values.map((v) => v[1]));
    const f = this.#svg.clientHeight / maxVal;

    for (let i = 0; i < values.length; i++) {
      const label = values[i][0];
      const value = values[i][1];

      const bar = document.createElementNS(this.#svgns, "rect");

      const barWidth = this.#svg.clientWidth / values.length;
      const barX = i * barWidth;
      const barHeight = value * f;
      const barY = this.#svg.clientHeight - barHeight;

      bar.setAttribute("x", barX);
      bar.setAttribute("y", barY);
      bar.setAttribute("width", barWidth);
      bar.setAttribute("height", barHeight);

      bar.classList.add("bar");

      bar.addEventListener("click", () => {
        alert(`Valoarea este: ${value}`);
      });

      // bar.setAttribute("fill", "yellow");

      // bar.addEventListener("mouseover", () => {
      //   bar.setAttribute("fill", "orange");
      // });

      // bar.addEventListener("mouseout", () => {
      //   bar.setAttribute("fill", "yellow");
      // });

      this.#svg.appendChild(bar);

      const barLabel = document.createElementNS(this.#svgns, "text");
      barLabel.textContent = label;

      const textX = barX + barWidth / 2;
      const textY = this.#svg.clientHeight - 5;

      barLabel.setAttribute("x", textX);
      barLabel.setAttribute("y", textY);
      barLabel.setAttribute("text-anchor", "middle");

      this.#svg.appendChild(barLabel);
    }
  }
}
