# Import necessary libraries
import streamlit as st
import numpy as np
import torch
from transformers import AutoImageProcessor, AutoModelForDepthEstimation
import open3d as o3d
import cv2
from PIL import Image
import tempfile

# Load the pre-trained model for depth estimation
processor = AutoImageProcessor.from_pretrained("LiheYoung/depth-anything-large-hf")
model = AutoModelForDepthEstimation.from_pretrained("LiheYoung/depth-anything-large-hf").to("cuda")

# Define functions from the provided code
def get_intrinsics(H, W, fov=55.0):
    f = 0.5 * W / np.tan(0.5 * fov * np.pi / 180.0)
    cx = 0.5 * W
    cy = 0.5 * H
    return np.array([[f, 0, cx],
                     [0, f, cy],
                     [0, 0, 1]])

def pixel_to_point(depth_image, camera_intrinsics=None):
    height, width = depth_image.shape
    if camera_intrinsics is None:
        camera_intrinsics = get_intrinsics(height, width, fov=55.0)

    fx, fy = camera_intrinsics[0, 0], camera_intrinsics[1, 1]
    cx, cy = camera_intrinsics[0, 2], camera_intrinsics[1, 2]

    x = np.linspace(0, width - 1, width)
    y = np.linspace(0, height - 1, height)
    u, v = np.meshgrid(x, y)

    x_over_z = (u - cx) / fx
    y_over_z = (v - cy) / fy
    z = depth_image / np.sqrt(1.0 + x_over_z**2 + y_over_z**2)

    x = x_over_z * z
    y = y_over_z * z

    return x, y, z

def create_point_cloud(depth_image, color_image, camera_intrinsics=None, scale_ratio=100.0):
    height, width = depth_image.shape
    if camera_intrinsics is None:
        camera_intrinsics = get_intrinsics(height, width, fov=55.0)

    color_image = cv2.resize(color_image, (width, height))
    depth_image = np.maximum(depth_image, 1e-5)
    depth_image = scale_ratio / depth_image

    x, y, z = pixel_to_point(depth_image, camera_intrinsics)
    point_image = np.stack((x, y, z), axis=-1)
    cloud = o3d.geometry.PointCloud()
    cloud.points = o3d.utility.Vector3dVector(point_image.reshape(-1, 3))
    cloud.colors = o3d.utility.Vector3dVector(color_image.reshape(-1, 3) / 255.0)

    return cloud

# Initialize session state
if 'uploaded_image' not in st.session_state:
    st.session_state.uploaded_image = None
if 'ply_file' not in st.session_state:
    st.session_state.ply_file = None

# Streamlit app
st.title("Image to Point Cloud (.ply) Converter")

# Upload image
uploaded_image = st.file_uploader("Upload an image", type=["jpg", "jpeg", "png"])
if uploaded_image is not None:
    st.session_state.uploaded_image = uploaded_image  # Save to session state

# Process if there's an uploaded image in session state
if st.session_state.uploaded_image is not None:
    image = Image.open(st.session_state.uploaded_image)
    image = np.array(image.convert("RGB"))

    # Display the uploaded image
    st.image(image, caption="Uploaded Image", use_column_width=True)

    # Process the image to generate a depth map
    input_image = processor(images=image, return_tensors="pt").to("cuda")
    with torch.no_grad():
        depth_output = model(**input_image)
    depth_image = depth_output.predicted_depth.squeeze().cpu().numpy()

    # Create point cloud
    point_cloud = create_point_cloud(depth_image, image)

    # Save point cloud to .ply file and store in session state
    ply_tempfile = tempfile.NamedTemporaryFile(delete=False, suffix=".ply")
    o3d.io.write_point_cloud(ply_tempfile.name, point_cloud)
    st.session_state.ply_file = ply_tempfile.name

    # Provide a download link for the .ply file
    with open(st.session_state.ply_file, "rb") as f:
        st.download_button("Download .ply file", data=f, file_name="output.ply", mime="application/octet-stream")

    st.success("Point cloud generated and saved as .ply file!")
