import { redirect } from "next/navigation"
import { getCurrentSession } from "@/lib/auth"
import { TeacherDashboard } from "@/components/teacher-dashboard"
import { SessionMonitor } from "@/components/session-monitor"

export default async function TeacherPage() {
  const session = await getCurrentSession()

  if (!session) {
    redirect("/login")
  }

  if (session.user.role !== "teacher") {
    redirect("/login")
  }

  return (
    <>
      <SessionMonitor sessionToken={session.sessionToken} expiresAt={session.expiresAt} />
      <TeacherDashboard user={session.user} />
    </>
  )
}
