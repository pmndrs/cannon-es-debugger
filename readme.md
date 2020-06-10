This is a debugger for use with [cannon-es](https://github.com/react-spring/cannon-es). It was adapted from the [original cannon.js debugger](https://github.com/schteppe/cannon.js/blob/master/tools/threejs/CannonDebugRenderer.js) written by Stefan Hedman [@schteppe](https://github.com/schteppe).

**Note:** This debugger currently does not work with [use-cannon](https://github.com/react-spring/use-cannon).


### Usage

Give `cannon-es-debugger` references to Three's scene object and Cannon's physics bodies. New meshes with wireframe textures will be generated from your physics body geometries and added into the scene. The position of the meshes will be synched with the Cannon phyics body simulation on every animation frame.

```js
import { Scene } from 'three'
import { World } from 'cannon-es'
import debug from 'cannon-es-debugger'

const scene = new Scene
const world = new World
debug(scene, world.bodies)
```


### Options

The available properties of the debugger `options` object are listed below.

```js
debug(scene, world.bodies, options)
```

* **`color`** - accepts a [Three Color](https://threejs.org/docs/#api/en/math/Color) constructor argument, defaults to `0x00ff00`