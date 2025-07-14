import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ComingSoon: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
      <h1 className="text-4xl font-bold mb-4 text-orange-600">Coming Soon!</h1>
      <p className="text-lg text-gray-600 mb-8">Tính năng này đang được phát triển. Vui lòng quay lại sau!</p>
      <Button onClick={() => navigate("/")}>Về trang chủ</Button>
    </div>
  );
};

export default ComingSoon; 