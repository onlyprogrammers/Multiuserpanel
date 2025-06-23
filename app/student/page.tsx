import { redirect } from "next/navigation"
import { getCurrentSession } from "@/lib/auth"
import { StudentDashboard } from "@/components/student-dashboard"
import { SessionMonitor } from "@/components/session-monitor"

export default async function StudentPage() {
  const session = await getCurrentSession()

  if (!session) {
    redirect("/login")
  }

  if (session.user.role !== "student") {
    redirect("/login")
  }

  return (
    <>
      <SessionMonitor sessionToken={session.sessionToken} expiresAt={session.expiresAt} />
      <StudentDashboard user={session.user} />
    </>
  )
}
