"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { GraduationCap, Users, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignupPage() {
  const [userType, setUserType] = useState("student");
  const [step, setStep] = useState(1);
  const router = useRouter();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
    graduationYear: "",
    prn_number: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Add different fields based on user type
      const userData = {
        username: formData.username || formData.email.split("@")[0], // Fallback to email prefix if username not provided
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        userType: userType,
        ...(userType === "student"
          ? { prn_number: formData.prn_number }
          : { graduationYear: formData.graduationYear }),
      };

      const res = await axios.post(
        "http://localhost:4000/api/user/register",
        userData
      );

      // Store token in localStorage
      localStorage.setItem("token", res.data.token);

      // Redirect to specific onboarding page based on user type
      router.push(`/onboarding/${userType}`);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else if (
        typeof error === "object" &&
        error !== null &&
        "response" in error
      ) {
        const axiosError = error;
        setError('Registration failed')
      } else {
        setError("Registration failed");
      }
    }
  };

  const handleNext = () => {
    setStep(2);
  };

  return (
    <div className="w-full max-w-[25rem]">
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
                  <TabsTrigger
                    value="student"
                    className="flex items-center gap-2"
                  >
                    <GraduationCap className="h-4 w-4" />
                    Student
                  </TabsTrigger>
                  <TabsTrigger
                    value="alumni"
                    className="flex items-center gap-2"
                  >
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
                    For current students who want to access course materials,
                    connect with alumni, and explore career opportunities.
                  </p>
                </div>
              ) : (
                <div className="rounded-lg border p-4 bg-muted/50">
                  <h3 className="font-medium flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Alumni Account
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    For graduates who want to stay connected with the community,
                    mentor students, and access exclusive alumni resources.
                  </p>
                </div>
              )}
            </div>

            <Button onClick={handleNext} className="w-full">
              Continue as {userType}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ) : (
          <OnboardingForm
            userType={userType}
            formData={formData}
            onChange={handleInputChange}
            onSubmit={handleSignup}
            error={error}
          />
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
  );
}

function OnboardingForm({
  userType,
  formData,
  onChange,
  onSubmit,
  error,
}: {
  userType: string;
  formData: any;
  onChange: any;
  onSubmit: any;
  error: any;
}) {
  return (
    <div className="space-y-4">
      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username" className="text-sm font-medium">
            Username
          </Label>
          <Input
            id="name"
            placeholder="johndoe"
            className=""
            value={formData.value}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fullname" className="text-sm font-medium">
            Full Name
          </Label>
          <Input id="fullname" placeholder="John Doe" className="" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            className=""
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Create a password"
            className=""
            required
          />
        </div>

        {userType === "student" ? (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="studentId">PRN No.</Label>
              <Input
                id="studentId"
                placeholder="e.g., S12345"
                className=""
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="graduationYear">Graduation Year</Label>
              <Input
                id="graduationYear"
                type="number"
                placeholder="e.g., 2020"
                className=""
                required
              />
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="graduationYear">Graduation Year</Label>
            <Input
              id="graduationYear"
              type="number"
              placeholder="e.g., 2020"
              className=""
              required
            />
          </div>
        )}

        <Button type="submit" className="w-full">
          Complete Registration
        </Button>
      </form>
    </div>
  );
}

// Missing component definition
// const Input = ({ className, ...props }: any) => {
//   return (
//     <input
//       className={`flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
//       {...props}
//     />
//   )
// }
