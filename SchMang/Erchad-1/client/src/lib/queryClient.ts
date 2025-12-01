import { QueryClient } from "@tanstack/react-query";

async function throwIfError(response: Response) {
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`${response.status}: ${body}`);
  }
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const response = await fetch(queryKey[0] as string);
        await throwIfError(response);
        return response.json();
      },
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});

type RequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export async function apiRequest(
  url: string,
  method: RequestMethod = "GET",
  data?: any
) {
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);
  await throwIfError(response);
  return response.json();
}
