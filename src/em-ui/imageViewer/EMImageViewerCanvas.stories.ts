import { Story, Meta } from '@storybook/web-components';
import { html } from 'lit-html';
import './EMImageViewerCanvas2';

export default {
  title: 'Example/EMImageViewerCanvas',
   argTypes: {
     backgroundColor: { control: 'color' },
  },
  parameters: {
    layout: 'fullscreen'
  },
} as Meta;

const Template: Story = () => html`
  <em-image-viewer-canvas-2
    file-extension="jpg"
    image-height="1367"
    image-prefix="i_l_"
    image-width="2048"
    resources-uri="/images/tiles/"
    tile-width="128"
    style="width: 100%; height: 100vh;">
  </em-image-viewer-canvas-2>`;

export const Primary = Template.bind({});
