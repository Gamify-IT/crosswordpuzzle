import axios from "axios";
import config from "@/config";
import { VolumeLevelDTO } from "@/types/dtos";
let volumeLevel: number | null = 0;

/**
 * Fetches the volume level configuration for the provided configuration ID from the server.
 * @param configuration - The configuration ID to fetch the volume level for.
 */
export async function fetchVolumeLevel(configuration: string): Promise<void> {
  const result = await axios.get<VolumeLevelDTO>(
    `${config.apiBaseUrl}/configurations/` + configuration + '/volume'
  );
  volumeLevel = result.data.volumeLevel;
}

/**
 * Creates an audio element and applies the fetched volume level.
 * @param pathToAudioFile - The path to the audio file to be used.
 * @returns An HTMLAudioElement with the appropriate volume level.
 */
export function createAudioWithVolume(pathToAudioFile: string): HTMLAudioElement {
  const audio = new Audio(pathToAudioFile);
  if (volumeLevel == 2 || volumeLevel == 3) {
    volumeLevel = 1;
  } else if (volumeLevel == 1) {
    volumeLevel = 0.5;
  }
  audio.volume = volumeLevel !== null ? volumeLevel : 1;
  return audio;
}
