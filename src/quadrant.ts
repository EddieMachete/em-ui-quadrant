/*
@license
Copyright (c) 2018 Eduardo Echeverria. All rights reserved.
This code may only be used under the MIT license found at https://github.com/EddieMachete/em-ui-quadrant/blob/master/LICENSE
Author: Eduardo Echeverria @eddiemachete
*/
'use strict';

export class Quadrant {
    
    // ToDo: Remove
    private $:any;
    public x:number = 0;
    public y:number = 0;
    private limitX:number = 256;
    private limitY:number = 256;

    public imageWidth:number = 256;
    public imageHeight:number = 256;

    public static get is():string { return 'em-ui-quadrant'; }

    public static get properties():any {
        return {
            resourcesUri: {
                type:String,
                value:'/'
            },
            imagePrefix: {
                type:String,
                value:'i_s_'
            },
            imageHeight: {
                type:Number,
                value: 534
            },
            imageWidth: {
                type:Number,
                value: 800
            },
            thumbnail: {
                type:String,
                value:'finder-thumbnail.jpg'
            },
            thumbnailheight: {
                type:Number,
                value: 77
            },
            thumbnailWidth: {
                type:Number,
                value: 115
            },
            fileExtension: {
                type: String,
                value: '.jpg'
            }
        };
    }

