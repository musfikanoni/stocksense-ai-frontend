"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Icon } from "./icons";
import { useSendContactMessageMutation } from "@/redux/api/contactApi";

export default function ContactModal() {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [sendContactMessage, { isLoading }] = useSendContactMessageMutation();

  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open]);

  const handleOpen = () => {
    setSent(false);
    setName("");
    setEmail("");
    setMessage("");
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      await sendContactMessage({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      }).unwrap();

      setSent(true);
      toast.success("Thank you! Your message has been sent. Please check your email for confirmation.");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err: unknown) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Failed to send your message. Please try again.";
      toast.error(msg);
    }
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="flex items-center gap-2 text-sm text-mute transition hover:text-white"
      >
        <Icon name="chat" />
        Message Us
      </button>
      {open && (
        <div
          className="animate-fade-in fixed inset-0 z-50 grid place-items-center bg-black/70 p-3 sm:p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Message us"
          onClick={() => setOpen(false)}
        >
          <div
            className="card animate-scale-in w-full max-w-sm max-h-[90vh] overflow-y-auto !p-4 sm:!p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold">Message Us</h2>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="text-mute hover:text-white"
              >
                <Icon name="x" />
              </button>
            </div>
            {sent ? (
              <div className="py-6 text-center space-y-2">
                <p role="status" className="font-medium text-up">
                  Thanks! We will get back to you soon.
                </p>
                <p className="text-xs text-mute">
                  A confirmation email has been sent to your inbox.
                </p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="btn-gold !px-4 !py-1.5 text-xs mt-3 inline-block"
                >
                  Close
                </button>
              </div>
            ) : (
              <form className="space-y-3" onSubmit={handleSubmit}>
                <input
                  required
                  aria-label="Name"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input"
                  disabled={isLoading}
                />
                <input
                  required
                  type="email"
                  aria-label="Email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                  disabled={isLoading}
                />
                <textarea
                  required
                  rows={4}
                  aria-label="Message"
                  placeholder="How can we help?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="input"
                  disabled={isLoading}
                />
                <button
                  className="btn-gold w-full flex items-center justify-center gap-2"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-ink border-t-transparent" />
                      Sending...
                    </>
                  ) : (
                    "Submit"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
