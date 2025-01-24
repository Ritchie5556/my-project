<template>
  <div id="app">
    <div ref="container" class="container" style="width: 500px; height: 500px;"></div>
  </div>
</template>

<script>
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default {
  name: "ModelViewer",
  data() {
    return {
      scene: null,
      camera: null,
      renderer: null,
      model: null,
      controls: null,
      clock: new THREE.Clock(),
      loadingManager: null, // 用于管理加载流程
    };
  },
  mounted() {
    this.init();
    this.loadModel();
    window.addEventListener("resize", this.onWindowResize);
  },
  methods: {
    init() {
      // 创建场景
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0xeeeeee);

      // 设置相机
      this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
      this.camera.position.set(0, 0, 5);

      // 设置渲染器
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: "high-performance",
      });
      this.renderer.setSize(500, 500);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.$refs.container.appendChild(this.renderer.domElement);

      // 添加光源
      const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
      this.scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(1, 1, 1).normalize();
      this.scene.add(directionalLight);

      // 添加 OrbitControls 并调整速度
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.2; // 阻尼系数
      this.controls.rotateSpeed = 2.0; // 增加旋转速度
      this.controls.panSpeed = 1.5; // 增加平移速度

      // 初始化加载管理器
      this.loadingManager = new THREE.LoadingManager(
        () => console.log("模型加载完成"), // 完成加载后的回调
        (item, loaded, total) => console.log(`加载进度: ${loaded}/${total}`),
        (error) => console.error("加载错误: ", error)
      );
    },

    loadModel() {
      const dracoLoader = new DRACOLoader(this.loadingManager);
      dracoLoader.setDecoderPath("/draco/");

      const loader = new GLTFLoader(this.loadingManager);
      loader.setDRACOLoader(dracoLoader);

      loader.load(
        "/models/model.glb", // 模型路径
        (gltf) => {
          this.model = gltf.scene;

          // 为模型设置简单材质（无纹理）
          this.model.traverse((child) => {
            if (child.isMesh) {
              child.material = new THREE.MeshStandardMaterial({
                color: 0x6699ff, // 蓝色
                metalness: 0.5,
                roughness: 0.5,
              });
              child.material.needsUpdate = true;
            }
          });

          this.scene.add(this.model);
          this.animate();
        },
        null, // 不需要额外的加载进度处理
        (error) => console.log("加载模型失败: ", error)
      );
    },

    onWindowResize() {
      this.camera.aspect = 1;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(500, 500);
    },

    animate() {
      const render = () => {
        const delta = this.clock.getDelta();
        if (delta > 1 / 30) {
          this.controls.update(); // 更新控制器
          this.renderer.render(this.scene, this.camera);
        }
        requestAnimationFrame(render);
      };
      render();
    },
  },
};
</script>

<style scoped>
.container {
  position: relative;
  width: 500px;
  height: 500px;
  margin: auto;
  overflow: hidden;
}
</style>
