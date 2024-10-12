class BarChart {
    #canvas;

    /**
     * 
     * @param {HTMLCanvasElement} canvas 
     */
    constructor(canvas) {
        this.#canvas = canvas;
    }

    draw(values) {
        // Folosim context pentru a desena pe canvas (context.fillRect, context.strokeRect, context.clearRect)
        const context =this.#canvas.getContext("2d");
    }
}