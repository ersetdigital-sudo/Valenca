"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Container from "@/components/Container";
import { Icon, SpinnerIcon, SuccessIcon } from "@/components/icons";
import { rupiah, shortLabel } from "@/lib/format";
import { detectOperator } from "@/lib/operators";
import { nominalCategories } from "@/data/products";
import { site } from "@/data/site";
import type { Product, ProductItem } from "@/types";

type View = "form" | "checkout" | "status";

const stepperLabels = ["Nomor Tujuan", "Pilih Nominal", "Konfirmasi"];

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-[14px] text-sm">
      <span className="text-muted">{label}</span>
      <b className="text-right font-semibold">{value}</b>
    </div>
  );
}

function Divider() {
  return <div className="h-[2px] bg-line" />;
}

function TotalRow({
  label,
  value,
  big = false,
}: {
  label: string;
  value: string;
  big?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-[14px]">
      <span className="text-[11px] uppercase tracking-[0.14em] text-muted">
        {label}
      </span>
      <b
        className={`font-display text-navy ${big ? "text-[28px]" : "text-[26px]"}`}
      >
        {value}
      </b>
    </div>
  );
}

export default function PaymentWizard({ product }: { product: Product }) {
  const [view, setView] = useState<View>("form");
  const [step, setStep] = useState(1);
  const [target, setTarget] = useState("");
  const [item, setItem] = useState<ProductItem | null>(null);
  const [inpErr, setInpErr] = useState<string | null>(null);
  const [nomErr, setNomErr] = useState(false);
  const [operator, setOperator] = useState<string | null>(null);
  const [trxId, setTrxId] = useState("");
  const [timeStr, setTimeStr] = useState("");
  const [status, setStatus] = useState<"waiting" | "success">("waiting");
  const [token, setToken] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(10 * 60);
  const targetRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const isNominal = nominalCategories.includes(product.id);
  const detectOpr = product.id === "pulsa" || product.id === "data";
  const digits = target.replace(/[^0-9]/g, "").length;
  const price = item?.price ?? 0;
  const total = item ? price + product.admin : 0;

  useEffect(() => {
    if (view !== "checkout") return;
    const id = setInterval(
      () => setSeconds((s) => (s > 0 ? s - 1 : 0)),
      1000
    );
    return () => clearInterval(id);
  }, [view]);

  useEffect(() => {
    if (view !== "status" || status !== "waiting") return;
    const id = setTimeout(() => {
      setStatus("success");
      if (product.id === "pln" && item?.label.startsWith("Token")) {
        setToken(
          Array.from({ length: 5 }, () =>
            String(Math.floor(1000 + Math.random() * 9000))
          ).join(" ")
        );
      }
    }, 3500);
    return () => clearTimeout(id);
  }, [view, status, product.id, item]);

  function targetError() {
    setInpErr(
      `Mohon isi ${product.inputLabel} dengan benar (min ${product.min} digit).`
    );
  }

  function goStep(n: number) {
    if (n >= 2 && digits < product.min) {
      targetError();
      setStep(1);
      targetRef.current?.focus();
      return;
    }
    if (n === 3 && !item) {
      setNomErr(true);
      setStep(2);
      return;
    }
    setStep(n);
    window.scrollTo({ top: 0 });
  }

  function toCheckout() {
    if (digits < product.min) {
      targetError();
      setStep(1);
      targetRef.current?.focus();
      return;
    }
    if (!item) {
      setNomErr(true);
      setStep(2);
      return;
    }
    setTrxId("VLC-" + Date.now().toString().slice(-8));
    setTimeStr(
      new Date().toLocaleString("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    );
    setSeconds(10 * 60);
    setView("checkout");
    window.scrollTo({ top: 0 });
  }

  function backToForm() {
    setView("form");
    setStep(3);
    window.scrollTo({ top: 0 });
  }

  function confirmPay() {
    setStatus("waiting");
    setToken(null);
    setView("status");
    window.scrollTo({ top: 0 });
  }

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <main className="relative z-10 pb-[90px] pt-12">
      <Container>
        {view === "form" && (
          <>
            <Link
              href="/"
              className="mb-[26px] inline-flex items-center gap-2 text-sm font-semibold text-navy hover:underline"
            >
              ← Kembali ke Beranda
            </Link>

            <div className="mb-[26px] flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="grid size-11 place-items-center rounded-[12px] border-2 border-navy bg-orange">
                  <Icon name={product.icon} className="size-[22px] text-white" />
                </div>
                <div>
                  <h2 className="font-display text-[22px] leading-[1.2]">
                    {product.nama}
                  </h2>
                  <span className="text-xs text-muted">{product.tag}</span>
                </div>
              </div>

              <div className="flex items-center overflow-hidden rounded-full border-2 border-navy bg-white p-[6px] shadow-hard max-[820px]:w-full max-[820px]:justify-between max-[820px]:rounded-card">
                {stepperLabels.map((label, i) => {
                  const n = i + 1;
                  const isOn = step === n;
                  const isDone = step > n;
                  return (
                    <div key={label} className="flex items-center">
                      {i > 0 && (
                        <div className="h-[2px] w-[26px] flex-none bg-line max-[820px]:w-3" />
                      )}
                      <div
                        className={`flex items-center gap-[9px] whitespace-nowrap rounded-full px-[18px] py-[9px] text-[13px] font-bold transition max-[820px]:gap-[7px] max-[820px]:px-[10px] max-[820px]:py-2 max-[820px]:text-xs ${
                          isOn
                            ? "bg-orange text-white"
                            : isDone
                              ? "text-navy"
                              : "text-muted"
                        }`}
                      >
                        <b
                          className={`grid size-[22px] place-items-center rounded-full border-2 text-xs font-bold ${
                            isOn
                              ? "border-white bg-white text-orange"
                              : isDone
                                ? "border-navy bg-navy text-white"
                                : "border-line bg-tint text-muted"
                          }`}
                        >
                          {n}
                        </b>
                        <span className={isOn ? "" : "max-[820px]:hidden"}>
                          {label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="max-w-[760px] rounded-card border-2 border-navy bg-white p-[30px] shadow-card">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="s1"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35 }}
                  >
                    <div className="font-display text-[19px]">
                      Masukkan nomor tujuan
                    </div>
                    <div className="mb-[22px] text-[13px] text-muted">
                      {product.hint}
                    </div>
                    <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                      {product.inputLabel}
                    </label>
                    <input
                      ref={targetRef}
                      className="w-full rounded-btn border-2 border-line bg-bg px-4 py-[14px] text-[15px] outline-none transition placeholder:text-[#9CA3AF] focus:border-navy focus:shadow-[0_0_0_3px_rgba(20,33,61,.15)]"
                      inputMode="numeric"
                      autoComplete="off"
                      placeholder={product.placeholder}
                      value={target}
                      onChange={(e) => {
                        setTarget(e.target.value);
                        setInpErr(null);
                        if (detectOpr) {
                          setOperator(detectOperator(e.target.value));
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") goStep(2);
                      }}
                    />
                    {detectOpr && operator && (
                      <div className="mt-3 inline-flex items-center gap-[10px] rounded-btn border-2 border-line bg-tint px-[14px] py-[10px] text-[13px] font-semibold">
                        <span className="size-[9px] rounded-full bg-ok" />
                        <span>
                          Terdeteksi:{" "}
                          <em className="not-italic font-bold text-orange">
                            {operator}
                          </em>
                        </span>
                      </div>
                    )}
                    <p className="mt-2 text-xs text-muted">{product.hint}</p>
                    {inpErr && (
                      <p className="mt-2 text-[13px] text-[#EF4444]">{inpErr}</p>
                    )}
                    <div className="mt-[26px] flex flex-wrap gap-3">
                      <ButtonNav variant="outline" onClick={() => router.push("/")}>
                        Batal
                      </ButtonNav>
                      <ButtonNav variant="solid" onClick={() => goStep(2)}>
                        Lanjut →
                      </ButtonNav>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="s2"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35 }}
                  >
                    <div className="font-display text-[19px]">
                      {isNominal ? "Pilih nominal" : "Pilih layanan / tagihan"}
                    </div>
                    <div className="mb-[22px] text-[13px] text-muted">
                      Untuk <b className="text-navy">{target}</b> ·{" "}
                      <button
                        type="button"
                        onClick={() => goStep(1)}
                        className="cursor-pointer border-b-2 border-orange text-xs font-bold text-orange"
                      >
                        ubah nomor
                      </button>
                    </div>
                    <div className="grid gap-3 min-[561px]:grid-cols-2 min-[761px]:grid-cols-3">
                      {product.items.map((it, i) => {
                        const active = item?.label === it.label;
                        return (
                          <button
                            key={it.label}
                            type="button"
                            onClick={() => {
                              setItem(it);
                              setNomErr(false);
                            }}
                            className={`relative flex min-h-[88px] flex-col justify-center gap-[2px] rounded-[12px] border-2 border-line bg-white px-3 py-[14px] text-center transition duration-150 hover:-translate-y-0.5 hover:border-orange ${
                              active
                                ? "border-navy bg-navy shadow-hard hover:border-navy"
                                : ""
                            }`}
                          >
                            <span
                              className={`absolute -right-[9px] -top-[9px] size-[22px] place-items-center rounded-full border-2 border-navy bg-orange text-xs text-white ${
                                active ? "grid" : "hidden"
                              }`}
                            >
                              ✓
                            </span>
                            <b
                              className={`font-display text-[17px] leading-[1.15] ${active ? "text-white" : "text-navy"}`}
                            >
                              {shortLabel(it.label)}
                            </b>
                            <span
                              className={`text-[13px] font-bold ${active ? "text-orange-light" : "text-orange"}`}
                            >
                              {rupiah(it.price)}
                            </span>
                            <span
                              className={`text-[11px] leading-[1.3] ${active ? "text-white/70" : "text-muted"}`}
                            >
                              {it.sub}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    {nomErr && (
                      <p className="mt-2 text-[13px] text-[#EF4444]">
                        Pilih salah satu nominal dulu ya.
                      </p>
                    )}
                    <div className="mt-[26px] flex flex-wrap gap-3">
                      <ButtonNav variant="outline" onClick={() => goStep(1)}>
                        ← Kembali
                      </ButtonNav>
                      <ButtonNav variant="solid" onClick={() => goStep(3)}>
                        Lanjut →
                      </ButtonNav>
                    </div>
                  </motion.div>
                )}

                {step === 3 && item && (
                  <motion.div
                    key="s3"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35 }}
                  >
                    <div className="font-display text-[19px]">
                      Cek lagi pesanan kamu
                    </div>
                    <div className="mb-[22px] text-[13px] text-muted">
                      Pastikan semuanya benar sebelum lanjut ke pembayaran QRIS.
                    </div>
                    <div className="rounded-card border-2 border-line bg-tint p-[22px]">
                      <div className="flex flex-col gap-3">
                        <Row label="Layanan" value={product.nama} />
                        <Row label={product.targetLabel} value={target} />
                        <Row label="Nominal" value={item.label} />
                        <Divider />
                        <Row label="Harga" value={rupiah(price)} />
                        <Row
                          label="Biaya Admin"
                          value={product.admin ? rupiah(product.admin) : "Gratis"}
                        />
                        <Divider />
                        <TotalRow label="Total Bayar" value={rupiah(total)} big />
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-muted">
                      ⚠️ Transaksi yang sudah diproses tidak dapat dibatalkan.
                    </p>
                    <div className="mt-[26px] flex flex-wrap gap-3">
                      <ButtonNav variant="outline" onClick={() => goStep(2)}>
                        ← Ubah Nominal
                      </ButtonNav>
                      <ButtonNav variant="solid" onClick={toCheckout}>
                        Bayar via QRIS →
                      </ButtonNav>
                    </div>
                    <p className="mt-3 text-center text-xs text-muted">
                      Tanpa login. Tanpa registrasi.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        )}

        {view === "checkout" && item && (
          <>
            <button
              type="button"
              onClick={backToForm}
              className="mb-[26px] inline-flex items-center gap-2 text-sm font-semibold text-navy hover:underline"
            >
              ← Ubah Pesanan
            </button>
            <div className="mb-7">
              <h2 className="font-display text-[clamp(28px,4.5vw,42px)] leading-[1.15]">
                Selesaikan Pembayaran
              </h2>
              <p className="mt-[10px] max-w-[54ch] text-base text-muted">
                Scan kode QRIS di bawah menggunakan aplikasi bank atau e-wallet
                apa pun.
              </p>
            </div>
            <div className="grid items-start gap-7 min-[901px]:grid-cols-[1.3fr_.9fr]">
              <div className="rounded-card border-2 border-navy bg-white p-7 shadow-card">
                <h4 className="mb-[18px] text-[13px] uppercase tracking-[0.1em] text-muted">
                  Detail Transaksi
                </h4>
                <div className="flex flex-col gap-3">
                  <Row label="Kode Transaksi" value={trxId} />
                  <Row label="Layanan" value={product.nama} />
                  <Row label={product.targetLabel} value={target} />
                  <Row label="Nominal / Layanan" value={item.label} />
                  <Divider />
                  <Row label="Harga" value={rupiah(price)} />
                  <Row
                    label="Biaya Admin"
                    value={product.admin ? rupiah(product.admin) : "Gratis"}
                  />
                  <Divider />
                  <TotalRow label="Total Bayar" value={rupiah(total)} />
                </div>
                <p className="mt-[18px] text-xs text-muted">
                  ⚠️ Pastikan nomor tujuan sudah benar. Transaksi yang sudah
                  diproses tidak dapat dibatalkan.
                </p>
              </div>

              <div className="rounded-card border-2 border-navy bg-white p-7 text-center shadow-card">
                <h4 className="mb-[18px] text-[13px] uppercase tracking-[0.1em] text-muted">
                  Scan &amp; Bayar
                </h4>
                {/* GANTI MANUAL: gambar QR code QRIS milik client */}
                <div className="mx-auto grid size-[220px] place-items-center rounded-card border-2 border-navy bg-white p-[10px] shadow-hard">
                  <div className="grid h-full w-full place-items-center rounded-lg bg-navy font-display text-[26px] tracking-[0.1em] text-white">
                    QRIS
                  </div>
                </div>
                <p className="mt-[14px] text-xs text-muted">
                  Nominal terisi otomatis saat dipindai
                </p>
                <div className="mt-4 font-display text-[28px] text-orange">
                  {mm}:{ss}
                </div>
                <p className="text-xs text-muted">Sisa waktu pembayaran</p>
                <ButtonNav
                  variant="solid"
                  onClick={confirmPay}
                  className="mt-[22px] block w-full text-center"
                >
                  Saya Sudah Bayar ✓
                </ButtonNav>
                <ButtonNav
                  variant="outline"
                  onClick={backToForm}
                  className="mt-[10px] block w-full text-center"
                >
                  Batalkan
                </ButtonNav>
              </div>
            </div>
          </>
        )}

        {view === "status" && item && (
          <div className="mx-auto max-w-[620px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={status}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="rounded-card border-2 border-navy bg-white p-7 text-center shadow-card"
              >
                <div className="mx-auto mb-[22px] grid size-[90px] place-items-center rounded-full border-[3px] border-navy bg-tint">
                  {status === "waiting" ? (
                    <SpinnerIcon className="size-[42px] animate-spin text-navy" />
                  ) : (
                    <SuccessIcon className="size-[42px] text-ok" />
                  )}
                </div>
                <span
                  className={`inline-flex items-center gap-2 rounded-full border-2 px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] ${
                    status === "waiting"
                      ? "border-warn bg-tint text-warn"
                      : "border-ok bg-[#FFEFE6] text-ok"
                  }`}
                >
                  {status === "waiting"
                    ? "Menunggu Konfirmasi"
                    : "Transaksi Berhasil"}
                </span>
                <h2 className="my-[18px] mb-[10px] font-display text-[28px]">
                  {status === "waiting"
                    ? "Menunggu Konfirmasi"
                    : "Transaksi Berhasil! 🎉"}
                </h2>
                <p className="mx-auto max-w-[44ch] text-muted">
                  {status === "waiting"
                    ? "Pembayaran kamu sedang kami verifikasi. Tunggu sebentar ya, halaman ini akan update otomatis."
                    : "Pembayaran terkonfirmasi dan produkmu sudah diproses. Makasih udah pakai Valenca!"}
                </p>

                <div className="mt-[30px] flex flex-col gap-3 text-left">
                  <Row label="Kode Transaksi" value={trxId} />
                  <Row label="Layanan" value={product.nama} />
                  <Row label={product.targetLabel} value={target} />
                  <Row label="Nominal / Layanan" value={item.label} />
                  <Row label="Waktu" value={timeStr} />
                  <Divider />
                  <TotalRow label="Total Dibayar" value={rupiah(total)} />
                </div>

                {token && (
                  <div className="mt-[22px] text-left">
                    <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                      Nomor Token / Referensi
                    </label>
                    <div className="rounded-btn border-2 border-line bg-bg px-4 py-[14px] text-center font-display text-[18px] tracking-[0.12em] text-navy">
                      {token}
                    </div>
                  </div>
                )}

                <Link
                  href="/"
                  className="mt-[22px] block w-full rounded-btn border-2 border-navy bg-navy px-6 py-3 text-center text-sm font-bold text-white shadow-hard transition duration-150 hover:-translate-y-0.5 hover:shadow-[0_4px_0_#14213d]"
                >
                  {status === "waiting" ? "Kembali ke Beranda" : "Transaksi Baru"}
                </Link>
                <p className="mt-[14px] text-xs text-muted">
                  Butuh bantuan? Chat CS kami di{" "}
                  <span className="font-bold text-navy">{site.whatsapp}</span>
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </Container>
    </main>
  );
}

function ButtonNav({
  variant,
  onClick,
  className = "",
  children,
}: {
  variant: "solid" | "outline";
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  const base =
    variant === "solid"
      ? "rounded-btn border-2 border-navy bg-navy px-6 py-3 text-sm font-bold text-white shadow-hard transition duration-150 hover:-translate-y-0.5 hover:shadow-[0_4px_0_#14213d]"
      : "rounded-btn border-2 border-navy bg-transparent px-6 py-3 text-sm font-bold text-navy transition hover:bg-navy hover:text-white";
  return (
    <div className={`min-w-[150px] flex-1 ${className}`}>
      <button type="button" onClick={onClick} className={`${base} w-full text-center`}>
        {children}
      </button>
    </div>
  );
}
