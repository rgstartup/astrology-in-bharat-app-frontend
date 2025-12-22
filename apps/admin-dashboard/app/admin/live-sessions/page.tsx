"use client"; // first line

import React, { useState } from "react";

export default function LiveSessionsPage() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Live Sessions</h1>
      <p>Count: {count}</p>
    </div>
  );
}
