import { useNavigate } from "react-router-dom";
import { RiArrowGoBackFill } from "react-icons/ri";

function BackPage() {
  const navigate = useNavigate();

  return (
    <button className="back-button" onClick={() => navigate(`/index`)}>
      <RiArrowGoBackFill size={18} /> Back
    </button>
  );
}

export default BackPage;