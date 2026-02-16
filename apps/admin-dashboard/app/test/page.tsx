export default function TestPage() {
  return (
    <div className="min-h-screen bg-primary flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold text-primary mb-4">
          Tailwind is Working! ✅
        </h1>
        <p className="text-gray-600">
          Black background = Tailwind CSS is properly configured with primary theme
        </p>
        <button className="mt-4 bg-primary text-white px-6 py-2 rounded hover:bg-primary-hover transition">
          Test Button
        </button>
      </div>
    </div>
  );
}