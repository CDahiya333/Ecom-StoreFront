import Coupon from "../models/couponModel.js";

// Fetch all avaiable Coupons for the User that are ACTIVE
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

// Validation Logic to Handle Expiry
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
