export default function TestPage() {
  return (
    <div className="min-h-screen bg-yellow-600 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold text-yellow-600 mb-4">
          Tailwind is Working! ✅
        </h1>
        <p className="text-gray-600">
          Yellow background = Tailwind CSS is properly configured
        </p>
        <button className="mt-4 bg-yellow-600 text-white px-6 py-2 rounded hover:bg-yellow-700 transition">
          Test Button
        </button>
      </div>
    </div>
  );
}