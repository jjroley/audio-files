# Audio Files
##### A WIP system for asyncronously loading base64 audio files into the KA Scratchpad environment

To install dependencies:

```bash
bun install
```

For developing:

```bash
bun run --run dev
```

For building:
```bash
bun run --run build
```

To import an audio file, run the load-audio script.

```bash
bun run load-audio.ts "<audio URL or path>" "<Song-name>"
```

To update for jsdelivr after running `load-audio` just bump the version in package.json and commit the new audio files. When you push to main, it will automatically create a new release that jsdelivr can pull from.

This project was created using `bun init` in bun v1.1.25. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
