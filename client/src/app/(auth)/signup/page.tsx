"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { GraduationCap, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    branch: "",
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
      const userData = {
        username: formData.username || formData.email.split("@")[0],
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        userType,
        branch: formData.branch,
        ...(userType === "student"
          ? { prn_number: formData.prn_number }
          : { graduationYear: formData.graduationYear }),
      };

      const res = await axios.post(
        "http://localhost:4000/api/user/register-user",
        userData
      );

      localStorage.setItem("token", res.data.token);
      toast.dark("User created successfully!");
      router.push(`/onboarding/${userType}`);
    } catch (error) {
      setError("Registration failed");
      toast.error("Data not updated by admin yet");
    }
  };

  return (
    <div className="w-full max-w-[25rem]">
      <div className="space-y-1 mb-4">
        <h1 className="text-2xl font-bold">Create an account</h1>
        <h2>
          {step === 1
            ? "Choose your account type to get started"
            : `Complete your ${userType} profile`}
        </h2>
      </div>
      <div>
        {step === 1 ? (
          <div className="space-y-4">
            <div className="flex justify-center">
              <Tabs defaultValue="student" className="w-full" onValueChange={setUserType}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="student" className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" /> Student
                  </TabsTrigger>
                  <TabsTrigger value="alumni" className="flex items-center gap-2">
                    <Users className="h-4 w-4" /> Alumni
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="py-4">
              {userType === "student" ? (
                <UserTypeCard
                  title="Student Account"
                  description="For current students who want to access course materials, connect with alumni, and explore career opportunities."
                  icon={<GraduationCap className="h-4 w-4" />}
                />
              ) : (
                <UserTypeCard
                  title="Alumni Account"
                  description="For graduates who want to stay connected with the community, mentor students, and access exclusive alumni resources."
                  icon={<Users className="h-4 w-4" />}
                />
              )}
            </div>

            <Button onClick={() => setStep(2)} className="w-full">
              Continue as {userType}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ) : (
          <OnboardingForm userType={userType} formData={formData} onChange={handleInputChange} onSubmit={handleSignup} />
        )}
      </div>
      <div className="flex justify-center mt-4">
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

function UserTypeCard({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-lg border p-4 bg-muted/50">
      <h3 className="font-medium flex items-center gap-2">{icon} {title}</h3>
      <p className="text-sm text-muted-foreground mt-2">{description}</p>
    </div>
  );
}

function OnboardingForm({
  userType,
  formData,
  onChange,
  onSubmit,
}: {
  userType: string;
  formData: any;
  onChange: any;
  onSubmit: any;
}) {
  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <InputField label="Username" id="username" value={formData.username} onChange={onChange} placeholder="johndoe" />
      <InputField label="Full Name" id="fullName" value={formData.fullName} onChange={onChange} placeholder="John Doe" />
      <InputField label="Email" id="email" value={formData.email} onChange={onChange} type="email" placeholder="you@example.com" />
      <InputField label="Branch" id="branch" value={formData.branch} onChange={onChange} placeholder="Computer Science" />
      <InputField label="Password" id="password" value={formData.password} onChange={onChange} type="password" placeholder="Create a password" />

      {userType === "student" ? (
        <>
          <InputField label="PRN No." id="prn_number" value={formData.prn_number} onChange={onChange} placeholder="e.g., S12345" />
          <InputField label="Graduation Year" id="graduationYear" value={formData.graduationYear} onChange={onChange} type="number" placeholder="e.g., 2025" />
        </>
      ) : (
        <InputField label="Graduation Year" id="graduationYear" value={formData.graduationYear} onChange={onChange} type="number" placeholder="e.g., 2020" />
      )}

      <Button type="submit" className="w-full">
        Complete Registration
      </Button>
    </form>
  );
}

function InputField({ label, id, value, onChange, type = "text", placeholder }: any) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium">{label}</Label>
      <Input id={id} type={type} value={value} onChange={onChange} placeholder={placeholder} required />
    </div>
  );
}
