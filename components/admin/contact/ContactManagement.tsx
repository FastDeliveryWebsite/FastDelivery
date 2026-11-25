"use client";

import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Search,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Trash2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
  MessageCircle,
  HelpCircle,
  User,
  Tag,
  Send,
  ExternalLink,
} from "lucide-react";

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  subject: string;
  message: string;
  status: "pending" | "in-progress" | "resolved";
  admin_reply?: string | null;
  created_at: string;
  updated_at: string;
}

const STATUS_OPTIONS: Array<ContactMessage["status"]> = [
  "pending",
  "in-progress",
  "resolved",
];

export const ContactManagement: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [tablePending, setTablePending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Accordion state (collapsed by default, click opens full query details)
  const [expandedQueries, setExpandedQueries] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedQueries((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Dynamic Pagination state (when queries are 2 or more, pagination displays)
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 2;

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const res = await fetch("/api/admin/contact-messages", { cache: "no-store" });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessages(data.messages || []);
        setTablePending(!!data.tablePending);
      } else {
        setErrorMsg(data.message || "Failed to load customer messages.");
      }
    } catch {
      setErrorMsg("Network error loading customer queries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Update Status handler
  const handleStatusChange = async (id: string, newStatus: ContactMessage["status"]) => {
    setUpdatingId(id);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const res = await fetch(`/api/admin/contact-messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m))
        );
        setSuccessMsg(`Status updated to "${newStatus}"!`);
        setTimeout(() => setSuccessMsg(null), 3000);
      } else {
        setErrorMsg(data.message || "Could not update status.");
      }
    } catch {
      setErrorMsg("Network error updating inquiry status.");
    } finally {
      setUpdatingId(null);
    }
  };

  // Delete message handler
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this customer inquiry?")) {
      return;
    }

    setDeletingId(id);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const res = await fetch(`/api/admin/contact-messages/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        setSuccessMsg("Inquiry deleted successfully.");
        setTimeout(() => setSuccessMsg(null), 3000);
      } else {
        setErrorMsg(data.message || "Could not delete inquiry.");
      }
    } catch {
      setErrorMsg("Network error deleting inquiry.");
    } finally {
      setDeletingId(null);
    }
  };

  // Filter messages
  const filteredMessages = messages.filter((msg) => {
    const matchesSearch =
      msg.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.message?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || msg.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredMessages.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredMessages.length);
  const currentMessages = filteredMessages.slice(startIndex, endIndex);

  // Analytics Stats
  const totalCount = messages.length;
  const pendingCount = messages.filter((m) => m.status === "pending").length;
  const inProgressCount = messages.filter((m) => m.status === "in-progress").length;
  const resolvedCount = messages.filter((m) => m.status === "resolved").length;

  const getStatusBadge = (status: ContactMessage["status"]) => {
    switch (status) {
      case "pending":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "in-progress":
        return "bg-blue-50 text-blue-800 border-blue-200";
      case "resolved":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-brand-red text-white flex items-center justify-center shadow-xs">
              <MessageSquare className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-950 tracking-tight">
                Customer Queries & Inquiries
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 font-normal">
                Messages, product requests, and feedback submitted via the Contact page
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchMessages}
            className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer"
            title="Refresh Inquiries"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-brand-red" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Database Schema Setup Notice (if table doesn't exist yet) */}
      {tablePending && (
        <div className="p-5 rounded-3xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2 animate-fadeIn">
          <div className="flex items-center gap-2 font-bold text-sm">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>Database Table Required</span>
          </div>
          <p className="text-xs leading-relaxed">
            The database table <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono font-bold">contact_messages</code> has not been created in your Supabase database yet. Please run the script in <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono font-bold">scripts/contact-messages-schema.sql</code> in your Supabase SQL Editor.
          </p>
        </div>
      )}

      {/* Global Alerts */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm font-semibold flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-xs sm:text-sm font-semibold flex items-center gap-2.5 animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Analytics Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-gray-200/90 shadow-xs">
          <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Total Queries</p>
          <p className="text-2xl font-black text-gray-950 mt-1">{totalCount}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200/90 bg-amber-50/20 shadow-xs">
          <p className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider">Pending Action</p>
          <p className="text-2xl font-black text-amber-700 mt-1">{pendingCount}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-blue-200/90 bg-blue-50/20 shadow-xs">
          <p className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider">In-Progress</p>
          <p className="text-2xl font-black text-blue-700 mt-1">{inProgressCount}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-200/90 bg-emerald-50/20 shadow-xs">
          <p className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">Resolved</p>
          <p className="text-2xl font-black text-emerald-700 mt-1">{resolvedCount}</p>
        </div>
      </div>

      {/* Search & Status Filters */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/90 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer name, phone, email, subject, or message..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-xs sm:text-sm text-gray-900 focus:bg-white focus:outline-hidden focus:border-brand-red transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0">
          <button
            type="button"
            onClick={() => setStatusFilter("ALL")}
            className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              statusFilter === "ALL"
                ? "bg-brand-red text-white shadow-xs"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All ({totalCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("pending")}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              statusFilter === "pending"
                ? "bg-brand-red text-white shadow-xs"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("in-progress")}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              statusFilter === "in-progress"
                ? "bg-brand-red text-white shadow-xs"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            In-Progress ({inProgressCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("resolved")}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              statusFilter === "resolved"
                ? "bg-brand-red text-white shadow-xs"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Resolved ({resolvedCount})
          </button>
        </div>
      </div>

      {/* Messages List View */}
      {loading ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-brand-red animate-spin mx-auto" />
          <p className="text-sm font-bold text-gray-700">Loading customer queries from database...</p>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center space-y-3">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="text-base font-bold text-gray-900">No Customer Queries Found</h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
            {searchQuery
              ? `No messages matching "${searchQuery}". Clear your search or change the filter.`
              : "No customer inquiries have been submitted yet. Submissions from /contact will appear here instantly."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {currentMessages.map((msg) => {
            const isUpdating = updatingId === msg.id;
            const isDeleting = deletingId === msg.id;
            const isExpanded = !!expandedQueries[msg.id];
            const cleanPhone = msg.phone ? msg.phone.replace(/\D/g, "") : "";
            const waPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
            const waText = encodeURIComponent(
              `Hi ${msg.name}, thank you for contacting Fast Delivery Bilariyaganj regarding "${msg.subject}". How can we help you?`
            );

            return (
              <div
                key={msg.id}
                className="bg-white rounded-3xl border border-gray-200/90 shadow-xs overflow-hidden transition-all hover:border-gray-300"
              >
                {/* Header (Summary Row - Click dropdown button or header to toggle open/close) */}
                <div
                  onClick={() => toggleExpand(msg.id)}
                  className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 bg-gray-50/40 hover:bg-gray-50/80 transition-colors cursor-pointer select-none"
                >
                  <div className="flex flex-wrap items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-red-50 text-brand-red flex items-center justify-center font-black text-sm shrink-0 border border-red-100">
                      {msg.name ? msg.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm sm:text-base font-black text-gray-950">
                          {msg.name}
                        </span>
                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border capitalize ${getStatusBadge(
                            msg.status
                          )}`}
                        >
                          {msg.status}
                        </span>
                        <span className="hidden sm:inline-block text-[11px] font-bold text-gray-700 bg-gray-100 px-2.5 py-0.5 rounded-full">
                          {msg.subject || "General Inquiry"}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 font-normal">
                        Received on{" "}
                        {new Date(msg.created_at).toLocaleString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        &bull; Phone: <span className="font-semibold text-gray-600">{msg.phone}</span>
                      </p>
                    </div>
                  </div>

                  {/* Actions: Status Dropdown, Delete, and Dropdown Accordion Button */}
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <span className="text-xs font-bold text-gray-600 hidden sm:inline">Status:</span>
                    <div className="relative">
                      <select
                        value={msg.status}
                        disabled={isUpdating}
                        onChange={(e) =>
                          handleStatusChange(msg.id, e.target.value as ContactMessage["status"])
                        }
                        className="appearance-none bg-white border border-gray-300 text-gray-900 font-bold text-xs py-2 pl-3 pr-8 rounded-xl focus:outline-hidden focus:border-brand-red cursor-pointer shadow-xs disabled:opacity-50 capitalize"
                      >
                        {STATUS_OPTIONS.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    {isUpdating && <Loader2 className="w-4 h-4 text-brand-red animate-spin" />}

                    <button
                      type="button"
                      onClick={() => handleDelete(msg.id)}
                      disabled={isDeleting}
                      className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete inquiry"
                    >
                      {isDeleting ? (
                        <Loader2 className="w-4 h-4 animate-spin text-red-600" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>

                    {/* Accordion Dropdown Icon Button: Toggles query details */}
                    <button
                      type="button"
                      onClick={() => toggleExpand(msg.id)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        isExpanded
                          ? "bg-brand-red text-white border-brand-red shadow-xs"
                          : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                      }`}
                      title={isExpanded ? "Hide Details" : "View Query Details"}
                      aria-label="Toggle Query Details"
                    >
                      <span className="hidden xs:inline">{isExpanded ? "Close" : "Details"}</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Collapsible Inquiry Details Form / View (Opens on dropdown button click) */}
                {isExpanded && (
                  <div className="border-t border-gray-100 animate-fadeIn">
                    {/* Body Content */}
                    <div className="p-5 sm:p-6 space-y-4">
                      {/* Category Tag & Contact Channels */}
                      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-gray-700 bg-gray-100 px-3 py-1.5 rounded-xl">
                          <Tag className="w-3.5 h-3.5 text-brand-red" />
                          <span>{msg.subject || "General Inquiry"}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Call Button */}
                          <a
                            href={`tel:${msg.phone}`}
                            className="inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold px-3 py-1.5 rounded-xl border border-emerald-200 transition-colors"
                            title="Call Customer"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>{msg.phone}</span>
                          </a>

                          {/* WhatsApp Button */}
                          {waPhone && (
                            <a
                              href={`https://wa.me/${waPhone}?text=${waText}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white font-bold px-3 py-1.5 rounded-xl transition-colors shadow-xs"
                              title="Reply on WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5 fill-white text-green-500" />
                              <span>WhatsApp</span>
                            </a>
                          )}

                          {/* Email Link (if available) */}
                          {msg.email && (
                            <a
                              href={`mailto:${msg.email}?subject=RE: ${encodeURIComponent(
                                msg.subject || "Fast Delivery Inquiry"
                              )}`}
                              className="inline-flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-3 py-1.5 rounded-xl transition-colors"
                              title="Send Email"
                            >
                              <Mail className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">{msg.email}</span>
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Message Box */}
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                          Customer Message / Inquiry:
                        </p>
                        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-gray-900 text-xs sm:text-sm font-normal leading-relaxed whitespace-pre-wrap">
                          {msg.message}
                        </div>
                      </div>
                    </div>

                    {/* Footer Quick Status Advances */}
                    <div className="px-5 py-3.5 bg-gray-50/70 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="text-gray-400 font-medium">Quick Status Action:</span>
                      <div className="flex items-center gap-2">
                        {msg.status !== "in-progress" && msg.status !== "resolved" && (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(msg.id, "in-progress")}
                            disabled={isUpdating}
                            className="px-3 py-1.5 rounded-lg font-bold bg-blue-100 hover:bg-blue-200 text-blue-900 transition-colors cursor-pointer"
                          >
                            &rarr; Mark In-Progress
                          </button>
                        )}

                        {msg.status !== "resolved" && (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(msg.id, "resolved")}
                            disabled={isUpdating}
                            className="px-3 py-1.5 rounded-lg font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer"
                          >
                            ✓ Mark Resolved
                          </button>
                        )}

                        {msg.status === "resolved" && (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(msg.id, "pending")}
                            disabled={isUpdating}
                            className="px-3 py-1.5 rounded-lg font-bold bg-gray-200 hover:bg-gray-300 text-gray-800 transition-colors cursor-pointer"
                          >
                            Re-open Inquiry
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

              </div>
            );
          })}

          {/* Dynamic Pagination (Shows when items > 4) */}
          {totalPages > 1 && (
            <div className="bg-white p-4 rounded-3xl border border-gray-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs mt-4">
              <p className="text-gray-500 font-medium">
                Showing <span className="font-bold text-gray-900">{startIndex + 1}</span> to{" "}
                <span className="font-bold text-gray-900">{endIndex}</span> of{" "}
                <span className="font-bold text-gray-900">{filteredMessages.length}</span> inquiries
              </p>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-gray-700 flex items-center gap-1 transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Prev</span>
                </button>

                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pg) => (
                  <button
                    key={pg}
                    type="button"
                    onClick={() => setCurrentPage(pg)}
                    className={`w-8 h-8 rounded-xl font-bold transition-all cursor-pointer ${
                      currentPage === pg
                        ? "bg-brand-red text-white shadow-xs"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {pg}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-gray-700 flex items-center gap-1 transition-all cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
