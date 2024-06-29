import axios from "axios";
import config from "@/config";
import { GameResult } from "@/types";
import { store } from '@/store';

export async function submitGameResult(gameResult: GameResult) {

  try {
    const response = await axios.post(`${config.apiBaseUrl}/results`, gameResult);
    console.log("HUU");
    const responseData = response.data;
    console.log("HUU");

    store.commit('setRewards', responseData.rewards);

    console.log("Response Data:", responseData);

    return responseData;
  } catch (error) {
    console.error("Error submitting game result:", error);
    throw error;
  }
}
