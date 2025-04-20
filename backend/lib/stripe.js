import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();
// Creating Stripe instance using the Secret Key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default stripe;
