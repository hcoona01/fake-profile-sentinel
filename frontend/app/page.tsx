"use client";

import { useState } from "react";
import UploadForm from "../components/UploadForm";
import ResultCard from "../components/ResultCard";

export default function Home() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white">
      {/* Navbar */}
      <nav className="border-b border-white/10 backdrop-blur-md bg-white/5 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-lg shadow-lg">
              🛡️
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">Sentinel</h1>
              <p className="text-xs text-blue-400">AI Fake Profile Detector</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-3 py-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-400 text-xs font-medium">Live</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="text-center py-16 px-4 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[300px] bg-blue-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-6">
            <span className="text-blue-400 text-sm">🤖 Powered by ML + Rule Engine</span>
          </div>

          <h2 className="text-5xl font-bold text-white mb-4 leading-tight">
            Detect Fake Profiles
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              Instantly
            </span>
          </h2>

          <p className="text-gray-400 max-w-lg mx-auto text-lg mb-8">
            AI-powered trust scoring that analyzes social profiles
            and detects bots in milliseconds
          </p>

          {/* Stats bar */}
          <div className="flex items-center justify-center gap-8 mb-12">
            {[
              { label: "Profiles Analyzed", value: "50K+" },
              { label: "Detection Accuracy", value: "87%" },
              { label: "Risk Factors", value: "8+" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div className="max-w-2xl mx-auto px-4 pb-16">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm shadow-2xl">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <span>🔍</span> Analyze a Profile
          </h3>
          <UploadForm onResult={setResult} onLoading={setLoading} />
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center mt-8">
            <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-8 py-5">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-gray-300">Analyzing profile with AI...</span>
            </div>
          </div>
        )}

        {/* Result */}
        {result && !loading && <ResultCard result={result} />}
      </div>

      {/* Footer */}
      <div className="text-center py-8 border-t border-white/5">
        <p className="text-gray-600 text-sm">
          Sentinel — Built with ❤️ for hackathon 🚀
        </p>
      </div>
    </main>
  );
}