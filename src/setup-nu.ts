import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";
import * as fs from "fs/promises";
import * as path from "path";

async function install(version: string) {
	core.info(`Setting up Nu ${version}...`);

	// const cachedPath = tc.find("nu", version);
	// if (cachedPath) {
	// 	core.info(`Using cached Nu installation from ${cachedPath}.`);
	// 	core.addPath(cachedPath);
	// 	return;
	// }

	const file = fileName(version);
	const url = `https://github.com/nushell/nushell/releases/download/${version}/${file}`;

	core.info(`Downloading Nu from ${url}.`);
	const zipPath = await tc.downloadTool(url);
	const extractedFolder = await tc.extractZip(zipPath);

	const bin = path.join(extractedFolder, extractedBin(version));
	// const newCachedPath = await tc.cacheDir(bin, "nu", version);

	core.info("bin: " + JSON.stringify(await fs.readdir(bin)));

	core.info(`Cached Nu to ${bin}.`);
	core.addPath(bin);
}

function extractedBin(version: string) {
	const prefix = `nu_${version.replaceAll(".", "_")}`;
	// TODO: `process.arch` `"arm64"` `"x64"`
	switch (process.platform) {
		case "linux":
			return `${prefix}_linux/nushell-${version}`;
		case "darwin":
			return `${prefix}_macOS/nushell-${version}`;
		case "win32":
			return `${prefix}_windows/nushell-${version}`;
		default:
			throw new Error(`Unsupported platform ${process.platform}.`);
	}
}

function fileName(version: string) {
	const prefix = `nu_${version.replaceAll(".", "_")}`;
	// TODO: `process.arch` `"arm64"` `"x64"`
	switch (process.platform) {
		case "linux":
			return `${prefix}_linux.tar.gz`;
		case "darwin":
			return `${prefix}_macOS.zip`;
		case "win32":
			return `${prefix}_windows.zip`;
		default:
			throw new Error(`Unsupported platform ${process.platform}.`);
	}
}

const version = core.getInput("nu-version");
install(version);
