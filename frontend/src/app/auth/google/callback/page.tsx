export default function GoogleCallbackPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing Google authentication...</p>
        <p className="text-sm text-gray-500 mt-2">Please wait while we process your authentication.</p>
      </div>
    </div>
  )
}
