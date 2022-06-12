const core = require("@actions/core");
const tc = require("@actions/tool-cache");
const os = require("os");
const path = require("path");
const process = require("process");

/**
 * @param string version
 */
async function install(version) {
	const cachedPath = tc.find("nu", version);
	if (cachedPath) {
		core.info(`Using cached Nu installation from ${cachedPath}.`);
		core.addPath(cachedPath);
		return;
	}

	const file = fileName();
	const url = `https://github.com/nushell/nushell/releases/download/0.63.0/v${version}/${file}`;

	core.info(`Downloading Nu from ${url}.`);
	const zipPath = await tc.downloadTool(url);
	const extractedFolder = await tc.extractZip(zipPath);
	const newCachedPath = await tc.cacheDir(extractedFolder, "nu", version);

	core.info(`Cached Nu to ${newCachedPath}.`);
	core.addPath(newCachedPath);
}

function fileName(version) {
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
