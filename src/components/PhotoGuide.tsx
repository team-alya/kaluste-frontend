import { Camera } from "lucide-react";

const PhotoGuide = () => {
  return (
    <div className="flex w-full justify-center">
      <div className="rounded-xl bg-green-50 border-2 border-green-200 md:flex overflow-hidden w-full max-w-md">
        <div className="p-3 border-b border-green-200 md:border-r-2 flex">
          <div className="flex items-center justify-center gap-2 w-full">
            <div className="flex md:flex-col items-center justify-center gap-2">
              <Camera
                className="text-green-600"
                size={24}
                strokeWidth={2}
                aria-hidden="true"
              />
              <h3 className="font-medium text-black">Kuvausohje</h3>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-3 flex-1">
          <div className="flex items-center gap-3 pb-3 border-b border-green-200">
            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-green-600 font-medium">1</span>
            </div>
            <p className="text-sm text-black">
              Varmista, että kaluste on hyvin valaistu ja koko huonekalu näkyy
              kuvassa.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-green-600 font-medium">2</span>
            </div>
            <p className="text-sm text-black">
              Ota kuva kalusteesta suoraan edestä ja hiukan yläviistosta.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoGuide;
