# FIX: Full-Stack Server Build

Use prefix `./dist/` for all assets imported in `dist/server.js`, e.g.
- `"./dist/index.html"` instead of `"../../client/src/index.html"`
- `"./dist./index-ghq6t9kp.js"` instead of `"./index-ghq6t9kp.js"`

Doesn't work with the `"canvas"` module used to generate labels.

```sh
error: dlopen(/dist/canvas-1ehwz3j6.node, 0x0001): Library not loaded: @loader_path/libpixman-1.0.dylib
  Referenced from: <790BF931-196C-396E-B9FF-C323418EFA8A> /dist/canvas-1ehwz3j6.node
  Reason: tried: '/dist/libpixman-1.0.dylib' (no such file)
 code: "ERR_DLOPEN_FAILED"

      at <anonymous> (/dist/server.js:2:601)
      at <anonymous> (/dist/server.js:2:346)
      at <anonymous> (/node_modules/canvas/lib/bindings.js:3:7)
      at <anonymous> (/dist/server.js:2:346)
      at <anonymous> (/node_modules/canvas/lib/canvas.js:9:7)
      at <anonymous> (/dist/server.js:2:346)
      at /server/src/label/generate-label.ts:61:7

Bun v1.2.19 (macOS arm64)
error: script "start" exited with code 1
```
