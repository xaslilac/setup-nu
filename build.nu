#!/usr/bin/env nu


def main [--watch (-w): bool] {
	let watch_args = if $watch {
		['--watch']
	} else {
		[]
	}

	(./node_modules/.bin/esbuild 
		./src/setup-nu.ts
		--outdir=./build/
		--bundle
		--platform=node
		$watch_args)
}
