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
  // * New section: Texture URLs
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

  const shelves = aiSettings && parseInt(aiSettings.shelves);

  useEffect(() => {
    if (mountRef.current) {
      // Create the scene
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xffffff);

      // Set up the camera

      let camera: any;

      if (!isResizing) {
        camera = new THREE.PerspectiveCamera(
          80,
          1, // Aspect ratio is 1 because width and height are the same
          1,
          2000
        );
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

      // Create the renderer
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      {
        !isResizing && renderer.setSize(500, 500); // Set size to 400x400 pixels
      }
      {
        isResizing && renderer.setSize(window.innerWidth, window.innerHeight);
      }
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      mountRef.current.appendChild(renderer.domElement);

      if (!isResizing) {
        // Set styles for the container
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

      // Validate dimensions
      if (isNaN(width) || isNaN(depth) || isNaN(height) || isNaN(thickness)) {
        console.error("Invalid dimensions in aiSettings");
        return;
      }

      // Load textures based on the selected material color * New section
      const textureLoader = new THREE.TextureLoader();
      let largerTexture, edgeTexture;

      switch ((aiSettings && aiSettings.materialColor) || "#D3B8AE") {
        case "#D3B8AE": // Light Oak
          largerTexture = textureLoader.load(textureURLs.lightOak.larger);
          edgeTexture = textureLoader.load(textureURLs.lightOak.edges);
          break;
        case "#F3D6C4": // Pine
          largerTexture = textureLoader.load(textureURLs.pine.larger);
          edgeTexture = textureLoader.load(textureURLs.pine.edges);
          break;
        case "#D9B68C": // Walnut
          largerTexture = textureLoader.load(textureURLs.walnut.larger);
          edgeTexture = textureLoader.load(textureURLs.walnut.edges);
          break;
        default:
          largerTexture = edgeTexture = null; // Use default textures or color if needed
      }

      // Create materials for larger faces and edges * New section
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

      // Add ambient light
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);

      // Add directional light with shadows
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(1000, 1000, 1000);
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.width = 2048;
      directionalLight.shadow.mapSize.height = 2048;
      scene.add(directionalLight);

      // Initialize cabinet group
      let cabinetGroup = new THREE.Group();

      // Function to create a panel with different materials for faces and edges * New section
      const createPanel = (w: number, h: number, d: number) => {
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
      };

      // Function to create a shelf
      const createShelf = () => {
        return createPanel(
          width - 2 * thickness,
          thickness,
          depth - 2 * thickness
        );
      };

      // Function to update the cabinet
      const updateCabinet = () => {
        scene.remove(cabinetGroup);
        cabinetGroup = new THREE.Group();

        // Create panels
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

        // Set panel positions
        leftPanel.position.set(-width / 2 + thickness / 2, 0, 0);
        rightPanel.position.set(width / 2 - thickness / 2, 0, 0);
        topPanel.position.set(0, height / 2 - thickness / 2, 0);
        bottomPanel.position.set(0, -height / 2 + thickness / 2, 0);
        backPanel.position.set(0, 0, -depth / 2 + thickness / 2);

        // Add panels to cabinet group
        cabinetGroup.add(leftPanel);
        cabinetGroup.add(rightPanel);
        cabinetGroup.add(topPanel);
        cabinetGroup.add(bottomPanel);
        cabinetGroup.add(backPanel);

        // Add shelves to cabinet group
        for (let i = 1; i <= shelves; i++) {
          const shelf = createShelf();
          shelf.position.set(0, -height / 2 + i * (height / (shelves + 1)), 0);
          cabinetGroup.add(shelf);
        }

        // Add cabinet group to scene
        scene.add(cabinetGroup);
      };

      // Initial cabinet update
      updateCabinet();

      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      };

      animate();

      // Handle window resize
      window.addEventListener("resize", () => {
        camera.aspect = 1; // Maintain aspect ratio of 1
        camera.updateProjectionMatrix();
        renderer.setSize(400, 400); // Set size to 400x400 pixels
      });

      // Cleanup function
      return () => {
        if (mountRef.current) {
          // eslint-disable-next-line react-hooks/exhaustive-deps
          mountRef.current.removeChild(renderer.domElement);
        }
      };
    }
  }, [aiSettings, isResizing, shelves]);

  return (
    <>
      <div ref={mountRef} className={cn("h-full")} />
    </>
  );
};
