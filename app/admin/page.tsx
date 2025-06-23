import { redirect } from "next/navigation"
import { getCurrentSession } from "@/lib/auth"
import { AdminDashboard } from "@/components/admin-dashboard"
import { SessionMonitor } from "@/components/session-monitor"

export default async function AdminPage() {
  const session = await getCurrentSession()

  if (!session) {
    redirect("/login")
  }

  if (session.user.role !== "administrator") {
    redirect("/login")
  }

  return (
    <>
      <SessionMonitor sessionToken={session.sessionToken} expiresAt={session.expiresAt} />
      <AdminDashboard user={session.user} />
    </>
  )
}
