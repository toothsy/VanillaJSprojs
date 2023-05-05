import * as THREE from "three";
import { GLTFLoader, GLTF } from "three/addons/loaders/GLTFLoader.js";
import "./style.css";
import { gsap } from "gsap";
import Singleton from "./Singleton";
let isIntersected = false;
const mouse = new THREE.Vector2();

export const setup = () => {
	Singleton.ins.renderer.setPixelRatio(window.devicePixelRatio);
	Singleton.ins.renderer.setSize(Singleton.ins.width, Singleton.ins.height);
	Singleton.ins.renderer.setClearColor(0xffffff);
	let tl = gsap.timeline();

	//light
	// const frontLight = new THREE.SpotLight(0xffffff, 2.5);
	// const backLight = new THREE.SpotLight(0xffffff, 2.5);
	const ambientLight = new THREE.AmbientLight(0xffffff, 1);

	//loading gltf
	const loader = new GLTFLoader();
	const glbScale = 0.3;

	//vidtexture init

	// rotatin the video
	const rotationMatrix = new THREE.Matrix3().set(0, -1, 1, 1, 0, 0, 0, 0, 1);
	Singleton.ins.videoTexture.matrix.multiply(rotationMatrix);
	let normalCallback = (gltf: GLTF) => {
		Singleton.ins.GLTFObject = gltf;
		Singleton.ins.GLTFObjectMeshes = gltf.scene.children.map(
			(child) => child as THREE.Mesh
		);
		gltf.scene.scale.set(glbScale, glbScale, glbScale);
		const videoMaterial = new THREE.MeshBasicMaterial({
			map: Singleton.ins.videoTexture,
			side: THREE.FrontSide,
		});

		gltf.scene.traverse(function (node) {
			if (node instanceof THREE.Mesh && node.name == "Screen001") {
				node.material = videoMaterial;
			}
		});
		Singleton.ins.scene.add(gltf.scene);
		tl.to(gltf.scene.rotation, { y: 2.8, duration: 4 });
	};
	const loaderFunc = (path: string, callback: (gltf: GLTF) => void) => {
		loader.load(path, callback);
	};

	loaderFunc("./phone.glb", normalCallback);
	Singleton.ins.mainCamera.position.set(-0.1, 2.3, 3);

	Singleton.ins.scene.add(ambientLight);
	window.addEventListener("resize", onWindowResize, false);
	/// INTERACTIVITY
	let isDragging = false;
	let previousMousePosition = {
		x: 0,
		y: 0,
	};

	let onMouseDown = (event: MouseEvent) => {
		isDragging = true;
		console.log("mouse down");
	};
	let mouseMoveEvent = (event: MouseEvent) => {
		const deltaMove = {
			x: event.offsetX - previousMousePosition.x,
			y: event.offsetY - previousMousePosition.y,
		};
		console.log("MOUSE MOVED");

		if (isDragging) {
			const deltaRotationQuaternion =
				new THREE.Quaternion().setFromEuler(
					new THREE.Euler(
						toRadians(deltaMove.y * 1),
						toRadians(deltaMove.x * 1),
						0,
						"XYZ"
					)
				);
			Singleton.ins.GLTFObjectMeshes.forEach((mesh) => {
				mesh.quaternion.multiplyQuaternions(
					deltaRotationQuaternion,
					mesh.quaternion
				);
			});
		}

		previousMousePosition = {
			x: event.offsetX,
			y: event.offsetY,
		};
	};
	let onMouseUp = (event: MouseEvent) => {
		isDragging = false;
	};
	Singleton.ins.renderer.domElement.addEventListener(
		"mousemove",
		mouseMoveEvent,
		false
	);
	Singleton.ins.renderer.domElement.addEventListener(
		"mousedown",
		onMouseDown
	);

	Singleton.ins.renderer.domElement.addEventListener("mouseup", onMouseUp);
};
let onWindowResize = () => {
	Singleton.ins.mainCamera.aspect =
		Singleton.ins.canvasElement.clientWidth /
		Singleton.ins.canvasElement.clientHeight;

	Singleton.ins.mainCamera.updateProjectionMatrix();

	Singleton.ins.renderer.setSize(
		Singleton.ins.canvasElement.clientWidth,
		Singleton.ins.canvasElement.clientHeight
	);
};
export const tick = () => {
	Singleton.ins.renderer.outputEncoding = THREE.sRGBEncoding;
	Singleton.ins.videoTexture.needsUpdate = true;
	Singleton.ins.renderer.render(
		Singleton.ins.scene,
		Singleton.ins.mainCamera
	);
	window.requestAnimationFrame(tick);
};
function toRadians(degrees: number): number {
	return degrees * (Math.PI / 180);
}
