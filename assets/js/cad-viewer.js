(() => {
  const canvas = document.getElementById("cad-canvas");
  const statusEl = document.getElementById("cad-status");
  const viewer = canvas?.parentElement;
  const MODEL_PATH = "/assets/models/cad-portfolio.glb";

  if (!canvas || !viewer) {
    return;
  }

  const CDN_BASE = "https://unpkg.com/three@0.160.0";
  const FALLBACKS = [
    { check: () => window.THREE, url: `${CDN_BASE}/build/three.min.js` },
    { check: () => window.THREE && THREE.GLTFLoader, url: `${CDN_BASE}/examples/js/loaders/GLTFLoader.js` },
    { check: () => window.THREE && THREE.OrbitControls, url: `${CDN_BASE}/examples/js/controls/OrbitControls.js` },
  ];

  const loadScript = (url) =>
    new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src=\"${url}\"]`);
      if (existing) {
        existing.addEventListener("load", () => resolve());
        existing.addEventListener("error", (e) => reject(e));
        return;
      }
      const script = document.createElement("script");
      script.src = url;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = (e) => reject(e);
      document.head.appendChild(script);
    });

  const ensureDependencies = async () => {
    for (const { check, url } of FALLBACKS) {
      if (!check()) {
        await loadScript(url);
      }
    }
    return window.THREE && THREE.GLTFLoader && THREE.OrbitControls;
  };

  const init = async () => {
    const ready = await ensureDependencies().catch(() => false);
    if (!ready) {
      if (statusEl) {
        statusEl.textContent = "Three.js viewer dependencies failed to load. Check your connection and reload.";
      }
      return;
    }

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0c1016, 0.065);

    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0.5, 0.35, 2.6);
    scene.add(camera);

    const controls = new THREE.OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 1.1;
    controls.maxDistance = 4;
    controls.target.set(0, 0.25, 0);

    const hemi = new THREE.HemisphereLight(0x9fd7ff, 0x0c1016, 0.45);
    scene.add(hemi);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    keyLight.position.set(3, 5, 3);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x66aaff, 0.65);
    rimLight.position.set(-3, 2, -2);
    scene.add(rimLight);

    const bounce = new THREE.PointLight(0xff7b4a, 0.6, 10);
    bounce.position.set(0.5, 0.3, 1.5);
    scene.add(bounce);

    const stageGeometry = new THREE.CircleGeometry(1.8, 80);
    const stageMaterial = new THREE.MeshStandardMaterial({
      color: 0x0f131a,
      roughness: 0.9,
      metalness: 0.05,
      transparent: true,
      opacity: 0.65,
    });
    const stage = new THREE.Mesh(stageGeometry, stageMaterial);
    stage.rotation.x = -Math.PI / 2;
    stage.receiveShadow = true;
    scene.add(stage);

    const resize = () => {
      const { clientWidth, clientHeight } = viewer;
      if (!clientWidth || !clientHeight) return;

      const height = Math.max(clientHeight, 360);
      renderer.setSize(clientWidth, height, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      camera.aspect = clientWidth / height;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", resize);
    resize();

    let model;
    let idleSpin = 0;
    let scrollRotation = 0;

    const loader = new THREE.GLTFLoader();
    loader.load(
      MODEL_PATH,
      (gltf) => {
        model = gltf.scene;
        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            const materials = Array.isArray(child.material) ? child.material : [child.material];
            materials.forEach((material) => {
              if (!material) return;
              if (!material.map && material.metalness !== undefined && material.roughness !== undefined) {
                material.metalness = 0.15;
                material.roughness = 0.28;
              }
            });
          }
        });

        centerAndFitModel(model);
        scene.add(model);

        if (statusEl) {
          statusEl.textContent = "Scroll to rotate • Drag to orbit";
          statusEl.classList.add("loaded");
        }
      },
      undefined,
      () => {
        if (statusEl) {
          statusEl.textContent = "Model not found. Add cad-portfolio.glb to assets/models.";
        }
      },
    );

    function centerAndFitModel(object) {
      const box = new THREE.Box3().setFromObject(object);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 1.4 / maxDim;
      object.scale.setScalar(scale);

      box.setFromObject(object);
      const center = box.getCenter(new THREE.Vector3());
      object.position.sub(center);
      object.position.y -= size.y * scale * 0.2;
    }

    function updateScrollRotation() {
      const scrollY = window.scrollY || window.pageYOffset;
      scrollRotation = scrollY * 0.002;
    }

    window.addEventListener("scroll", updateScrollRotation);
    updateScrollRotation();

    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);

      const delta = clock.getDelta();
      idleSpin += delta * 0.45;

      if (model) {
        const targetRotation = scrollRotation + idleSpin * 0.2;
        model.rotation.y = THREE.MathUtils.lerp(model.rotation.y, targetRotation, 0.08);
        model.rotation.x = THREE.MathUtils.lerp(model.rotation.x, 0, 0.1);
      }

      controls.update();
      renderer.render(scene, camera);
    }

    animate();
  };

  init();
})();
