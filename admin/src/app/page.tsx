import AuthLayout from "@/components/authLayout/AuthLayout";

 
export default function Home() {
  return (
    <div>
      <AuthLayout>
        <div>
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <h1 className="text-3xl font-bold">Welcome, Admin 👋</h1>
        <p className="text-gray-600 mt-2">Manage your application efficiently.</p>

        <div className="mt-6 flex space-x-4">
          <a href="/dashboard" className="px-6 py-2 bg-blue-600 text-white rounded-lg">
            Go to Dashboard
          </a>
          
        </div>
      </div>
        </div>
      </AuthLayout>
    </div>
  );
}
