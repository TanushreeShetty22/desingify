"use client";

import * as THREE from "three";
import { Minimize } from "lucide-react";
import { OrbitControls } from "three-stdlib";
import React, { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

interface AIModalCabinetProps {
  aiSettings: {
    width: string;
    height: string;
    depth: string;
    thickness: string;
    materialColor: string;
    shelves: string;
  };
  isResizing: boolean;
  toggleResizing: () => void;
}

const textureURLs = {
  lightOak: {
    larger: "https://i.ibb.co/GxqXx2d/light-oak-larger-texture.png",
    edges: "https://i.ibb.co/jMXH2FB/light-oak-edges-texture.png",
  },
  pine: {
    larger: "https://i.ibb.co/ZgRM6kJ/pine-larger-texture.png",
    edges: "https://i.ibb.co/2S3PYgL/pine-edges-texture.png",
  },
  walnut: {
    larger: "https://i.ibb.co/V9HbMLP/walnut-larger-texture.png",
    edges: "https://i.ibb.co/Pt1j8Sv/walnut-edges-texture.png",
  },
};

// Function to create a panel with different materials for faces and edges
function createPanel(
  w: number,
  h: number,
  d: number,
  largerMaterial: THREE.Material,
  edgeMaterial: THREE.Material
) {
  const geometry = new THREE.BoxGeometry(w, h, d);
  const materials = [
    largerMaterial, // Front face
    largerMaterial, // Back face
    edgeMaterial, // Top face
    edgeMaterial, // Bottom face
    edgeMaterial, // Right face
    edgeMaterial, // Left face
  ];
  const mesh = new THREE.Mesh(geometry, materials);
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  const edges = new THREE.EdgesGeometry(geometry);
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
  const edgeLines = new THREE.LineSegments(edges, lineMaterial);

  const group = new THREE.Group();
  group.add(mesh);
  group.add(edgeLines);

  return group;
}

// Function to create a shelf
function createShelf(
  width: number,
  thickness: number,
  depth: number,
  largerMaterial: THREE.Material,
  edgeMaterial: THREE.Material
) {
  return createPanel(
    width - 2 * thickness,
    thickness,
    depth - 2 * thickness,
    largerMaterial,
    edgeMaterial
  );
}

// Function to update the cabinet
function updateCabinet(
  scene: THREE.Scene,
  cabinetGroup: THREE.Group,
  thickness: number,
  height: number,
  depth: number,
  width: number,
  largerMaterial: THREE.Material,
  edgeMaterial: THREE.Material,
  shelves: number
) {
  scene.remove(cabinetGroup);
  cabinetGroup.clear();

  const leftPanel = createPanel(
    thickness,
    height,
    depth,
    largerMaterial,
    edgeMaterial
  );
  const rightPanel = createPanel(
    thickness,
    height,
    depth,
    largerMaterial,
    edgeMaterial
  );
  const topPanel = createPanel(
    width - 2 * thickness,
    thickness,
    depth,
    largerMaterial,
    edgeMaterial
  );
  const bottomPanel = createPanel(
    width - 2 * thickness,
    thickness,
    depth,
    largerMaterial,
    edgeMaterial
  );
  const backPanel = createPanel(
    width - 2 * thickness,
    height - 2 * thickness,
    thickness,
    largerMaterial,
    edgeMaterial
  );

  leftPanel.position.set(-width / 2 + thickness / 2, 0, 0);
  rightPanel.position.set(width / 2 - thickness / 2, 0, 0);
  topPanel.position.set(0, height / 2 - thickness / 2, 0);
  bottomPanel.position.set(0, -height / 2 + thickness / 2, 0);
  backPanel.position.set(0, 0, -depth / 2 + thickness / 2);

  cabinetGroup.add(leftPanel);
  cabinetGroup.add(rightPanel);
  cabinetGroup.add(topPanel);
  cabinetGroup.add(bottomPanel);
  cabinetGroup.add(backPanel);

  for (let i = 1; i <= shelves; i++) {
    const shelf = createShelf(
      width,
      thickness,
      depth,
      largerMaterial,
      edgeMaterial
    );
    shelf.position.set(0, -height / 2 + i * (height / (shelves + 1)), 0);
    cabinetGroup.add(shelf);
  }

  scene.add(cabinetGroup);
}

// Function to animate the scene
function animate(
  controls: OrbitControls,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer
) {
  requestAnimationFrame(() => animate(controls, scene, camera, renderer));
  controls.update();
  renderer.render(scene, camera);
}

export const AIModalCabinet = ({
  aiSettings,
  isResizing,
  toggleResizing,
}: AIModalCabinetProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const shelves = aiSettings && parseInt(aiSettings.shelves);

  useEffect(() => {
    if (mountRef.current) {
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xffffff);

      let camera: THREE.PerspectiveCamera;

      if (!isResizing) {
        camera = new THREE.PerspectiveCamera(80, 1, 1, 2000);
      } else {
        camera = new THREE.PerspectiveCamera(
          80,
          window.innerWidth / window.innerHeight,
          1,
          2000
        );
      }

      camera.position.set(
        800 * Math.cos(THREE.MathUtils.degToRad(50)),
        800 * Math.sin(THREE.MathUtils.degToRad(23)),
        800 * Math.sin(THREE.MathUtils.degToRad(50))
      );
      camera.lookAt(0, 0, 0);
      scene.add(camera);

      const renderer = new THREE.WebGLRenderer({ antialias: true });
      if (!isResizing) renderer.setSize(500, 500);
      else renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      mountRef.current.appendChild(renderer.domElement);

      if (!isResizing) {
        mountRef.current.style.width = "500px";
        mountRef.current.style.height = "500px";
      }

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.2;
      controls.maxPolarAngle = Math.PI / 2;
      controls.enablePan = false;
      controls.minDistance = 0;
      controls.maxDistance = 1500;
      controls.update();

      const width = aiSettings && parseInt(aiSettings.width);
      const depth = aiSettings && parseInt(aiSettings.depth);
      const height = aiSettings && parseInt(aiSettings.height);
      const thickness = aiSettings && parseInt(aiSettings.thickness);

      if (isNaN(width) || isNaN(depth) || isNaN(height) || isNaN(thickness)) {
        console.error("Invalid dimensions in aiSettings");
        return;
      }

      const textureLoader = new THREE.TextureLoader();
      let largerTexture, edgeTexture;

      switch ((aiSettings && aiSettings.materialColor) || "#D3B8AE") {
        case "#D3B8AE":
          largerTexture = textureLoader.load(textureURLs.lightOak.larger);
          edgeTexture = textureLoader.load(textureURLs.lightOak.edges);
          break;
        case "#F3D6C4":
          largerTexture = textureLoader.load(textureURLs.pine.larger);
          edgeTexture = textureLoader.load(textureURLs.pine.edges);
          break;
        case "#D9B68C":
          largerTexture = textureLoader.load(textureURLs.walnut.larger);
          edgeTexture = textureLoader.load(textureURLs.walnut.edges);
          break;
        default:
          largerTexture = edgeTexture = null;
      }

      const largerMaterial = new THREE.MeshStandardMaterial({
        map: largerTexture,
        roughness: 0.5,
        metalness: 0.2,
      });
      const edgeMaterial = new THREE.MeshStandardMaterial({
        map: edgeTexture,
        roughness: 0.5,
        metalness: 0.2,
      });

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(1000, 1000, 1000);
      directionalLight.castShadow = true;
      scene.add(directionalLight);

      const cabinetGroup = new THREE.Group();
      updateCabinet(
        scene,
        cabinetGroup,
        thickness,
        height,
        depth,
        width,
        largerMaterial,
        edgeMaterial,
        shelves
      );

      animate(controls, scene, camera, renderer);

      return () => {
        mountRef.current?.removeChild(renderer.domElement);
      };
    }
  }, [aiSettings, isResizing]);

  return (
    <div>
      <Button
        variant="outline"
        onClick={toggleResizing}
        className="absolute top-4 right-4 z-10"
      >
        <Minimize size={20} />
      </Button>
      <div
        ref={mountRef}
        className={cn("w-full h-full", isResizing ? "overflow-hidden" : "overflow-hidden")}
      />
    </div>
  );
};
