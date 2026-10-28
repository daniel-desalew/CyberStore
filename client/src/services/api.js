const BASE = import.meta.env.VITE_API_URL || "/api";

export const api = async (path, opts = {}) => {
  const token = localStorage.getItem("token");
  const res = await fetch(BASE + path, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...opts,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const error = new Error(data?.message || `Request failed (${res.status})`);
    error.status = res.status;
    throw error;
  }
  if (data === null) throw new Error("The server returned an invalid response.");
  return data;
};
