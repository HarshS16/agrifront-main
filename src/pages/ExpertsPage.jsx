import { useState } from "react";
import { motion } from "framer-motion";

const ExpertsPage = () => {
    // Random experts data
    const experts = [
        {
            _id: "1",
            name: "John Doe",
            profession: "Agronomist",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyQQ0lKviAx8hg3Q0KWTpfsuRQg_5PFrFpzg&s"
        },
        {
            _id: "2",
            name: "Jane Smith",
            profession: "Horticulturist",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTNjkaQHLXfokbl1GiKnXl6v7GNgnG8rb3JA&s"
        },
        {
            _id: "3",
            name: "Sam Wilson",
            profession: "Entomologist",
            image: "https://www.shutterstock.com/image-photo/smiling-african-american-millennial-businessman-600nw-1437938108.jpg"
        },
        {
            _id: "4",
            name: "Emily Davis",
            profession: "Soil Scientist",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYkoXDY3bU7DweqPS20T11LyFjcXgGiCIxtSt6Ge7Y6GKU1dzLw9PFZg6opGSmlcdVwVs&usqp=CAU"
        },
        {
            _id: "5",
            name: "Michael Brown",
            profession: "Plant Pathologist",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSieLvUXoA0oRQwscvW_2NNih5-NVuXYUdkEQ&s"
        },
        {
            _id: "6",
            name: "Sarah Lee",
            profession: "Agricultural Engineer",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGw-sz_ynsO6fK1gee7Kz13-xZHInABzJrXw&s"
        }
    ];

    return (
        <div className="container mx-auto p-6">
            {/* Title */}
            <h1 className="text-2xl font-bold mb-6">Our Experts</h1>
            
            {/* Grid of Expert Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                {experts.map((expert) => (
                    <motion.div
                        key={expert._id}
                        className="bg-white border rounded-lg shadow-md p-4 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        whileHover={{
                            scale: 1.05,
                            boxShadow: "0 10px 15px rgba(0, 0, 0, 0.1)",
                            backgroundColor: "#f9fafb"
                        }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <img
                            src={expert.image}
                            alt={expert.name}
                            className="w-28 h-28 mx-auto rounded-full object-cover transition-transform duration-300 ease-in-out"
                        />
                        <h3 className="mt-4 font-semibold text-lg">{expert.name}</h3>
                        <p className="text-sm text-gray-600">{expert.profession}</p>
                        
                        {/* Book Appointment Button */}
                        <motion.button
                            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg w-full transition duration-300 ease-in-out transform hover:bg-green-500 hover:cursor-pointer focus:outline-none"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Book Appointment
                        </motion.button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default ExpertsPage;
