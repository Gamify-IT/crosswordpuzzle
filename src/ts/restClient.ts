import { GameResult } from "@/types";
import axios from "axios";
import config from "@/config";

export async function submitGameResult(gameResult: GameResult) {
  return axios.post(`${config.apiBaseUrl}/results`, gameResult);
}
