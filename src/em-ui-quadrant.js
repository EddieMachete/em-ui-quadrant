'use strict';

import './em-ui-quadrant-canvas.js';

const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: flex;
      flex-direction: column;
    }

    .canvas-container {
      background-color: #e2e2e2;
      cursor: grab;
      display: flex;
      flex: 1;
      flex-direction: column;
      min-height: 300px;
      overflow: hidden;
      touch-action: none;
    }

    .canvas-container.dragging {
      cursor: grabbing;
    }

    em-ui-quadrant-canvas {
      flex: 1;
    }
  </style>
  <div class="canvas-container">
    <em-ui-quadrant-canvas id="canvas"></em-ui-quadrant-canvas>
  </div>
`;

export class EmUiQuadrant extends HTMLElement {
  static get observedAttributes() {
    return [
      'resources-uri',
      'image-prefix',
      'file-extension',
      'image-width',
      'image-height',
    ];
  }

  constructor() {
    super();

    this.resourcesUri = '/';
    this.imagePrefix = 'i_s_';
    this.fileExtension = '.jpg';
    this.imageWidth = 800;
    this.imageHeight = 534;

    this.x = 0;
    this.y = 0;
    this.limitX = 256;
    this.limitY = 256;

    this.dragging = false;
    this.lastPointerX = 0;
    this.lastPointerY = 0;

    this.onPointerDown = this.onPointerDown.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerUp = this.onPointerUp.bind(this);

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.container = this.shadowRoot.querySelector('.canvas-container');
    this.canvas = this.shadowRoot.getElementById('canvas');
  }

  connectedCallback() {
    this.syncCanvas();

    this.container.addEventListener('pointerdown', this.onPointerDown);
    this.container.addEventListener('pointermove', this.onPointerMove);
    this.container.addEventListener('pointerup', this.onPointerUp);
    this.container.addEventListener('pointercancel', this.onPointerUp);
  }

  disconnectedCallback() {
    this.container.removeEventListener('pointerdown', this.onPointerDown);
    this.container.removeEventListener('pointermove', this.onPointerMove);
    this.container.removeEventListener('pointerup', this.onPointerUp);
    this.container.removeEventListener('pointercancel', this.onPointerUp);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'resources-uri':
        this.resourcesUri = newValue;
        break;
      case 'image-prefix':
        this.imagePrefix = newValue;
        break;
      case 'file-extension':
        this.fileExtension = newValue;
        break;
      case 'image-width':
        this.imageWidth = Number(newValue);
        break;
      case 'image-height':
        this.imageHeight = Number(newValue);
        break;
    }

    if (this.isConnected) {
      this.syncCanvas();
    }
  }

  syncCanvas() {
    this.canvas.setAttribute('resources-uri', this.resourcesUri);
    this.canvas.setAttribute('image-prefix', this.imagePrefix);
    this.canvas.setAttribute('file-extension', this.fileExtension);
    this.canvas.setAttribute('image-width', this.imageWidth);
    this.canvas.setAttribute('image-height', this.imageHeight);
  }

  updateLimits() {
    this.limitX = Math.max(0, this.imageWidth - this.canvas.clientWidth);
    this.limitY = Math.max(0, this.imageHeight - this.canvas.clientHeight);
  }

  onPointerDown(e) {
    this.dragging = true;
    this.lastPointerX = e.clientX;
    this.lastPointerY = e.clientY;
    this.updateLimits();
    this.container.classList.add('dragging');
    this.container.setPointerCapture(e.pointerId);
  }

  onPointerMove(e) {
    if (!this.dragging) {
      return;
    }

    const ddx = e.clientX - this.lastPointerX;
    const ddy = e.clientY - this.lastPointerY;
    this.lastPointerX = e.clientX;
    this.lastPointerY = e.clientY;

    let x = this.x - ddx;
    let y = this.y - ddy;

    if (x < 0) {
      x = 0;
    } else if (x > this.limitX) {
      x = this.limitX;
    }

    if (y < 0) {
      y = 0;
    } else if (y > this.limitY) {
      y = this.limitY;
    }

    this.x = x;
    this.y = y;
    this.canvas.x = x;
    this.canvas.y = y;
  }

  onPointerUp(e) {
    this.dragging = false;
    this.container.classList.remove('dragging');
    if (this.container.hasPointerCapture(e.pointerId)) {
      this.container.releasePointerCapture(e.pointerId);
    }
  }
}

customElements.define('em-ui-quadrant', EmUiQuadrant);
