import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export default class GLTFViewer {

    static scene
    static camera
    static loader
    static renderer
    static controls
    static gltfObject
    static light

    /**
     * creates a scene that can display gltf/glb files
     */
    static start() {

        // create new renderers from the THREE engine
        GLTFViewer.scene = new THREE.Scene();
        GLTFViewer.camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 0.1, 1000);
        GLTFViewer.renderer = new THREE.WebGLRenderer();
        GLTFViewer.loader = new GLTFLoader();
        GLTFViewer.controls = new OrbitControls(GLTFViewer.camera, GLTFViewer.renderer.domElement);

        // set the renderer size and add it to the webpage
        GLTFViewer.renderer.setSize(window.innerWidth - 50, window.innerHeight - 50);
        document.body.appendChild(GLTFViewer.renderer.domElement);

        // add my own objects to the scene
        GLTFViewer.camera.position.z = 1;
        GLTFViewer.addBackground()
        GLTFViewer.addLight()

        // start the renderer
        GLTFViewer.animateLoop()
    }

    /**
     * creates an inside out sphere with a color as background
     */
    static addBackground(color = 0x68becc) {
        const geometry = new THREE.SphereGeometry(-10, 32, 16);
        const material = new THREE.MeshBasicMaterial({ color: color });
        const sphere = new THREE.Mesh(geometry, material);
        GLTFViewer.scene.add(sphere);
    }

    /**
     * creates ambient light and a point light at the camera
     */
    static addLight() {
        GLTFViewer.light = new THREE.PointLight(0xffffff, 0.5);
        GLTFViewer.scene.add(GLTFViewer.light);

        const light = new THREE.AmbientLight(0xffffff, 0.1);
        GLTFViewer.scene.add(light);
    }

    /**
     * loads a gltf/glb file to the renderer and unloads any previous glb files
     * @param {string} path the path to the gltf/glb file
     */
    static loadGltf(path) {
        console.log(`loading glb: ${path}`)
        GLTFViewer.loader.load(path, function (gltf) {
            // remove the old one
            if (GLTFViewer.gltfObject) GLTFViewer.scene.remove(GLTFViewer.gltfObject)

            // add the new one
            GLTFViewer.gltfObject = gltf.scene
            GLTFViewer.scene.add(GLTFViewer.gltfObject);

        }, undefined, function (error) {
            // log any errors
            console.error(error);
        });
    }

    /**
     * this function happens every frame
     */
    static animateLoop() {
        //call this function again the next frame
        requestAnimationFrame(GLTFViewer.animateLoop);

        // move the light to the camera
        GLTFViewer.light.position.x = GLTFViewer.camera.position.x
        GLTFViewer.light.position.y = GLTFViewer.camera.position.y
        GLTFViewer.light.position.z = GLTFViewer.camera.position.z

        // render the scene from the camera
        GLTFViewer.renderer.render(GLTFViewer.scene, GLTFViewer.camera);
    }
}
