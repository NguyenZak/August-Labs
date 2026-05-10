"use client";

import { useEffect, useState } from "react";
import { getLeads, updateLeadStatus } from "@/app/actions/leads";
import { 
  User, 
  Mail, 
  Briefcase, 
  Calendar, 
  MessageSquare, 
  Filter, 
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  MoreVertical,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    const result = await getLeads();
    if (result.success) {
      setLeads(result.data || []);
    }
    setLoading(false);
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    const result = await updateLeadStatus(id, newStatus);
    if (result.success) {
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.brand && lead.brand.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = filterStatus === "all" || lead.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit">
          <Clock size={12} /> New
        </span>;
      case "contacting":
        return <span className="px-3 py-1 rounded-full bg-yellow-50 text-yellow-600 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit">
          <AlertCircle size={12} /> Contacting
        </span>;
      case "closed":
        return <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit">
          <CheckCircle2 size={12} /> Closed
        </span>;
      case "spam":
        return <span className="px-3 py-1 rounded-full bg-gray-50 text-gray-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit">
          Spam
        </span>;
      default:
        return null;
    }
  };

  return (
    <div className="p-8">
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Leads</h1>
          <p className="text-gray-500">Manage and track your incoming business requests.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Search leads..."
              className="pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <select 
              className="pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all appearance-none bg-white font-medium text-gray-700"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="contacting">Contacting</option>
              <option value="closed">Closed</option>
              <option value="spam">Spam</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-48 bg-gray-100 rounded-[24px] animate-pulse" />
          ))
        ) : filteredLeads.length === 0 ? (
          <div className="bg-white rounded-[32px] border border-dashed border-gray-200 p-20 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={40} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No leads found</h3>
            <p className="text-gray-500">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          filteredLeads.map((lead) => (
            <motion.div 
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={lead.id}
              className="bg-white rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-all p-8 group"
            >
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Info Section */}
                <div className="lg:w-1/3">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-vibrant flex items-center justify-center text-white font-bold text-xl">
                      {lead.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{lead.name}</h3>
                      <div className="flex flex-col gap-1 mt-1">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Mail size={14} /> {lead.email}
                        </div>
                        {lead.phone && (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span className="w-3.5 h-3.5 flex items-center justify-center">📞</span> {lead.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Briefcase size={16} className="text-pink-500" />
                      <span className="font-semibold text-gray-700">Brand:</span>
                      <span className="text-gray-600">{lead.brand || "Not specified"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Filter size={16} className="text-pink-500" />
                      <span className="font-semibold text-gray-700">Service:</span>
                      <span className="text-gray-600">{lead.service || "General Inquiry"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <AlertCircle size={16} className="text-pink-500" />
                      <span className="font-semibold text-gray-700">Budget:</span>
                      <span className="text-gray-600">{lead.budget || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar size={16} className="text-pink-500" />
                      <span className="font-semibold text-gray-700">Date:</span>
                      <span className="text-gray-600">{new Date(lead.created_at).toLocaleDateString("vi-VN")}</span>
                    </div>
                  </div>
                </div>

                {/* Message Section */}
                <div className="lg:w-1/2 bg-gray-50 rounded-2xl p-6 relative">
                  <MessageSquare size={20} className="text-gray-200 absolute top-4 right-4" />
                  <p className="text-gray-700 leading-relaxed italic">
                    "{lead.message || "No message provided."}"
                  </p>
                </div>

                {/* Actions Section */}
                <div className="lg:w-[15%] flex flex-col justify-between items-end">
                  <div className="mb-4">{getStatusBadge(lead.status)}</div>
                  
                  <div className="flex flex-col gap-2 w-full">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1">Status Update</label>
                    <select 
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition-all appearance-none bg-white"
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                    >
                      <option value="new">New</option>
                      <option value="contacting">Contacting</option>
                      <option value="closed">Closed</option>
                      <option value="spam">Spam</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
