import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { SSAARenderPass } from 'three/addons/postprocessing/SSAARenderPass.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

export default class GLTFViewer {

    static scene
    static camera
    static loader
    static renderer
    static controls
    static gltfObject
    static light
    static gui
    static ssaaRenderPass
    static composer

    /**
     * creates a scene that can display gltf/glb files
     */
    static start() {
        const width = window.innerWidth - 50
        const height = window.innerHeight - 50
        const aspectRatio = width / height
        const scale = 0.15;

        // create new renderers from the THREE engine
        GLTFViewer.scene = new THREE.Scene();
        // GLTFViewer.camera = new THREE.PerspectiveCamera(20, aspectRatio, 0.1, 1000);
        GLTFViewer.camera = new THREE.OrthographicCamera(-aspectRatio * scale, aspectRatio * scale, scale, -scale, 0.1, 1000);

        GLTFViewer.renderer = new THREE.WebGLRenderer();
        GLTFViewer.loader = new GLTFLoader();
        GLTFViewer.controls = new OrbitControls(GLTFViewer.camera, GLTFViewer.renderer.domElement);

        // set the renderer size and add it to the webpage
        GLTFViewer.renderer.setSize(width, height);
        document.body.appendChild(GLTFViewer.renderer.domElement);
        GLTFViewer.postProcessing();
        GLTFViewer.composer.setSize(width, height);

        // add my own objects to the scene
        GLTFViewer.camera.position.z = 100;
        // GLTFViewer.addBackground()
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
        GLTFViewer.light = new THREE.PointLight(0xffffff, 1);
        GLTFViewer.scene.add(GLTFViewer.light);

        const light = new THREE.AmbientLight(0xffffff, 0.2);
        GLTFViewer.scene.add(light);
    }

    /**
     * anti aliasing
     */
    static postProcessing() {
        // Create the composer and anti aliasing (ssaa) pass
        GLTFViewer.composer = new EffectComposer(GLTFViewer.renderer);
        GLTFViewer.composer.setPixelRatio(1); // ensure pixel ratio is always 1 for performance reasons
        GLTFViewer.ssaaRenderPass = new SSAARenderPass(GLTFViewer.scene, GLTFViewer.camera);
        GLTFViewer.composer.addPass(GLTFViewer.ssaaRenderPass);

        // set the anti aliasing settings
        GLTFViewer.ssaaRenderPass.clearColor = 0xffffff; //background color
        GLTFViewer.ssaaRenderPass.clearAlpha = 0.8; //background opacity/brightness

        GLTFViewer.ssaaRenderPass.sampleLevel = 2; //anti aliasing level (1:1x 2:4x 3:8x etc.)
        GLTFViewer.ssaaRenderPass.unbiased = true; //unbiased removes weird circles
        GLTFViewer.ssaaRenderPass.enabled = true; //enable the render pass

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

            console.log(gltf.asset)

            // add the new one
            GLTFViewer.gltfObject = gltf.scene
            GLTFViewer.scene.add(GLTFViewer.gltfObject);

            const scale = gltf.asset.generator ? 0.01 : 1
            GLTFViewer.gltfObject.scale.set(scale, scale, scale)

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
        GLTFViewer.composer.render();
    }
}
