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
      <h2 className="flex text-4xl items-center justify-center sm:text-5xl md:text-5xl font-bold mb-4 heading-font text-center">
        <span className="hidden sm:block">Commonly</span>
        <span className="script-heading text-xl mr-6 ml-4"> Bought</span>
        Together
      </h2>
      <div className="flex flex-wrap gap-x-4 gap-y-8 text-center justify-start">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </>
  );
};

export default RecommendedProducts;
