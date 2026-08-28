"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "../ui/LoadingSpinner";
import { useLanguage } from "../../context/LanguageContext";

type FormValues = {
  titleEn: string;
  titleAm: string;
  subtitleEn: string;
  subtitleAm: string;
  descriptionEn: string;
  descriptionAm: string;
  category: string;
  image: string;
  entryCost: string;
  startsAt: string;
  endsAt: string;
};

const initialValues: FormValues = {
  titleEn: "", titleAm: "", subtitleEn: "", subtitleAm: "", descriptionEn: "", descriptionAm: "", category: "Electronics",
  image: "", entryCost: "1", startsAt: "", endsAt: "",
};

export default function AdminAuctionForm({ id }: { id?: string }) {
  const router = useRouter();
  const { language } = useLanguage();
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    fetch(`/api/auctions/${encodeURIComponent(id)}`, { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        if (!data.success) throw new Error("Auction not found");
        const auction = data.auction;
        setValues({ titleEn: auction.titleEn || auction.title?.en || auction.title || "", titleAm: auction.titleAm || auction.title?.am || auction.title || "", subtitleEn: auction.subtitleEn || auction.subtitle?.en || auction.subtitle || "", subtitleAm: auction.subtitleAm || auction.subtitle?.am || auction.subtitle || "", descriptionEn: auction.descriptionEn || auction.description?.en || auction.description || "", descriptionAm: auction.descriptionAm || auction.description?.am || auction.description || "", category: auction.category, image: auction.image, entryCost: String(auction.entryCost), startsAt: toInputDate(auction.startsAt), endsAt: toInputDate(auction.endsAt) });
      })
      .catch(() => setError("Unable to load auction."))
      .finally(() => setLoading(false));
  }, [id]);

  function update(field: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!values.image) {
      setError("Please upload an auction image before saving.");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(id ? `/api/admin/auctions/${encodeURIComponent(id)}` : "/api/admin/auctions", {
        method: id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...values, entryCost: Number(values.entryCost) }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to save auction.");
      router.push("/admin/auctions");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to save auction.");
      setSaving(false);
    }
  }

  async function uploadImage(file: File) {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !uploadPreset) {
      setError("Cloudinary is not configured. Add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: "POST", body: formData });
      const data = await response.json();
      if (!response.ok || !data.secure_url) throw new Error("Cloudinary upload failed.");
      update("image", data.secure_url);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to upload image.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="flex min-h-[60vh] items-center justify-center"><LoadingSpinner size="lg" /></div>;

  return (
    <form onSubmit={submit} className="w-full max-w-6xl space-y-6">
      {error && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}
      <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex items-center justify-between gap-4 border-b border-black/10 pb-5">
          <div><h2 className="text-lg font-semibold">Auction content</h2><p className="mt-1 text-sm text-black/45">{language === "am" ? "ይዘቱን በሁለቱም ቋንቋዎች ያስገቡ።" : "Add the title, subtitle and description in both languages."}</p></div>
          <span className="rounded-full bg-[#1681C5]/10 px-3 py-1 text-xs font-semibold text-[#1681C5]">English + Amharic</span>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Title (English)" value={values.titleEn} onChange={(value) => update("titleEn", value)} required />
          <Field label="Title (Amharic)" value={values.titleAm} onChange={(value) => update("titleAm", value)} required />
          <Field label="Subtitle (English)" value={values.subtitleEn} onChange={(value) => update("subtitleEn", value)} required />
          <Field label="Subtitle (Amharic)" value={values.subtitleAm} onChange={(value) => update("subtitleAm", value)} required />
          <label className="block"><span className="mb-2 block text-sm font-semibold">Category</span><select value={values.category} onChange={(event) => update("category", event.target.value)} required className="h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus:border-[#1681C5]"><option>Electronics</option><option>Automotive</option><option>Home</option><option>Mystery Box</option></select></label>
        </div>
      <div className="mt-6 grid gap-5 border-t border-black/10 pt-6 sm:grid-cols-2"><label className="block"><span className="mb-2 block text-sm font-semibold">Description (English)</span><textarea value={values.descriptionEn} onChange={(event) => update("descriptionEn", event.target.value)} required rows={5} className="w-full rounded-xl border border-black/10 p-3 text-sm outline-none focus:border-[#1681C5]" /></label><label className="block"><span className="mb-2 block text-sm font-semibold">Description (Amharic)</span><textarea value={values.descriptionAm} onChange={(event) => update("descriptionAm", event.target.value)} required rows={5} className="w-full rounded-xl border border-black/10 p-3 text-sm outline-none focus:border-[#1681C5]" /></label></div>
      </section>
      <section className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm"><h2 className="text-lg font-semibold">Auction image</h2><p className="mt-1 text-sm text-black/45">Upload a product image directly to Cloudinary.</p><input type="file" accept="image/png,image/jpeg,image/webp,image/avif" onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadImage(file); }} disabled={saving} required={!id && !values.image} className="mt-5 block w-full text-sm" />{values.image && <img src={values.image} alt="Auction preview" className="mt-5 aspect-video w-full rounded-xl object-cover" />}</div>
        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm"><h2 className="text-lg font-semibold">Timing and entry</h2><p className="mt-1 text-sm text-black/45">Set when bidding opens and closes.</p><div className="mt-5 grid gap-5 sm:grid-cols-2"><Field label="Entry cost (ETB)" value={values.entryCost} onChange={(value) => update("entryCost", value)} type="number" min="0" step="0.01" required /><div /><Field label="Starts at" value={values.startsAt} onChange={(value) => update("startsAt", value)} type="datetime-local" required /><Field label="Ends at" value={values.endsAt} onChange={(value) => update("endsAt", value)} type="datetime-local" required /></div></div>
      </section>
      <div className="flex justify-end gap-3"><button type="button" onClick={() => router.back()} className="rounded-full border border-black/10 px-5 py-3 text-sm font-semibold">Cancel</button><button disabled={saving} className="rounded-full bg-[#1681C5] px-6 py-3 text-sm font-bold text-white disabled:opacity-60">{saving ? "Saving..." : id ? "Save auction" : "Create auction"}</button></div>
    </form>
  );
}

function Field({ label, value, onChange, ...props }: { label: string; value: string; onChange: (value: string) => void; type?: string; min?: string; step?: string; required?: boolean; disabled?: boolean }) {
  return <label className="block"><span className="mb-2 block text-sm font-semibold">{label}</span><input {...props} value={value} onChange={(event) => onChange(event.target.value)} className="h-11 w-full rounded-xl border border-black/10 px-3 text-sm outline-none focus:border-[#1681C5] disabled:bg-black/5" /></label>;
}

function toInputDate(value: string) {
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 16);
}