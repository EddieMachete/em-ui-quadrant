# Quadrant

`<em-ui-quadrant>` is a small, dependency-free web component for viewing very
large images in the browser. Instead of downloading one huge file, it slices the
image into a grid of small tiles and only loads the tiles needed to fill the
visible area, fetching more as the user pans. The approach is borrowed from
slippy map viewers like Google Maps, applied to a single static image, which
makes it well suited to things like high-resolution scans where the full image
is far larger than the viewport.

It was originally written for the Google Polymer framework and has since been
rewritten as a standalone, vanilla custom element with no build step and no
runtime dependencies.

## How it works

The image is expected to be pre-cut into **128×128 pixel tiles**, numbered
sequentially from `1`, left-to-right then top-to-bottom. The component computes
how many tiles cover the full image from `image-width` / `image-height`, then
renders just enough `<img>` tiles to cover the viewport plus a one-tile margin.
As you drag, those same tile elements are repositioned and recycled — their
`src` is rewritten to the tile that should now be visible — so the number of DOM
nodes and in-flight requests stays roughly constant regardless of how large the
source image is.

Tile URLs are assembled as:

```
{resources-uri}{image-prefix}{n}{file-extension}
```

For example, with `resources-uri="images/tiles/"`, `image-prefix="i_l_"`, and
`file-extension=".jpg"`, the first tile is `images/tiles/i_l_1.jpg`.

## Usage

The component ships as native ES modules. Import the element, then use the tag:

```html
<script type="module" src="./src/em-ui-quadrant.js"></script>

<em-ui-quadrant
  resources-uri="images/tiles/"
  image-prefix="i_l_"
  file-extension=".jpg"
  image-width="2048"
  image-height="1367"
  style="width: 640px; height: 480px;"
></em-ui-quadrant>
```

Drag inside the element to pan. Give the element a width and height (via CSS);
it fills whatever box it is given and adapts automatically when that box
resizes.

### Attributes

| Attribute        | Description                                             | Default |
| ---------------- | ------------------------------------------------------- | ------- |
| `resources-uri`  | Base path or URL the tiles are served from.             | `/`     |
| `image-prefix`   | Filename prefix shared by every tile.                   | `i_s_`  |
| `file-extension` | Tile file extension, including the leading dot.         | `.jpg`  |
| `image-width`    | Full image width in pixels (used to lay out the tiles). | `800`   |
| `image-height`   | Full image height in pixels.                            | `534`   |

To swap the displayed image at runtime — for example to switch detail levels —
replace the element with a fresh one carrying the new attributes rather than
mutating them in place.

> `<em-ui-quadrant-canvas>` is an internal implementation detail used by the
> component to render the tile grid. It is not part of the public API and should
> not be used directly.

## Running the demo

A standalone test page lives in [`demo/`](demo/). It loads the bundled tile sets
and lets you pan, resize, and switch between detail levels.

```bash
npm install
npm start
```

This serves the project root and opens the demo in your browser. The page uses
no bundler — it loads the component directly as an ES module.

## License

[MIT](LICENSE)
