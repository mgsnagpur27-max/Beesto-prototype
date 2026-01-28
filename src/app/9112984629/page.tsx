"use client";

import { useEffect, useState } from "react";
import { Download, Loader2 } from "lucide-react";

export default function SecretDownloadPage() {
  const [status, setStatus] = useState<"loading" | "downloading" | "done" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const downloadZip = async () => {
      try {
        setStatus("downloading");
        
        const response = await fetch("/api/download-source");
        
        if (!response.ok) {
          throw new Error(`Download failed: ${response.status}`);
        }
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const filename = `beesto-source-${Date.now()}.zip`;
        
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        }, 100);
        
        setStatus("done");
      } catch (err) {
        console.error("Download error:", err);
        setErrorMsg(err instanceof Error ? err.message : "Unknown error");
        setStatus("error");
      }
    };

    const timer = setTimeout(downloadZip, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleRetry = () => {
    setStatus("loading");
    window.location.reload();
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0f] text-white">
      <div className="flex flex-col items-center gap-6 p-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10 ring-1 ring-violet-500/30">
          {status === "downloading" || status === "loading" ? (
            <Loader2 className="h-8 w-8 text-violet-400 animate-spin" />
          ) : (
            <Download className="h-8 w-8 text-violet-400" />
          )}
        </div>

        {(status === "loading" || status === "downloading") && (
          <div className="text-center">
            <h1 className="text-xl font-semibold text-zinc-200">
              {status === "loading" ? "Preparing download..." : "Downloading..."}
            </h1>
            <p className="mt-2 text-sm text-zinc-500">Please wait, creating ZIP archive</p>
          </div>
        )}

        {status === "done" && (
          <div className="text-center">
            <h1 className="text-xl font-semibold text-emerald-400">Download complete!</h1>
            <p className="mt-2 text-sm text-zinc-500">Check your downloads folder</p>
            <button
              onClick={handleRetry}
              className="mt-4 flex items-center gap-2 rounded-lg bg-violet-600 px-6 py-3 font-medium text-white transition-colors hover:bg-violet-500"
            >
              <Download className="h-4 w-4" />
              Download again
            </button>
          </div>
        )}

        {status === "error" && (
          <div className="text-center">
            <h1 className="text-xl font-semibold text-red-400">Download failed</h1>
            <p className="mt-2 text-sm text-zinc-500">{errorMsg}</p>
            <button
              onClick={handleRetry}
              className="mt-4 flex items-center gap-2 rounded-lg bg-violet-600 px-6 py-3 font-medium text-white transition-colors hover:bg-violet-500"
            >
              Retry download
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
