export enum AppStatus {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface GeneratedImageResult {
  imageUrl: string | null;
  text: string | null;
}

export interface PresetPrompt {
  label: string;
  text: string;
}

export const SAMPLE_PROMPT = "Hyper-realistic cinematic Create an 8k photorealistic image using the attached photo. A close-up portrait of a woman with long, jet-black, slightly wind-swept hair falling across her face. Her striking, light-colored eyes gaze upwards and to the right, catching a sharp, diagonal beam of natural light that illuminates the high points of her cheekbone, nose, and plump, glossy, mauve-toned lips a slightly light weight silk";
