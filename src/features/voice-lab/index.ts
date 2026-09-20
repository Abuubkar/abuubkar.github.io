/**
 * Voice Lab (EXP.01) — on-device neural text to speech.
 *
 * Public surface for rendering the experiment. The engine it drives is the
 * other entry point, ./engine, which stays framework-free so it can be
 * exercised without React. Everything in a subfolder is private.
 *
 * Folders by role: components/ and hooks/ are the React side; engine/,
 * state/ and data/ are the side that must keep working without a DOM.
 */
export { VoiceLab } from "./components/VoiceLab";
