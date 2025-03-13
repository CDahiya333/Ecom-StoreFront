import Coupon from "../models/couponModel.js";
import Product from "../models/productModel.js";
import stripe from "../lib/stripe.js";

export const createCheckoutSession = async (req, res) => {
  try {
    const { products, couponCode } = req.body;
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ json: "Invalid or Empty Array" });
    }
    let totalAmount = 0;
    const lineItems = products.map((product) => {
      const amount = Math.round(product.price * 100);
      totalAmount += amount * product.quantity;

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            images: [product.image],
          },
          unit_amount: amount,
        },
      };
    });

    let coupon = null;
    if (couponCode) {
      coupon = await Coupon.findOne({
        code: couponCode,
        userId: req.user._id,
        isActive: true,
      });
      if (coupon) {
        totalAmount -= Math.round(
          (totalAmount * coupon.discountPercentage) / 100
        );
      }
    }

    const discounts = coupon
      ? [{ coupon: await createStripeCoupon(coupon.discountPercentage) }]
      : [];

    // Creating stripe session to log payment
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "upi", "paypal"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
      discount: discounts,
      metadata: {
        userId: req.user_id.toString(),
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
    // In case user spent more than 200 Dollars give 10% discount
    if (totalAmount >= 20000) {
      await createNewCoupon(req.user._id.toString());
    }
    res.status(200).json({ id: session.id, totalAmount: totalAmount / 10 });
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
// Creating new coupon and saving to db
async function createNewCoupon(userId) {
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

    if (session.payment_status === "paid") {
      // If a coupon was used, mark it as inactive
      if (session.metadata.couponCode) {
        await Coupon.findOneAndUpdate(
          {
            code: session.metadata.couponCode,
            userId: session.metadata.userId,
          },
          { isActive: false }
        );
      }
      const products = JSON.parse(session.metadata.products);
      const newOrder = new Order({
        user: session.metadata.userId,
        products: products.map((p) => ({
          product: p.id,
          quantity: p.quantity,
          price: p.price,
        })),
        totalAmount: session.amount_total / 100,
        stripeSessionId: session.id,
      });
      await newOrder.save();
      res.status(200).json({ message: "Order created successfully" });
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
