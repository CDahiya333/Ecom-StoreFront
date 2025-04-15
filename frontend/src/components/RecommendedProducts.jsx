import React, { useEffect } from "react";
import LoadingSpinner from "./LoadingSpinner";
import ProductCard from "./productCard";
import useProductStore from "../Stores/useProductStore";

const RecommendedProducts = () => {
  const { products, fetchRecommendations, loading } = useProductStore();
  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);
  if (loading) return <LoadingSpinner />;
  return (
    <>
      <h2 className="text-2xl font-bold mb-4 heading-font">
        Our <span className="script-heading text-xl">Luxurious</span> Selections
      </h2>
      <div className="flex-row text-center justify-evenly">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </>
  );
};

export default RecommendedProducts;
