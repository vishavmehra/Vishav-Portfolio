# Third-party notices

This project contains work adapted from third-party sources. Their licences and
copyright notices are reproduced below and must be kept.

---

## ThreeUI

The portfolio's WebGL world (`src/portfolio/world/scene.ts`) is **adapted from**
the ThreeUI Community component library: its procedural moss-root scene was
ported into this application's own three.js runtime and then extended.

- Source: <https://threeui.com> · <https://github.com/MengTo/threeui>
- Package: `@designcodeio/threeui` v1.2.0
- Licence of the adapted code: MIT (this notice is the credit it requires; it
  does not license this project)

What was adapted (and since modified):

- the shared light-uniform model (warm key, bounced fill, dark ambient)
- the aerial-perspective / haze treatment that tints toward lit air rather than
  toward the clear colour
- the single-loop pointer damping and rounded custom-property publishing
- the shared design-grid approach for co-registering DOM and WebGL coordinates,
  including the `k = (DIST - z) / DIST` depth correction
- the stepped dot-front image reveal technique

What was **not** taken: the moss-root and fern geometry, the flowers, the
butterfly, the card photographs, the Lexend typography, the page copy, the
layout, and the iframe packaging. No ThreeUI branding appears in this project,
and `@designcodeio/threeui` is not a dependency of it.

```
MIT License

Copyright (c) 2026 Meng To

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## three.js

Used as a direct dependency, and the adapted source above was originally
written against it.

- Copyright 2010-2026 Three.js Authors
- SPDX-License-Identifier: MIT

---

## Componentry

UI components installed from the Componentry registry
(<https://componentry.dev>) are vendored into `src/components/ui/` in the
shadcn manner and modified in place where noted in their file headers.

---

## thinking-orbs

The application's loading indicator.

- Source: <https://libraries.dev/orbs> · <https://github.com/Jakubantalik/Libraries.dev>
- Licence: MIT © Jakub Antalik

---

## Fonts

- **Archivo Black** — SIL Open Font License 1.1, served via `next/font/google`.
- **Lastoria Bold** (`public/LastoriaBoldRegular.otf`) — used by the Componentry
  Signature component. Licence not yet verified; see the TODO in the project
  notes before shipping publicly.
