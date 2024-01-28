import * as THREE from "https://www.unpkg.com/three@0.160.1/build/three.module.js";

const mainContainer = {
  element: null,
  width: 320,
  height: 480,
};

const description = {
  element: null,
  width: 320,
  height: 80,
};

const canvas = {
  element: null,
  width: 320,
  height: 480,
};

const fortuneList = ["大吉", "中吉", "小吉", "吉", "凶", "大凶"];

let renderer = null;
let scene = null;
let camera = null;
let box = null;
let rod;
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

  description.element = document.createElement("div");
  description.element.style.position = "absolute";
  description.element.style.top = "0px";
  description.element.style.left = "0px";
  description.element.style.width = description.width + "px";
  description.element.style.height = description.height + "px";
  description.element.style.display = "flex";
  description.element.style.alignItems = "center";
  description.element.style.justifyContent = "center";
  description.element.style.flexDirection = "column";
  description.element.style.fontSize = "22px";
  description.element.style.backgroundColor = "transparent";
  description.element.style.color = "white";
  description.element.textContent = "画面を押しておみくじを引く";
  mainContainer.element.appendChild(description.element);

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

  initBox();
  initRod();
};

const initBox = () => {
  const geometry = new THREE.BoxGeometry(200, 400, 200);
  const material = new THREE.MeshLambertMaterial({
    color: 0xcd853f,
  });
  box = new THREE.Mesh(geometry, material);
  scene.add(box);
};

const initRod = () => {
  const texture = createTexture(
    fortuneList[Math.floor(Math.random() * fortuneList.length)]
  );
  const geometry = new THREE.BoxGeometry(50, 400, 7);
  const material = new THREE.MeshLambertMaterial({
    color: 0xffffff,
    map: texture,
  });

  rod = new THREE.Mesh(geometry, material);

  scene.add(rod);
};

const createTexture = (text) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const width = 150;
  const height = 1050;
  canvas.width = width;
  canvas.height = height;

  ctx.font = "135px sans-serif";
  ctx.textAlign = "left";
  ctx.fillStyle = "#cd853f";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";

  text.split("").forEach((str, index) => {
    ctx.fillText(str, canvas.width / 2, canvas.height * 0.6 + index * 150);
  });
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = false;

  return texture;
};

const tick = () => {
  if (isDrawStart) {
    description.element.style.display = "none";
    box.position.y += 3.5;
    camera.position.z -= 2.0;
    if (camera.position.z < 600) {
      return;
    }
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
