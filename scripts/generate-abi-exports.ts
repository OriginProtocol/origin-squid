/**
 * Generate .abi.ts files from raw JSON ABIs in ./abi/.
 * Each generated file re-exports the ABI with `as const` for proper viem type inference.
 *
 * Usage: ts-node scripts/generate-abi-exports.ts
 * Or via: pnpm run typegen (if wired into the command chain)
 */
import fs from 'fs'
import path from 'path'

const abiDir = path.resolve(__dirname, '../abi')
const outDir = path.resolve(__dirname, '../src/abi')

const jsonFiles = fs.readdirSync(abiDir).filter((f) => f.endsWith('.json'))

for (const file of jsonFiles) {
  const basename = path.parse(file).name
  const json = fs.readFileSync(path.join(abiDir, file), 'utf-8')
  const abi = JSON.parse(json)
  const outFile = path.join(outDir, `${basename}.abi.ts`)
  const content = `export const ABI_JSON = ${JSON.stringify(abi, null, 4)} as const\n`
  fs.writeFileSync(outFile, content)
}

console.log(`Generated ${jsonFiles.length} .abi.ts files`)
