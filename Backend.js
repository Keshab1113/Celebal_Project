const express = require("express");
const bodyParser = require("body-parser");
const Razorpay = require("razorpay");

const app = express();
app.use(bodyParser.json());

const shows = [
    // Sample shows
];

app.get("/api/shows", (req, res) => {
    res.json(shows);
});

app.get("/api/shows/:id", (req, res) => {
    const show = shows.find((show) => show.id === parseInt(req.params.id));
    if (show) {
        res.json({ show, availableSeats: show.availableSeats });
    } else {
        res.status(404).json({ error: "Show not found" });
    }
});

const razorpay = new Razorpay({
    key_id: "YOUR_RAZORPAY_KEY",
    key_secret: "YOUR_RAZORPAY_SECRET"
});

app.post("/api/razorpay/order", async (req, res) => {
    const options = {
        amount: req.body.amount * 100,
        currency: "INR",
        receipt: `receipt_${Date.now()}`
    };
    try {
        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: "Failed to create order" });
    }
});

app.post("/api/razorpay/verify", async (req, res) => {
    const { order_id, razorpay_payment_id, razorpay_signature } = req.body;
    // Verify payment signature and confirm payment
    const isValid = true; // Perform actual validation here
    if (isValid) {
        res.json({ id: `receipt_${Date.now()}` });
    } else {
        res.status(400).json({ error: "Invalid payment" });
    }
});

app.post("/api/bookings", (req, res) => {
    const { showId, seats, receiptId } = req.body;
    const show = shows.find((show) => show.id === showId);
    if (show) {
        show.availableSeats = show.availableSeats.filter((seat) => !seats.includes(seat));
        res.json({ success: true });
    } else {
        res.status(404).json({ error: "Show not found" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
