import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { verifyAccount } from "../services/api";

export default function VerifyAccount() {
  const { token } = useParams(); // grab token from URL
  const [status, setStatus] = useState("Verifying...");

  useEffect(() => {
    const doVerify = async () => {
      try {
        const { data } = await verifyAccount(token);
        console.log("Verification response:", data);
        setStatus("✅ Account verified successfully!");
      } catch (err) {
        console.error(
          "Verification failed:",
          err.response?.data || err.message
        );
        setStatus("❌ Verification failed. Token invalid or expired.");
      }
    };
    if (token) doVerify();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md p-8 rounded-xl text-center">
        <h1 className="text-2xl font-bold mb-4 text-purple-600">
          Email Verification
        </h1>
        <p className="text-gray-700">{status}</p>
      </div>
    </div>
  );
}
