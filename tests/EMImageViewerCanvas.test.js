import { expect } from '@esm-bundle/chai';
import { EMImageViewerCanvas2 } from "/build/scripts/bundle.js";
import { TestUtils } from "./test-utils.js";

describe('Image Viewer Canvas', () => {
  const canvasAttributes_1 = {
    'file-extension': 'jpg',
    'image-height': '1367',
    'image-prefix': 'i_l_',
    'image-width': '2048',
    'resources-uri': '/build/images/tiles/',
    style: 'height:280px;width: 360px;',
    'tile-width': '128',
  };

  it('adds the EMImageViewerCanvas when no attributes are provided', async () => {
    const imageViewerCanvas = await TestUtils.render(
      EMImageViewerCanvas2.is,
      {style: 'height:280px;width: 360px;'}
    );

    expect(imageViewerCanvas).to.be.ok;
  });

  it('initializes a grid of 4x4 when the component has a width equal 360px to and the height equal to 280px', async () => {
    const attributes = {...canvasAttributes_1};
    const imageViewerCanvas = await TestUtils.render(EMImageViewerCanvas2.is, attributes);
    
    const {shadowRoot} = imageViewerCanvas;
    const rows = shadowRoot.querySelector('[tiles]').children;
    
    expect(rows.length).to.equal(4);
    
    for (let i=0; i<rows.length; i++) {
      expect(rows[i].childElementCount).to.equal(4);
    }
  });

  it('moves the first column to the end when the tile width is 128px and the position changes from {x: 0, y: 0} to {x:129, y:0}', async () => {
    const attributes = {...canvasAttributes_1};
    const imageViewerCanvas = await TestUtils.render(EMImageViewerCanvas2.is, attributes);
    
    const {shadowRoot} = imageViewerCanvas;
    const rows = [...shadowRoot.querySelector('[tiles]').children];
    const firstColumnTiles = rows.map((row) => row.firstElementChild);

    imageViewerCanvas.setLocation(129, 0);

    rows.forEach((row, index) => {
      expect(row.lastElementChild === firstColumnTiles[index]).to.be.ok;
    });
  });

  it('moves the last column to the start when the tile width is 128px and the position changes from {x: 129, y: 0} to {x:0, y:0}', async () => {
    const attributes = {...canvasAttributes_1};
    const imageViewerCanvas = await TestUtils.render(EMImageViewerCanvas2.is, attributes);
    
    const {shadowRoot} = imageViewerCanvas;
    imageViewerCanvas.setLocation(129, 0);

    const rows = [...shadowRoot.querySelector('[tiles]').children];
    const lastColumnTiles = rows.map((row) => row.lastElementChild);

    imageViewerCanvas.setLocation(0, 0);

    rows.forEach((row, index) => {
      expect(row.firstElementChild === lastColumnTiles[index]).to.be.ok;
    });
  });
});
