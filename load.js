(() => {
	class Tracks {
		constructor() {
			this.data = {}
		}

		load(name, data) {
			const slug = name.toLowerCase().replace(/ /g, '-')

			this.data[slug] = {
				name: name,
				slug: slug,
				data: data
			}
		}

		getAll() {
			return window._AFTracksList
		}

		getLoaded()	{
			return this.data
		}
	}
	window._AFTracks = new Tracks()
})();