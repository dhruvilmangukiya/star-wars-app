import axios from "axios";
import { toast } from "react-toastify";

export const getStarWarsPeople = async (page) => {
  try {
    const response = await axios.get(
      `https://swapi.dev/api/people/?page=${page}`
    );
    return response.data.results;
  } catch (error) {
    toast.error(error);
  }
};
