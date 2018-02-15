/*
@license
Copyright (c) 2018 Eduardo Echeverria. All rights reserved.
This code may only be used under the MIT license found at https://github.com/EddieMachete/em-ui-quadrant/blob/master/LICENSE
Author: Eduardo Echeverria @eddiemachete
*/

'use strict';
import { ResizeObserver } from 'resize-observer-polyfill/src/ResizeObserver';
import { ResizeObserverEntry } from 'resize-observer-polyfill/src/ResizeObserverEntry';

//-- Public Constructor -----------------------------------------------------
export class Canvas extends HTMLElement {
    private blockSide:number = 128;
    private columnCount:number = 1;
    private rowCount:number = 1;
    private width:number = 500;
    private height:number = 300;
    private blocks:HTMLElement[] = [];
    private imageColumnCount:number = 1;
    private imageRowCount:number = 1;
    private index:number = 0; // Current position on the image (top/left corner)
    
    // ToDo: Remove
    private $:any;
    public imagePrefix:string;
    public imageWidth:number;
    public imageHeight:number;
    public resourcesUri:string;
    public fileExtension:string;


    public static get is():string { return 'em-ui-quadrant-canvas'; }

    public static get properties():any {
        return {
            resourcesUri: {
                type:String,
                value:'/'
            },
            fileExtension: {
                type:String,
                value:'.jpg'
            },
            imagePrefix: {
                type: String,
                value: ''
            },
            imageHeight: {
                type:Number,
                value: 320
            },
            imageWidth: {
                type:Number,
                value: 520
            }
        }
    }

    private ready():void {
        console.log('remove $');
        console.log('uncomment the line below');
        //super.ready();

        const resizeObserver:ResizeObserver =
            new ResizeObserver((entries:ResizeObserverEntry[], observer:ResizeObserver) => this.onResize(entries, observer));

        resizeObserver.observe(this);
    }

//     this.View.style.clip = 'rect(0px ' + this.View.clientWidth + 'px ' + this.View.clientHeight + 'px 0px)'; /*Top Right Bottom Left*/


//     this.PreviousX = 0;
//     this.PreviousY = 0;
//     this.ConstantList = '';


//     this.Canvas = document.createElement('div');
//     this.Canvas.style.position = 'absolute';
//     this.Canvas.style.width = (this.View.clientWidth + this.BlockSide) + 'px';
//     this.Canvas.style.height = (this.View.clientHeight + this.BlockSide) + 'px';
//     this.View.appendChild(this.Canvas);

//     this.LimitTop = 0;
//     this.LimitBottom = this.View.clientWidth + this.BlockSide;
//     this.LimitLeft = 0;
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

    private initializeCanvas(width:number, height:number):void {
        this.width = width;
        this.height = height;


    //     if (this.ViewModel.GetWidth() <= w) {
    //         w = (this.ViewModel.GetWidth() - 1);
    //         this.View.style.width = w + 'px';
    //     }

    //     if (this.ViewModel.GetHeight() <= h) {
    //         h = this.ViewModel.GetHeight() - 1;
    //         this.View.style.height = h + 'px';
    //     }

    //     this.LimitRight = this.ViewModel.GetWidth() - w;
    //     this.LimitBottom = this.ViewModel.GetHeight() - this.View.clientHeight;
        this.updateImageColumnsAndRows(this.imageWidth, this.imageHeight);
    //     this.InitializeColumnsAndRows(w, h);
        this.updateBlocks();
        this.refreshImage();
    }

    private updateImageColumnsAndRows(imageWidth:number, imageHeight:number):void {
        this.imageColumnCount = Math.ceil(imageWidth / this.blockSide);
        this.imageRowCount = Math.ceil(imageHeight / this.blockSide);
    }

// sci.quadrant.CanvasController.prototype.InitializeColumnsAndRows = function (w, h) {
//     
// };

    private updateBlocks():void {
        this.columnCount = Math.ceil(this.width / this.blockSide) + 1;
        this.rowCount = Math.ceil(this.height / this.blockSide) + 1;

        const blockCount:number = this.columnCount * this.rowCount;
        const difference:number = blockCount - this.blocks.length;
        let current:number = 0;

        for (let i:number = 0; i < this.rowCount; i++) {
            for (let j:number = 0; j < this.columnCount; j++) {
                if (current < this.blocks.length) {
                    var block = this.blocks[current];
                    block.style.left = (j * this.blockSide) + 'px';
                    block.style.top = (i * this.blockSide) + 'px';
                }
                else { this.addBlock(j * this.blockSide, i * this.blockSide); }

                current++;
            }
        }

        for (let i = difference; i < 0; i++) {
            this.removeBlock();
        }
    }
    
