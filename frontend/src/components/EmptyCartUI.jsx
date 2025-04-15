import React from "react";
import { ShoppingCart } from "lucide-react";
const EmptyCartUI = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <ShoppingCart size={128} className="text-gray-400 mb-4" />
      <p className="text-center text-gray-700">
        So Empty 😔
        <br /> Go Shop some More 😍
      </p>
    </div>
  );
};

export default EmptyCartUI;
