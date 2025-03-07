"use client"

import { useState } from "react"
import Link from "next/link"
import { GraduationCap, Users, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SignupPage() {
  const [userType, setUserType] = useState("student")
  const [step, setStep] = useState(1)
  
  const handleNext = () => {
    setStep(2)
    // In a real app, you would navigate to onboarding page
    // router.push(`/onboarding?type=${userType}`)
  }

  return (
    <div className="w-full max-w-xs">
      <div className="space-y-1 mb-4">
        <h1 className="text-2xl font-bold">Create an account</h1>
        <h2 className="">
          {step === 1 
            ? "Choose your account type to get started" 
            : `Complete your ${userType} profile`}
        </h2>
      </div>
      <div>
        {step === 1 ? (
          <div className="space-y-4">
            <div className="flex justify-center">
              <Tabs 
                defaultValue="student" 
                className="w-full" 
                onValueChange={setUserType}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="student" className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Student
                  </TabsTrigger>
                  <TabsTrigger value="alumni" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Alumni
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div className="py-4">
              {userType === "student" ? (
                <div className="rounded-lg border p-4 bg-muted/50">
                  <h3 className="font-medium flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Student Account
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    For current students who want to access course materials, connect with alumni, and explore career opportunities.
                  </p>
                </div>
              ) : (
                <div className="rounded-lg border p-4 bg-muted/50">
                  <h3 className="font-medium flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Alumni Account
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    For graduates who want to stay connected with the community, mentor students, and access exclusive alumni resources.
                  </p>
                </div>
              )}
            </div>
            
            <Button 
              onClick={handleNext} 
              className="w-full"
            >
              Continue as {userType}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ) : (
          <OnboardingForm userType={userType} />
        )}
      </div>
      <div className="flex justify-center mt-4">
        <div className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}

function OnboardingForm({ userType }: { userType: string }) {
  return (
    <div className="space-y-4">
      <form className="space-y-4">
        <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
                Name
            </label>
            <Input id="name" placeholder="John Doe" className="" />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input id="email" type="email" placeholder="you@example.com" className="" />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <Input id="password" type="password" placeholder="Create a password" className="" />
        </div>
        
        {userType === "student" ? (
          <div className="space-y-2">
            <label htmlFor="studentId" className="text-sm font-medium">
              Student ID
            </label>
            <Input id="studentId" placeholder="e.g., S12345" className="" />
          </div>
        ) : (
          <div className="space-y-2">
            <label htmlFor="graduationYear" className="text-sm font-medium">
              Graduation Year
            </label>
            <Input id="graduationYear" type="number" placeholder="e.g., 2020" className="" />
          </div>
        )}
        
        <Button type="submit" className="w-full">
          Complete Registration
        </Button>
      </form>
    </div>
  )
}

// Missing component definition
const Input = ({ className, ...props }: any) => {
  return (
    <input
      className={`flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  )
}