/*
@license
Copyright (c) 2018 Eduardo Echeverria. All rights reserved.
This code may only be used under the MIT license found at https://github.com/EddieMachete/em-ui-quadrant/blob/master/LICENSE
Author: Eduardo Echeverria @eddiemachete
*/

'use strict';

export class EMImageViewerCanvas extends HTMLElement {
  // private columnCount:number = 1;
  // private rowCount:number = 1;
  // private width:number = 500;
  // private height:number = 300;
  // private blocks:HTMLElement[] = [];
  // private imageColumnCount:number = 1;
  // private imageRowCount:number = 1;
  private index: number = 0; // Current position on the image (top/left corner)
  // private limitLeft:number = 0;
  // private limitRight:number = 256;
  // private limitTop:number = 0;
  // private limitBottom:number = 256;

  // private previousXPos:number = 0;
  // private previousYPos:number = 0;
  // //private constantList:string = '';

  // // ToDo: Remove
  // private $:any;
  // public imagePrefix:string;
  // public resourcesUri:string;
  // public fileExtension:string;
  // public x:number = 0;
  // public y:number = 0;


  public static get is(): string { return 'em-image-viewer-canvas'; }

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

  private readonly DEFAULT_TILE_WIDTH: number = 128;
  private tiles: HTMLElement;

  private template: string = `
    <style>
      :host{
        background-color: #CCC;
        display: block;
        overflow: hidden;
      }

      [tiles] {
        background-color: rgba(255, 0, 0, .6);
        position: absolute;
        opacity: .6;
      }

      [tiles] img {
        box-shadow: inset 0 0 2px #000;
        float: left;
      }
    </style>
    <div tiles></div>
  `;

  // public static get properties():any {
  //     return {
  //         resourcesUri: {
  //             type:String,
  //             value:'/'
  //         },
  //         fileExtension: {
  //             type:String,
  //             value:'.jpg'
  //         },
  //         imagePrefix: {
  //             type: String,
  //             value: ''
  //         },
  //         imageHeight: {
  //             type:Number,
  //             value: 256
  //         },
  //         imageWidth: {
  //             type:Number,
  //             value: 256
  //         },
  //         x: {
  //             type:Number,
  //             value: 0,
  //             observer: 'xChanged'
  //         },
  //         y: {
  //             type:Number,
  //             value: 0,
  //             observer: 'yChanged'
  //         }
  //     }
  // }

  public get imageHeight(): number {
    return parseInt(this.getAttribute('image-height'));
  }

  public set imageHeight(value: number) {
    this.setAttribute(
      'image-height',
      (isNaN(value) || value < 10 ? 3 * this.DEFAULT_TILE_WIDTH : value).toString(),
    );

    this.updateTiles();
  }

  public get imageWidth(): number {
    return parseInt(this.getAttribute('image-width'));
  }

  public set imageWidth(value: number) {
    this.setAttribute(
      'image-width',
      (isNaN(value) || value < 10 ? 5 * this.DEFAULT_TILE_WIDTH : value).toString(),
    );

    this.updateTiles();
  }

  public get tileWidth(): number {
    return parseInt(this.getAttribute('tile-width'));
  }

  public set tileWidth(value: number) {
    this.setAttribute(
      'tile-width',
      (isNaN(value) || value < 10 ? this.DEFAULT_TILE_WIDTH : value).toString(),
    );

    this.updateTiles();
  }

  public get resourcesUri(): string {
    return this.getAttribute('resources-uri');
  }

  public get imagePrefix(): string {
    return this.getAttribute('image-prefix');
  }

  public get fileExtension(): string {
    return this.getAttribute('file-extension');
  }

  public constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.innerHTML = this.template;

    this.tiles = shadowRoot.querySelector('[tiles]');

    this.initializeRequiredAttributes(
      3 * this.DEFAULT_TILE_WIDTH,
      5 * this.DEFAULT_TILE_WIDTH,
      this.DEFAULT_TILE_WIDTH,
    );

    /* ToDo: Figure out ho not to call updateTiles multiple times during initialization */

