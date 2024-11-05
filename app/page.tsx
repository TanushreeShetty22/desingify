const Home = () => {
  return (
    <>
      <div
        style={{ backgroundImage: "url('/BG1.png')" }}
        className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat text-white"
      >
        <nav className="absolute top-0 w-full py-6 px-8 flex justify-between items-center">
          <div className="text-2xl font-semibold">Designify</div>
          <ul className="flex space-x-8">
            <li>
              <a href="/aboutus" className="hover:text-yellow-700">
                About Us
              </a>
            </li>
          </ul>
        </nav>

        <main className="flex flex-col items-center text-center px-4 space-y-8">
          <h1 className="text-5xl font-bold">Welcome to Designify</h1>
          <p className="max-w-lg text-lg">
            An AI-powered platform that transforms your ideas into precise 3D
            models and optimizes material usage, revolutionizing the way you
            design and create. From carpentry to interior design, Designify
            empowers you to achieve more with less.
          </p>
          <a
            href="/3d-model"
            className="bg-yellow-700 text-white px-6 py-3 rounded-lg hover:bg-yellow-800 transition"
          >
            Make 3D Model
          </a>
        </main>
      </div>

      {/* Centered and Enlarged Features Section */}
      <section className="bg-white text-gray-800 py-24 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-yellow-700">
            Our Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 justify-center">
            <a
              href="/3d-model"
              className="p-10 w-full md:w-72 border border-yellow-700 rounded-lg shadow-lg hover:bg-yellow-100 transition transform hover:scale-105"
            >
              <h3 className="text-2xl font-semibold mb-4 text-yellow-700">
                AI-Powered Modeling
              </h3>
              <p>
                Transform your ideas into 3D models with our advanced AI tools,
                making the design process efficient and precise.
              </p>
            </a>
            <a
              href="#material-optimization"
              className="p-10 w-full md:w-72 border border-yellow-700 rounded-lg shadow-lg hover:bg-yellow-100 transition transform hover:scale-105"
            >
              <h3 className="text-2xl font-semibold mb-4 text-yellow-700">
                Material Optimization
              </h3>
              <p>
                Optimize material usage and reduce waste through intelligent
                recommendations and accurate modeling.
              </p>
            </a>
            <a
              href="#upload-2d-image"
              className="p-10 w-full md:w-72 border border-yellow-700 rounded-lg shadow-lg hover:bg-yellow-100 transition transform hover:scale-105"
            >
              <h3 className="text-2xl font-semibold mb-4 text-yellow-700">
                Upload 2D Image
              </h3>
              <p>
                Upload a 2D image to seamlessly convert it into a 3D model,
                allowing for enhanced visualization and design flexibility.
              </p>
            </a>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-yellow-700 py-4">
        <div className="flex justify-center text-sm text-white">
          <p>
            &copy; {new Date().getFullYear()} Designify. All Rights Reserved.
          </p>
        </div>
      </footer>
    </>
  );
};

export default Home;
