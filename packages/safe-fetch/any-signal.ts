export default function anySignal(signals: AbortSignal[]): AbortSignal {
  const controller = new AbortController();

  const onAbort = () => controller.abort();

  signals.forEach((signal) => {
    if (signal.aborted) {
      controller.abort();
    } else {
      signal.addEventListener("abort", onAbort, { once: true });
    }
  });

  // Optional cleanup
  controller.signal.addEventListener(
    "abort",
    () => {
      signals.forEach((s) => s.removeEventListener("abort", onAbort));
    },
    { once: true },
  );

  return controller.signal;
}
