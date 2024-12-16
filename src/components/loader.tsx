import { Loader2 } from "lucide-react";

function LoaderAnimation({
  isLoading,
  text,
}: {
  isLoading: boolean;
  text: string;
}) {
  return (
    <div>
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-gray-600">{text}</p>
          </div>
        </div>
      )}
    </div>
  );
}
export default LoaderAnimation;
