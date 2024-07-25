import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { loadRazorpay } from "../razorpay";

const Booking = () => {
    const { id } = useParams();
    const [show, setShow] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [availableSeats, setAvailableSeats] = useState([]);

    useEffect(() => {
        // Fetch show details and available seats from your backend API
        fetch(`/api/shows/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setShow(data.show);
                setAvailableSeats(data.availableSeats);
            })
            .catch((error) => console.error("Error fetching booking data:", error));
    }, [id]);

    const handleSeatSelect = (seat) => {
        if (selectedSeats.includes(seat)) {
            setSelectedSeats(selectedSeats.filter((s) => s !== seat));
        } else {
            setSelectedSeats([...selectedSeats, seat]);
        }
    };

    const handleCheckout = async () => {
        const res = await loadRazorpay();

        if (!res) {
            alert("Razorpay SDK failed to load. Are you online?");
            return;
        }

        const orderData = await fetch("/api/razorpay/order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ amount: selectedSeats.length * show.price })
        }).then((res) => res.json());

        const options = {
            key: "YOUR_RAZORPAY_KEY",
            amount: orderData.amount,
            currency: "INR",
            name: "Ticket Booking",
            description: `Booking for ${show.title}`,
            order_id: orderData.id,
            handler: async (response) => {
                const receipt = await fetch("/api/razorpay/verify", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        order_id: orderData.id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature
                    })
                }).then((res) => res.json());

                // Save booking details to your database
                await fetch("/api/bookings", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        showId: show.id,
                        seats: selectedSeats,
                        receiptId: receipt.id
                    })
                });

                alert("Payment successful! Your booking is confirmed.");
                // Redirect or update UI accordingly
            },
            prefill: {
                name: "Your Name",
                email: "your-email@example.com",
                contact: "1234567890"
            },
            theme: {
                color: "#F37254"
            }
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    };

    if (!show) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen p-6">
            <h1 className="text-3xl font-semibold mb-6">Book Seats for {show.title}</h1>
            <div className="grid grid-cols-8 gap-2 mb-6">
                {availableSeats.map((seat) => (
                    <div
                        key={seat}
                        className={`p-2 border rounded ${selectedSeats.includes(seat) ? "bg-green-500" : "bg-gray-200"}`}
                        onClick={() => handleSeatSelect(seat)}
                    >
                        {seat}
                    </div>
                ))}
            </div>
            <button onClick={handleCheckout} className="p-2 bg-blue-500 text-white rounded">Proceed to Checkout</button>
        </div>
    );
};

export default Booking;
