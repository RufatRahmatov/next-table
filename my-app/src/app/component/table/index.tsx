"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

type Project = {
  id: number;
  logo: string;
  name: string;
  description: string;
  teamImage: string;
  assignedDate: string;
  dueDate: string;
  status: string;
};

const Table: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [imagePreview, setImagePreview] = useState<string | ArrayBuffer | null>(
    null
  );
  const [fileInput, setFileInput] = useState<File | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/projects");
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (project: Project) => {
    setEditProject({ ...project }); // Ensure we copy the project
    setImagePreview(project.logo);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3001/projects/${id}`);
      setProjects(projects.filter((project) => project.id !== id));
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const handleView = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
    setIsEditModalOpen(false);
    setEditProject(null);
    setImagePreview(null);
    setFileInput(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileInput(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditSubmit = async () => {
    if (editProject) {
      try {
        const formData = new FormData();
        formData.append("name", editProject.name);
        formData.append("description", editProject.description);
        formData.append("assignedDate", editProject.assignedDate);
        formData.append("dueDate", editProject.dueDate);
        formData.append("status", editProject.status);
        if (fileInput) {
          formData.append("logo", fileInput);
        } else {
          formData.append("logo", editProject.logo);
        }

        await axios.put(
          `http://localhost:3001/projects/${editProject.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        setProjects((prevProjects) =>
          prevProjects.map((project) =>
            project.id === editProject.id
              ? {
                  ...editProject,
                  logo: fileInput
                    ? URL.createObjectURL(fileInput)
                    : editProject.logo,
                }
              : project
          )
        );
        closeModal();
      } catch (error) {
        console.error("Error updating project:", error);
      }
    }
  };

  return (
    <div>
      <table className="min-w-full divide-y divide-gray-200 overflow-x-auto">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Project Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Team
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Assigned Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Due Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {projects.map((project) => (
            <tr key={project.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={project.logo}
                      alt={`${project.name} logo`}
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {project.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      Total 18/20 tasks completed
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {project.description}
                </div>
                <div className="text-sm text-gray-500">Optimization</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <img
                  className="h-10 w-10 rounded-full"
                  src={project.teamImage}
                  alt="Team member"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {project.assignedDate}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {project.dueDate}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  {project.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <a
                  href="#"
                  onClick={() => handleEdit(project)}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  Edit
                </a>
                <a
                  href="#"
                  onClick={() => handleDelete(project.id)}
                  className="ml-2 text-red-600 hover:text-red-900"
                >
                  Delete
                </a>
                <a
                  href="#"
                  onClick={() => handleView(project)}
                  className="ml-2 text-green-600 hover:text-green-900"
                >
                  View
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && selectedProject && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-xl font-semibold mb-4">
              {selectedProject.name}
            </h2>
            <img
              className="h-20 w-20 rounded-full mb-4"
              src={selectedProject.logo}
              alt={`${selectedProject.name} logo`}
            />
            <p className="text-gray-700 mb-4">{selectedProject.description}</p>
            <p className="text-gray-500 mb-4">
              Assigned Date: {selectedProject.assignedDate}
            </p>
            <p className="text-gray-500 mb-4">
              Due Date: {selectedProject.dueDate}
            </p>
            <p className="text-gray-500 mb-4">
              Status:{" "}
              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                {selectedProject.status}
              </span>
            </p>
            <button
              onClick={closeModal}
              className="bg-gray-300 px-4 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {isEditModalOpen && editProject && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-xl font-semibold mb-4">Edit Project</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEditSubmit();
              }}
            >
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Project Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={editProject.name}
                  onChange={(e) =>
                    setEditProject({ ...editProject, name: e.target.value })
                  }
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  value={editProject.description}
                  onChange={(e) =>
                    setEditProject({
                      ...editProject,
                      description: e.target.value,
                    })
                  }
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="logo"
                  className="block text-sm font-medium text-gray-700"
                >
                  Logo
                </label>
                <input
                  type="file"
                  id="logo"
                  onChange={handleImageChange}
                  className="mt-1 block w-full text-gray-500"
                />
                {imagePreview && (
                  <img
                    src={imagePreview as string}
                    alt="Image preview"
                    className="mt-2 w-20 h-20 object-cover"
                  />
                )}
              </div>
              <div className="mb-4">
                <label
                  htmlFor="assignedDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Assigned Date
                </label>
                <input
                  type="date"
                  id="assignedDate"
                  value={editProject.assignedDate}
                  onChange={(e) =>
                    setEditProject({
                      ...editProject,
                      assignedDate: e.target.value,
                    })
                  }
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="dueDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Due Date
                </label>
                <input
                  type="date"
                  id="dueDate"
                  value={editProject.dueDate}
                  onChange={(e) =>
                    setEditProject({
                      ...editProject,
                      dueDate: e.target.value,
                    })
                  }
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700"
                >
                  Status
                </label>
                <input
                  type="text"
                  id="status"
                  value={editProject.status}
                  onChange={(e) =>
                    setEditProject({ ...editProject, status: e.target.value })
                  }
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-300 px-4 py-2 rounded-lg mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
