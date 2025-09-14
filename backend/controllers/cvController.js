const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

exports.validateCv = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  try {
    const formData = new FormData();
    formData.append("cv", fs.createReadStream(req.file.path)); // match Flask key

    const response = await axios.post("http://127.0.0.1:5001/validate-cv", formData, {
      headers: formData.getHeaders(),
    });

    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "CV validation failed" });
  }
};
