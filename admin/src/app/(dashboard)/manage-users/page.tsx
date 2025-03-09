"use client";

import { Button } from "@/components/ui/button";
import React, { useState, useEffect, useRef } from "react";

// Define types for Student and Alumnus
interface User {
  id: number;
  name: string;
  email: string;
}

const ManageUsers: React.FC = () => {
  const [students, setStudents] = useState<User[]>([]);
  const [alumni, setAlumni] = useState<User[]>([]);
  const studentFileInputRef = useRef<HTMLInputElement>(null);
  const alumniFileInputRef = useRef<HTMLInputElement>(null);

  // Fetch students and alumni from API
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const studentsResponse = await fetch("/api/students");
//         const alumniResponse = await fetch("/api/alumni");

//         if (!studentsResponse.ok || !alumniResponse.ok) {
//           throw new Error("Failed to fetch users");
//         }

//         setStudents(await studentsResponse.json());
//         setAlumni(await alumniResponse.json());
//       } catch (error) {
//         console.error("Error fetching users:", error);
//       }
//     };

//     fetchUsers();
//   }, []);

const handleFileUpload = async (
  event: React.ChangeEvent<HTMLInputElement>,
  type: "students" | "alumni"
) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  const endpoint =
    type === "students"
      ? "http://localhost:4000/api/dataupload/upload-student-csv"
      : "http://localhost:4000/api/dataupload/upload-alumni-csv";

  try {
    console.log(`Uploading ${type} CSV to ${endpoint}`); // Debugging

    const response = await fetch(endpoint, {
      method: "POST",
      body: formData,
    });

    const result = await response.json(); // Parse response
    console.log("Server Response:", result); // Log response

    if (!response.ok) {
      throw new Error(result.message || `Failed to upload ${type} CSV`);
    }

    alert(`${type} CSV uploaded successfully`);
    event.target.value = ""; // Reset file input after upload
  } catch (error) {
    console.error(`Error uploading ${type} CSV:`, error);
    alert(`Error uploading ${type} CSV. Please try again.`);
  }
};


  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold">Manage Users</h1>
      <div className="grid grid-cols-2 mt-4 gap-4">
        {/* Students Section */}
        <div className="border p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium">Students List</h2>
            <input
              type="file"
              accept=".csv"
              className="hidden"
              ref={studentFileInputRef}
              onChange={(e) => handleFileUpload(e, "students")}
            />
            <Button size="sm" onClick={() => studentFileInputRef.current?.click()}>
              Upload CSV
            </Button>
          </div>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">ID</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Email</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="text-center">
                  <td className="border p-2">{student.id}</td>
                  <td className="border p-2">{student.name}</td>
                  <td className="border p-2">{student.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Alumni Section */}
        <div className="border p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium">Alumni List</h2>
            <input
              type="file"
              accept=".csv"
              className="hidden"
              ref={alumniFileInputRef}
              onChange={(e) => handleFileUpload(e, "alumni")}
            />
            <Button size="sm" onClick={() => alumniFileInputRef.current?.click()}>
              Upload CSV
            </Button>
          </div>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">ID</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Email</th>
              </tr>
            </thead>
            <tbody>
              {/* {alumni.map((alumnus) => ( */}
                <tr key="" className="text-center">
                  <td className="border p-2">123</td>
                  <td className="border p-2">Satyam</td>
                  <td className="border p-2">satyam@satyam.com</td>
                </tr>
              {/* ))} */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