    private refreshImage():void {
        let index:number = this.index;
        const leap:number = this.imageColumnCount - this.columnCount;
        let currentColumn:number = 0;

        for (let i:number = 0; i < this.blocks.length; i++) {
            index++;
            currentColumn++;

//         if (this.ConstantList.indexOf(',' + i + ',') == -1) {
//             this.Blocks[i].style.visibility = 'hidden';
            this.blocks[i].setAttribute('src', `${this.resourcesUri}${this.imagePrefix}${index}${this.fileExtension}`);
//         }

            if (currentColumn == this.columnCount) {
                currentColumn = 0;
                index += leap;
            }
        }

        //this.constantList = '';
    }

    private addBlock(x:number, y:number) {
        const block:HTMLElement = document.createElement('img');
        block.style.width = this.blockSide + 'px';
        block.style.height = this.blockSide + 'px';
        block.style.position = 'absolute';
        block.style.left = x + 'px';
        block.style.top = y + 'px';
        block.onload = () => { this.style.visibility = 'visible'; };
        this.blocks.push(block);
        this.$.content.appendChild(block);
    }

    private removeBlock():void {
        const block:HTMLElement = this.blocks.pop();
        this.$.content.removeChild(block);
    }

    private onResize(entries:ResizeObserverEntry[], observer:ResizeObserver):void {
        for (const entry of entries) {
            if (entry.target.tagName.toUpperCase() === 'EM-UI-QUADRANT-CANVAS') {
                const cs = window.getComputedStyle(entry.target);
                //console.log(entry.contentRect.top,' is ', cs.paddingTop);
                //console.log(entry.contentRect.left,' is ', cs.paddingLeft);
                this.initializeCanvas(parseInt(cs.width.replace(/px/g, '')), parseInt(cs.height.replace(/px/g, '')));
            }

            //if (entry.target.handleResize)
            //    entry.target.handleResize(entry);
        }
    }

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

// sci.quadrant.CanvasController.prototype.ViewModel_LocationChange = function (e) {
//     this.ConstantList = ',';
//     //showRed = true;

//     var x = e.X;
//     if (x < this.LimitLeft) { x = this.LimitLeft; }
//     else if (x > this.LimitRight) { x = this.LimitRight; }

//     var c = Math.floor(x / this.BlockSide);
//     var xDif = c - this.PreviousX;
//     x = x % this.BlockSide;

//     var y = e.Y;
//     if (y < this.LimitTop) { y = this.LimitTop; }
//     else if (y > this.LimitBottom) { y = this.LimitBottom; }

//     var r = Math.floor(y / this.BlockSide);
//     var yDif = r - this.PreviousY;
//     y = y % this.BlockSide;


//     if (Math.abs(yDif) < this.Rows && Math.abs(xDif) < this.Columns && (xDif + yDif) != 0) {
//         var down = yDif < 0;
//         var right = xDif < 0;
//         var rEnd = (down) ? (yDif + this.Rows) * this.Columns : yDif * this.Columns;
//         for (var i = 0; i < rEnd; i++) { this.Blocks.push(this.Blocks.shift()); }

//         if (right) { xDif += this.Columns; }
//         var cStart = (down) ? this.Blocks.length - rEnd : 0;
//         var cEnd = (down) ? this.Blocks.length : this.Blocks.length - rEnd;
//         var p1 = cStart + xDif;
//         var p3 = cStart + this.Columns - 1;
//         var p2 = p3 - xDif;
//         var temp = new Array();

//         for (var i = cStart; i < cEnd; i++) {
//             if (i < p1) {
//                 temp.push(this.Blocks[i]);

//             }
//             else {
//                 this.Blocks[i - xDif] = this.Blocks[i];
//                 if (!right) { this.ConstantList += (i - xDif) + ','; }
//             }

//             if (i > p2) {
//                 this.Blocks[i] = temp.shift();
//                 if (right) { this.ConstantList += i + ','; }
//             }

//             if (i == p3) {
//                 p1 += this.Columns;
//                 p2 += this.Columns;
//                 p3 += this.Columns;
//             }
//         }
//     }
//     else { /*alert('UPDATE ALL');*/ }

//     this.PreviousY = r;
//     this.PreviousX = c;

//     var current = 0;

//     for (var i = 0; i < this.Rows; i++) {
//         for (var j = 0; j < this.Columns; j++) {
//             this.Blocks[current].style.left = parseFloat(j * this.BlockSide - x) + 'px';
//             this.Blocks[current].style.top = parseFloat(i * this.BlockSide - y) + 'px';
//             current++;
//         }
//     }

//     var ix = this.imageColumnCount * this.PreviousY + this.PreviousX;

//     if (this.Index === ix)
//         return;

//     this.Index = ix;
//     this.refreshImage();









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



}