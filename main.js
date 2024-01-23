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
let isDrawStart = false;

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
  canvas.element.style.cursor = "pointer";
  mainContainer.element.appendChild(canvas.element);

  const handleButtonDown = (e) => {
    e.preventDefault();
    isDrawStart = true;
  };

  const handleButtonUp = (e) => {
    e.preventDefault();
  };

  if (window.ontouchstart === null) {
    canvas.element.ontouchstart = handleButtonDown;
    canvas.element.ontouchend = handleButtonUp;
  } else {
    canvas.element.onpointerdown = handleButtonDown;
    canvas.element.onpointerup = handleButtonUp;
  }

  renderer = new THREE.WebGLRenderer({
    canvas: canvas.element,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(canvas.width, canvas.height);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height);
  camera.position.set(0, 0, 1000);

  const directionalLight = new THREE.DirectionalLight(0xffffff);
  directionalLight.position.set(0, 0, 1);
  scene.add(directionalLight);

  const geometry = new THREE.BoxGeometry(200, 400, 200);
  const material = new THREE.MeshLambertMaterial({ color: 0xcd853f });
  box = new THREE.Mesh(geometry, material);
  scene.add(box);
};

const tick = () => {
  if (isDrawStart) {
    box.position.y += 3.5;
  } else {
    box.rotation.y += 0.01;
  }
  renderer.render(scene, camera);

  requestAnimationFrame(tick);
};

window.onload = () => {
  init();
  tick();
};
