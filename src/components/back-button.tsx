import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="p-2 text-green-light hover:text-green-dark transition-colors"
      aria-label="Go back"
    >
      <ArrowLeft size={24} />
    </button>
  );
};
