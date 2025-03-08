"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Pencil, Trash, PlusCircle } from "lucide-react";

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  status: "Active" | "Closed" | "Pending";
}

const ManageJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editJob, setEditJob] = useState<Job | null>(null);
  const [newJob, setNewJob] = useState({ title: "", company: "", location: "", status: "Active" });

//   useEffect(() => {
//     fetchJobs();
//   }, []);

  // Fetch jobs from API
//   const fetchJobs = async () => {
//     try {
//       const res = await fetch("/api/jobs");
//       if (!res.ok) throw new Error("Failed to fetch jobs");
//       setJobs(await res.json());
//     } catch (error) {
//       console.error("Error fetching jobs:", error);
//     }
//   };

  // Handle job form submission
  const handleSaveJob = async () => {
    const method = editJob ? "PUT" : "POST";
    const endpoint = editJob ? `/api/jobs/${editJob.id}` : "/api/jobs";

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editJob ? editJob : newJob),
      });

      if (!res.ok) throw new Error("Failed to save job");

    //   fetchJobs();
      setModalOpen(false);
      setEditJob(null);
      setNewJob({ title: "", company: "", location: "", status: "Active" });
    } catch (error) {
      console.error("Error saving job:", error);
    }
  };

  // Delete a job
  const handleDeleteJob = async (id: number) => {
    try {
      await fetch(`/api/jobs/${id}`, { method: "DELETE" });
    //   fetchJobs();
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  return (
    <div className="p-6">
      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-4">Manage Jobs</h1>

      {/* Analytics Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <CardContent>
            <h2 className="text-lg font-medium">Total Jobs</h2>
            <p className="text-3xl font-bold">{jobs.length}</p>
          </CardContent>
        </Card>
        <Card className="p-4">
          <CardContent>
            <h2 className="text-lg font-medium">Active Jobs</h2>
            <p className="text-3xl font-bold">{jobs.filter((job) => job.status === "Active").length}</p>
          </CardContent>
        </Card>
        <Card className="p-4">
          <CardContent>
            <h2 className="text-lg font-medium">Closed Jobs</h2>
            <p className="text-3xl font-bold">{jobs.filter((job) => job.status === "Closed").length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Add Job Button */}
      <Button onClick={() => setModalOpen(true)} className="mb-4">
        <PlusCircle className="mr-2" size={18} /> Add Job
      </Button>

      {/* Jobs Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Title</th>
            <th className="border p-2">Company</th>
            <th className="border p-2">Location</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id} className="text-center">
              <td className="border p-2">{job.title}</td>
              <td className="border p-2">{job.company}</td>
              <td className="border p-2">{job.location}</td>
              <td className="border p-2">{job.status}</td>
              <td className="border p-2 flex justify-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditJob(job);
                    setModalOpen(true);
                  }}
                >
                  <Pencil size={16} />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDeleteJob(job.id)}>
                  <Trash size={16} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add/Edit Job Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editJob ? "Edit Job" : "Add Job"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Job Title"
              value={editJob ? editJob.title : newJob.title}
              onChange={(e) =>
                editJob ? setEditJob({ ...editJob, title: e.target.value }) : setNewJob({ ...newJob, title: e.target.value })
              }
            />
            <Input
              type="text"
              placeholder="Company"
              value={editJob ? editJob.company : newJob.company}
              onChange={(e) =>
                editJob ? setEditJob({ ...editJob, company: e.target.value }) : setNewJob({ ...newJob, company: e.target.value })
              }
            />
            <Input
              type="text"
              placeholder="Location"
              value={editJob ? editJob.location : newJob.location}
              onChange={(e) =>
                editJob ? setEditJob({ ...editJob, location: e.target.value }) : setNewJob({ ...newJob, location: e.target.value })
              }
            />
            <select
              className="w-full p-2 border border-gray-300 rounded"
              value={editJob ? editJob.status : newJob.status}
              onChange={(e) =>
                editJob ? setEditJob({ ...editJob, status: e.target.value as Job["status"] }) : setNewJob({ ...newJob, status: e.target.value })
              }
            >
              <option value="Active">Active</option>
              <option value="Closed">Closed</option>
              <option value="Pending">Pending</option>
            </select>
            <Button onClick={handleSaveJob}>{editJob ? "Update Job" : "Create Job"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageJobs;
