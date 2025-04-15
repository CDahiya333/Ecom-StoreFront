import Coupon from "../models/couponModel.js";
export const getCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findOne({
      userId: req.user._id,
      isActive: true,
    });
    res.json(coupon || null);
  } catch (error) {
    console.log("Error in getCoupon:", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

/**
 * Validate a coupon code given in the request body.
 * @param {String} req.body.code - The coupon code to be validated.
 * @return {Object} - The response object with the status code and the message.
 * If the coupon is valid and active, the response will have a 200 status code
 * and contain the coupon code, discount percentage, and a success message.
 * If the coupon is invalid or inactive, the response will have a 404 status code
 * and contain an appropriate error message.
 */
// TODO: Implement Coupon Deactivation after successful Purchase
export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({
      code: code,
      userId: req.user,
      isActive: true,
    });

    if (!coupon) {
      return res.status(404).json("Coupon Not Found");
    }

    if (coupon.expirationDate < new Date()) {
      coupon.isActive = false;
      await coupon.save();
      return res.status(404).json({ message: "Coupon has expired" });
    }

    // Coupon is valid and Active
    res.json({
      message: "Valid Coupon",
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
    });
  } catch (error) {
    console.log("Error in ValidateCoupon ", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};
