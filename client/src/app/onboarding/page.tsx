// app/onboarding/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  User,
  BookOpen,
  Building,
  MapPin,
  GraduationCap,
  Briefcase,
  Award,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function OnboardingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userType, setUserType] = useState("student");
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Common fields
    profilePicture: null,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    bio: "",

    // Student specific fields
    studentId: "",
    major: "",
    minor: "",
    expectedGraduation: "",
    gpa: "",
    clubs: [],

    // Alumni specific fields
    graduationYear: "",
    degree: "",
    company: "",
    jobTitle: "",
    industry: "",
    linkedIn: "",
    mentoring: false,
    expertise: [],
  });

  useEffect(() => {
    const type = searchParams.get("type");
    if (type === "student" || type === "alumni") {
      setUserType(type);
    }
  }, [searchParams]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: any, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log("Submitting data:", formData);
    // In a real app, you would submit this data to your backend
    // Then redirect to the dashboard or home page
    router.push("/dashboard");
  };

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {userType === "student" ? (
              <div className="flex items-center gap-2">
                <GraduationCap className="h-6 w-6" />
                Student Onboarding
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Users className="h-6 w-6" />
                Alumni Onboarding
              </div>
            )}
          </CardTitle>
          <CardDescription>
            {userType === "student"
              ? "Complete your student profile to get started"
              : "Complete your alumni profile to reconnect with your community"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                      step >= i
                        ? "bg-primary text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {i}
                  </div>
                  <span className="text-xs mt-1 text-muted-foreground">
                    {i === 1 ? "Basic Info" : i === 2 ? "Details" : "Review"}
                  </span>
                </div>
              ))}
            </div>
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div
                className="bg-primary h-2 rounded-full"
                style={{ width: `${(step / 3) * 100}%` }}
              ></div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-4">
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                      {formData.profilePicture ? (
                        <img
                          src={URL.createObjectURL(formData.profilePicture)}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="h-12 w-12 text-muted-foreground" />
                      )}
                    </div>
                    <label
                      htmlFor="profilePicture"
                      className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full cursor-pointer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 20h9"></path>
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                      </svg>
                      <input
                        id="profilePicture"
                        type="file"
                        accept="image/*"
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="John"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(123) 456-7890"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="123 Main St"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="San Francisco"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="CA"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zipCode">Zip Code</Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    placeholder="94105"
                  />
                </div>
              </div>
            )}

            {step === 2 && userType === "student" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="studentId">Student ID</Label>
                  <Input
                    id="studentId"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleChange}
                    placeholder="S12345"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="major">Major</Label>
                    <Select
                      value={formData.major}
                      onValueChange={(value) =>
                        handleSelectChange("major", value)
                      }
                    >
                      <SelectTrigger id="major">
                        <SelectValue placeholder="Select major" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="computer_science">
                          Computer Science
                        </SelectItem>
                        <SelectItem value="business">
                          Business Administration
                        </SelectItem>
                        <SelectItem value="engineering">Engineering</SelectItem>
                        <SelectItem value="psychology">Psychology</SelectItem>
                        <SelectItem value="biology">Biology</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minor">Minor (Optional)</Label>
                    <Select
                      value={formData.minor}
                      onValueChange={(value) =>
                        handleSelectChange("minor", value)
                      }
                    >
                      <SelectTrigger id="minor">
                        <SelectValue placeholder="Select minor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="mathematics">Mathematics</SelectItem>
                        <SelectItem value="economics">Economics</SelectItem>
                        <SelectItem value="communications">
                          Communications
                        </SelectItem>
                        <SelectItem value="art">Art</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expectedGraduation">
                      Expected Graduation
                    </Label>
                    <Select
                      value={formData.expectedGraduation}
                      onValueChange={(value) =>
                        handleSelectChange("expectedGraduation", value)
                      }
                    >
                      <SelectTrigger id="expectedGraduation">
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        {[2025, 2026, 2027, 2028, 2029].map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gpa">GPA (Optional)</Label>
                    <Input
                      id="gpa"
                      name="gpa"
                      value={formData.gpa}
                      onChange={handleChange}
                      placeholder="3.5"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell us about yourself, your interests, and your goals"
                    rows={4}
                  />
                </div>
              </div>
            )}

            {step === 2 && userType === "alumni" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="graduationYear">Graduation Year</Label>
                    <Select
                      value={formData.graduationYear}
                      onValueChange={(value) =>
                        handleSelectChange("graduationYear", value)
                      }
                    >
                      <SelectTrigger id="graduationYear">
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 30 }, (_, i) => 2025 - i).map(
                          (year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="degree">Degree</Label>
                    <Select
                      value={formData.degree}
                      onValueChange={(value) =>
                        handleSelectChange("degree", value)
                      }
                    >
                      <SelectTrigger id="degree">
                        <SelectValue placeholder="Select degree" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bachelors">Bachelor's</SelectItem>
                        <SelectItem value="masters">Master's</SelectItem>
                        <SelectItem value="phd">Ph.D.</SelectItem>
                        <SelectItem value="certificate">Certificate</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company">Current Company</Label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Company Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <Input
                      id="jobTitle"
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleChange}
                      placeholder="Software Engineer"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select
                    value={formData.industry}
                    onValueChange={(value) =>
                      handleSelectChange("industry", value)
                    }
                  >
                    <SelectTrigger id="industry">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="manufacturing">
                        Manufacturing
                      </SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedIn">LinkedIn Profile</Label>
                  <Input
                    id="linkedIn"
                    name="linkedIn"
                    value={formData.linkedIn}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell us about your career journey, achievements, and interests"
                    rows={4}
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="rounded-lg border p-4">
                  <h3 className="font-medium text-lg mb-2">
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-medium">
                        {formData.firstName} {formData.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{formData.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">
                        {formData.phone || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="font-medium">
                        {formData.address
                          ? `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`
                          : "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>

                {userType === "student" ? (
                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium text-lg mb-2">
                      Academic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Student ID
                        </p>
                        <p className="font-medium">{formData.studentId}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Major</p>
                        <p className="font-medium">{formData.major}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Minor</p>
                        <p className="font-medium">
                          {formData.minor || "None"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Expected Graduation
                        </p>
                        <p className="font-medium">
                          {formData.expectedGraduation}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">GPA</p>
                        <p className="font-medium">
                          {formData.gpa || "Not provided"}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium text-lg mb-2">
                      Professional Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Graduation Year
                        </p>
                        <p className="font-medium">{formData.graduationYear}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Degree</p>
                        <p className="font-medium">{formData.degree}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Company</p>
                        <p className="font-medium">
                          {formData.company || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Job Title
                        </p>
                        <p className="font-medium">
                          {formData.jobTitle || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Industry
                        </p>
                        <p className="font-medium">{formData.industry}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="rounded-lg border p-4">
                  <h3 className="font-medium text-lg mb-2">Bio</h3>
                  <p className="text-sm">{formData.bio || "No bio provided"}</p>
                </div>
              </div>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={prevStep} disabled={step === 1}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          {step < 3 ? (
            <Button onClick={nextStep}>
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit}>Complete Profile</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
