"use client";
import { isValidEmail } from "@/utils/check-email";
import type { ContactFormInput } from "@/types/portfolio";
import { personalData } from "@/utils/data/personal-data";
import axios from "axios";
import { useState } from "react";
import { HiOutlineMail } from "react-icons/hi";
import { TbMailForward } from "react-icons/tb";
import { toast } from "react-toastify";

function ContactForm() {
  const [error, setError] = useState({ email: false, required: false });
  const [isLoading, setIsLoading] = useState(false);
  const [needsMailtoFallback, setNeedsMailtoFallback] = useState(false);
  const [userInput, setUserInput] = useState<ContactFormInput>({
    name: "",
    email: "",
    message: "",
  });

  const checkRequired = () => {
    if (userInput.email && userInput.message && userInput.name) {
      setError((prev) => ({ ...prev, required: false }));
    }
  };

  const getMailtoLink = () => {
    const subject = encodeURIComponent(`Portfolio Message from ${userInput.name || "Visitor"}`);
    const body = encodeURIComponent(
      `${userInput.message || ""}\n\n---\nSender Name: ${userInput.name || "N/A"}\nSender Email: ${userInput.email || "N/A"}`
    );
    return `mailto:${personalData.email}?subject=${subject}&body=${body}`;
  };

  const handleSendMail = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!userInput.email || !userInput.message || !userInput.name) {
      setError({ email: !isValidEmail(userInput.email) && Boolean(userInput.email), required: true });
      return;
    } else if (!isValidEmail(userInput.email)) {
      setError({ email: true, required: false });
      return;
    } else {
      setError({ email: false, required: false });
    }

    try {
      setIsLoading(true);
      const apiEndpoint = process.env.NEXT_PUBLIC_APP_URL
        ? `${process.env.NEXT_PUBLIC_APP_URL}/api/contact`
        : "/api/contact";

      const res = await axios.post(apiEndpoint, userInput);
      if (res.data?.success) {
        toast.success(res.data.message || "Message sent successfully!");
        setUserInput({ name: "", email: "", message: "" });
        setNeedsMailtoFallback(false);
      } else {
        toast.error(res.data?.message || "Failed to send message");
        setNeedsMailtoFallback(true);
      }
    } catch (err) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      const errorMsg =
        axiosErr?.response?.data?.message ??
        "Email service pending configuration. You can click 'Send via Mail Client' below.";
      toast.error(errorMsg);
      setNeedsMailtoFallback(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <p className="font-medium mb-5 text-[#16f2b3] text-xl uppercase tracking-wider">Send a Message</p>
      <div className="max-w-3xl text-white rounded-xl border border-[#464c6a] p-4 lg:p-6 bg-[#0d1224]/80 backdrop-blur-sm shadow-xl">
        <p className="text-sm text-[#d3d8e8] leading-relaxed">
          Have an idea, project, or opportunity you&apos;d like to discuss? Drop your message below and it will be delivered straight to my inbox.
        </p>
        <div className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">Your Name: </label>
            <input
              className="bg-[#10172d] w-full border rounded-lg border-[#353a52] focus:border-[#16f2b3] ring-0 outline-0 transition-all duration-300 px-3.5 py-2.5 text-sm"
              type="text"
              placeholder="e.g. John Doe"
              maxLength={100}
              required
              onChange={(e) => setUserInput({ ...userInput, name: e.target.value })}
              onBlur={checkRequired}
              value={userInput.name}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">Your Email: </label>
            <input
              className="bg-[#10172d] w-full border rounded-lg border-[#353a52] focus:border-[#16f2b3] ring-0 outline-0 transition-all duration-300 px-3.5 py-2.5 text-sm"
              type="email"
              placeholder="e.g. john@example.com"
              maxLength={100}
              required
              value={userInput.email}
              onChange={(e) => {
                setUserInput({ ...userInput, email: e.target.value });
                if (error.email && isValidEmail(e.target.value)) {
                  setError((prev) => ({ ...prev, email: false }));
                }
              }}
              onBlur={() => {
                checkRequired();
                setError((prev) => ({ ...prev, email: !isValidEmail(userInput.email) }));
              }}
            />
            {error.email && <p className="text-xs text-red-400">Please provide a valid email address!</p>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">Your Message: </label>
            <textarea
              className="bg-[#10172d] w-full border rounded-lg border-[#353a52] focus:border-[#16f2b3] ring-0 outline-0 transition-all duration-300 px-3.5 py-2.5 text-sm resize-none"
              maxLength={1000}
              placeholder="Tell me about your project, idea, or questions..."
              name="message"
              required
              onChange={(e) => setUserInput({ ...userInput, message: e.target.value })}
              onBlur={checkRequired}
              rows={4}
              value={userInput.message}
            />
          </div>

          <div className="flex flex-col items-center gap-3 mt-2">
            {error.required && (
              <p className="text-xs text-red-400">All fields are required before sending!</p>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
              <button
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-violet-600 px-7 py-3 text-center text-xs md:text-sm font-semibold uppercase tracking-wider text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed shadow-lg cursor-pointer"
                role="button"
                onClick={handleSendMail}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span>Sending Message...</span>
                ) : (
                  <span className="flex items-center gap-2">
                    Send Message
                    <TbMailForward size={18} />
                  </span>
                )}
              </button>

              {needsMailtoFallback && (
                <a
                  href={getMailtoLink()}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full border border-[#16f2b3] text-[#16f2b3] hover:bg-[#16f2b3]/10 px-5 py-2.5 text-xs md:text-sm font-medium transition-all duration-200"
                >
                  <HiOutlineMail size={18} />
                  <span>Send via Mail App</span>
                </a>
              )}
            </div>

            <p className="text-xs text-gray-400 mt-1 text-center">
              Or email directly at{" "}
              <a
                href={`mailto:${personalData.email}`}
                className="text-[#16f2b3] hover:underline"
              >
                {personalData.email}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactForm;
