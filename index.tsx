import { useState } from "react";

export default function Home() {
  const [status, setStatus] = useState("");
  async function handleSubmit(e: any) {
    e.preventDefault();
    const form = new FormData(e.target);
    const body = {
      name: form.get("name"),
      email: form.get("email"),
      message: form.get("message")
    };
    const res = await fetch("/api/forms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    setStatus(data.message || "Submitted");
  }
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-4">Medo Web App</h1>
      <form className="w-full max-w-md" onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" required className="border p-2 w-full mb-2"/>
        <input name="email" type="email" placeholder="Email" required className="border p-2 w-full mb-2"/>
        <textarea name="message" placeholder="Message" required className="border p-2 w-full mb-2 h-24"/>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Send</button>
      </form>
      <p className="mt-4">{status}</p>
    </div>
  );
}