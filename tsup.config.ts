import { defineConfig } from 'tsup'
import * as fs from 'fs'
import * as path from 'path'

// Read package.json to extract version and dependencies
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf-8'))

// Extract package information
const { name, version, author, license } = packageJson

// Extract all dependencies to mark as external
const allDependencies = [
  ...Object.keys(packageJson.dependencies || {}),
  ...Object.keys(packageJson.peerDependencies || {}),
  'class-validator',
  'class-transformer',
  'reflect-metadata',
]

// Create a banner for the output files
const banner = `/**
 * ${name} v${version}
 * 
 * Advanced console toolkit for Node.js applications
 * 
 * @license ${license}
 * @copyright ${new Date().getFullYear()} ${author || 'Author'}
 */
`

// Function to copy stub files
const copyStubs = () => {
  return {
    name: 'copy-stubs',
    setup(build: { onEnd: (arg0: () => void) => void }) {
      build.onEnd(() => {
        const stubsDir = path.join(__dirname, 'src/stubs/templates')
        const outDir = path.join(__dirname, 'dist/stubs/templates')

        // Create output directory if it doesn't exist
        if (!fs.existsSync(outDir)) {
          fs.mkdirSync(outDir, { recursive: true })
        }

        // Copy all stub files
        const files = fs.readdirSync(stubsDir)
        for (const file of files) {
          if (file.endsWith('.stub')) {
            fs.copyFileSync(path.join(stubsDir, file), path.join(outDir, file))
            console.log(`Copied ${file} to ${outDir}`)
          }
        }
      })
    },
  }
}

export default defineConfig({
  // Specify the entry points for the build
  entry: ['src/'],

  // Output formats (CommonJS and ES Modules)
  format: ['cjs', 'esm'],

  // Generate declaration files (.d.ts)
  dts: true,

  // Disable code splitting for better compatibility
  splitting: false,

  // Generate source maps for debugging
  sourcemap: true,

  // Clean the output directory before building
  clean: true,

  // Don't minify the output for better readability
  minify: false,

  // Enable tree shaking to remove unused code
  treeshake: true,

  // Mark all dependencies as external to avoid bundling them
  external: allDependencies,

  // Add the banner to all output files
  banner: {
    js: banner,
  },

  // Adding esbuild plugins
  esbuildPlugins: [copyStubs()],

  // Custom esbuild options
  esbuildOptions(options, context) {
    // Configure loader for .stub files
    options.loader = {
      ...options.loader,
      '.stub': 'copy', // Use "copy" loader for .stub files
    }
  },

  // Additional options for better developer experience
  onSuccess: 'echo "Build completed successfully!"',
})
