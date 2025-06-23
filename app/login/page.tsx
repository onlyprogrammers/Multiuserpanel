import { redirect } from "next/navigation"
import { getCurrentSession } from "@/lib/auth"
import { LoginForm } from "@/components/login-form"

export default async function LoginPage() {
  const session = await getCurrentSession()

  if (session) {
    // Redirect based on user role
    const role = session.user.role
    if (role === "administrator") {
      redirect("/admin")
    } else if (role === "teacher") {
      redirect("/teacher")
    } else {
      redirect("/student")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-600 mt-2">Sign in to your account</p>
          </div>

          <LoginForm />

          <div className="mt-8 text-center">
            <div className="text-sm text-gray-600">
              <p className="mb-2">Demo Accounts:</p>
              <div className="space-y-1 text-xs">
                <p>
                  <strong>Admin:</strong> admin@school.com
                </p>
                <p>
                  <strong>Teacher:</strong> teacher@school.com
                </p>
                <p>
                  <strong>Student:</strong> student@school.com
                </p>
                <p className="text-gray-500">Password: password123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
