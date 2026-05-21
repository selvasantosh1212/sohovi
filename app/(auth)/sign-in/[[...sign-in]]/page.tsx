import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ background: "linear-gradient(135deg, #1E3A5F 0%, #152b47 100%)" }}
    >
      {/* Logo */}
      <div className="mb-8 flex flex-col items-center gap-3">
        <Link href="/" className="flex items-center gap-2">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-lg"
            style={{ background: "#00C9A7" }}
          >
            S
          </div>
          <span className="text-white font-bold text-2xl">Sohovi</span>
        </Link>
        <p className="text-white/60 text-sm">Privacy-first data quality platform</p>
      </div>

      <SignIn
        appearance={{
          layout: {
            logoPlacement: "none",
          },
          variables: {
            colorPrimary: "#00C9A7",
            colorText: "#1e293b",
            colorBackground: "#ffffff",
            borderRadius: "0.75rem",
          },
          elements: {
            card: "shadow-2xl",
            formButtonPrimary:
              "bg-[#00C9A7] hover:bg-[#00a88c] text-slate-900 font-semibold",
            footerActionLink: "text-[#00C9A7] hover:text-[#00a88c]",
          },
        }}
      />
    </div>
  );
}
