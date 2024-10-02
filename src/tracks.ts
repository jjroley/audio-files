import trackJSON from '../tracks/tracks.json'

export type TrackMeta = {
	name: string
	slug: string
	data: string
}

export type TrackInfo = {
	name: string
	path: string
}

const tracks: { [key:string]: TrackInfo } = trackJSON

export default class Tracks {
	data: { [key:string]: TrackMeta } = {}
	bufferCache: { [key:string]: AudioBuffer } = {}
	baseURL: string

	constructor(baseURL:string) {
		this.baseURL = baseURL
	}

	// the method that the loaded scripts will call
	static async _register(name:string, data:string) {
		const slug = name.toLowerCase().replace(/ /g, '-')

		// dispatch event with audio buffer
		const event = new CustomEvent(`af-audio-loaded-${slug}`, {
			detail: {
				name: name,
				slug: slug,
				data: data
			}
		})

		document.dispatchEvent(event)
	}

	load(slug:string):Promise<TrackMeta> {
		if(!this.get(slug)) {
			return Promise.reject('Track not found')
		}

		if(this.getLoaded(slug)) {
			return Promise.resolve(this.getLoaded(slug))
		}

		// load a script tag and set up. The script will call _register to set things up
		return new Promise((resolve, reject) => {
			if(!this.get(slug)) {
				return reject('Track not found')
			}

			const url = new URL(this.baseURL)
			url.pathname = this.get(slug).path

			const script = document.createElement('script')
			script.src   = url.toString()
			script.async = true

			const onload = (e:Event) => {
				const customEvent = e as CustomEvent<TrackMeta>
				const trackMeta = customEvent.detail
				this.data[slug] = trackMeta

				// cleanup
				document.removeEventListener(`af-audio-loaded-${slug}`, onload)
				document.head.removeChild(script)

				resolve(trackMeta)
			}

			// listen for message with audio buffer
			document.addEventListener(`af-audio-loaded-${slug}`, onload)

			script.onerror = (err) => {
				reject(err)
			}
			document.head.appendChild(script)
		})
	}


	getAll() {
		return tracks;
	}

	get(slug:string) {
		return tracks[slug]
	}

	getLoaded(slug:string) {
		return this.data[slug]
	}

	getAllLoaded() {
		return this.data
	}
}
