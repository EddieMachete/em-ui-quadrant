'use strict';

export class EMImageViewerCanvas2 extends HTMLElement {
  public static get is(): string { return 'em-image-viewer-canvas-2'; }

  public static get observedAttributes(): string[] {
    return [
      'file-extension',
      'image-height',
      'image-prefix',
      'image-width',
      'resources-uri',
      'tile-width',
    ];
  }

  private index: number = 0; // Current position on the image (top/left corner)
  private limitLeft:number = 0;
  private limitRight:number = 256;
  private limitTop:number = 0;
  private limitBottom:number = 256;

  private columns: Array<HTMLElement>[] = [];
  private rows: Array<HTMLElement>[] = [];

  private readonly DEFAULT_TILE_WIDTH: number = 128;
  private tiles: HTMLElement;

  private template: string = `
    <style>
      :host{
        background-color: #CCC;
        border: solid 1px black;
        display: block;
        overflow: hidden;
      }

      [tiles] {
        background-color: rgba(255, 0, 0, .6);
        display: flex;
        flex-direction: column;
        opacity: .6;
        position: absolute;
      }

      [tiles] [row] {
        display: flex;
      }
      
      [tiles] [row] img {
        box-shadow: inset 0 0 2px #000;
      }
    </style>
    <div tiles></div>
  `;

  public get imageHeight(): number {
    return parseInt(this.getAttribute('image-height') ?? '');
  }

  public set imageHeight(value: number) {
    this.setAttribute(
      'image-height',
      (isNaN(value) || value < 10 ? 3 * this.DEFAULT_TILE_WIDTH : value).toString(),
    );

    this.updateLimits(this.imageWidth, this.imageHeight);
    this.updateTiles();
  }

  public get imageWidth(): number {
    return parseInt(this.getAttribute('image-width') ?? '');
  }

  public set imageWidth(value: number) {
    this.setAttribute(
      'image-width',
      (isNaN(value) || value < 10 ? 5 * this.DEFAULT_TILE_WIDTH : value).toString(),
    );

    this.updateLimits(this.imageWidth, this.imageHeight);
    this.updateTiles();
  }

  public get tileWidth(): number {
    return parseInt(this.getAttribute('tile-width') ?? '');
  }

  public set tileWidth(value: number) {
    this.setAttribute(
      'tile-width',
      (isNaN(value) || value < 10 ? this.DEFAULT_TILE_WIDTH : value).toString(),
    );

    this.updateLimits(this.imageWidth, this.imageHeight);
    this.updateTiles();
  }

  public get resourcesUri(): string {
    return this.getAttribute('resources-uri') ?? '';
  }

  public get imagePrefix(): string {
    return this.getAttribute('image-prefix') ?? '';
  }

  public get fileExtension(): string {
    return this.getAttribute('file-extension') ?? '';
  }

  public constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.innerHTML = this.template;

    const tiles: HTMLElement | null = shadowRoot.querySelector('[tiles]');

    if (!tiles) {
      throw new Error('Tiles element missing');
    }

    this.tiles = tiles;

    // this.initializeRequiredAttributes(
    //   3 * this.DEFAULT_TILE_WIDTH,
    //   5 * this.DEFAULT_TILE_WIDTH,
    //   this.DEFAULT_TILE_WIDTH,
    // );

    /* ToDo: Figure out how not to call updateTiles multiple times during initialization */

