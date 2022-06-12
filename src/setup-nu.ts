import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";
import * as fs from "fs/promises";

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
	// const newCachedPath = await tc.cacheDir(extractedFolder, "nu", version);

	// core.info(`Cached Nu to ${newCachedPath}.`);
	// core.addPath(newCachedPath);

	core.info("bin: " + JSON.stringify(await fs.readdir(extractedFolder)));

	core.info(`Cached Nu to ${extractedFolder}.`);
	core.addPath(extractedFolder);
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
