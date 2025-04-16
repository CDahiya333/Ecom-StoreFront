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
      <h2 className="text-4xl sm:text-5xl md:text-5xl font-bold mb-4 heading-font text-center justify-center">
        Commonly <span className="script-heading text-xl"> Bought</span> Together
      </h2>
      <div className="flex flex-wrap gap-8 text-center justify-evenly">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </>
  );
};

export default RecommendedProducts;
