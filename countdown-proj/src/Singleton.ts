import * as THREE from "three";
import { GLTF } from "three/addons/loaders/GLTFLoader.js";
/**
 * @class singleton has things that can be passed around after its manually initialised has following vars
 *  @type{divideFactor: number}
 *  @type{width: number}
 *  @type{height: number}
 *  @type{renderer: THREE.WebGLRenderer}
 *  @type{canvasElement: HTMLCanvasElement}
 *  @type{mainCamera: THREE.PerspectiveCamera}
 *  @type{scene: THREE.Scene}
 *  @type{videoTexture: THREE.VideoTexture}
 *
 */
class Singleton {
	public static ins: Singleton;
	public static divideFactorForWidth: number = 3;
	public static divideFactorForHeight: number = 1.5;
	public width: number;
	public height: number;

	public renderer: THREE.WebGLRenderer;
	public canvasElement: HTMLCanvasElement;
	public mainCamera: THREE.PerspectiveCamera;
	public scene: THREE.Scene;
	public videoTexture: THREE.VideoTexture;
	public GLTFObjectMeshes!: THREE.Mesh[];
	public GLTFObject!: GLTF;
	isTouchDevice(): boolean {
		return "ontouchstart" in window || navigator.maxTouchPoints > 0;
	}
	public constructor() {
		if (this.isTouchDevice()) {
			// code for mobile devices
			this.width = document.querySelector("html")!.clientWidth / 1.5;
			this.height = document.querySelector("html")!.clientHeight / 3;
		} else {
			// code for desktop devices
			this.width =
				document.querySelector("html")!.clientWidth /
				Singleton.divideFactorForWidth;
			this.height =
				document.querySelector("html")!.clientHeight /
				Singleton.divideFactorForHeight;
		}
		this.canvasElement = document.getElementById(
			"app"
		) as HTMLCanvasElement;

		//renderer
		this.renderer = new THREE.WebGLRenderer({
			canvas: this.canvasElement,
			antialias: true,
		});
		//camera
		this.mainCamera = new THREE.PerspectiveCamera(
			60,
			this.width / this.height,
			1,
			100
		);
		// scene
		this.scene = new THREE.Scene();
		//video
		const video = document.createElement("video");
		video.src = "video.mp4";
		video.loop = true;
		video.muted = true;
		video.style.transform = "scaleZ(-1)";
		video.play();
		// video Texture
		this.videoTexture = new THREE.VideoTexture(video);
		this.videoTexture.minFilter = THREE.LinearFilter;
		this.videoTexture.magFilter = THREE.LinearFilter;
		this.videoTexture.format = THREE.RGBAFormat;
		this.videoTexture.matrixAutoUpdate = false;
	}
}

export default Singleton;
