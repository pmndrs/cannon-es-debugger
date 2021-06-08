![Demo Image](https://i.imgur.com/2Bf8KfJ.png)

This is a debugger for use with [cannon-es](https://github.com/pmndrs/cannon-es). It was adapted from the [original cannon.js debugger](https://github.com/schteppe/cannon.js/blob/master/tools/threejs/CannonDebugRenderer.js) written by Stefan Hedman [@schteppe](https://github.com/schteppe).

**Note:** This debugger currently does not work with [use-cannon](https://github.com/pmndrs/use-cannon).

### Installation

```
yarn add cannon-es-debugger
```

Make sure you also have `three` and `cannon-es` as dependencies.

```
yarn add three cannon-es
```

### Usage

Give `cannon-es-debugger` references to your Three scene object and Cannon physics bodies:

```js
import { Scene } from 'three'
import { World } from 'cannon-es'
import cannonDebugger from 'cannon-es-debugger'

const scene = new Scene()
const world = new World()
cannonDebugger(scene, world.bodies, options)
```

New meshes with wireframe textures will be generated from your physics body geometries and added into the scene. A mesh will be created for every shape in the physics body. The position of the meshes will be synched with the Cannon physics body simulation on every animation frame.

### API

The available properties of the `options` object are listed below.

```typescript
import type { Scene, Color } from 'three'
import type { Body } from 'cannon-es'

type DebugOptions = {
  color?: string | number | Color
  scale?: number
  onInit?: (body: Body, mesh: Mesh, shape: Shape) => void
  onUpdate?: (body: Body, mesh: Mesh, shape: Shape) => void
  autoUpdate?: Boolean
}

export default function cannonDebugger(scene: Scene, bodies: Body[], options: DebugOptions): void
```

- **`color`** - a [Three Color](https://threejs.org/docs/#api/en/math/Color) argument that sets the wireframe color, defaults to `0x00ff00`

- **`scale`** - scale factor, defaults to 1

- **`onInit`** - callback function that runs once, right after a new wireframe mesh is added

- **`onUpdate`** - callback function that runs on every subsequent animation frame

- **`autoUpdate`** - wheter or not the debugger should update by itself (default: `true`)

If you set `autoUpdate: false`, then you can use the `update()` method included in the returned object to update the debugger manually.
