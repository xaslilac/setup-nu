import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";
import * as path from "path";

async function install(version: string) {
	core.info(`Setting up Nu ${version}...`);

	const cachedPath = tc.find("nu", version);
	if (cachedPath) {
		core.info(`Using cached Nu installation from ${cachedPath}.`);
		core.addPath(cachedPath);
		return;
	}

	const bin = await extractNu(version);
	const newCachedPath = await tc.cacheDir(bin, "nu", version);

	core.info(`Cached Nu to ${bin}.`);
	core.addPath(newCachedPath);
}

async function extractNu(version: string) {
	const assetPrefix = `nu_${version.replaceAll(".", "_")}`;
	const assetUrlBase = `https://github.com/nushell/nushell/releases/download/${version}/${assetPrefix}`;

	switch (process.platform) {
		case "linux": {
			const assetUrl = `${assetUrlBase}_linux.tar.gz`;
			core.info(`Downloading Nu from ${assetUrl}.`);
			const archivePath = await tc.downloadTool(assetUrl);
			const extractedFolder = await tc.extractTar(archivePath);
			return path.join(extractedFolder, `${assetPrefix}_linux/nushell-${version}`);
		}
		case "darwin": {
			const assetUrl = `${assetUrlBase}_macOS.zip`;
			core.info(`Downloading Nu from ${assetUrl}.`);
			const archivePath = await tc.downloadTool(assetUrl);
			const extractedFolder = await tc.extractZip(archivePath);
			return path.join(extractedFolder, `${assetPrefix}_macOS/nushell-${version}`);
		}
		case "win32": {
			const assetUrl = `${assetUrlBase}_windows.zip`;
			core.info(`Downloading Nu from ${assetUrl}.`);
			const archivePath = await tc.downloadTool(assetUrl);
			const extractedFolder = await tc.extractZip(archivePath);
			return path.join(extractedFolder, `${assetPrefix}_windows/nushell-${version}`);
		}
		default:
			throw new Error(`Unsupported platform ${process.platform}.`);
	}
}

const version = core.getInput("nu-version");
install(version);
