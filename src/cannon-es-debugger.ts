import {
  Vec3 as CannonVector3,
  Sphere,
  Box,
  ConvexPolyhedron,
  Trimesh,
  Heightfield,
  Shape,
  Quaternion as CannonQuaternion,
  Cylinder,
} from 'cannon-es'
import {
  MeshBasicMaterial,
  SphereGeometry,
  BoxGeometry,
  PlaneGeometry,
  CylinderGeometry,
  Mesh,
  Vector3 as ThreeVector3,
  Quaternion as ThreeQuaternion,
  BufferGeometry,
  Float32BufferAttribute,
} from 'three'
import type { Body, World } from 'cannon-es'
import type { Scene, Color } from 'three'

type ComplexShape = Shape & { geometryId?: number }
export type DebugOptions = {
  color?: string | number | Color
  scale?: number
  onInit?: (body: Body, mesh: Mesh, shape: Shape) => void
  onUpdate?: (body: Body, mesh: Mesh, shape: Shape) => void
}

export default function CannonDebugger(
  scene: Scene,
  world: World,
  { color = 0x00ff00, scale = 1, onInit, onUpdate }: DebugOptions = {}
) {
  const _meshes: Mesh[] = []
  const _material = new MeshBasicMaterial({ color: color ?? 0x00ff00, wireframe: true })
  const _tempVec0 = new CannonVector3()
  const _tempVec1 = new CannonVector3()
  const _tempVec2 = new CannonVector3()
  const _tempQuat0 = new CannonQuaternion()
  const _sphereGeometry = new SphereGeometry(1)
  const _boxGeometry = new BoxGeometry(1, 1, 1)
  const _planeGeometry = new PlaneGeometry(10, 10, 10, 10)

  // Move the planeGeometry forward a little bit to prevent z-fighting
  _planeGeometry.translate(0, 0, 0.0001)

  function createConvexPolyhedronGeometry(shape: ConvexPolyhedron): BufferGeometry {
    const geometry = new BufferGeometry()

    // Add vertices
    const positions = []
    for (let i = 0; i < shape.vertices.length; i++) {
      const vertex = shape.vertices[i]
      positions.push(vertex.x, vertex.y, vertex.z)
    }
    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))

    // Add faces
    const indices = []
    for (let i = 0; i < shape.faces.length; i++) {
      const face = shape.faces[i]
      const a = face[0]
      for (let j = 1; j < face.length - 1; j++) {
        const b = face[j]
        const c = face[j + 1]
        indices.push(a, b, c)
      }
    }

    geometry.setIndex(indices)
    geometry.computeBoundingSphere()
    geometry.computeVertexNormals()
    return geometry
  }

  function createTrimeshGeometry(shape: Trimesh): BufferGeometry {
    const geometry = new BufferGeometry()
    const positions = []
    const v0 = _tempVec0
    const v1 = _tempVec1
    const v2 = _tempVec2

    for (let i = 0; i < shape.indices.length / 3; i++) {
      shape.getTriangleVertices(i, v0, v1, v2)
      positions.push(v0.x, v0.y, v0.z)
      positions.push(v1.x, v1.y, v1.z)
      positions.push(v2.x, v2.y, v2.z)
    }

    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
    geometry.computeBoundingSphere()
    geometry.computeVertexNormals()
    return geometry
  }

  function createHeightfieldGeometry(shape: Heightfield): BufferGeometry {
    const geometry = new BufferGeometry()
    const s = shape.elementSize || 1 // assumes square heightfield, else i*x, j*y
    const positions = shape.data.flatMap((row, i) => row.flatMap((z, j) => [i * s, j * s, z]))
    const indices = []

    for (let xi = 0; xi < shape.data.length - 1; xi++) {
      for (let yi = 0; yi < shape.data[xi].length - 1; yi++) {
        const stride = shape.data[xi].length
        const index = xi * stride + yi
        indices.push(index + 1, index + stride, index + stride + 1)
        indices.push(index + stride, index + 1, index)
      }
    }

    geometry.setIndex(indices)
    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
    geometry.computeBoundingSphere()
    geometry.computeVertexNormals()
    return geometry
  }

  function createMesh(shape: Shape): Mesh {
    let mesh = new Mesh()
    const { SPHERE, BOX, PLANE, CYLINDER, CONVEXPOLYHEDRON, TRIMESH, HEIGHTFIELD } = Shape.types

    switch (shape.type) {
      case SPHERE: {
        mesh = new Mesh(_sphereGeometry, _material)
        break
      }
      case BOX: {
        mesh = new Mesh(_boxGeometry, _material)
        break
      }
      case PLANE: {
        mesh = new Mesh(_planeGeometry, _material)
        break
      }
      case CYLINDER: {
        const geometry = new CylinderGeometry(
          (shape as Cylinder).radiusTop,
          (shape as Cylinder).radiusBottom,
          (shape as Cylinder).height,
          (shape as Cylinder).numSegments
        )
        mesh = new Mesh(geometry, _material)
        ;(shape as ComplexShape).geometryId = geometry.id
        break
      }
      case CONVEXPOLYHEDRON: {
        const geometry = createConvexPolyhedronGeometry(shape as ConvexPolyhedron)
        mesh = new Mesh(geometry, _material)
        ;(shape as ComplexShape).geometryId = geometry.id
        break
      }
      case TRIMESH: {
        const geometry = createTrimeshGeometry(shape as Trimesh)
        mesh = new Mesh(geometry, _material)
        ;(shape as ComplexShape).geometryId = geometry.id
        break
      }
      case HEIGHTFIELD: {
        const geometry = createHeightfieldGeometry(shape as Heightfield)
        mesh = new Mesh(geometry, _material)
        ;(shape as ComplexShape).geometryId = geometry.id
        break
      }
    }
    scene.add(mesh)
    return mesh
  }

  function scaleMesh(mesh: Mesh, shape: Shape | ComplexShape): void {
    const { SPHERE, BOX, PLANE, CYLINDER, CONVEXPOLYHEDRON, TRIMESH, HEIGHTFIELD } = Shape.types
    switch (shape.type) {
      case SPHERE: {
        const { radius } = shape as Sphere
        mesh.scale.set(radius * scale, radius * scale, radius * scale)
        break
      }
      case BOX: {
        mesh.scale.copy((shape as Box).halfExtents as unknown as ThreeVector3)
        mesh.scale.multiplyScalar(2 * scale)
        break
      }
      case PLANE: {
        break
      }
      case CYLINDER: {
        mesh.scale.set(1 * scale, 1 * scale, 1 * scale)
        break
      }
      case CONVEXPOLYHEDRON: {
        mesh.scale.set(1 * scale, 1 * scale, 1 * scale)
        break
      }
      case TRIMESH: {
        mesh.scale.copy((shape as Trimesh).scale as unknown as ThreeVector3).multiplyScalar(scale)
        break
      }
      case HEIGHTFIELD: {
        mesh.scale.set(1 * scale, 1 * scale, 1 * scale)
        break
      }
    }
  }

  function typeMatch(mesh: Mesh, shape: Shape | ComplexShape): boolean {
    if (!mesh) return false
    const { geometry } = mesh
    return (
      (geometry instanceof SphereGeometry && shape.type === Shape.types.SPHERE) ||
      (geometry instanceof BoxGeometry && shape.type === Shape.types.BOX) ||
      (geometry instanceof PlaneGeometry && shape.type === Shape.types.PLANE) ||
      (geometry.id === (shape as ComplexShape).geometryId && shape.type === Shape.types.CYLINDER) ||
      (geometry.id === (shape as ComplexShape).geometryId && shape.type === Shape.types.CONVEXPOLYHEDRON) ||
      (geometry.id === (shape as ComplexShape).geometryId && shape.type === Shape.types.TRIMESH) ||
      (geometry.id === (shape as ComplexShape).geometryId && shape.type === Shape.types.HEIGHTFIELD)
    )
  }

  function updateMesh(index: number, shape: Shape | ComplexShape): boolean {
    let mesh = _meshes[index]
    let didCreateNewMesh = false

    if (!typeMatch(mesh, shape)) {
      if (mesh) scene.remove(mesh)
      _meshes[index] = mesh = createMesh(shape)
      didCreateNewMesh = true
    }

    scaleMesh(mesh, shape)
    return didCreateNewMesh
  }

  function update(): void {
    const meshes = _meshes
    const shapeWorldPosition = _tempVec0
    const shapeWorldQuaternion = _tempQuat0

    let meshIndex = 0

    for (const body of world.bodies) {
      for (let i = 0; i !== body.shapes.length; i++) {
        const shape = body.shapes[i]
        const didCreateNewMesh = updateMesh(meshIndex, shape)
        const mesh = meshes[meshIndex]

        if (mesh) {
          // Get world position
          body.quaternion.vmult(body.shapeOffsets[i], shapeWorldPosition)
          body.position.vadd(shapeWorldPosition, shapeWorldPosition)

          // Get world quaternion
          body.quaternion.mult(body.shapeOrientations[i], shapeWorldQuaternion)

          // Copy to meshes
          mesh.position.copy(shapeWorldPosition as unknown as ThreeVector3)
          mesh.quaternion.copy(shapeWorldQuaternion as unknown as ThreeQuaternion)

          if (didCreateNewMesh && onInit instanceof Function) onInit(body, mesh, shape)
          if (!didCreateNewMesh && onUpdate instanceof Function) onUpdate(body, mesh, shape)
        }

        meshIndex++
      }
    }

    for (let i = meshIndex; i < meshes.length; i++) {
      const mesh = meshes[i]
      if (mesh) scene.remove(mesh)
    }

    meshes.length = meshIndex
  }

  return { update }
}
