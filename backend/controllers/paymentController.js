import Coupon from "../models/couponModel.js";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";
import stripe from "../lib/stripe.js";

export const createCheckoutSession = async (req, res) => {
  try {
    const { products, couponCode } = req.body;
    const userObjectId = req.user._id;
    const userStringId = req.user._id.toString();
    if (!Array.isArray(products) || products.length === 0) {
      console.log("Stuck Here");
      return res.status(400).json({ json: "Invalid or Empty Array" });
    }
    let totalAmount = 0;
    const lineItems = products.map((product) => {
      const amount = Math.round(product.price * 100);
      totalAmount += amount * (product.quantity || 1);

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            images: [product.image],
          },
          unit_amount: amount,
        },
        quantity: product.quantity || 1,
      };
    });

    let discounts = [];
    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode,
        userId: userObjectId,
        isActive: true,
      });
      if (coupon) {
        // Creating a Stripe Coupon
        const stripeCouponId = await createStripeCoupon(
          coupon.discountPercentage
        );
        discounts = [
          {
            coupon: stripeCouponId,
          },
        ];
        // Discounted amount for Metadata
        const discountAmount = Math.round(
          (totalAmount * coupon.discountPercentage) / 100
        );
        totalAmount -= discountAmount;
      }
    }
    // Creating stripe session to log payment
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/purchase-cancelled`,
      discounts: discounts,
      metadata: {
        userId: userStringId,
        couponCode: couponCode || "",
        products: JSON.stringify(
          products.map((p) => ({
            id: p._id,
            quantity: p.quantity,
            price: p.price,
          }))
        ),
      },
    });
    // In case user spent more than 200 Dollars Creating new coupon for next purchase
    if (totalAmount >= 20000) {
      await createNewCoupon(userStringId);
    }
    res.status(200).json({ id: session.id, totalAmount: totalAmount / 100 });
  } catch (error) {
    console.log("Error in checkout", error.message);
    res.status(500).json({ message: error.message });
  }
};

async function createStripeCoupon(discountPercentage) {
  const coupon = await stripe.coupons.create({
    percent_off: discountPercentage,
    duration: "once",
  });
  return coupon.id;
}
// Creating NewCoupon for next purchase
async function createNewCoupon(userId) {
  await Coupon.findOneAndDelete({ userId });
  const newCoupon = new Coupon({
    code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    discountPercentage: 10,
    expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    userId: userId,
  });
  await newCoupon.save();
  return newCoupon;
}

export const checkoutSuccess = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log(session);
    // Checking for exisiting Order
    const existingOrder = await Order.findOne({
      stripeSessionId: session.id,
    });
    if (existingOrder) {
      // Order already exists return instead
      return res.status(200).json({
        success: true,
        message: "Order already exists",
        orderId: existingOrder._id,
      });
    }

    if (session.payment_status === "paid") {
      // Deactivating used Coupon
      if (session.metadata.couponCode) {
        await Coupon.findOneAndUpdate(
          {
            code: session.metadata.couponCode,
            userId: session.metadata.userId,
          },
          { isActive: false }
        );
      }
      // Creating Order entry
      const products = JSON.parse(session.metadata.products);
      const newOrder = new Order({
        user: session.metadata.userId,
        products: products.map((p) => ({
          product: p.id,
          quantity: p.quantity,
          price: p.price,
        })),
        totalAmount: session.amount_total / 100, //Storing in Dollars
        stripeSessionId: session.id,
      });
      await newOrder.save();
      res.status(200).json({
        success: true,
        message:
          "Payment successful, order created, and coupon deactivated if used.",
        orderId: newOrder._id,
      });
    } else {
      res.status(400).json({ message: "Payment not completed" });
    }
  } catch (error) {
    console.log("Error in checkoutSuccess controller", error.message);
    return res
      .status(500)
      .json({ message: "Error encountered during Checkout Success" });
  }
};
