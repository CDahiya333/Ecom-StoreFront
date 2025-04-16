import React, { useEffect } from "react";
import useCartStore from "../Stores/useCartStore.js";
import CartItemCard from "../components/CartItemCard.jsx";
import useUserStore from "../Stores/useUserStore.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import EmptyCartUI from "../components/EmptyCartUI.jsx";
import RecommendedProducts from "../components/RecommendedProducts.jsx";
import CheckOut from "../components/CheckOut.jsx";
import { ShoppingBag } from "lucide-react";
const CartPage = () => {
  const { cart, getCartItems, isLoading } = useCartStore();

  const { user } = useUserStore();

  useEffect(() => {
    if (user) {
      // Force refresh cart when page loads
      getCartItems();
    }
  }, [getCartItems, user]);

  return (
    <div className="min-h-screen bg-amber-50 text-gray-800 pt-20 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-8">
        {/* Cart Items Section */}
        <div className="flex-1 flex-col flex-wrap">
          {cart.length !== 0 ? (
            <div className=" flex flex-row justify-center items-center text-5xl text-center mt-10 sm:mt-12 md:mt-4 lg:mt-2 script-heading-regular mb-6">
              Cart{" "}
              <ShoppingBag
                className="justify-center items-center text-center script-heading-regular ml-2"
                size={42}
              />
            </div>
          ) : (
            <></>
          )}

          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : cart.length === 0 ? (
            <EmptyCartUI />
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <CartItemCard key={item._id} item={item} />
              ))}
            </div>
          )}
          {/* Recommended Section */}
          {cart.length > 0 && <RecommendedProducts />}
        </div>

        {/* CheckOUT Section */}
        {cart.length <= 0 ? (
          <></>
        ) : (
          <div>
            {/* CheckOut Summary */}
            <CheckOut />
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
