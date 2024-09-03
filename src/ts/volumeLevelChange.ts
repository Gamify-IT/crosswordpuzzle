import axios from "axios";
import config from "@/config";
import { VolumeLevelDTO } from "@/types/dtos";
let volumeLevel: number | null = 0;

export async function fetchVolumeLevel(configuration: string): Promise<void> {
  const result = await axios.get<VolumeLevelDTO>(
    `${config.apiBaseUrl}/configurations/` + configuration
  );
  volumeLevel = result.data.volumeLevel;
}

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
