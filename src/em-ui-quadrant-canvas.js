'use strict';

const template = document.createElement('template');
template.innerHTML = `
    <style>
        :host {
            background-color: aquamarine;
            display: block;
            position: relative;
        }
    </style>
    <div id="content"></div>
`;

/**
 * Private tile renderer for <em-ui-quadrant>. Renders a large image as a grid
 * of 128px <img> tiles and recycles them as the viewport pans, so only the
 * visible region is ever downloaded. Not part of the public API.
 */
export class EmUiQuadrantCanvas extends HTMLElement {
  static get observedAttributes() {
    return [
      'resources-uri',
      'file-extension',
      'image-prefix',
      'image-width',
      'image-height',
    ];
  }

  constructor() {
    super();

    this.blockSide = 128;
    this.columnCount = 1;
    this.rowCount = 1;
    this.width = 500;
    this.height = 300;
    this.blocks = [];
    this.imageColumnCount = 1;
    this.imageRowCount = 1;
    this.index = 0; // Current position on the image (top/left corner).
    this.limitLeft = 0;
    this.limitRight = 256;
    this.limitTop = 0;
    this.limitBottom = 256;
    this.previousXPos = 0;
    this.previousYPos = 0;

    this.resourcesUri = '/';
    this.fileExtension = '.jpg';
    this.imagePrefix = '';
    this.imageWidth = 256;
    this.imageHeight = 256;
    this._x = 0;
    this._y = 0;

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.content = this.shadowRoot.getElementById('content');

    this.resizeObserver = new ResizeObserver((entries) =>
      this.onResize(entries),
    );
  }

  get x() {
    return this._x;
  }

  set x(value) {
    this._x = value;
    this.locationChanged(this._x, this._y);
  }

  get y() {
    return this._y;
  }

  set y(value) {
    this._y = value;
    this.locationChanged(this._x, this._y);
  }

  connectedCallback() {
    this.resizeObserver.observe(this);
  }

