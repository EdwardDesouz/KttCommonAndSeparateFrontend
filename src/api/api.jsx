import axios from "axios";

const API = axios.create({
  baseURL: "http://192.168.1.36:8001/",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;
