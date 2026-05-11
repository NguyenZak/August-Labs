"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Send, CheckCircle2, Phone } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { submitLead } from "@/app/actions/leads";
import { useSettings } from "@/lib/context/SettingsContext";

export default function Contact() {
  const { t, lang } = useLanguage();
  const { general } = useSettings();

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [phoneError, setPhoneError] = useState("");
  
  const validatePhone = (phone: string) => {
    if (!phone) return true;
    const phoneRegex = /^(0|84|\+84)(3|5|7|8|9)([0-9]{8})$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ""))) {
      setPhoneError(lang === 'vi' ? "Số điện thoại không hợp lệ." : "Invalid phone number.");
      return false;
    }
    setPhoneError("");
    return true;
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");
    setPhoneError("");


    const formData = new FormData(e.currentTarget);
    const leadData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      brand: formData.get("brand") as string,
      service: formData.get("service") as string,
      budget: formData.get("budget") as string,
      message: formData.get("message") as string
    };

    if (!validatePhone(leadData.phone)) {
      setIsSubmitting(false);
      return;
    }



    try {
      const result = await submitLead(leadData);
      if (result.success) {
        setIsSubmitted(true);
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      setErrorMsg(t("pageContact.formError") || "Something went wrong. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50/50 pb-24">
      <section className="pt-32 pb-12">
        <div className="container mx-auto px-6 md:px-12 max-w-6xl">
          <div className="bg-white rounded-[40px] shadow-xl border border-gray-100 overflow-hidden flex flex-col lg:flex-row">
            
            {/* Left Side: Contact Info */}
            <div className="lg:w-5/12 bg-gray-900 text-white p-10 md:p-16 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-vibrant opacity-20 blur-[80px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 opacity-20 blur-[80px] pointer-events-none" />
              
              <div className="relative z-10">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl md:text-6xl font-headline tracking-tight mb-4"
                >
                  {t("pageContact.heroTitle")} <br />
                  <span className="text-gradient-vibrant">{t("pageContact.heroHighlight")}</span>
                </motion.h1>
                <motion.p className="text-gray-400 text-lg mb-16">
                  {t("pageContact.heroDesc")}
                </motion.p>

                <div className="space-y-8">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-pink-400" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">{t("pageContact.emailTitle")}</p>
                      <a href={`mailto:${general.email}`} className="text-lg font-semibold hover:text-pink-400 transition-colors">
                        {general.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Hotline</p>
                      <a href={`tel:${general.phone}`} className="text-lg font-semibold hover:text-green-400 transition-colors">
                        {general.phone || "090 123 4567"}
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">{t("pageContact.officeTitle")}</p>
                      <p className="text-lg font-semibold leading-relaxed">
                        {general.address}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Form */}
            <div className="lg:w-7/12 p-10 md:p-16 bg-white">
              {isSubmitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-20">
                  <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-12 h-12 text-green-500" />
                  </div>
                  <h3 className="text-3xl font-headline text-gray-900 mb-4">Awesome!</h3>
                  <p className="text-gray-600 text-lg max-w-md mx-auto">
                    {t("pageContact.formSuccess")}
                  </p>
                  <button onClick={() => setIsSubmitted(false)} className="mt-8 px-8 py-3 rounded-full border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors">
                    Send another request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {errorMsg && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">{errorMsg}</div>}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">{t("pageContact.formName")} *</label>
                      <input name="name" required type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 transition-colors bg-gray-50/50" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">{t("pageContact.formEmail")} *</label>
                      <input name="email" required type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 transition-colors bg-gray-50/50" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Số điện thoại *</label>
                      <input 
                        name="phone" 
                        required 
                        type="tel" 
                        onBlur={(e) => validatePhone(e.target.value)}
                        onChange={() => {
                          if (phoneError) setPhoneError("");
                        }}
                        className={`w-full px-4 py-3 rounded-xl border transition-colors bg-gray-50/50 ${phoneError ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-pink-500'}`} 
                      />

                      {phoneError && <p className="text-red-500 text-xs mt-1 font-medium">{phoneError}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">{t("pageContact.formBrand")}</label>
                      <input name="brand" type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 transition-colors bg-gray-50/50" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">{t("pageContact.formService")} *</label>
                      <select name="service" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 transition-colors bg-gray-50/50 appearance-none">
                        <option value="">{t("pageContact.formServiceOptions.0")}</option>
                        <option value="Brand Strategy & Identity">{t("pageContact.formServiceOptions.1")}</option>
                        <option value="Performance Marketing">{t("pageContact.formServiceOptions.2")}</option>
                        <option value="Social Media & Content">{t("pageContact.formServiceOptions.3")}</option>
                        <option value="Tech & O2O Booking App">{t("pageContact.formServiceOptions.4")}</option>
                        <option value="Comprehensive Growth">{t("pageContact.formServiceOptions.5")}</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">{t("pageContact.formBudget")} *</label>
                      <select name="budget" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 transition-colors bg-gray-50/50 appearance-none">
                        <option value="">{t("pageContact.formBudgetOptions.0")}</option>
                        <option value="Under $2,000">{t("pageContact.formBudgetOptions.1")}</option>
                        <option value="$2,000 - $5,000">{t("pageContact.formBudgetOptions.2")}</option>
                        <option value="$5,000 - $10,000">{t("pageContact.formBudgetOptions.3")}</option>
                        <option value="$10,000+">{t("pageContact.formBudgetOptions.4")}</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">{t("pageContact.formMessage")}</label>
                    <textarea name="message" rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 transition-colors bg-gray-50/50 resize-none"></textarea>
                  </div>

                  <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-70">
                    {isSubmitting ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : <>{t("pageContact.formSubmit")} <Send className="w-4 h-4" /></>}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
