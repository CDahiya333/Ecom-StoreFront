export const checkout = async (req, res) => {
    try {
        const { paymentIntent } = req.body;
        res.json(paymentIntent);
    } catch (error) {
        console.log("Error in checkout", error.message);
        res.status(500).json({ message: error.message });
    }
};