import type Player from "./player";
import type Tracks from "./tracks";

declare global {
	interface Window {
		AFPlayer: typeof Player
		AFTracks: typeof Tracks
	}
}