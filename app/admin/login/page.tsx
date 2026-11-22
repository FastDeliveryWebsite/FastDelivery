import { AdminLogin } from "@/components/admin/AdminLogin";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Sign In | Fast Delivery Bilariyaganj",
  description: "Secure Admin Login with Custom JWT Authentication",
};

export default function AdminLoginPage() {
  return <AdminLogin />;
}
