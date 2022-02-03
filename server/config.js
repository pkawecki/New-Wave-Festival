API_URL = process.env.NODE_ENV === "production" ? "" : "http://localhost:8000";
module.exports = API_URL;
