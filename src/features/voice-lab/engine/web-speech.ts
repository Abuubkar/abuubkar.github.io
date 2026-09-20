/**
 * The non-AI fallback: the browser's built-in speech, used when the model
 * can't load at all. Labelled as such in the UI, because it isn't the
 * experiment — it just means the page still does something useful.
 */

export function isAvailable(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

/** Chrome fills getVoices() asynchronously; calling it early gives the voice
 *  list time to exist by the time we need to pick from it. */
export function primeVoices() {
  if (isAvailable()) window.speechSynthesis.getVoices();
}

function pickLocalVoice(): SpeechSynthesisVoice | null {
  // Prefer a local English voice so no text leaves the device even here:
  // some of Chrome's voices synthesize server-side.
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => v.localService && v.lang.startsWith("en")) ??
    voices.find((v) => v.lang.startsWith("en")) ??
    null
  );
}

export function speak(text: string, onEnd: () => void) {
  const utterance = new SpeechSynthesisUtterance(text);
  const voice = pickLocalVoice();
  if (voice) utterance.voice = voice;
  utterance.onend = utterance.onerror = onEnd;
  window.speechSynthesis.speak(utterance);
}

export function cancel() {
  if (isAvailable()) window.speechSynthesis.cancel();
}
