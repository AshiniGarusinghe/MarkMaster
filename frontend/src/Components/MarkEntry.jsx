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


}