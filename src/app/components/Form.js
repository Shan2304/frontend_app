"use client";

import React, { useState } from "react";
import axios from "axios";

export default function Form() {
  const [participants, setParticipants] = useState([
    { role: "BUYER", name: "", email: "" },
    { role: "SELLER", name: "", email: "" },
  ]);
  const [templateId, setTemplateId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Handle participant input change
  const handleParticipantChange = (index, field, value) => {
    const updatedParticipants = [...participants];
    updatedParticipants[index][field] = value;
    setParticipants(updatedParticipants);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const payload = {
        templateId,
        participants: participants.map((participant) => ({
          role: participant.role.toUpperCase(),
          name: participant.name.trim(),
          email: participant.email.trim(),
          test_mode: 1,
        })),
      };

      console.log("Payload sent to backend:", payload); // Debugging step

      const response = await axios.post("http://localhost:5000/documents", payload);

      if (response.status === 200) {
        setMessage("Template sent successfully for signing!");
      } else {
        setMessage("send template");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 flex flex-col justify-between relative">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-white opacity-20 rounded-full animate-pulse blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-purple-300 opacity-30 rounded-full animate-ping blur-2xl"></div>
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-pink-400 opacity-25 rounded-full animate-pulse blur-3xl"></div>
      </div>

      <header className="p-4 bg-white shadow-md text-center z-10">
        <h1 className="text-2xl font-bold text-gray-800">Document Signing Portal</h1>
        <p className="text-sm text-gray-500">Send templates for signing</p>
      </header>

      <main className="flex-grow flex justify-center items-center z-10">
        <form
          className="w-full max-w-md bg-white p-6 rounded-lg shadow-2xl backdrop-blur-md"
          onSubmit={handleSubmit}
        >
          <h2 className="text-lg font-semibold text-gray-700 text-center mb-4">
            Send Template for Signature
          </h2>

          <input
            type="text"
            placeholder="Template ID"
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4 text-gray-800"
            value={templateId}
            onChange={(e) => setTemplateId(e.target.value)}
            required
          />

          {participants.map((participant, index) => (
            <div key={index} className="flex flex-col gap-2 mb-4">
              <select
                className="p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800"
                value={participant.role}
                onChange={(e) =>
                  handleParticipantChange(index, "role", e.target.value)
                }
              >
                <option value="buyer">BUYER</option>
                <option value="seller">SELLER</option>
              </select>
              <input
                type="text"
                placeholder="Name"
                className="p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-gray-100 text-gray-800"
                value={participant.name}
                onChange={(e) =>
                  handleParticipantChange(index, "name", e.target.value)
                }
                required
              />
              <input
                type="email"
                placeholder="Email"
                className="p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-gray-100 text-gray-800"
                value={participant.email}
                onChange={(e) =>
                  handleParticipantChange(index, "email", e.target.value)
                }
                required
              />
            </div>
          ))}

          <button
            type="submit"
            className={`w-full p-3 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition-transform transform hover:scale-105 ${
              loading ? "opacity-50" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send"}
          </button>

          {message && <p className="text-sm text-green-600 mt-4 text-center">{message}</p>}
        </form>
      </main>

      <footer className="p-4 bg-white shadow-md text-center z-10">
        <p className="text-sm text-gray-500">&copy; 2025 Document Signing Portal. All rights reserved.</p>
      </footer>
    </div>
  );
}
