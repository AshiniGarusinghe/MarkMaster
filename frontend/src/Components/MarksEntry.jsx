import React, { useState, useEffect } from "react";
import axios from "axios";

const MarksEntry = () => {
  const [name, setName] = useState("");
  const [marks, setMarks] = useState("");
  const [data, setData] = useState([]);

  // Fetch all entries on load
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios.get("http://localhost:5000/list").then((res) => {
      setData(res.data);
    });
  };

  const handleSubmit = () => {
    if (!name || !marks) {
      alert("❗ Please fill in both fields.");
      return;
    }

    axios
      .post("http://localhost:5000/add", { name, marks })
      .then(() => {
        alert("✅ Student marks added successfully!");
        setName("");
        setMarks("");
        fetchData();
      })
      .catch((err) => {
        console.error(err);
        alert("❌ Failed to add marks.");
      });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;

    axios
      .delete(`http://localhost:5000/delete/${id}`)
      .then(() => {
        alert("🗑️ Entry deleted successfully.");
        fetchData();
      })
      .catch((err) => {
        console.error(err);
        alert("❌ Error deleting entry.");
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-200 p-8 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-green-800 mb-10 drop-shadow-lg">
        FINAL EXAM MARKS 2025
      </h1>

      <div className="bg-white shadow-lg rounded-lg p-6 mb-10 w-full max-w-2xl flex flex-col md:flex-row items-center gap-4">
        <input
          type="text"
          placeholder="Enter Your Name"
          className="w-full md:w-1/2 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Enter Your Marks"
          className="w-full md:w-1/2 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          value={marks}
          onChange={(e) => setMarks(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
        >
          Submit
        </button>
      </div>

      <div className="w-full max-w-3xl bg-white shadow-xl rounded-lg overflow-hidden">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-green-700 text-white uppercase text-sm">
            <tr>
              <th className="px-6 py-3 border-b">No.</th>
              <th className="px-6 py-3 border-b">Student Name</th>
              <th className="px-6 py-3 border-b">Marks</th>
              <th className="px-6 py-3 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry, index) => (
              <tr
                key={entry.id}
                className={index % 2 === 0 ? "bg-gray-100" : "bg-green-50"}
              >
                <td className="px-6 py-4 border-b">{index + 1}</td>
                <td className="px-6 py-4 border-b">{entry.name}</td>
                <td className="px-6 py-4 border-b">{entry.marks}</td>
                <td className="px-6 py-4 border-b text-center">
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MarksEntry;
