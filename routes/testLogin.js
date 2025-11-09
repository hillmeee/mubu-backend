(async () => {
  const fetch = (await import("node-fetch")).default;

  const res = await fetch("http://localhost:5000/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "admin@mubu.com",
      password: "Admin123!",
    }),
  });

  const data = await res.json();
  console.log("✅ Backend cevabı:", data);
})();
