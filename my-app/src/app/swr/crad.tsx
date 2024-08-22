import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

export function useProjects() {
  const { data, error, mutate } = useSWR("/api/projects", fetcher);

  const createProject = async (newProject) => {
    await fetch("/api/projects", {
      method: "POST",
      body: JSON.stringify(newProject),
      headers: {
        "Content-Type": "application/json",
      },
    });
    mutate();
  };

  const updateProject = async (updatedProject) => {
    await fetch(`/api/projects/${updatedProject.id}`, {
      method: "PUT",
      body: JSON.stringify(updatedProject),
      headers: {
        "Content-Type": "application/json",
      },
    });
    mutate();
  };

  const deleteProject = async (id) => {
    await fetch(`/api/projects/${id}`, {
      method: "DELETE",
    });
    mutate();
  };

  return {
    projects: data,
    isLoading: !error && !data,
    isError: error,
    createProject,
    updateProject,
    deleteProject,
  };
}
