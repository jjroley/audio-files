import Player from "./player"
import Tracks from "./tracks";

// expose the Player class to the window object
window.AFPlayer = Player;
window.AFTracks = Tracks;

console.log("Audio Framework loaded");
