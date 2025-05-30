/// <reference types="chrome"/>

interface SpeakMessage {
  type: "speakText" | "speak";
  text: string;
}

interface SpeakResponse {
  success: boolean;
  error?: string;
}
