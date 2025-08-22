"use client";

import { useState } from "react";
import Surface from "@/components/ui/Surface";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useAuth } from "@/contexts/AuthContext";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const success = login(formData.username, formData.password);
    
    if (success) {
      onClose();
      setFormData({ username: "", password: "" });
    } else {
      setError("Invalid username or password");
    }
    
    setLoading(false);
  };

  const handleClose = () => {
    if (loading) return;
    setFormData({ username: "", password: "" });
    setError("");
    onClose();
  };

  const demoCredentials = [
    { username: "admin", password: "admin123" },
    { username: "user", password: "user123" },
    { username: "student", password: "student123" },
    { username: "KizaruZero", password: "kizaru123" }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <Surface
        variant="glass"
        padding="lg"
        radius="xl"
        border
        className="relative w-full max-w-md animate-fade-in backdrop-blur-md"
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          disabled={loading}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-text-muted hover:text-text-primary hover:bg-state-hover transition-colors duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <Surface
            variant="glass"
            padding="md"
            radius="full"
            className="w-16 h-16 flex items-center justify-center mx-auto mb-6 gradient-web3-primary shadow-glow"
          >
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </Surface>
          
          <h2 className="text-2xl font-bold text-text-primary mb-2">
            Welcome Back
          </h2>
          <p className="text-text-secondary">Sign in to continue your PTE practice</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Username"
            type="text"
            value={formData.username}
            onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
            placeholder="Enter your username"
            disabled={loading}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
            required
          />

          <Input
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            placeholder="Enter your password"
            disabled={loading}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            }
            required
          />

          {error && (
            <Surface variant="default" padding="sm" radius="md" className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
              <p className="text-red-600 dark:text-red-400 text-sm flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </p>
            </Surface>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            glow
            loading={loading}
            disabled={!formData.username || !formData.password}
          >
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </form>

        {/* Demo Credentials */}
        <Surface variant="glass" padding="md" radius="lg" border className="mt-6">
          <h3 className="text-sm font-semibold text-text-primary mb-3">Demo Accounts</h3>
          <div className="grid gap-2">
            {demoCredentials.map((cred, index) => (
              <button
                key={index}
                onClick={() => setFormData(cred)}
                disabled={loading}
                className="text-left p-2 rounded-md hover:bg-state-hover transition-colors duration-200 disabled:opacity-50"
              >
                <div className="text-sm text-text-primary font-medium">{cred.username}</div>
                <div className="text-xs text-text-muted">{cred.password}</div>
              </button>
            ))}
          </div>
          <p className="text-xs text-text-muted mt-3">
            Click any account above to auto-fill credentials
          </p>
        </Surface>
      </Surface>
    </div>
  );
}