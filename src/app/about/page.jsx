// app/about/page.jsx

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 md:p-12">


        <section className="mb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            About Us
          </h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-gray-700 space-y-4">
              <p>
                Welcome to MyStore, designed and developed for your premier destination for the latest trends in fashion. Founded with a vision to bring high-quality, stylish, and accessible clothing to everyone, we believe that fashion is more than just clothes – it's a form of self-expression.
              </p>
              <p>
                Our journey began with a simple idea: to curate a collection that empowers individuals to feel confident and comfortable in their own skin. We meticulously select each piece, focusing on exceptional craftsmanship, sustainable practices where possible, and designs that resonate with modern sensibilities.
              </p>
            </div>
            <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden shadow-md">
              {/* Placeholder image for visual appeal */}
              <img
                src="https://placehold.co/600x400/A78BFA/FFFFFF?text=Our+Mission"
                alt="Our Mission"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Our Values
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-indigo-50 p-6 rounded-lg shadow-sm text-center">
              <h3 className="text-xl font-semibold text-indigo-700 mb-3">Quality & Craftsmanship</h3>
              <p className="text-gray-700 text-sm">
                We are committed to offering products that are not only stylish but also built to last, ensuring you get the best value.
              </p>
            </div>
            <div className="bg-indigo-50 p-6 rounded-lg shadow-sm text-center">
              <h3 className="text-xl font-semibold text-indigo-700 mb-3">Customer Satisfaction</h3>
              <p className="text-gray-700 text-sm">
                Your happiness is our priority. We strive to provide an exceptional shopping experience from start to finish.
              </p>
            </div>
            <div className="bg-indigo-50 p-6 rounded-lg shadow-sm text-center">
              <h3 className="text-xl font-semibold text-indigo-700 mb-3">Sustainable Practices</h3>
              <p className="text-gray-700 text-sm">
                We continuously seek out and support brands that prioritize ethical production and environmental responsibility.
              </p>
            </div>
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Join Our Fashion Journey
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Explore our diverse collections and find pieces that tell your unique story.
          </p>
          <a
            href="/shop"
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 transition duration-150 ease-in-out shadow-lg"
          >
            Shop Our Collections
          </a>
        </section>
      </div>
    </div>
  );
}
