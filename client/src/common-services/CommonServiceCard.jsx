// src/components/CommonServiceCard.jsx
import { Card } from "/components/ui/card";
import { useNavigate } from "react-router-dom";

const CommonServiceCard = ({ title, description, imgSrc, path }) => {
  const navigate = useNavigate();

  return (
    <Card
      className="hover:shadow-md cursor-pointer transition-transform transform hover:scale-105"
      onClick={() => navigate(path)}
    >
      <img
        src={imgSrc}
        alt={title}
        className="rounded-t-lg w-full h-40 object-cover"
      />
      <div className="p-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-muted">{description}</p>
      </div>
    </Card>
  );
};

export default CommonServiceCard;
