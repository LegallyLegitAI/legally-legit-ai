import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router-dom";

export default function ConsentModal() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const hasConsented = localStorage.getItem("consentGiven");
    if (!hasConsented) setIsOpen(true);
  }, []);

  const handleAccept = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { navigate("/auth"); return; }

    await supabase.from("consent_logs").insert({
      user_id: user.id,
      consent_version: "v1.0",
      consent_text: "Agreed to Terms of Service and Privacy Policy",
      ip_address: null,
      user_agent: navigator.userAgent,
    });

    localStorage.setItem("consentGiven", "true");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="max-w-lg rounded bg-white p-6 shadow">
        <h2 className="mb-3 text-xl font-bold">Consent required</h2>
        <p className="mb-4">
          Please review and accept our{" "}
          <a href="/terms" className="text-blue-600 underline">Terms of Service</a> and{" "}
          <a href="/privacy" className="text-blue-600 underline">Privacy Policy</a> to continue.
        </p>
        <button onClick={handleAccept} className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          Accept & Continue
        </button>
      </div>
    </div>
  );
}
