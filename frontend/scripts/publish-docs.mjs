import { cpSync, rmSync } from 'node:fs'
import { join } from 'node:path'

const distDir = join(import.meta.dirname, '..', 'dist')
const docsDir = join(import.meta.dirname, '..', '..', 'docs')

rmSync(docsDir, { recursive: true, force: true })
cpSync(distDir, docsDir, { recursive: true })

console.log('Published frontend build to docs/')
