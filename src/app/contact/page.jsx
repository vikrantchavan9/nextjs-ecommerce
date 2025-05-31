// app/contact/page.jsx
import ContactForm from '@/components/ContactForm'; // Import the client component

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-5xl md:text-6xl leading-tight">
          Get in Touch
        </h1>
        <p className="mt-4 text-md text-gray-600">
          We'd love to hear from you! Whether you have a question about our products,
          feedback, or just want to say hello, feel free to reach out.
        </p>
      </div>

      {/* The ContactForm component is a Client Component */}
      <ContactForm />

      {/* Optional: Add more contact info or a map here */}
      <div className="mt-12 text-center text-gray-700 text-base">
        <p className="font-semibold mb-2">Other Ways to Connect:</p>
        <p>Email: <a href="mailto:info@yourstore.com" className="text-indigo-600 hover:underline">vikrantchavan200@gmail.com</a></p>
        <p>Address: MyStore, canada corner, Nashik 422003</p>
      </div>
    </div>
  );
}
