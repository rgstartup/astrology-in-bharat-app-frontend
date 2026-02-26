export default async function parseBody(res: Response) {
  const contentType = res.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    return await res.text();
  }

  try {
    return await res.json();
  } catch {
    return await res.text();
  }
}
