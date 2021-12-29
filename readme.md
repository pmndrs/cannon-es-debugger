# cannon-es-debugger

[![Demo Image](https://i.imgur.com/2Bf8KfJ.png)](https://pmndrs.github.io/cannon-es-debugger/)

This is a debugger for use with [cannon-es](https://github.com/pmndrs/cannon-es). It was adapted from the [original cannon.js debugger](https://github.com/schteppe/cannon.js/blob/master/tools/threejs/CannonDebugRenderer.js) written by Stefan Hedman [@schteppe](https://github.com/schteppe).

**Note:** This debugger is included in [use-cannon](https://github.com/pmndrs/use-cannon#debug) directly.

### Installation

```
yarn add cannon-es-debugger
```

Make sure you also have `three` and `cannon-es` as dependencies.

```
yarn add three cannon-es
```

### Usage

Give `cannon-es-debugger` references to your three.js scene object and cannon-es world:

```js
import { Scene } from 'three'
import { World } from 'cannon-es'
import CannonDebugger from 'cannon-es-debugger'

const scene = new Scene()
const world = new World()
const cannonDebugger = new CannonDebugger(scene, world, {
  // options...
})

// ...

function animate() {
  requestAnimationFrame(animate)

  world.step(timeStep) // Update cannon-es physics
  cannonDebugger.update() // Update the CannonDebugger meshes
  renderer.render(scene, camera) // Render the three.js scene
}
animate()
```

New meshes with wireframe material will be generated from your physics body shapes and added into the scene. The position of the meshes will be synched with the Cannon physics body simulation on every animation frame.

### API

```ts
import type { Scene, Color } from 'three'
import type { Body } from 'cannon-es'

type DebugOptions = {
  color?: string | number | Color
  scale?: number
  onInit?: (body: Body, mesh: Mesh, shape: Shape) => void
  onUpdate?: (body: Body, mesh: Mesh, shape: Shape) => void
}

export default class CannonDebugger {
  constructor(scene: Scene, world: World, options: DebugOptions): void

  update(): void
}
```

The available properties of the `options` object are:

- **`color`** - a [Three Color](https://threejs.org/docs/#api/en/math/Color) argument that sets the wireframe color, defaults to `0x00ff00`

- **`scale`** - scale factor for all the wireframe meshes, defaults to 1

- **`onInit`** - callback function that runs once, right after a new wireframe mesh is added

- **`onUpdate`** - callback function that runs on every subsequent animation frame

The `update()` method needs to be called in a `requestAnimationFrame` loop to keep updating the wireframe meshes after the bodies have been updated.
