import {GameAnswer, GameResult} from "@/types";
import axios from "axios";
import config from "@/config";
import storeTwo from "@/store/indexTwo";

export const tutorialConfiguration = "4f3af39f-1a0c-44f1-8a07-460786ab4fb1";

/**
 * Sends the game result to the backend via an API request and processes the response.
 *
 * This function makes a POST request to the backend API to submit the game result, which includes
 * the player's score, rewards, and other game-related data. After receiving the response, it updates
 * the store with the rewards and score.
 *
 * @param {GameResult} gameResult - The game result object containing the details of the game session.
 * @returns {Promise<void>} A promise that resolves when the game result has been successfully submitted.
 */
export async function submitGameResult(
    gameResult: GameResult
): Promise<void> {
  console.log("Sending GameResultDTO to backend:", gameResult);
  if (gameResult.configuration != tutorialConfiguration) {
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
}

/**
 * Converts the response data from the backend (DTO) into a GameResult object.
 *
 * This function maps the raw data (DTO) received from the backend into a properly structured
 * `GameResult` object, which can then be used within the application for further processing.
 *
 * @param {any} dto - The data transfer object (DTO) from the backend containing game result details.
 * @returns {GameResult} The constructed `GameResult` object containing the game details.
 */
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

