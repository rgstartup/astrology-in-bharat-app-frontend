# safeFetch – Usage Examples

A tuple-based fetch wrapper:

```ts
type Result<T> = [T | null, ApiError | null];
```

---

## 1. Basic GET Request

```ts
const [users, error] = await safeFetch<User[]>("/api/users");

if (error) {
  console.error(error.status, error.message);
  return;
}

console.log(users);
```

---

## 2. POST With JSON Body

```ts
const [created, err] = await safeFetch<User>("/api/users", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "Sushant",
    role: "admin",
  }),
});

if (err) return toast.error(err.message);
```

---

## 3. Custom Timeout

```ts
const [data, err] = await safeFetch<Product[]>("/api/products", {
  timeoutMs: 3000,
});

if (err?.message === "Request aborted or timeout") {
  console.log("Server too slow");
}
```

---

## 4. Manual Cancellation (AbortController)

```ts
const controller = new AbortController();

const promise = safeFetch<Order[]>("/api/orders", {
  controller,
});

// later in UI
controller.abort();

const [orders, err] = await promise;
```

---

## 5. React useEffect Cancellation

```ts
useEffect(() => {
  const controller = new AbortController();

  safeFetch<Profile>("/api/profile", { controller }).then(([data, err]) => {
    if (!err) setProfile(data);
  });

  return () => controller.abort();
}, []);
```

---

## 6. Both Timeout + Manual Abort

```ts
const controller = new AbortController();

const [data, err] = await safeFetch("/api/reports", {
  controller,
  timeoutMs: 5000,
});
```

Aborts when **either** happens first:

- user calls `controller.abort()`
- 5s timeout reached

---

## 7. With Next.js Fetch Extensions

```ts
const [products] = await safeFetch<Product[]>("/api/products", {
  next: {
    revalidate: 60,
    tags: ["products"],
  },
  timeoutMs: 4000,
});
```

---

## 8. Handling Non-JSON Responses

```ts
const [file, err] = await safeFetch("/api/logs");

if (typeof file === "string") {
  console.log("Raw text:", file);
}
```

---

## 9. Access Error Body & Headers

```ts
const [_, err] = await safeFetch("/api/payments");

if (err) {
  console.log(err.status);
  console.log(err.body); // server error payload
  console.log(err.headers?.get("x-trace-id"));
}
```

---

## 10. Type Guard Helper

```ts
const [data, err] = await safeFetch<User>("/api/me");

if (err) return;

data.id; // fully typed User
```

---

## 11. Helper for JSON Requests

```ts
const json = (body: any): RequestInit => ({
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

const [user] = await safeFetch<User>("/api/users", json({ name: "Alex" }));
```

---

## 12. Parallel Requests

```ts
const results = await Promise.all([
  safeFetch<User>("/api/me"),
  safeFetch<Settings>("/api/settings"),
]);

const [[me], [settings]] = results;
```

---

## 13. Server Component (Next.js)

```ts
export default async function Page() {
  const [data, err] = await safeFetch<Post[]>("/api/posts");

  if (err) return <ErrorView />;

  return <List items={data} />;
}
```

---

## 14. Route Handler

```ts
export async function GET() {
  const [data, err] = await safeFetch("/external");

  if (err) {
    return Response.json(err.body, { status: err.status });
  }

  return Response.json(data);
}
```

---

### Result Tuple Pattern

- ✅ No try/catch in UI
- ✅ Typed responses
- ✅ Works client & server
- ✅ Timeout + cancellation
- ✅ Next.js compatible