  disconnectedCallback() {
    this.resizeObserver.disconnect();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'resources-uri':
        this.resourcesUri = newValue;
        break;
      case 'file-extension':
        this.fileExtension = newValue;
        break;
      case 'image-prefix':
        this.imagePrefix = newValue;
        break;
      case 'image-width':
        this.imageWidth = Number(newValue);
        break;
      case 'image-height':
        this.imageHeight = Number(newValue);
        break;
    }
  }

  initializeCanvas(width, height) {
    this.width = width;
    this.height = height;
    this.limitRight = this.imageWidth - this.width;
    this.limitBottom = this.imageHeight - this.height;
    this.updateImageColumnsAndRows(this.imageWidth, this.imageHeight);
    this.updateBlocks();
    this.refreshImage();
  }

  updateImageColumnsAndRows(imageWidth, imageHeight) {
    this.imageColumnCount = Math.ceil(imageWidth / this.blockSide);
    this.imageRowCount = Math.ceil(imageHeight / this.blockSide);
  }

  updateBlocks() {
    this.columnCount = Math.ceil(this.width / this.blockSide) + 1;
    this.rowCount = Math.ceil(this.height / this.blockSide) + 1;
    const blockCount = this.columnCount * this.rowCount;
    const difference = blockCount - this.blocks.length;
    let current = 0;
    for (let i = 0; i < this.rowCount; i++) {
      for (let j = 0; j < this.columnCount; j++) {
        if (current < this.blocks.length) {
          const block = this.blocks[current];
          block.style.left = j * this.blockSide + 'px';
          block.style.top = i * this.blockSide + 'px';
        } else {
          this.addBlock(j * this.blockSide, i * this.blockSide);
        }
        current++;
      }
    }
    for (let i = difference; i < 0; i++) {
      this.removeBlock();
    }
  }

  refreshImage() {
    let index = this.index;
    const leap = this.imageColumnCount - this.columnCount;
    let currentColumn = 0;
    for (let i = 0; i < this.blocks.length; i++) {
      index++;
      currentColumn++;
      if (index <= this.imageColumnCount * this.imageRowCount) {
        this.blocks[i].setAttribute(
          'src',
          `${this.resourcesUri}${this.imagePrefix}${index}${this.fileExtension}`,
        );
        this.blocks[i].style.visibility = 'visible';
      } else {
        this.blocks[i].style.visibility = 'hidden';
      }
      if (currentColumn == this.columnCount) {
        currentColumn = 0;
        index += leap;
      }
    }
  }

  addBlock(x, y) {
    const block = document.createElement('img');
    block.style.width = this.blockSide + 'px';
    block.style.height = this.blockSide + 'px';
    block.style.position = 'absolute';
    block.style.left = x + 'px';
    block.style.top = y + 'px';
    block.draggable = false;
    block.onload = () => {
      this.style.visibility = 'visible';
    };
    this.blocks.push(block);
    this.content.appendChild(block);
  }

  removeBlock() {
    const block = this.blocks.pop();
    this.content.removeChild(block);
  }

  onResize(entries) {
    for (const entry of entries) {
      const { width, height } = entry.contentRect;
      if (!width || !height) {
        continue;
      }
      this.initializeCanvas(Math.floor(width), Math.floor(height));
    }
  }

  locationChanged(x, y) {
    if (x < this.limitLeft) {
      x = this.limitLeft;
    } else if (x > this.limitRight) {
      x = this.limitRight;
    }
    const startingColumn = Math.floor(x / this.blockSide);
    let xDif = startingColumn - this.previousXPos;
    const xPos = x % this.blockSide;
    if (y < this.limitTop) {
      y = this.limitTop;
    } else if (y > this.limitBottom) {
      y = this.limitBottom;
    }
    const startingRow = Math.floor(y / this.blockSide);
    const yDif = startingRow - this.previousYPos;
    const yPos = y % this.blockSide;
    if (
      Math.abs(yDif) < this.rowCount &&
      Math.abs(xDif) < this.columnCount &&
      xDif + yDif !== 0
    ) {
      const movedDown = yDif < 0;
      const movedRight = xDif < 0;
      const lastRow = movedDown
        ? (yDif + this.rowCount) * this.columnCount
        : yDif * this.columnCount;
      for (let i = 0; i < lastRow; i++) {
        this.blocks.push(this.blocks.shift());
      }
      if (movedRight) {
        xDif += this.columnCount;
      }
      const firstColumn = movedDown ? this.blocks.length - lastRow : 0;
      const lastColumn = movedDown
        ? this.blocks.length
        : this.blocks.length - lastRow;
      let p1 = firstColumn + xDif;
      let p3 = firstColumn + this.columnCount - 1;
      let p2 = p3 - xDif;
      const temp = [];
      for (let i = firstColumn; i < lastColumn; i++) {
        if (i < p1) {
          temp.push(this.blocks[i]);
        } else {
          this.blocks[i - xDif] = this.blocks[i];
        }
        if (i > p2) {
          this.blocks[i] = temp.shift();
        }
        if (i == p3) {
          p1 += this.columnCount;
          p2 += this.columnCount;
          p3 += this.columnCount;
        }
      }
    }
    this.previousYPos = startingRow;
    this.previousXPos = startingColumn;
    let current = 0;
    for (let i = 0; i < this.rowCount; i++) {
      for (let j = 0; j < this.columnCount; j++) {
        if (current < this.blocks.length) {
          this.blocks[current].style.left = `${j * this.blockSide - xPos}px`;
          this.blocks[current].style.top = `${i * this.blockSide - yPos}px`;
        }
        current++;
      }
    }
    const index = this.imageColumnCount * this.previousYPos + this.previousXPos;
    if (this.index === index) {
      return;
    }
    this.index = index;
    this.refreshImage();
  }
}

customElements.define('em-ui-quadrant-canvas', EmUiQuadrantCanvas);
