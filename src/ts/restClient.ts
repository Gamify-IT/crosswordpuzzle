import {GameAnswer, GameResult} from "@/types";
import axios from "axios";
import config from "@/config";
import store from "@/store/indexTwo";

export async function submitGameResult(gameResult: GameResult) {
  return axios.post(`${config.apiBaseUrl}/results`, gameResult);
}

export async function postGameResult(
    gameResult: GameResult
): Promise<void> {
  console.log("Sending GameResultDTO to backend:", gameResult); // Log the data being sent
  try {
    const response = await axios.post(`${config.apiBaseUrl}/results`, gameResult);
    console.log("Received response from backend:", response.data); // Log the response from backend
    const returnedResult = fromDTO(response.data);
    store.commit('setRewards', returnedResult.rewards)
    store.commit('setScore', returnedResult.score)

  } catch (error) {
    console.error("Error sending GameResultDTO:", error); // Log any error
    throw error; // Rethrow the error to be handled by the caller
  }
}

export function fromDTO(dto: any): GameResult {
  return new GameResult(
      dto.correctTiles,
      dto.number,
      dto.configuration,
      dto.answers,
      dto.duration,
      dto.score,
      dto.rewards);
}

