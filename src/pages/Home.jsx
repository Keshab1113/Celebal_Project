import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
    const [shows, setShows] = useState([]);

    useEffect(() => {
        // Fetch shows from your backend API
        fetch("/api/shows")
            .then((res) => res.json())
            .then((data) => setShows(data))
            .catch((error) => console.error("Error fetching shows:", error));
    }, []);

    return (
        <div className="min-h-screen p-6">
            <h1 className="text-3xl font-semibold mb-6">Available Shows</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {shows.map((show) => (
                    <div key={show.id} className="p-4 border rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold mb-2">{show.title}</h2>
                        <p className="mb-4">{show.description}</p>
                        <Link to={`/show/${show.id}`} className="text-blue-500 underline">View Details</Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
