export async function getMe() {
  const res = await fetch("/api/auth/getme");

  if (!res.ok) {
    throw new Error("Unauthorized");
  }
  const data = await res.json();

  return data.user;
}
