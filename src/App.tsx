import {
  ChangeEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import useAsync from "./hooks/use-async";
import { IPFSImageFormatter } from "./utils";

const BASE_URI = "ipfs://QmWiQE65tmpYzcokCheQmng2DCM33DEhjXcPB6PanwpAZo/";

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tokenId, setTokenId] = useState<string | undefined>();
  const [src, setSrc] = useState<string | undefined>(undefined);
  const [converting, setConverting] = useState(false);

  const handleInput: ChangeEventHandler<HTMLInputElement> = useCallback(
    async (e) => {
      setTokenId(e.target.value);
    },
    []
  );

  const fetchImage = useAsync(
    useCallback(async () => {
      if (!tokenId) return;
      const src = await IPFSImageFormatter(BASE_URI + tokenId);
      setSrc(src);
    }, [tokenId])
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !src) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.style.display = "none";
    setConverting(true);
    img.onload = function () {
      ctx.drawImage(img, 0, 0);
      const bgPixel = ctx.getImageData(1, 1, 1, 1);
      const bgData = bgPixel.data;

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (var i = 0; i < data.length; i += 4) {
        if (
          data[i] === bgData[0] &&
          data[i + 1] === bgData[1] &&
          data[i + 2] === bgData[2]
        ) {
          data[i] = 162;
          data[i + 1] = 154;
          data[i + 2] = 238;
        }
      }
      ctx.putImageData(imageData, 0, 0);
      setConverting(false);
    };
  }, [src]);

  return (
    <div className="w-screen min-h-screen flex flex-col justify-center items-center font-inter  px-5 ">
      <h1 className="font-medium text-2xl md:text-3xl mb-5 text-label-2">
        Convert Mfers Background
      </h1>
      <div className="flex items-center mb-5">
        <input
          type="text"
          onChange={handleInput}
          className="p-3 text-label-2 placeholder:text-label-3 font-medium border-2 border-label-3 rounded-md focus:outline-none h-12"
          placeholder="Token ID"
        />
        <button
          role="button"
          onClick={fetchImage.execute}
          className="p-3 bg-background text-label-2 font-semibold ml-2 w-[120px] rounded-md"
        >
          {fetchImage.status === "pending" ? "Converting..." : "Convert"}
        </button>
      </div>
      <div className="w-[400px] h-[400px] relative">
        <canvas
          ref={canvasRef}
          width={1000}
          height={1000}
          className={"w-[400px] h-[400px]"}
        />
        {(converting || fetchImage.status === "pending") && (
          <div className="w-full h-full bg-black/50 absolute top-0 left-0 flex">
            <span className="text-white font-medium m-auto">Converting...</span>
          </div>
        )}
      </div>

      <div className="flex flex-col text-label-3 font-medium mt-5">
        <div className="flex items-center">
          <span>Step1: Input token ID and click Convert button.</span>
        </div>
        <span>
          Step2: Right click(or long tap on mobile phone) the picture below and
          save it.
        </span>
      </div>

      <footer className="absolute bottom-5 flex text-center items-center  text-sm">
        <span className="text-label-3 opacity-75 font-medium">
          created by &nbsp;
        </span>
        <a className="text-label-3" href="https://twitter.com/sunskyxh">
          @SunskyXH
        </a>
      </footer>
    </div>
  );
}

export default App;
