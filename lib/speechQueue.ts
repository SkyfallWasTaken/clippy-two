export function queueSpeech(text: string, options = {}) {
  const speechOptions = {
    voice: null,
    volume: 1,
    rate: 1,
    pitch: 1,
    includeExperimental: false,
    ...options,
  };

  const utterance = new SpeechSynthesisUtterance(text);

  if (speechOptions.voice) utterance.voice = speechOptions.voice;
  utterance.volume = speechOptions.volume;
  utterance.rate = speechOptions.rate;
  utterance.pitch = speechOptions.pitch;

  // HIGHLY RELIABLE - Core user activation events
  const coreEvents = [
    "keydown",
    "keyup",
    "mousedown",
    "mouseup",
    "click",
    "dblclick",
    "touchstart",
    "touchend",
    "pointerdown",
    "pointerup",
  ];

  let eventsToUse = coreEvents;

  const playSpeech = (event: any) => {
    console.log(`Speech triggered by: ${event.type}`);
    speechSynthesis.speak(utterance);

    eventsToUse.forEach((eventType) => {
      document.removeEventListener(eventType, playSpeech, { capture: true });
    });
  };

  eventsToUse.forEach((eventType) => {
    document.addEventListener(eventType, playSpeech, {
      capture: true,
      once: false,
    });
  });

  return function cancelQueuedSpeech() {
    eventsToUse.forEach((eventType) => {
      document.removeEventListener(eventType, playSpeech, { capture: true });
    });
  };
}
