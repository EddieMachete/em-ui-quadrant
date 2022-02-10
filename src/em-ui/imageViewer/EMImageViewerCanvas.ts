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
  // private index:number = 0; // Current position on the image (top/left corner)
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
      'image-height',
      'image-width',
      'tile-width',
    ];
  }

  private readonly DEFAULT_TILE_WIDTH: number = 128;
  private tiles: HTMLElement;

  private template: string = `
    <style>
      :host{
        display: block;
      }

      [tiles] {
        position: absolute;
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

  public set imageHeight(value: number) {
    this.setAttribute(
      'image-height',
      (isNaN(value) || value < 10 ? 3 * this.DEFAULT_TILE_WIDTH : value).toString(),
    );

    this.updateTiles();
  }

  public set imageWidth(value: number) {
    this.setAttribute(
      'image-width',
      (isNaN(value) || value < 10 ? 5 * this.DEFAULT_TILE_WIDTH : value).toString(),
    );

    this.updateTiles();
  }

  public set tileWidth(value: number) {
    this.setAttribute(
      'tile-width',
      (isNaN(value) || value < 10 ? this.DEFAULT_TILE_WIDTH : value).toString(),
    );

    this.updateTiles();
  }

  public constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.innerHTML = this.template;

    this.initializeRequiredAttributes(
      3 * this.DEFAULT_TILE_WIDTH,
      5 * this.DEFAULT_TILE_WIDTH,
      this.DEFAULT_TILE_WIDTH,
    );


    this.tiles = shadowRoot.querySelector('[tiles]');
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
  //     this.columnCount = Math.ceil(this.width / this.blockSide) + 1;
  //     this.rowCount = Math.ceil(this.height / this.blockSide) + 1;

  //     const blockCount:number = this.columnCount * this.rowCount;
  //     const difference:number = blockCount - this.blocks.length;
  //     let current:number = 0;

  //     for (let i:number = 0; i < this.rowCount; i++) {
  //         for (let j:number = 0; j < this.columnCount; j++) {
  //             if (current < this.blocks.length) {
  //                 var block = this.blocks[current];
  //                 block.style.left = (j * this.blockSide) + 'px';
  //                 block.style.top = (i * this.blockSide) + 'px';
  //             }
  //             else { this.addBlock(j * this.blockSide, i * this.blockSide); }

  //             current++;
  //         }
  //     }

  //     for (let i = difference; i < 0; i++) {
  //         this.removeBlock();
  //     }
  }

  private refreshImage(): void {
    // let index:number = this.index;
    // const leap:number = this.imageColumnCount - this.columnCount;
    // let currentColumn:number = 0;

    // // Based on the image dimensions, the total image blocks available should be:
    // const totalBlocksAvailable:number = this.imageColumnCount * this.imageRowCount;

    // for (let i:number = 0; i < this.blocks.length; i++) {
    //     index++;
    //     currentColumn++;

    //     //if (currentColumn < this.imageColumnCount) {
    //     if (index < totalBlocksAvailable) {
    //         this.blocks[i].setAttribute('src', `${this.resourcesUri}${this.imagePrefix}${index}${this.fileExtension}`);
    //         this.blocks[i].style.visibility = 'visible';
    //     } else {
    //         // These blocks are out of range
    //         this.blocks[i].style.visibility = 'hidden';
    //     }

    //     if (currentColumn == this.columnCount) {
    //         currentColumn = 0;
    //         index += leap;
    //     }
    // }

    //this.constantList = '';
  }

  private addBlock(x: number, y: number) {
    // const block:HTMLElement = document.createElement('img');
    // block.style.width = this.blockSide + 'px';
    // block.style.height = this.blockSide + 'px';
    // block.style.position = 'absolute';
    // block.style.left = x + 'px';
    // block.style.top = y + 'px';
    // block.draggable = false;
    // block.onload = () => { this.style.visibility = 'visible'; };
    // this.blocks.push(block);
    // this.$.content.appendChild(block);
  }

  // private removeBlock():void {
  //     const block:HTMLElement = this.blocks.pop();
  //     this.$.content.removeChild(block);
  // }

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

  private locationChanged(x: number, y: number) {
    //     this.ConstantList = ',';
    //     //showRed = true;

    // if (x < this.limitLeft) { x = this.limitLeft; }
    // else if (x > this.limitRight) { x = this.limitRight; }

    // const startingColumn:number = Math.floor(x / this.blockSide);
    // let xDif:number = startingColumn - this.previousXPos;
    // const xPos:number = x % this.blockSide;

    // if (y < this.limitTop) { y = this.limitTop; }
    // else if (y > this.limitBottom) { y = this.limitBottom; }

    // const startingRow:number = Math.floor(y / this.blockSide);
    // const yDif:number = startingRow - this.previousYPos;
    // const yPos:number = y % this.blockSide;


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
    //             this.blocks[current].style.left = `${(j * this.blockSide - xPos)}px`;
    //             this.blocks[current].style.top = `${(i * this.blockSide - yPos)}px`;
    //         }

    //         current++;
    //     }
    // }

    // const index:number = this.imageColumnCount * this.previousYPos + this.previousXPos;

    // if (this.index === index)
    //     return;

    // this.index = index;
    // this.refreshImage();
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
