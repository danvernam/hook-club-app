export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
      <div className="max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">404</h2>
        <p className="text-gray-600 mb-6">This page could not be found.</p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          Go back home
        </a>
      </div>
    </div>
  );
}

