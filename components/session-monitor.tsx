"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { extendUserSession } from "@/app/actions/auth"

interface SessionMonitorProps {
  sessionToken: string
  expiresAt: number
}

export function SessionMonitor({ sessionToken, expiresAt }: SessionMonitorProps) {
  const [showExtendDialog, setShowExtendDialog] = useState(false)
  const [timeLeft, setTimeLeft] = useState("")
  const router = useRouter()

  useEffect(() => {
    const checkSession = () => {
      const now = Date.now()
      const timeUntilExpiry = expiresAt - now
      const fiveMinutes = 5 * 60 * 1000 // 5 minutes in milliseconds

      if (timeUntilExpiry <= 0) {
        // Session expired
        router.push("/login")
        return
      }

      if (timeUntilExpiry <= fiveMinutes && !showExtendDialog) {
        setShowExtendDialog(true)
      }

      // Update time left display
      const minutes = Math.floor(timeUntilExpiry / (1000 * 60))
      const seconds = Math.floor((timeUntilExpiry % (1000 * 60)) / 1000)
      setTimeLeft(`${minutes}:${seconds.toString().padStart(2, "0")}`)
    }

    const interval = setInterval(checkSession, 1000)
    checkSession() // Initial check

    return () => clearInterval(interval)
  }, [expiresAt, showExtendDialog, router])

  const handleExtendSession = async () => {
    const result = await extendUserSession(sessionToken)
    if (result.success) {
      setShowExtendDialog(false)
      // Refresh the page to get updated session data
      router.refresh()
    }
  }

  const handleLogout = () => {
    router.push("/login")
  }

  return (
    <>
      <div className="fixed top-4 right-4 bg-background border rounded-lg px-3 py-2 text-sm shadow-lg">
        Session expires in: <span className="font-mono font-bold">{timeLeft}</span>
      </div>

      <Dialog open={showExtendDialog} onOpenChange={setShowExtendDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Session Expiring Soon</DialogTitle>
            <DialogDescription>
              Your session will expire in less than 5 minutes. Would you like to extend your session for another 24
              hours?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
            <Button onClick={handleExtendSession}>Extend Session</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
