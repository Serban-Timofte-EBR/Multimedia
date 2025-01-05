export class ImageEditor {
  /**
   * @type {HTMLCanvasElement}
   */
  #visibleCanvas;

  /**
   * @type {HTMLCanvasElement}
   */
  #offscreenCanvas;

  /**
   * @type {CanvasRenderingContext2D}
   */
  #visibleCanvasContext;

  /**
   * @type {CanvasRenderingContext2D}
   */
  #offscreenCanvasContext;

  /**
   * @param {HTMLCanvasElement} visibleCanvas
   */
  constructor(visibleCanvas) {
    this.#visibleCanvas = visibleCanvas;
    this.#offscreenCanvas = document.createElement("canvas");
    this.#visibleCanvasContext = this.#visibleCanvas.getContext("2d");
    this.#offscreenCanvasContext = this.#offscreenCanvas.getContext("2d");
  }

  /**
   * Changes the current imagine
   * @param {HTMLImageElement} img
   */
  changeImage(img) {
    this.#visibleCanvas.width = this.#offscreenCanvas.width = img.naturalWidth;
    this.#visibleCanvas.height = this.#offscreenCanvas.height =
      img.naturalHeight;

    this.#offscreenCanvasContext.drawImage(img, 0, 0);
    this.changeEffect("normal");
  }

  /**
   * Changes the current effect
   * @param {string} effect
   */
  changeEffect(effect) {
    switch (effect) {
      case "normal":
        this.#normal();
        break;
      case "grayscale":
        this.#grayscale();
        break;
      case "threshold":
        this.#threshold();
        break;
      case "sepia":
        this.#sepia();
        break;
      case "negative":
        this.#negative();
        break;
      case "darker":
        this.#darker(20);
        break;
      case "pixelate":
        this.#pixelate(5);
        break;
    }
  }

  #normal() {
    this.#visibleCanvasContext.drawImage(this.#offscreenCanvas, 0, 0);
  }

  #grayscale() {
    const imageData = this.#offscreenCanvasContext.getImageData(
      0,
      0,
      this.#offscreenCanvas.width,
      this.#offscreenCanvas.height
    );
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      data[i] =
        data[i + 1] =
        data[i + 2] =
          Math.round((data[i] + data[i + 1] + data[i + 2]) / 3);
    }

    this.#visibleCanvasContext.putImageData(imageData, 0, 0);
  }

  #threshold() {
    const imageData = this.#offscreenCanvasContext.getImageData(
      0,
      0,
      this.#offscreenCanvas.width,
      this.#offscreenCanvas.height
    );
    const data = imageData.data;
    const threshold = 128;

    for (let i = 0; i < data.length; i += 4) {
      const average = (data[i] + data[i + 1] + data[i + 2]) / 3;

      let pixelValue;
      if (average > threshold) {
        pixelValue = 255;
      } else {
        pixelValue = 0;
      }

      data[i] = data[i + 1] = data[i + 2] = pixelValue;
    }

    this.#visibleCanvasContext.putImageData(imageData, 0, 0);
  }

  #sepia() {
    const imageData = this.#offscreenCanvasContext.getImageData(
      0,
      0,
      this.#offscreenCanvas.width,
      this.#offscreenCanvas.height
    );
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const rPrime = r * 0.393 + g * 0.769 + b * 0.189;
      const gPrime = r * 0.349 + g * 0.686 + b * 0.168;
      const bPrime = r * 0.272 + g * 0.534 + b * 0.131;

      data[i] = Math.min(255, rPrime);
      data[i + 1] = Math.min(255, gPrime);
      data[i + 2] = Math.min(255, bPrime);
    }

    this.#visibleCanvasContext.putImageData(imageData, 0, 0);
  }

  #negative() {
    const imageData = this.#offscreenCanvasContext.getImageData(
      0,
      0,
      this.#offscreenCanvas.width,
      this.#offscreenCanvas.height
    );
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      data[i] = 255 - data[i];
      data[i + 1] = 255 - data[i + 1];
      data[i + 2] = 255 - data[i + 2];
    }

    this.#visibleCanvasContext.putImageData(imageData, 0, 0);
  }

  #darker(adjusment) {
    const imageData = this.#offscreenCanvasContext.getImageData(
      0,
      0,
      this.#offscreenCanvas.width,
      this.#offscreenCanvas.height
    );
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.max(data[i] - adjusment, 0);
      data[i + 1] = Math.max(data[i + 1] - adjusment, 0);
      data[i + 2] = Math.max(data[i + 2] - adjusment, 0);
    }

    this.#visibleCanvasContext.putImageData(imageData, 0, 0);
  }

  saveImage() {
    const a = document.createElement("a");
    a.download = "edited-image.webp";
    a.href = this.#visibleCanvas.toDataURL("image/webp", 1); // 1 means 100% quality (without data loss)
    a.click();
  }

  #pixelate(blockSize) {
    const canvasW = this.#offscreenCanvas.width;
    const canvasH = this.#offscreenCanvas.height;

    this.#offscreenCanvasContext.drawImage(
      this.#visibleCanvas,
      0,
      0,
      canvasW,
      canvasH
    );

    for (let x = 0; x < canvasW; x += blockSize) {
      for (let y = 0; y < canvasH; y += blockSize) {
        const pixelData = this.#offscreenCanvasContext.getImageData(x, y, 1, 1);
        const r = pixelData.data[0];
        const g = pixelData.data[1];
        const b = pixelData.data[2];

        this.#visibleCanvasContext.fillStyle = `rgb(${r}, ${g}, ${b})`;
        this.#visibleCanvasContext.fillRect(x, y, blockSize, blockSize);
      }
    }
  }
}
