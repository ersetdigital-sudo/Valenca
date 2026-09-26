"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/admin/actions";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, null);

  return (
    <form action={formAction} className="w-full">
      <label htmlFor="password" className="mb-1.5 block text-[13px] font-medium text-ink">
        Password admin
      </label>
      <input
        id="password"
        name="password"
        type="password"
        required
        autoComplete="current-password"
        autoFocus
        aria-invalid={state?.error ? true : undefined}
        aria-describedby={state?.error ? "login-error" : "login-hint"}
        className="w-full rounded-[10px] border border-line bg-white px-3.5 py-2.5 text-sm text-navy outline-none transition placeholder:text-[#667290] focus:border-orange focus:ring-2 focus:ring-orange/25"
        placeholder="••••••••"
      />
      <p id="login-hint" className="mt-2 text-xs text-ink">
        Masuk untuk mengelola produk &amp; pengaturan situs.
      </p>

      {state?.error && (
        <p
          id="login-error"
          role="alert"
          className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-800"
        >
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-5 inline-flex w-full items-center justify-center rounded-[10px] bg-navy px-6 py-2.5 text-sm font-medium text-white transition hover:bg-navy-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
      >
        {pending ? "Memeriksa…" : "Masuk"}
      </button>
    </form>
  );
}
