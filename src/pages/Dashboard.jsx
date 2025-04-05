import { useEffect, useState } from "react";

const Dashboard = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedReport, setSelectedReport] = useState(null);
    const [aiResponse, setAiResponse] = useState(null);
    const [loadingAI, setLoadingAI] = useState(false);
    const [showAIResponse, setShowAIResponse] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState("English");

    // Chatbot States
    const [showChat, setShowChat] = useState(false);
    const [chatInput, setChatInput] = useState("");
    const [chatResponse, setChatResponse] = useState("");

    useEffect(() => {
        const fetchReports = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("No authentication token found.");
                setLoading(false);
                return;
            }

            try {
                const res = await fetch("https://agriback-mj37.onrender.com/api/reports", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                });

                if (!res.ok) {
                    throw new Error(`Failed to fetch reports: ${res.status}`);
                }

                const data = await res.json();
                setReports(Array.isArray(data) ? data : data.reports || []);
            } catch (error) {
                console.error("Error fetching reports:", error);
                setError(`Error fetching reports: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    const handleKnowMore = async () => {
        if (!selectedReport || !selectedReport.analysisResult) {
            setAiResponse("No valid analysis result available.");
            return;
        }

        setShowAIResponse(true);
        setLoadingAI(true);
        setAiResponse(null);

        const queryPayload = {
            query: `Explain ${selectedReport.analysisResult}. Provide its cure and prevention.`,
            language: selectedLanguage
        };

        try {
            const res = await fetch("https://agriback-mj37.onrender.com/api/gemini", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(queryPayload)
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Failed to fetch AI response. Status: ${res.status}, Message: ${errorText}`);
            }

            const data = await res.json();
            setAiResponse(data.result || "No additional details available.");
        } catch (error) {
            console.error("Error fetching AI response:", error);
            setAiResponse("Failed to fetch AI details.");
        } finally {
            setLoadingAI(false);
        }
    };

    const handleChatSubmit = async () => {
        if (!chatInput.trim()) return;

        const payload = {
            query: chatInput,
            language: selectedLanguage
        };

        setChatResponse("Thinking...");
        try {
            const res = await fetch("https://agriback-mj37.onrender.com/api/gemini", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            setChatResponse(data.result || "I couldn't find an answer.");
        } catch (error) {
            console.error("Chatbot error:", error);
            setChatResponse("Something went wrong.");
        }

        setChatInput("");
    };

    return (
        <div className="bg-green-50 min-h-screen p-6">
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">Previous Reports</h1>
            <div id="google_translate_element"></div>

            {loading ? (
                <p className="text-gray-600">Loading...</p>
            ) : error ? (
                <p className="text-red-600">{error}</p>
            ) : reports.length === 0 ? (
                <p className="text-gray-600">No reports found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reports.map((report) => (
                        <div
                            key={report._id || report.id}
                            className="bg-white shadow-lg rounded-lg p-4 border border-gray-200 cursor-pointer transition-transform transform hover:scale-105"
                            onClick={() => setSelectedReport(report)}
                        >
                            <img
                                src={report.imageUrl || "/placeholder-image.jpg"}
                                alt="Report"
                                className="w-full h-40 object-cover rounded-md mb-4"
                                onError={(e) => { e.target.src = "/placeholder-image.jpg"; }}
                            />
                            <p className="text-gray-800 font-medium"><strong>Name:</strong> {report.name || "Disease Report"}</p>
                            <p className="text-gray-700"><strong>Status:</strong> {report.status || "Unknown"}</p>
                            {report.status === "Processed" && (
                                <p className="text-gray-600"><strong>Result:</strong> {report.analysisResult || "No results available"}</p>
                            )}
                            <p className="text-gray-500 text-sm mt-2"><strong>Date:</strong> {report.createdAt ? new Date(report.createdAt).toLocaleDateString() : "Unknown date"}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Report Details Modal */}
            {selectedReport && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedReport(null)}>
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative" onClick={(e) => e.stopPropagation()}>
                        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" onClick={() => setSelectedReport(null)}>✕</button>
                        <img src={selectedReport.imageUrl} alt="Full View" className="w-full h-auto rounded-lg mb-4" />
                        <p className="text-gray-800 font-semibold"><strong>Name:</strong> {selectedReport.name || "Disease Report"}</p>
                        <p className="text-gray-700"><strong>Status:</strong> {selectedReport.status || "Unknown"}</p>
                        <p className="text-gray-600"><strong>Result:</strong> {selectedReport.analysisResult || "No results available"}</p>
                        <p className="text-gray-500 text-sm"><strong>Date:</strong> {selectedReport.createdAt ? new Date(selectedReport.createdAt).toLocaleDateString() : "Unknown date"}</p>

                        {/* Language Selector + Know More Button */}
                        <div className="mt-4 flex items-center gap-2">
                            <select
                                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                                value={selectedLanguage}
                                onChange={(e) => setSelectedLanguage(e.target.value)}
                            >
                                <option value="English">English</option>
                                <option value="Hindi">Hindi</option>
                                <option value="Gujarati">Gujarati</option>
                                <option value="Marathi">Marathi</option>
                                <option value="Bengali">Bengali</option>
                                <option value="Telugu">Telugu</option>
                                <option value="Tamil">Tamil</option>
                                <option value="Malayalam">Malayalam</option>
                                <option value="Punjabi">Punjabi</option>
                                <option value="Urdu">Urdu</option>
                            </select>

                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                onClick={handleKnowMore}
                            >
                                Know More
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* AI Response Modal */}
            {showAIResponse && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowAIResponse(false)}>
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative overflow-hidden" onClick={(e) => e.stopPropagation()}>
                        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" onClick={() => setShowAIResponse(false)}>✕</button>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">AI Analysis</h2>
                        <div className="max-h-64 overflow-y-auto border border-gray-300 p-3 rounded-md bg-gray-50 text-gray-700 whitespace-pre-wrap">
                            {loadingAI ? <p className="text-gray-600">Fetching details...</p> : aiResponse}
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Chatbot Button */}
            <div className="fixed bottom-6 right-6 z-50">
                <button
                    onClick={() => setShowChat(!showChat)}
                    className="w-14 h-14 rounded-full bg-green-700 text-white shadow-lg flex items-center justify-center hover:bg-blue-600 transition"
                >
                    💬
                </button>
            </div>

            {/* Chatbot Popup */}
            {showChat && (
                <div className="fixed bottom-24 right-6 w-100 h-70 bg-white rounded-lg shadow-xl z-50 border border-gray-200 flex flex-col">
                    <div className="flex justify-between items-center p-3 bg-green-700 text-white rounded-t-lg">
                        <h2 className="text-xl font-semibold">Ask Agriscan</h2>
                        <button onClick={() => setShowChat(false)} className="text-white hover:text-gray-200">✕</button>
                    </div>
                    <div className="p-3 flex-1 max-h-60 overflow-y-auto text-md text-gray-800 whitespace-pre-wrap">
                        {chatResponse || "Ask me something related to crop health or diseases!"}
                    </div>
                    <div className="p-3 border-t flex gap-2">
                        <input
                            type="text"
                            className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                            placeholder="Type your question..."
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                        />
                        <button
                            onClick={handleChatSubmit}
                            className="bg-green-700 text-white px-3 py-1 rounded hover:bg-green-500 text-md"
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
