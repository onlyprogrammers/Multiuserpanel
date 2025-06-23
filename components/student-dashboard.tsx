"use client"

import type { User } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Calendar, FileText, Award, Clock, TrendingUp, CheckCircle, LogOut } from "lucide-react"
import { logout } from "@/app/actions/auth"

interface StudentDashboardProps {
  user: User
}

export function StudentDashboard({ user }: StudentDashboardProps) {
  const courses = [
    { name: "Mathematics 101", progress: 78, grade: "A-", nextAssignment: "Homework #6", dueDate: "Tomorrow" },
    { name: "Physics", progress: 65, grade: "B+", nextAssignment: "Lab Report", dueDate: "Friday" },
    { name: "Chemistry", progress: 82, grade: "A", nextAssignment: "Quiz #4", dueDate: "Next Monday" },
    { name: "English Literature", progress: 90, grade: "A+", nextAssignment: "Essay", dueDate: "Next Week" },
  ]

  const upcomingAssignments = [
    { title: "Math Homework #6", course: "Mathematics 101", dueDate: "Tomorrow 11:59 PM", priority: "high" },
    { title: "Physics Lab Report", course: "Physics", dueDate: "Friday 5:00 PM", priority: "medium" },
    { title: "Chemistry Quiz #4", course: "Chemistry", dueDate: "Monday 9:00 AM", priority: "medium" },
    { title: "Literature Essay", course: "English Literature", dueDate: "Next Friday", priority: "low" },
  ]

  const recentGrades = [
    { assignment: "Math Quiz #3", grade: "A-", points: "92/100", course: "Mathematics 101" },
    { assignment: "Physics Homework #4", grade: "B+", points: "87/100", course: "Physics" },
    { assignment: "Chemistry Lab #2", grade: "A", points: "95/100", course: "Chemistry" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
                <p className="text-gray-600">Welcome back, {user.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                Student
              </Badge>
              <form action={logout}>
                <Button variant="outline" size="sm" type="submit">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Enrolled Courses</p>
                  <p className="text-3xl font-bold text-gray-900">4</p>
                </div>
                <BookOpen className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Overall GPA</p>
                  <p className="text-3xl font-bold text-gray-900">3.7</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Assignments Due</p>
                  <p className="text-3xl font-bold text-gray-900">4</p>
                </div>
                <FileText className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-3xl font-bold text-gray-900">28</p>
                </div>
                <CheckCircle className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Courses */}
          <Card>
            <CardHeader>
              <CardTitle>My Courses</CardTitle>
              <CardDescription>Your current course progress</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {courses.map((course, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{course.name}</h3>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      {course.grade}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                    <div className="text-sm text-gray-500">
                      <p>Next: {course.nextAssignment}</p>
                      <p className="text-xs">Due: {course.dueDate}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Upcoming Assignments */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Assignments</CardTitle>
              <CardDescription>Don't miss these deadlines</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingAssignments.map((assignment, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-gray-900">{assignment.title}</h4>
                        <Badge
                          variant="outline"
                          className={
                            assignment.priority === "high"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : assignment.priority === "medium"
                                ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                : "bg-green-50 text-green-700 border-green-200"
                          }
                        >
                          {assignment.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{assignment.course}</p>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <Clock className="w-3 h-3 mr-1" />
                        Due: {assignment.dueDate}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Grades */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Grades</CardTitle>
            <CardDescription>Your latest assignment results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentGrades.map((grade, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{grade.assignment}</h4>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      {grade.grade}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{grade.course}</p>
                  <p className="text-lg font-bold text-gray-900 mt-1">{grade.points}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button className="h-20 flex-col space-y-2" variant="outline">
                <FileText className="w-6 h-6" />
                <span>Submit Assignment</span>
              </Button>
              <Button className="h-20 flex-col space-y-2" variant="outline">
                <Calendar className="w-6 h-6" />
                <span>View Schedule</span>
              </Button>
              <Button className="h-20 flex-col space-y-2" variant="outline">
                <Award className="w-6 h-6" />
                <span>View Grades</span>
              </Button>
              <Button className="h-20 flex-col space-y-2" variant="outline">
                <BookOpen className="w-6 h-6" />
                <span>Course Materials</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
