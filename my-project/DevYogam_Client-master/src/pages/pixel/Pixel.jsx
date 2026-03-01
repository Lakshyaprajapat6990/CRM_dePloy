import useMetaPixel from "../../hooks/useMetaPixel";

const pixelId = process.env.REACT_APP_FB_PIXEL_ID;

function Pixel() {
  useMetaPixel(pixelId);
  return <div>Meta Pixel is running.</div>;
}

export default Pixel;
