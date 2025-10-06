import { createRequire } from 'module'
import { spawn } from 'child_process'

const require = createRequire(import.meta.url)

function hasEslint() {
  try {
    require.resolve('eslint/package.json')
    return true
  } catch {
    return false
  }
}

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: process.platform === 'win32',
    })

    child.on('close', (code) => {
      if (code === 0) {
        resolve()
      } else {
        const error = new Error(`${command} exited with code ${code}`)
        error.code = code
        reject(error)
      }
    })

    child.on('error', reject)
  })
}

async function main() {
  if (!hasEslint()) {
    console.warn('⚠️  未检测到 ESLint，已跳过代码检查。要启用 lint，请运行 `npm install --save-dev eslint eslint-config-next` 后重试。')
    console.warn('⚠️  ESLint is not installed. Install it with `npm install --save-dev eslint eslint-config-next` to enable linting.')
    return
  }

  await run('npx', ['next', 'lint'])
}

main().catch((error) => {
  console.error(error.message)
  process.exit(error.code || 1)
})