    this.updateTiles();
    this.refreshImage();
  }

  /*
   * We want the source of all basic dimensions to be the attributes.
   * This is desirable as it centrilizes where the values are, without having to create a redundant private variable.
   * It is also good for accessibility as the values are visible in the HTML itself.
  */
  private initializeRequiredAttributes(imageHeight: number, imageWidth: number, tileWidth: number): void {
    if (!this.hasAttribute('image-height')) {
      this.imageHeight = imageHeight
    }

    if (!this.hasAttribute('image-width')) {
      this.imageWidth = imageWidth;
    }

    if (!this.hasAttribute('tile-width')) {
      this.tileWidth = tileWidth;
    }
  }

  private ready(): void {

    // const resizeObserver:ResizeObserver =
    //     new ResizeObserver((entries:ResizeObserverEntry[], observer:ResizeObserver) => this.onResize(entries, observer));

    // resizeObserver.observe(this);
  }




  //     this.Canvas = document.createElement('div');
  //     this.Canvas.style.position = 'absolute';
  //     this.Canvas.style.width = (this.View.clientWidth + this.BlockSide) + 'px';
  //     this.Canvas.style.height = (this.View.clientHeight + this.BlockSide) + 'px';
  //     this.View.appendChild(this.Canvas);

  //     this.LimitTop = 0;
  //     this.LimitBottom = this.View.clientWidth + this.BlockSide;
  //     this.LimitRight = this.View.clientHeight + this.BlockSide;

  //     if (viewModel)
  //         this.SetViewModel(viewModel);
  // };

  // sci.quadrant.CanvasController.prototype.SetViewModel = function (viewModel) {
  //     if (this.ViewModel) {
  //         this.ViewModel.RemoveObserver('ContentUpdate', this);
  //         this.ViewModel.RemoveObserver('LocationChanged', this);
  //         this.ViewModel.RemoveObserver('SizeChange', this);
  //     }

  //     this.ViewModel = viewModel;

  //     if (this.ViewModel) {
  //         this.ViewModel.AddObserver('ContentUpdate', this, 'ViewModel_ContentUpdate');
  //         this.ViewModel.AddObserver('LocationChange', this, 'ViewModel_LocationChange');
  //         this.ViewModel.AddObserver('SizeChange', this, 'ViewModel_SizeChange');

  //         this.InitializeCanvas(this.View.clientWidth, this.View.clientHeight);
  //     }
  // };

  private initializeCanvas(width: number, height: number): void {
    // this.width = width;
    // this.height = height;


    //     if (this.ViewModel.GetWidth() <= w) {
    //         w = (this.ViewModel.GetWidth() - 1);
    //         this.View.style.width = w + 'px';
    //     }

    //     if (this.ViewModel.GetHeight() <= h) {
    //         h = this.ViewModel.GetHeight() - 1;
    //         this.View.style.height = h + 'px';
    //     }

    // this.limitRight = this.imageWidth - this.width;
    // this.limitBottom = this.imageHeight - this.height;
    // this.updateImageColumnsAndRows(this.imageWidth, this.imageHeight);
    this.updateTiles();
    // this.refreshImage();
  }

  // private updateImageColumnsAndRows(imageWidth:number, imageHeight:number):void {
  //     this.imageColumnCount = Math.ceil(imageWidth / this.blockSide);
  //     this.imageRowCount = Math.ceil(imageHeight / this.blockSide);
  // }

  private updateTiles():void {
    const tileWidth: number = this.tileWidth;
    const columnCount: number = Math.ceil(this.offsetWidth / tileWidth) + 1;
    const rowCount: number = Math.ceil(this.offsetHeight / tileWidth) + 1;
    this.tiles.style.width = `${columnCount * tileWidth}px`;

    const tileCount: number = columnCount * rowCount;
    const difference: number = tileCount - this.tiles.childElementCount;

    const handler: Function = difference > 0
      ? () => this.addTile(this.tiles, tileWidth)
      : () => this.removeTile(this.tiles);

    while (this.tiles.childElementCount !== tileCount) {
      handler();
    }
  }

  private refreshImage(): void {
    let index: number = this.index;
    const tileWidth: number = this.tileWidth;
    const imageColumnCount: number = Math.ceil(this.imageWidth / tileWidth);
    const imageRowCount: number = Math.ceil(this.imageHeight / tileWidth);
    const columnCount: number = Math.ceil(this.offsetWidth / tileWidth) + 1;
    const leap: number = imageColumnCount - columnCount;
    let currentColumn:number = 0;

    // Based on the image dimensions, the total image blocks available should be:
    const totalBlocksAvailable:number = imageColumnCount * imageRowCount;

    const tiles: HTMLCollection = this.tiles.children;

    for (let i:number = 0; i < tiles.length; i++) {
      index++;
      currentColumn++;
      const tile: HTMLElement = tiles[i] as HTMLElement;

      //if (currentColumn < this.imageColumnCount) {
      if (index < totalBlocksAvailable) {
        tile.setAttribute('src', `${this.resourcesUri}${this.imagePrefix}${index}.${this.fileExtension}`);
        tile.style.visibility = 'visible';
      } else {
        // These blocks are out of range
        tile.style.visibility = 'hidden';
      }

      if (currentColumn == columnCount) {
          currentColumn = 0;
          index += leap;
      }
    }

    //this.constantList = '';
  }

  private addTile(target: HTMLElement, tileWidth: number) {
    const tile: HTMLElement = document.createElement('img');
    tile.style.width = `${tileWidth}px`;
    tile.style.height = `${tileWidth}px`;
    tile.draggable = false;
    target.appendChild(tile);
  }

  private removeTile(target: HTMLElement):void {
    target.removeChild(target.lastChild);
  }

  // private onResize(entries:ResizeObserverEntry[], observer:ResizeObserver):void {
  //     for (const entry of entries) {
  //         if (entry.target.tagName.toUpperCase() === 'EM-UI-QUADRANT-CANVAS') {
  //             const cs = window.getComputedStyle(entry.target);
  //             this.initializeCanvas(parseInt(cs.width.replace(/px/g, '')), parseInt(cs.height.replace(/px/g, '')));
  //         }
  //     }
  // }

  // sci.quadrant.CanvasController.prototype.ViewModel_ContentUpdate = function (e) {
  //     this.InitializeCanvas(this.View.clientWidth, this.View.clientHeight);
  //     this.PreviousX = 0;
  //     this.PreviousY = 0;
  //     this.Index = 0;
  //     this.ConstantList = '';
  //     this.refreshImage();
  // };

  // sci.quadrant.CanvasController.prototype.ViewModel_SizeChange = function (e) {
  //     this.InitializeCanvas(this.View.clientWidth, this.View.clientHeight);
  //     this.PreviousX = this.Columns;
  //     this.PreviousY = this.Rows;
  //     this.Index = 0;
  //     this.ConstantList = '';
  //     this.refreshImage();
  // };

  // private xChanged(newValue:number, oldValue:number) {
  //     this.locationChanged(this.x, this.y);
  // }

  // private yChanged(newValue:number, oldValue:number) {
  //     this.locationChanged(this.x, this.y);
  // }

  public setLocation(x: number, y: number) {
    const tileWidth: number = this.tileWidth;
    const imageColumnCount: number = Math.ceil(this.imageWidth / tileWidth);

    // if (x < this.limitLeft) { x = this.limitLeft; }
    // else if (x > this.limitRight) { x = this.limitRight; }

    const startingColumn: number = Math.floor(x / tileWidth);
    // let xDif:number = startingColumn - this.previousXPos;
    // const xPos: number = x % tileWidth;

    // if (y < this.limitTop) { y = this.limitTop; }
    // else if (y > this.limitBottom) { y = this.limitBottom; }

    const startingRow: number = Math.floor(y / tileWidth);
    // const yDif:number = startingRow - this.previousYPos;
    // const yPos: number = y % tileWidth;


    // if (Math.abs(yDif) < this.rowCount && Math.abs(xDif) < this.columnCount && (xDif + yDif) !== 0) {
    //     const movedDown:boolean = yDif < 0;
    //     const movedRight = xDif < 0;
    //     const lastRow = (movedDown) ? (yDif + this.rowCount) * this.columnCount : yDif * this.columnCount;

    //     // Swap blocks to create the illusion of endless scrolling
    //     for (let i:number = 0; i < lastRow; i++) { this.blocks.push(this.blocks.shift()); }

    //     if (movedRight) { xDif += this.columnCount; }
    //     const firstColumn:number = (movedDown) ? this.blocks.length - lastRow : 0;
    //     const lastColumn:number = (movedDown) ? this.blocks.length : this.blocks.length - lastRow;

    //     let p1:number = firstColumn + xDif;
    //     let p3:number = firstColumn + this.columnCount - 1;
    //     let p2:number = p3 - xDif;
    //     const temp:HTMLElement[] = [];

    //     for (let i:number = firstColumn; i < lastColumn; i++) {
    //         if (i < p1) {
    //             temp.push(this.blocks[i]);
    //         }
    //         else {
    //             this.blocks[i - xDif] = this.blocks[i];
    //             //if (!movedRight) { this.constantList += (i - xDif) + ','; }
    //         }

    //         if (i > p2) {
    //             this.blocks[i] = temp.shift();
    //             //if (movedRight) { this.constantList += i + ','; }
    //         }

    //         if (i == p3) {
    //             p1 += this.columnCount;
    //             p2 += this.columnCount;
    //             p3 += this.columnCount;
    //         }
    //     }
    // }
    // else { /*alert('UPDATE ALL');*/ }

    // this.previousYPos = startingRow;
    // this.previousXPos = startingColumn;

    // let current = 0;

    // for (let i:number = 0; i < this.rowCount; i++) {
    //     for (let j:number = 0; j < this.columnCount; j++) {
    //         if (current < this.blocks.length) {
    //             this.blocks[current].style.left = `${(j * tileWidth - xPos)}px`;
    //             this.blocks[current].style.top = `${(i * tileWidth - yPos)}px`;
    //         }

    //         current++;
    //     }
    // }

    // const index:number = this.imageColumnCount * this.previousYPos + this.previousXPos;
    const index: number = imageColumnCount * startingRow + startingColumn;

    if (this.index === index) {
      return;
    }
    
    this.index = index;
    this.refreshImage();
  }








  // /*--------------------------------------------------------------------------
  // 	@class sci.quadrant.QuadrantViewModel
  // 	@author Eduardo Echeverria
  // 	@version 1.0 February 3rd, 2014
  // 	@description
  //   --------------------------------------------------------------------------
  // */

  // sci.Require('sci.patterns.observer.Observable');
  // sci.Provide('sci.quadrant.QuadrantViewModel');

  // //-- Public Constructor -----------------------------------------------------
  // sci.quadrant.QuadrantViewModel = function (imageName, thumbnail, width, height, thumbnailWidth, thumbnailHeight) {
  //     sci.patterns.observer.Observable.call(this);

  //     this.Width = width;
  //     this.Height = height;
  //     this.ImageName = imageName;
  //     this.Thumbnail = thumbnail;
  //     this.ThumbnailWidth = thumbnailWidth;
  //     this.ThumbnailHeight = thumbnailHeight;

  //     this.PosX = 0;
  //     this.PosY = 0;
  // };

  // //-- Public Methods ---------------------------------------------------------
  // /*--------------------------------------------------------------------------
  // 	@method removeObserver
  // 	@param 
  // 	@description 
  //   --------------------------------------------------------------------------
  // */
  // sci.quadrant.QuadrantViewModel.prototype.GetX = function () {
  //     return this.PosX;
  // };
  // /*--------------------------------------------------------------------------
  // 	@method removeObserver
  // 	@param 
  // 	@description 
  //   --------------------------------------------------------------------------
  // */
  // sci.quadrant.QuadrantViewModel.prototype.SetX = function (x) {
  //     if (this.PosX !== x) {
  //         this.PosX = x;
  //         this.UpdateObservers({ Type: 'LocationChange', X: this.PosX, Y: this.PosY });
  //     }
  // };
  // /*--------------------------------------------------------------------------
  // 	@method removeObserver
  // 	@param 
  // 	@description 
  //   --------------------------------------------------------------------------
  // */
  // sci.quadrant.QuadrantViewModel.prototype.GetY = function () {
  //     return this.PosY;
  // };
  // /*--------------------------------------------------------------------------
  // 	@method removeObserver
  // 	@param 
  // 	@description 
  //   --------------------------------------------------------------------------
  // */
  // sci.quadrant.QuadrantViewModel.prototype.SetY = function (y) {
  //     if (this.PosY !== y) {
  //         this.PosY = y;
  //         this.UpdateObservers({ Type: 'LocationChange', X: this.PosX, Y: this.PosY });
  //     }
  // };
  // /*--------------------------------------------------------------------------
  // 	@method removeObserver
  // 	@param 
  // 	@description 
  //   --------------------------------------------------------------------------
  // */
  // sci.quadrant.QuadrantViewModel.prototype.SetLocation = function (x, y) {
  //     if (this.PosX !== x || this.PosY !== y) {
  //         this.PosX = x;
  //         this.PosY = y;
  //         this.UpdateObservers({ Type: 'LocationChange', X: this.PosX, Y: this.PosY });
  //     }
  // };
  // /*--------------------------------------------------------------------------
  // 	@method removeObserver
  // 	@param 
  // 	@description 
  //   --------------------------------------------------------------------------
  // */
  // sci.quadrant.QuadrantViewModel.prototype.GetWidth = function () {
  //     return this.Width;
  // };
  // /*--------------------------------------------------------------------------
  // 	@method removeObserver
  // 	@param 
  // 	@description 
  //   --------------------------------------------------------------------------
  // */
  // sci.quadrant.QuadrantViewModel.prototype.SetWidth = function (w) {
  //     if (this.Width !== w) {
  //         this.Width = w;
  //         this.UpdateObservers({ Type: 'SizeChange', Width: this.Width, Height: this.Height });
  //     }
  // };
  // /*--------------------------------------------------------------------------
  // 	@method removeObserver
  // 	@param 
  // 	@description 
  //   --------------------------------------------------------------------------
  // */
  // sci.quadrant.QuadrantViewModel.prototype.GetHeight = function () {
  //     return this.Height;
  // };
  // /*--------------------------------------------------------------------------
  // 	@method removeObserver
  // 	@param 
  // 	@description 
  //   --------------------------------------------------------------------------
  // */
  // sci.quadrant.QuadrantViewModel.prototype.SetHeight = function (h) {
  //     if (this.Height !== h) {
  //         this.Height = h;
  //         this.UpdateObservers({ Type: 'SizeChange', Width: this.Width, Height: this.Height });
  //     }
  // };

  // sci.quadrant.QuadrantViewModel.prototype.GetThumbnailWidth = function () {
  //     return this.ThumbnailWidth;
  // };

  // sci.quadrant.QuadrantViewModel.prototype.GetThumbnailHeight = function () {
  //     return this.ThumbnailHeight;
  // };
  // /*--------------------------------------------------------------------------
  // 	@method removeObserver
  // 	@param 
  // 	@description 
  //   --------------------------------------------------------------------------
  // */
  // sci.quadrant.QuadrantViewModel.prototype.SetSize = function (w, h) {
  //     if (this.Width !== w || this.Height !== h) {
  //         this.Width = w;
  //         this.Height = h;
  //         this.UpdateObservers({ Type: 'SizeChange', Width: this.Width, Height: this.Height });
  //     }
  // };

  // sci.quadrant.QuadrantViewModel.prototype.GetImage = function () {
  //     return this.ImageName;
  // };

  // sci.quadrant.QuadrantViewModel.prototype.GetThumbnail = function () {
  //     return this.Thumbnail;
  // };

  // sci.quadrant.QuadrantViewModel.prototype.UpdateContent = function (imageName, thumbnail, width, height, thumbnailWidth, thumbnailHeight) {
  //     this.Width = width;
  //     this.Height = height;
  //     this.ImageName = imageName;
  //     this.Thumbnail = thumbnail;
  //     this.ThumbnailWidth = thumbnailWidth;
  //     this.ThumbnailHeight = thumbnailHeight;

  //     this.UpdateObservers({ Type: 'ContentUpdate' });
  // };




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

window.customElements.define(EMImageViewerCanvas.is, EMImageViewerCanvas);
