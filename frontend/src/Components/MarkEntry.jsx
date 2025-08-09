import React, { useState, useEffect } from "react";
import axios from "axios";

const MarksEntry = () => {
    // State for input fields
  const [name, setName] = useState("");
  const [marks, setMarks] = useState("");
    // State for storing all student marks data
  const [data, setData] = useState([]);

  // Fetch all entries on load
  useEffect(() => {
    fetchData();
  }, []);

  // Function to fetch all marks data from backend
  const fetchData = () => {
    axios.get("http://localhost:5000/list").then((res) => {
      setData(res.data);
    });
  };


}