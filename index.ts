const args = process.argv.slice(2); // slice(2) ignores the first two default args

// Validate and extract arguments
if (args.length < 2) {
  console.error("Usage: bun convert <filePath|URL> <name>");
  process.exit(1);
}

const run = async () => {
	const [file, name] = args;

	const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');

	const getScript = (name: string, data:string) => {
		return (
			`window._AFTracks?.load("${name}", "${data}");`
		);
	}

	// check if file is a URL
	if (file.startsWith("http")) {
		// download the file
		const response = await fetch(file);
		const data = new Uint8Array(await response.arrayBuffer());
		const ext = file.split('.').pop();
		const prefix = `data:${response.headers.get("content-type")};base64,`;

		await Bun.write(`tracks/${slug}.${ext}`, data);
		await Bun.write(`tracks/${slug}.js`, getScript(name, prefix + Buffer.from(data).toString("base64")));
	} else {
		// check if file exists
		if (!await Bun.file(file).exists()) {
			console.error("File does not exist");
			process.exit(1);
		}

		const data = await Bun.file(file).arrayBuffer();
		const ext = file.split('.').pop();
		const prefix = `data:${await Bun.file(file).type};base64,`;

		await Bun.write(`tracks/${slug}.${ext}`, data);
		await Bun.write(`tracks/${slug}.js`, getScript(name, prefix + Buffer.from(data).toString("base64")));
	}

	const tracks = await Bun.file('tracks/tracks.json').json();

	tracks[slug] = {
		name: name,
		path: 'tracks/' + slug + '.js',
	}

	await Bun.write('tracks/tracks.json', JSON.stringify(tracks, null, 2));
	await Bun.write('tracks/tracks.js', '(() => (window._AFTracks = ' + JSON.stringify(tracks, null, 2) + '))()');

	console.log("File converted successfully");
}

run();
