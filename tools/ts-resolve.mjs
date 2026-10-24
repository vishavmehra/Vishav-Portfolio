/**
 * Lets `node --experimental-strip-types` load the app's own modules, which import
 * each other the TypeScript way — without a file extension — and through the `@/`
 * alias. Node resolves neither, so both are mapped here.
 *
 * Run a tool with:  node --experimental-strip-types --import ./tools/ts-resolve.mjs tools/<file>.ts
 */
import { register } from 'node:module'
import { pathToFileURL } from 'node:url'

register(
  'data:text/javascript,' +
    encodeURIComponent(`
  const root = ${JSON.stringify(pathToFileURL(process.cwd()).href)} + '/src/'
  export async function resolve(specifier, context, next) {
    const mapped = specifier.startsWith('@/') ? root + specifier.slice(2) : specifier
    try {
      return await next(mapped, context)
    } catch (error) {
      if (/^[./@]/.test(mapped) && !/\\.[a-z]+$/.test(mapped)) return next(mapped + '.ts', context)
      throw error
    }
  }
`),
  import.meta.url,
)
