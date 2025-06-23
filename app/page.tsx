import { redirect } from "next/navigation"
import { getCurrentSession } from "@/lib/auth"

export default async function HomePage() {
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

  redirect("/login")
}
