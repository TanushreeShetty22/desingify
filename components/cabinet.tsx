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

export const AIModalCabinet = ({
  aiSettings,
  isResizing,
  toggleResizing,
}: AIModalCabinetProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const currentRenderer = useRef<THREE.WebGLRenderer | null>(null); // Track renderer

  const shelves = aiSettings && parseInt(aiSettings.shelves);

  useEffect(() => {
    if (mountRef.current) {
      // Remove any existing renderer before creating a new one
      if (currentRenderer.current) {
        mountRef.current.removeChild(currentRenderer.current.domElement);
        currentRenderer.current.dispose();
      }

      // Create the scene
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xffffff);

      // Set up the camera
      let camera = new THREE.PerspectiveCamera(
        80,
        isResizing ? window.innerWidth / window.innerHeight : 1,
        1,
        2000
      );

      camera.position.set(
        800 * Math.cos(THREE.MathUtils.degToRad(50)),
        800 * Math.sin(THREE.MathUtils.degToRad(23)),
        800 * Math.sin(THREE.MathUtils.degToRad(50))
      );
      camera.lookAt(0, 0, 0);
      scene.add(camera);

      // Create the renderer
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(
        isResizing ? window.innerWidth : 500,
        isResizing ? window.innerHeight : 500
      );
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      currentRenderer.current = renderer; // Save the renderer

      // Append renderer to the DOM
      mountRef.current.appendChild(renderer.domElement);

      if (!isResizing) {
        mountRef.current.style.width = "500px";
        mountRef.current.style.height = "500px";
      }

      // Set up orbit controls
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.2;
      controls.maxPolarAngle = Math.PI / 2;
      controls.enablePan = false;
      controls.minDistance = 0;
      controls.maxDistance = 1500;
      controls.update();

      // Parse dimensions from aiSettings
      const width = aiSettings && parseInt(aiSettings.width);
      const depth = aiSettings && parseInt(aiSettings.depth);
      const height = aiSettings && parseInt(aiSettings.height);
      const thickness = aiSettings && parseInt(aiSettings.thickness);

      if (isNaN(width) || isNaN(depth) || isNaN(height) || isNaN(thickness)) {
        console.error("Invalid dimensions in aiSettings");
        return;
      }

      // Load textures based on the selected material color
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
      directionalLight.shadow.mapSize.width = 2048;
      directionalLight.shadow.mapSize.height = 2048;
      scene.add(directionalLight);

      let cabinetGroup = new THREE.Group();

      const createPanel = (w: number, h: number, d: number) => {
        const geometry = new THREE.BoxGeometry(w, h, d);
        const materials = [
          largerMaterial,
          largerMaterial,
          edgeMaterial,
          edgeMaterial,
          edgeMaterial,
          edgeMaterial,
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
      };

      const createShelf = () =>
        createPanel(width - 2 * thickness, thickness, depth - 2 * thickness);

      const updateCabinet = () => {
        scene.remove(cabinetGroup);
        cabinetGroup = new THREE.Group();

        const leftPanel = createPanel(thickness, height, depth);
        const rightPanel = createPanel(thickness, height, depth);
        const topPanel = createPanel(width - 2 * thickness, thickness, depth);
        const bottomPanel = createPanel(
          width - 2 * thickness,
          thickness,
          depth
        );
        const backPanel = createPanel(
          width - 2 * thickness,
          height - 2 * thickness,
          thickness
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
          const shelf = createShelf();
          shelf.position.set(0, -height / 2 + i * (height / (shelves + 1)), 0);
          cabinetGroup.add(shelf);
        }

        scene.add(cabinetGroup);
      };

      updateCabinet();

      const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      };

      animate();

      window.addEventListener("resize", () => {
        camera.aspect = 1;
        camera.updateProjectionMatrix();
        renderer.setSize(400, 400);
      });

      return () => {
        if (currentRenderer.current && mountRef.current) {
          mountRef.current.removeChild(currentRenderer.current.domElement);
          currentRenderer.current.dispose();
          currentRenderer.current = null;
        }
      };
    }
  }, [aiSettings, isResizing, shelves]);

  return (
    <>
      {isResizing && (
        <Button
          onClick={toggleResizing}
          variant="outline"
          className="absolute z-10 right-3 top-3 h-10 w-10"
        >
          <Minimize className="h-4 w-4" />
        </Button>
      )}
      <div
        ref={mountRef}
        className="relative bg-white rounded-md overflow-hidden w-full h-[400px] max-w-full"
      ></div>
    </>
  );
};
