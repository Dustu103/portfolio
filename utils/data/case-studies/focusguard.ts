import type { Project } from '@/types/portfolio';

export const focusGuardProject: Project = {
  id: 6,
  name: "FocusGuard",
  description: "Developed a robust Android parental control application enforcing daily app usage limits and remote device pairing. Implemented a secure 6-digit synchronization backend allowing parents to remotely monitor installations and block specific applications.",
  html_url: "https://github.com/Dustu103/focusguard",
  demo_url: "https://focusguard-theta.vercel.app/",
  language: "Java, Kotlin, Firebase, Android SDK",
  case_study: {
    architecture: "FocusGuard is a native Android application paired with a real-time Firebase backend. It features a master-slave architecture where the parent's device acts as the controller, sending remote commands via Firebase Cloud Messaging to a background service on the child's device.",
    technical_challenge: "Reliably enforcing app usage limits and blocking apps in the background is notoriously difficult on modern Android versions due to strict battery optimization and background execution limits (Doze mode).",
    solution: "I engineered a resilient background enforcement engine using Android's AccessibilityService API combined with a Foreground Service. This ensures the monitoring thread cannot be easily killed by the OS, allowing it to instantly detect when a restricted app is launched and draw a system-level overlay to block access."
  }
};
