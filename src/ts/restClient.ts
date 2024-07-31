import {GameAnswer, GameResult} from "@/types";
import axios from "axios";
import config from "@/config";
import storeTwo from "@/store/indexTwo";


export async function submitGameResult(
    gameResult: GameResult
): Promise<void> {
  console.log("Sending GameResultDTO to backend:", gameResult);
  try {
    const response = await axios.post(`${config.apiBaseUrl}/results`, gameResult);
    console.log("Received response from backend:", response.data);
    const returnedResult = fromDTO(response.data);
    storeTwo.commit('setRewards', returnedResult.rewards)
    storeTwo.commit('setScore', returnedResult.score)
    console.log("Store rewards:", storeTwo.state.rewards);


  } catch (error) {
    console.error("Error sending GameResultDTO:", error);
    throw error;
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

