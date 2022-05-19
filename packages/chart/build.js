const esbuild = require("esbuild")

try {
  esbuild.build({
    entryPoints: ["./src/index.ts"],
    outfile: "./dist/chart.js",
    minify: process.env.NODE_ENV === "production",
    bundle: true,
    external: ["react", "invariant"],
    format: "cjs",
  })
} catch (e) {
  console.error(e)
}
