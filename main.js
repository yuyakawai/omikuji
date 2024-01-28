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
  const material = new THREE.MeshLambertMaterial({ color: 0xcd853f });
  box = new THREE.Mesh(geometry, material);
  scene.add(box);
};

const initRod = () => {
  let texture = createTexture({
    text: "at",
    fontSize: 1200,
  });
  const geometry = new THREE.BoxGeometry(150, 400, 10);
  const material = new THREE.MeshLambertMaterial({
    color: 0xffffff,
    map: texture,
  });

  rod = new THREE.Mesh(geometry, material);

  scene.add(rod);
};

const createTexture = (options) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // measureTextするためいったん設定
  const fontFamily = "sans-serif";
  ctx.font = `${options.fontSize}px '${fontFamily}'`;
  const textWidth = ctx.measureText(options.text); // 文字の横幅を取得

  // dprに対応したサイズを計算
  const width = textWidth.width;
  const height = options.fontSize * 0.8; // 文字に合わせて高さを調整。ここの高さは任意で
  // 幅を指定
  canvas.width = width;
  canvas.height = height;

  // 中央にテキストを描画
  ctx.font = `${options.fontSize}px '${fontFamily}'`;
  ctx.textAlign = "left";
  ctx.textBaseline = "hanging";
  ctx.fillStyle = "#cd853f";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.fillText(options.text, -5, 0); // 文字が途切れないように調整。数値はよしなに

  // ↓canvasの文字を確認したいとき。テキストを描画したcanvasをbodyに追加しているだけです。
  // document.body.appendChild(canvas);
  // canvas.style.backgroundColor = '#933';
  // canvas.style.position = 'relative';

  // テクスチャを作成
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = false;
  // ↓ここら辺の設定をしておかないとthree.jsでエラーが出る時がある
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.format = THREE.RGBAFormat;

  return texture;
};

const tick = () => {
  if (isDrawStart) {
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
