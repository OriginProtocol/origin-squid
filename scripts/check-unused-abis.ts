import * as fs from 'fs'
import * as path from 'path'
import { execSync } from 'child_process'

/**
 * Checks for unused ABI files in the codebase.
 *
 * ABI workflow:
 * 1. JSON ABI files live in /abi/
 * 2. They get typegenned into /src/abi/
 * 3. Code imports from @abi/filename
 *
 * This script finds which ABIs in src/abi/ are not imported
 * anywhere outside of src/abi/, and reports the corresponding
 * JSON files in abi/ that can be deleted.
 */

const ROOT_DIR = path.resolve(__dirname, '..')
const SRC_ABI_DIR = path.join(ROOT_DIR, 'src', 'abi')
const ABI_JSON_DIR = path.join(ROOT_DIR, 'abi')
const SRC_DIR = path.join(ROOT_DIR, 'src')

// ABIs to ignore (auto-generated or intentionally kept without direct imports)
const IGNORED_ABIS = ['multicall']

function getAbiFiles(): string[] {
  const files = fs.readdirSync(SRC_ABI_DIR)
  // Get main .ts files, excluding .abi.ts helper files
  return files
    .filter((f) => f.endsWith('.ts') && !f.endsWith('.abi.ts'))
    .map((f) => f.replace('.ts', ''))
}

function isAbiUsed(abiName: string): boolean {
  // Search for imports of this ABI outside of src/abi/
  // Check both @abi/ alias imports and relative ../abi/ imports

  // Pattern 1: @abi/abiName imports
  const aliasPattern = `@abi/${abiName}[^a-zA-Z0-9_-]|@abi/${abiName}$`
  // Pattern 2: relative path imports like '../abi/abiName'
  const relativePattern = `/abi/${abiName}'|/abi/${abiName}\\"`

  try {
    // Check alias imports first
    const aliasResult = execSync(
      `grep -r -l -E "${aliasPattern}" "${SRC_DIR}" --include="*.ts" | grep -v "/src/abi/"`,
      { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] },
    )
    if (aliasResult.trim().length > 0) return true
  } catch {
    // grep returns exit code 1 when no matches found
  }

  try {
    // Check relative imports
    const relativeResult = execSync(
      `grep -r -l -E "${relativePattern}" "${SRC_DIR}" --include="*.ts" | grep -v "/src/abi/"`,
      { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] },
    )
    if (relativeResult.trim().length > 0) return true
  } catch {
    // grep returns exit code 1 when no matches found
  }

  return false
}

function getCorrespondingJsonFile(abiName: string): string | null {
  // Try to find matching JSON file in abi/ directory
  const jsonPath = path.join(ABI_JSON_DIR, `${abiName}.json`)
  if (fs.existsSync(jsonPath)) {
    return `${abiName}.json`
  }
  return null
}

function getSrcAbiFiles(abiName: string): string[] {
  // Get all related files in src/abi/ (main .ts and optional .abi.ts helper)
  const files: string[] = [`${abiName}.ts`]
  const helperPath = path.join(SRC_ABI_DIR, `${abiName}.abi.ts`)
  if (fs.existsSync(helperPath)) {
    files.push(`${abiName}.abi.ts`)
  }
  return files
}

function main() {
  console.log('Checking for unused ABIs...\n')

  const abiFiles = getAbiFiles()
  const unused: { tsFile: string; jsonFile: string | null; srcFiles: string[] }[] = []
  const used: string[] = []

  for (const abiName of abiFiles) {
    if (IGNORED_ABIS.includes(abiName)) {
      used.push(abiName) // Count as used
    } else if (isAbiUsed(abiName)) {
      used.push(abiName)
    } else {
      unused.push({
        tsFile: abiName,
        jsonFile: getCorrespondingJsonFile(abiName),
        srcFiles: getSrcAbiFiles(abiName),
      })
    }
  }

  console.log(`Total ABIs: ${abiFiles.length}`)
  console.log(`Used: ${used.length}`)
  console.log(`Unused: ${unused.length}\n`)

  if (unused.length > 0) {
    console.log('=== UNUSED ABIs ===\n')
    console.log('The following ABIs are not imported anywhere outside src/abi/:\n')

    for (const { tsFile, jsonFile } of unused) {
      console.log(`  src/abi/${tsFile}.ts`)
      if (jsonFile) {
        console.log(`    -> abi/${jsonFile}`)
      }
    }

    console.log('\nTo remove unused ABIs, run the commands below.\n')

    // Collect all files to delete
    const jsonFiles = unused.map((u) => u.jsonFile).filter(Boolean) as string[]
    const srcFiles = unused.flatMap((u) => u.srcFiles)

    console.log('Commands to delete unused files:')
    console.log('```')
    for (const jsonFile of jsonFiles) {
      console.log(`rm abi/${jsonFile}`)
    }
    for (const srcFile of srcFiles) {
      console.log(`rm src/abi/${srcFile}`)
    }
    console.log('```')
  } else {
    console.log('All ABIs are in use!')
  }

  // Exit with error code if unused ABIs found (useful for CI)
  if (unused.length > 0) {
    process.exit(1)
  }
}

main()
