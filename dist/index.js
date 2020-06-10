"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cannon_es_1 = require("cannon-es");
const three_1 = require("three");
function renderWireframes(scene, bodies, options = {}) {
    var _a;
    const _meshes = [];
    const _material = new three_1.MeshBasicMaterial({ color: (_a = options.color) !== null && _a !== void 0 ? _a : 0x00ff00, wireframe: true });
    const _tempVec0 = new cannon_es_1.Vec3();
    const _tempVec1 = new cannon_es_1.Vec3();
    const _tempVec2 = new cannon_es_1.Vec3();
    const _tempQuat0 = new cannon_es_1.Quaternion();
    const _sphereGeometry = new three_1.SphereGeometry(1);
    const _boxGeometry = new three_1.BoxGeometry(1, 1, 1);
    const _planeGeometry = new three_1.PlaneGeometry(10, 10, 10, 10);
    const _cylinderGeometry = new three_1.CylinderGeometry(0.5, 0.5, 1, 32);
    function createConvexPolyhedronGeometry(shape) {
        const geometry = new three_1.Geometry();
        shape.vertices.forEach(({ x, y, z }) => geometry.vertices.push(new three_1.Vector3(x, y, z)));
        shape.faces.forEach((face) => {
            for (let i = 1; i < face.length - 1; i++) {
                geometry.faces.push(new three_1.Face3(face[0], face[i], face[i + 1]));
            }
        });
        geometry.computeBoundingSphere();
        geometry.computeFaceNormals();
        return geometry;
    }
    function createTrimeshGeometry(shape) {
        const geometry = new three_1.Geometry();
        const v0 = _tempVec0;
        const v1 = _tempVec1;
        const v2 = _tempVec2;
        for (let i = 0; i < shape.indices.length / 3; i++) {
            shape.getTriangleVertices(i, v0, v1, v2);
            geometry.vertices.push(new three_1.Vector3(v0.x, v0.y, v0.z), new three_1.Vector3(v1.x, v1.y, v1.z), new three_1.Vector3(v2.x, v2.y, v2.z));
            const index = geometry.vertices.length - 3;
            geometry.faces.push(new three_1.Face3(index, index + 1, index + 2));
        }
        geometry.computeBoundingSphere();
        geometry.computeFaceNormals();
        return geometry;
    }
    function createHeightfieldGeometry(shape) {
        const geometry = new three_1.Geometry();
        const v0 = _tempVec0;
        const v1 = _tempVec1;
        const v2 = _tempVec2;
        const { data } = shape;
        for (let i = 0; i < data.length - 1; i++) {
            for (let j = 0; j < data[i].length - 1; j++) {
                for (let k = 0; k < 2; k++) {
                    shape.getConvexTrianglePillar(i, j, k === 0);
                    v0.copy(shape.pillarConvex.vertices[0]);
                    v1.copy(shape.pillarConvex.vertices[1]);
                    v2.copy(shape.pillarConvex.vertices[2]);
                    v0.vadd(shape.pillarOffset, v0);
                    v1.vadd(shape.pillarOffset, v1);
                    v2.vadd(shape.pillarOffset, v2);
                    geometry.vertices.push(new three_1.Vector3(v0.x, v0.y, v0.z), new three_1.Vector3(v1.x, v1.y, v1.z), new three_1.Vector3(v2.x, v2.y, v2.z));
                    const index = geometry.vertices.length - 3;
                    geometry.faces.push(new three_1.Face3(index, index + 1, index + 2));
                }
            }
        }
        geometry.computeBoundingSphere();
        geometry.computeFaceNormals();
        return geometry;
    }
    function createMesh(shape) {
        let mesh = new three_1.Mesh();
        const { SPHERE, BOX, PLANE, CYLINDER, CONVEXPOLYHEDRON, TRIMESH, HEIGHTFIELD } = cannon_es_1.Shape.types;
        switch (shape.type) {
            case SPHERE: {
                mesh = new three_1.Mesh(_sphereGeometry, _material);
                break;
            }
            case BOX: {
                mesh = new three_1.Mesh(_boxGeometry, _material);
                break;
            }
            case PLANE: {
                mesh = new three_1.Mesh(_planeGeometry, _material);
                break;
            }
            case CYLINDER: {
                mesh = new three_1.Mesh(_cylinderGeometry, _material);
                break;
            }
            case CONVEXPOLYHEDRON: {
                const geometry = createConvexPolyhedronGeometry(shape);
                mesh = new three_1.Mesh(geometry, _material);
                shape.geometryId = geometry.id;
                break;
            }
            case TRIMESH: {
                const geometry = createTrimeshGeometry(shape);
                mesh = new three_1.Mesh(geometry, _material);
                shape.geometryId = geometry.id;
                break;
            }
            case HEIGHTFIELD: {
                const geometry = createHeightfieldGeometry(shape);
                mesh = new three_1.Mesh(geometry, _material);
                shape.geometryId = geometry.id;
                break;
            }
        }
        scene.add(mesh);
        return mesh;
    }
    function scaleMesh(mesh, shape) {
        const { SPHERE, BOX, PLANE, CYLINDER, CONVEXPOLYHEDRON, TRIMESH, HEIGHTFIELD } = cannon_es_1.Shape.types;
        switch (shape.type) {
            case SPHERE: {
                const { radius } = shape;
                mesh.scale.set(radius, radius, radius);
                break;
            }
            case BOX: {
                mesh.scale.copy(shape.halfExtents);
                mesh.scale.multiplyScalar(2);
                break;
            }
            case PLANE: {
                break;
            }
            case CYLINDER: {
                mesh.scale.set(1, 1, 1);
                break;
            }
            case CONVEXPOLYHEDRON: {
                mesh.scale.set(1, 1, 1);
                break;
            }
            case TRIMESH: {
                mesh.scale.copy(shape.scale);
                break;
            }
            case HEIGHTFIELD: {
                mesh.scale.set(1, 1, 1);
                break;
            }
        }
    }
    function typeMatch(mesh, shape) {
        if (!mesh) {
            return false;
        }
        const { geometry } = mesh;
        return ((geometry instanceof three_1.SphereGeometry && shape instanceof cannon_es_1.Sphere) ||
            (geometry instanceof three_1.BoxGeometry && shape instanceof cannon_es_1.Box) ||
            (geometry instanceof three_1.PlaneGeometry && shape instanceof cannon_es_1.Plane) ||
            (geometry.id === shape.geometryId && shape instanceof cannon_es_1.ConvexPolyhedron) ||
            (geometry.id === shape.geometryId && shape instanceof cannon_es_1.Trimesh) ||
            (geometry.id === shape.geometryId && shape instanceof cannon_es_1.Heightfield));
    }
    function updateMesh(index, shape) {
        let mesh = _meshes[index];
        if (!typeMatch(mesh, shape)) {
            if (mesh) {
                scene.remove(mesh);
            }
            _meshes[index] = mesh = createMesh(shape);
        }
        scaleMesh(mesh, shape);
    }
    function update() {
        const meshes = _meshes;
        const shapeWorldPosition = _tempVec0;
        const shapeWorldQuaternion = _tempQuat0;
        let meshIndex = 0;
        for (const body of bodies) {
            for (let i = 0; i !== body.shapes.length; i++) {
                const shape = body.shapes[i];
                updateMesh(meshIndex, shape);
                const mesh = meshes[meshIndex];
                if (mesh) {
                    body.quaternion.vmult(body.shapeOffsets[i], shapeWorldPosition);
                    body.position.vadd(shapeWorldPosition, shapeWorldPosition);
                    body.quaternion.mult(body.shapeOrientations[i], shapeWorldQuaternion);
                    mesh.position.copy(shapeWorldPosition);
                    mesh.quaternion.copy(shapeWorldQuaternion);
                }
                meshIndex++;
            }
        }
        for (let i = meshIndex; i < meshes.length; i++) {
            const mesh = meshes[i];
            if (mesh) {
                scene.remove(mesh);
            }
        }
        meshes.length = meshIndex;
        requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}
exports.default = renderWireframes;
