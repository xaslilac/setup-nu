#!/usr/bin/env nu

def main [--watch (-w): bool] {
	let args = []
	let args = if $watch { $args | append '--watch' } else { $args }

	(./node_modules/.bin/esbuild 
		./src/setup-nu.ts
		--outdir=./build/
		--bundle
		--platform=node
		$args)
}