    ready() {
        //super.ready();
    

//     // Get the initial image name used to locate the tiles to initialize the component
//     imageName = this.View.getAttribute('data-image-name');

//     if (!imageName)
//         throw 'sci.quadrant.QuadrantController :: The attribute data-image-name is required';

//     // Get the initial image with
//     var imageWidth = parseInt(this.View.getAttribute('data-image-width'));

//     if (isNaN(imageWidth) || imageWidth < 10)
//         throw 'sci.quadrant.QuadrantController :: The attribute data-image-width for the Quadrant Component is either missing or less than 10';

//     // Get the initial image height
//     var imageHeight = parseInt(this.View.getAttribute('data-image-height'));

//     if (isNaN(imageHeight) || imageHeight < 10)
//         throw 'sci.quadrant.QuadrantController :: The attribute data-image-height for the Quadrant Component is either missing or less than 10';

//     // Get the navigator thumbnail details
//     var thumbnailName = this.View.getAttribute('data-thumbnail-name');
//     var thumbnailWidth = parseInt(this.View.getAttribute('data-thumbnail-width'));
//     var thumbnailHeight = parseInt(this.View.getAttribute('data-thumbnail-height'));

//     this.LimitX = 10;
//     this.LimitY = 10;
//     this.MapStart = { X: 0, Y: 0 };
//     this.LocationStart = { X: 0, Y: 0 };
//     this.DragType = 0;
//     this.ViewModel = new sci.quadrant.QuadrantViewModel(imageName, thumbnailName, imageWidth, imageHeight, thumbnailWidth, thumbnailHeight);
//     var elements = this.GetAllElementsInTargetMatching(this.View, 'data-controller', 'Quadrant');
//     var navigatorButton = null;
//     this.SelectedZoomLevelElement = null;

//     for (var i = 0; i < elements.length; i++) {
//         switch (elements[i].getAttribute('data-name')) {
//             case 'Canvas':
//                 this.Canvas = new sci.quadrant.CanvasController(elements[i], this.ViewModel);
//                 break;
//             case 'Navigator':
//                 this.Navigator = new sci.quadrant.NavigatorController(elements[i], this.ViewModel);
//                 break;
//             case 'ZoomLevel':
//                 this.AddZoomLevel(elements[i]);
//                 break;
//             case 'NavigatorButton':
//                 navigatorButton = elements[i];
//                 break;
//         }
//     }

//     if (!this.Canvas)
//         throw 'sci.quadrant.QuadrantController :: Quadrant was not able to find an element in the specified view with attributes data-controller="Quadrant" and data-name="Canvas"';

//     var that = this;
//     this.Canvas.GetView().onmousedown = function (e) { return that.View_OnMouseDown(e); };
//     document.body.onmouseup = function (e) { return that.Body_OnMouseUp(e); };
//     document.body.onmousemove = function (e) { return that.Body_OnMouseMove(e); };

//     if (this.Navigator)
//         this.Navigator.GetView().onmousedown = function (e) { return that.NavigatorView_OnMouseDown(e); };

//     if (navigatorButton)
//         navigatorButton.onclick = function (e) { return that.NavigatorButton_OnClick(e); };

        this.updateLimits();

//     if (this.Navigator)
//         this.Navigator.ResizeFinder(Math.floor(this.ViewModel.GetThumbnailWidth() * this.Canvas.View.clientWidth / this.ViewModel.GetWidth()), Math.floor(this.ViewModel.GetThumbnailHeight() * this.Canvas.View.clientHeight / this.ViewModel.GetHeight()));
    }

// sci.quadrant.QuadrantController.prototype.GetAllElementsInTargetMatching = function (target, attribute, match) {
//     var matchingElements = [];
//     var allElements = target.getElementsByTagName('*');

//     for (var i = 0; i < allElements.length; i++) {
//         if (allElements[i].getAttribute(attribute) === match)
//             matchingElements.push(allElements[i]);
//     }

//     return matchingElements;
// };

// sci.quadrant.QuadrantController.prototype.AddZoomLevel = function (target) {
//     var imageName = target.getAttribute('data-image-name');

//     if (!imageName)
//         throw 'sci.quadrant.QuadrantController::AddZoomLevel :: A zoom level element is missing the attribute data-image-name';

//     var imageWidth = parseInt(target.getAttribute('data-image-width'));
//     if (isNaN(imageWidth) || imageWidth < 10)
//         throw 'sci.quadrant.QuadrantController::AddZoomLevel :: A zoom level element is missing the attribute data-image-width or its value is less than 10';

//     var imageHeight = parseInt(target.getAttribute('data-image-height'));
//     if (isNaN(imageHeight) || imageHeight < 10)
//         throw 'sci.quadrant.QuadrantController::AddZoomLevel :: A zoom level element is missing the attribute data-image-height or its value is less than 10';

//     var that = this;
//     target.onclick = function (e) {
//         var ev = (e) ? e : window.event;
//         return that.ZoomLevel_Clicked(imageName, imageWidth, imageHeight, ev.target);
//     };
    
//     var classAttribute = target.getAttribute('class');

//     if (classAttribute && /\bselected\b/.test(classAttribute))
//         this.SelectedZoomLevelElement = target;
// };

private updateLimits():void {
    this.limitX = this.imageWidth - this.$.canvas.clientWidth;
    this.limitY = this.imageHeight - this.$.canvas.clientHeight;
}

// sci.quadrant.QuadrantController.prototype.GetMouseLocation = function (e) {
//     // /*IE uses srcElement, others use target*/ var target = e.target != null ? e.target : e.srcElement;
//     var ev = (e) ? e : window.event;
//     var x;
//     var y;

//     if (ev.pageX || ev.pageY) {
//         x = ev.pageX;
//         y = ev.pageY;
//     }
//     else {
//         x = ev.clientX + document.body.scrollLeft - document.body.clientLeft;
//         y = ev.clientY + document.body.scrollTop - document.body.clientTop;
//     }

//     return { X: x, Y: y };
// };

// sci.quadrant.QuadrantController.prototype.ToggleNavigator = function () {
//     if (!this.Navigator)
//         return;

//     var navigatorView = this.Navigator.GetView();
//     navigatorView.style.visibility = (navigatorView.style.visibility === "hidden") ? "visible" : "hidden";
// }

// sci.quadrant.QuadrantController.prototype.SetZoomLevelElementAsSelected = function (element) {
//     if (this.SelectedZoomLevelElement) {
//         this.SelectedZoomLevelElement.className = this.SelectedZoomLevelElement.className.replace(/\s*\bselected\b/g, '');
//     }

//     element.className = element.className && element.className.length > 0 ? element.className + ' selected' : 'selected';
//     this.SelectedZoomLevelElement = element;
// }

// sci.quadrant.QuadrantController.prototype.ZoomLevel_Clicked = function (imageName, imageWidth, imageHeight, element) {
//     if (this.ViewModel.GetWidth() === imageWidth && this.ViewModel.GetHeight() === imageHeight)
//         return;

//     this.SetZoomLevelElementAsSelected(element);

//     var x = Math.round(this.ViewModel.GetX() * imageWidth / this.ViewModel.GetWidth());
//     var y = Math.round(this.ViewModel.GetY() * imageHeight / this.ViewModel.GetHeight());
//     this.ViewModel.UpdateContent(imageName, this.ViewModel.GetThumbnail(), imageWidth, imageHeight, this.ViewModel.GetThumbnailWidth(), this.ViewModel.GetThumbnailHeight());

//     this.UpdateLimits();
//     if (x > this.LimitX) { x = this.LimitX; }
//     if (y > this.LimitY) { y = this.LimitY; }
//     this.ViewModel.SetLocation(x, y);

//     if (this.Navigator) {
//         this.Navigator.ResizeFinder(Math.floor(this.ViewModel.GetThumbnailWidth() * this.Canvas.View.clientWidth / this.ViewModel.GetWidth()), Math.floor(this.ViewModel.GetThumbnailHeight() * this.Canvas.View.clientHeight / this.ViewModel.GetHeight()));

//         if (this.Navigator.View.style.visibility === 'hidden')
//             this.ToggleNavigator();
//     }

//     return false;
// };

// sci.quadrant.QuadrantController.prototype.View_OnMouseDown = function (e) {
//     var location = this.GetMouseLocation(e);
//     this.MapStart.X = this.ViewModel.GetX();
//     this.MapStart.Y = this.ViewModel.GetY();
//     this.LocationStart.X = location.X;
//     this.LocationStart.Y = location.Y;
//     this.DragType = 1;
//     document.body.focus();
    
//     return false;
// };

// sci.quadrant.QuadrantController.prototype.Body_OnMouseUp = function (e) {
//     this.DragType = 0;

//     return true;
// }

// sci.quadrant.QuadrantController.prototype.NavigatorView_OnMouseDown = function (e) {
//     this.DragType = 2;
//     this.Body_OnMouseMove(e);
//     document.body.focus();

//     return false;
// }

// sci.quadrant.QuadrantController.prototype.NavigatorButton_OnClick = function (e) {
//     this.ToggleNavigator();

//     return false;
// }

// sci.quadrant.QuadrantController.prototype.Body_OnMouseMove = function (e) {
    private handleTrack(e) {
//     if (this.DragType === 0)
//         return true;

        let x = e.detail.ddx ? this.x - e.detail.ddx : this.x;
        let y = e.detail.ddy ? this.y - e.detail.ddy : this.y;
//     var location = this.GetMouseLocation(e);
//     var x;
//     var y;

//     if (this.DragType === 1)	// View Drag
//     {
//         x = this.MapStart.X + this.LocationStart.X - location.X;
//         y = this.MapStart.Y + this.LocationStart.Y - location.Y;
//     }
//     else if (this.DragType === 2)	// Navigator Drag
//     {
//         x = Math.round((location.X - this.Navigator.GetView().offsetLeft - this.Navigator.FinderWidth / 2) * this.ViewModel.GetWidth() / this.ViewModel.GetThumbnailWidth());
//         y = Math.round((location.Y - this.Navigator.GetView().offsetTop - this.Navigator.FinderHeight / 2) * this.ViewModel.GetHeight() / this.ViewModel.GetThumbnailHeight());
//     }

     if (x < 0) { x = 0; }
     else if (x > this.limitX) { x = this.limitX; }

     if (y < 0) { y = 0; }
     else if (y > this.limitY) { y = this.limitY; }

     this.x = x;
     this.y = y;
//     this.ViewModel.SetLocation(x, y);

//     return false;
    }
}