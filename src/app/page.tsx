"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Code2, Terminal, Zap } from "lucide-react";

const features = [
  { icon: Sparkles, label: "AI Powered" },
  { icon: Terminal, label: "Live Terminal" },
  { icon: Zap, label: "Instant Preview" },
] as const;

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(239_84%_67%/0.12)_0%,transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,hsl(280_84%_67%/0.08)_0%,transparent_50%)]" />
      
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center gap-8 px-6 text-center"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20 glow-primary"
        >
          <Code2 className="h-10 w-10 text-primary" />
        </motion.div>

        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            AI Code Editor
          </h1>
          <p className="max-w-md text-lg text-muted-foreground">
            Build, run, and deploy applications with AI-powered assistance
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          {features.map(({ icon: Icon, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.08 }}
              className="flex items-center gap-2 rounded-full border border-border/50 bg-card/50 px-4 py-2 text-sm text-muted-foreground backdrop-blur-sm"
            >
              <Icon className="h-4 w-4 text-primary" />
              {label}
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Link
            href="/editor"
            className="group mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3 font-medium text-primary-foreground transition-all hover:bg-primary/90 glow-primary"
          >
            Start Building
            <Zap className="h-4 w-4 transition-transform group-hover:scale-110" />
          </Link>
        </motion.div>
      </motion.main>
    </div>
  );
}
