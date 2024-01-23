import * as THREE from "https://www.unpkg.com/three@0.160.1/build/three.module.js";

const mainContainer = {
  element: null,
  width: 320,
  height: 480,
};

const canvas = {
  element: null,
  width: 320,
  height: 480,
};

let renderer = null;
let scene = null;
let camera = null;
let box = null;

const init = () => {
  mainContainer.element = document.getElementById("main-container");
  mainContainer.element.style.position = "relative";
  mainContainer.element.style.margin = "5px";
  mainContainer.element.style.width = mainContainer.width + "px";
  mainContainer.element.style.height = mainContainer.height + "px";
  mainContainer.element.style.display = "flex";
  mainContainer.element.style.alignItems = "center";
  mainContainer.element.style.justifyContent = "center";
  mainContainer.element.style.flexDirection = "column";
  mainContainer.element.style.overflow = "hidden";
  mainContainer.element.style.userSelect = "none";
  mainContainer.element.style.webkitUserSelect = "none";

  canvas.element = document.createElement("canvas");
  mainContainer.element.appendChild(canvas.element);

  renderer = new THREE.WebGLRenderer({
    canvas: canvas.element,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(canvas.width, canvas.height);

  // シーンを作成
  scene = new THREE.Scene();

  // カメラを作成
  camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height);
  camera.position.set(0, 0, +1000);

  // 箱を作成
  const geometry = new THREE.BoxGeometry(200, 200, 400);
  const material = new THREE.MeshNormalMaterial();
  box = new THREE.Mesh(geometry, material);
  scene.add(box);
};

const tick = () => {
  box.rotation.x += 0.01;
  box.rotation.y += 0.01;
  renderer.render(scene, camera); // レンダリング

  requestAnimationFrame(tick);
};

window.onload = () => {
  init();
  tick();
};
