export default function About() {
  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url(/BG1.png)" }}
    >
      <div className="bg-black bg-opacity-60 p-8 md:p-12 lg:p-16 text-white rounded-lg max-w-3xl mx-4 md:mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">
          About Us
        </h1>
        <p className="text-lg md:text-xl mb-4 text-center">
          Welcome to Designify! We are a team of passionate students committed
          to developing innovative solutions that blend technology with design.
          Our capstone project, Designify, is an AI-powered 3D design and
          material optimization platform created in collaboration with{" "}
          <a href="https://www.pytha.com/">
            {" "}
            <strong>PYTHA Company India</strong>.
          </a>
        </p>
        <p className="text-lg md:text-xl mb-4 text-center">
          Designify aims to streamline the design process for carpenters,
          furniture designers, and industries like interior design, stonework,
          tiles, bathrooms, and kitchens. Our platform leverages machine
          learning and 3D modeling to convert text prompts into detailed 3D
          renditions and also can generate cutlists making it easier for
          professionals to visualize and optimize materials.
        </p>
        <p className="text-lg md:text-xl text-center mb-8">
          This capstone project has been a remarkable journey, allowing us to
          apply our knowledge, expand our skills, and make a real impact in the
          design and manufacturing industry.
        </p>

        <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-center">
          Meet the Team
        </h2>
        <ul className="flex flex-col md:flex-row justify-center gap-4 text-lg text-center">
          <li>Tanushree</li>
          <li>Shriya</li>
          <li>Vedant</li>
          <li>Aditra</li>
        </ul>
      </div>
    </div>
  );
}
