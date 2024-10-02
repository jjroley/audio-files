import Tracks from "./tracks"

export default class Player {
	audioCtx: AudioContext = new AudioContext()
	source: AudioBufferSourceNode | null = null
	isStarted: boolean = false
	tracks: Tracks

	constructor(baseURL: string) {
		this.tracks = new Tracks(baseURL)
	}

	async load(slug: string) {
		if (!this.tracks.get(slug)) {
			console.error("Track not found")
			return;
		}

		try {
			// load the track data
			const trackData = await this.tracks.load(slug)

			// stackoverflow
			var binaryString = atob(trackData.data.split(',')[1]);
			var bytes = new Uint8Array(binaryString.length);
			for (var i = 0; i < binaryString.length; i++) {
				bytes[i] = binaryString.charCodeAt(i);
			}

			this.audioCtx.decodeAudioData(bytes.buffer)
				.then(this.loadSource.bind(this))
				.catch(this.handleError.bind(this))
		} catch (err) {
			this.handleError(err)
		}
	}

	loadSource(audioBuffer: AudioBuffer) {
		this.source = this.audioCtx.createBufferSource();
		this.source.buffer = audioBuffer;
		this.source.connect(this.audioCtx.destination);
	}

	handleError(err: any) {
		console.error("Error decoding audio data:", err);
	}

	start() {
		if (this.source) {
			this.source.start()
			this.isStarted = true
		}
	}

	stop() {
		if (this.source) {
			this.source.stop()
			this.isStarted = false
		}
	}
}