    this.updateLimits(this.imageWidth, this.imageHeight);
    this.updateTiles();
    this.refreshImage();
  }

  /*
   * We want the source of all basic dimensions to be the attributes.
   * This is desirable as it centrilizes where the values are, without having to create a redundant private variable.
   * It is also good for accessibility as the values are visible in the HTML itself.
  */
  // private initializeRequiredAttributes(imageHeight: number, imageWidth: number, tileWidth: number): void {
  //   if (!this.hasAttribute('image-height')) {
  //     this.imageHeight = imageHeight
  //   }

  //   if (!this.hasAttribute('image-width')) {
  //     this.imageWidth = imageWidth;
  //   }

  //   if (!this.hasAttribute('tile-width')) {
  //     this.tileWidth = tileWidth;
  //   }
  // }

  private updateLimits(imageWidth: number, imageHeight: number): void {
    this.limitLeft = 0;
    this.limitRight = imageWidth - this.offsetWidth;
    this.limitTop = 0;
    this.limitBottom = imageHeight - this.offsetHeight;
  }

  /*
   * I'm thinking of having an HTMLElement as container
   * Inside of it, I'll have other elements as rows.
   */
  private updateTiles(): void {
    const columnCount: number = Math.ceil(this.offsetWidth / this.tileWidth) + 1;
    const rowCount: number = Math.ceil(this.offsetHeight / this.tileWidth) + 1;

    if (!this.tileWidth || !rowCount || !columnCount) {
      console.log(`updateTiles :: ${this.tileWidth} :: rowCount: ${rowCount} :: columnCount: ${columnCount}`);
      return;
    }

    for (let i: number = 0; i < rowCount; i++) {
      if (i < this.tiles.childElementCount) {
        this.updateColumnsInRow(
          this.tiles.childNodes[i] as HTMLElement, columnCount, this.tileWidth
        );
      } else {
        const row = document.createElement('DIV');
        row.setAttributeNode(document.createAttribute('row'));
        this.tiles.append(row);
        this.updateColumnsInRow(row, columnCount, this.tileWidth);
      }
    }
  }
  
  private updateColumnsInRow(row: HTMLElement, columnCount: number, tileWidth: number): void {
    while (row.childElementCount !== columnCount) {
      row.childElementCount < columnCount ? this.addTile(row, tileWidth) : row.lastChild.remove();
    }
  }

  private addTile(target: HTMLElement, tileWidth: number) {
    const tile: HTMLElement = document.createElement('img');
    tile.style.width = `${tileWidth}px`;
    tile.style.height = `${tileWidth}px`;
    tile.draggable = false;
    target.appendChild(tile);
  }

  private refreshImage(): void {
    let index: number = this.index;
    const imageColumnCount: number = Math.ceil(this.imageWidth / this.tileWidth);
    const imageRowCount: number = Math.ceil(this.imageHeight / this.tileWidth);
    const columnCount: number = Math.ceil(this.offsetWidth / this.tileWidth) + 1;
    const rowCount: number = Math.ceil(this.offsetHeight / this.tileWidth) + 1;
    const leap: number = imageColumnCount - columnCount;

    if (!this.imageWidth || !this.imageHeight || !this.tileWidth || !this.offsetHeight || !this.offsetWidth) {
      return;
    }

    const rows: HTMLCollection = this.tiles.children;

    for (let i=0; i<rows.length; i++) {
      const tiles = rows[i].children;

      for (let j = 0; j < tiles.length; j++){
        index++;
        tiles[j].setAttribute('src', `${this.resourcesUri}${this.imagePrefix}${index}.${this.fileExtension}`);
      }

      index += leap;
    }
  }

  public setLocation(x: number, y: number) {
    const tileWidth: number = this.tileWidth;
    const imageColumnCount: number = Math.ceil(this.imageWidth / tileWidth);

    // Ensure that the position does not go below 0 or higher than the image width and height
    const xPos: number = x < this.limitLeft ? this.limitLeft : x > this.limitRight ? this.limitRight : x;
    const yPos: number = y < 0 ? 0 : y > this.imageHeight ? this.imageHeight : y;

    const startingColumn: number = Math.floor(xPos / tileWidth);

    const startingRow: number = Math.floor(yPos / tileWidth);

    // const index:number = this.imageColumnCount * this.previousYPos + this.previousXPos;
    this.tiles.style.left = `${-xPos % tileWidth}px`;
    this.tiles.style.top = `${-yPos % tileWidth}px`;
    const index: number = imageColumnCount * startingRow + startingColumn;

    console.log(index + ' :: ' + xPos);

    if (this.index === index) {
      return;
    }
    
    this.index = index;
    this.refreshImage();
  }

  public attributeChangedCallback(
    name: string,
    oldValue: string,
    newValue: string,
    namespace: string,
  ): void {
    if (oldValue === newValue) {
      return;
    }

    if (name === 'image-height') {
      this.imageHeight = parseInt(newValue);
      return;
    }

    if (name === 'image-width') {
      this.imageWidth = parseInt(newValue);
      return;
    }

    if (name === 'tile-width') {
      this.tileWidth = parseInt(newValue);
      return;
    }
  }
}

window.customElements.define(EMImageViewerCanvas2.is, EMImageViewerCanvas2);
