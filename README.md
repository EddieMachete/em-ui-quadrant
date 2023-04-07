# Quadrant
Quadrant is a tile base web component which allows viewing an image in different levels of detail while optimizing the download process.
It is based on my interpretation of Google Maps applied to image viewing over the web.
The web component was written in JavaScript for the Google Polymer framework.

## Testing

We are using [Web Test Runner](https://modern-web.dev/docs/test-runner/overview/) for testing.
Since its objective is to test the component as it is to be used on the web,
we are not testing directly on the TypeScript files.
Instead, we are testing the compiled version of the code.

## Storybook

1. Start the assets server with the command `npm run assets-test-server`
2. Start storybook with the command `npm run storybook`
3. Open https://eddiemachete-obscure-winner-69p7vgjx7534x7v-6006.preview.app.github.dev/?path=/story/example-emimageviewercanvas--primary
