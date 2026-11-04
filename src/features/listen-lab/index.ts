/**
 * Listen Lab (EXP.02) — on-device speech to text.
 *
 * Public surface for rendering the experiment. The engine it drives is the
 * other entry point, ./engine, which stays framework-free so it can be
 * exercised without React. Everything in a subfolder is private.
 *
 * Folders by role: components/ and hooks/ are the React side; engine/,
 * state/ and data/ are the side that must keep working without a DOM.
 */
export { ListenLab } from "./components/ListenLab";
