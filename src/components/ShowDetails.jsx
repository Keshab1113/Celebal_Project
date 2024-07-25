import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const ShowDetails = () => {
    const { id } = useParams();
    const [show, setShow] = useState(null);

    useEffect(() => {
        // Fetch show details from your backend API
        fetch(`/api/shows/${id}`)
            .then((res) => res.json())
            .then((data) => setShow(data))
            .catch((error) => console.error("Error fetching show details:", error));
    }, [id]);

    if (!show) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen p-6">
            <h1 className="text-3xl font-semibold mb-6">{show.title}</h1>
            <p className="mb-4">{show.description}</p>
            <Link to={`/book/${show.id}`} className="p-2 bg-blue-500 text-white rounded">Book Now</Link>
        </div>
    );
};

export default ShowDetails;
