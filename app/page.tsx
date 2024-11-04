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
              <a href="#about" className="hover:text-gray-300">
                About Us
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-gray-300">
                Contact
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
            className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition"
          >
            Make 3D Model
          </a>
        </main>

        <footer className="absolute bottom-4 flex flex-col items-center text-sm">
          {/* Footer content here */}
        </footer>
      </div>
    </>
  );
};

export default Home;
