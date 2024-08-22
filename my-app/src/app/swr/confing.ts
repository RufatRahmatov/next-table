import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

export function useProjects() {
  const { data, error, mutate } = useSWR("/api/projects", fetcher);

  return {
    projects: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}
