import { FONT_MONO } from "./ui";

type FieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  id: string;
};

/** Input styled for the dark navy CTA panels. Shared by both site forms. */
export default function FormField({ label, id, ...rest }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className={`text-[11px] font-medium uppercase tracking-[0.08em] text-white/70 ${FONT_MONO}`}
      >
        {label}
      </label>
      <input
        id={id}
        {...rest}
        className="h-12 rounded-lg border border-white/20 bg-white/10 px-4 text-[14.5px] text-white outline-none transition-all placeholder:text-white/40 hover:border-white/35 focus:border-(--blue) focus:bg-white/15 focus:ring-4 focus:ring-(--blue)/25 disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  );
}

/**
 * Hidden field that people never see and bots tend to fill.
 * Named `website` so it does not collide with a real company field.
 */
export function Honeypot({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="hidden" aria-hidden="true">
      <label htmlFor="hp-website">Website</label>
      <input
        id="hp-website"
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

/** Confirmation panel shown in place of a form after a successful submit. */
export function FormSuccess({
  title,
  body,
  icon,
}: {
  title: string;
  body: string;
  icon: React.ReactNode;
}) {
  return (
    <div
      role="status"
      className="mx-auto mt-6 flex max-w-xl flex-col items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.06] px-6 py-8 text-center"
    >
      <span
        aria-hidden="true"
        className="grid h-11 w-11 place-items-center rounded-full bg-(--blue) text-white"
      >
        {icon}
      </span>
      <p className="font-display m-0 text-[20px] font-semibold -tracking-[0.015em] text-white">
        {title}
      </p>
      <p className="m-0 text-[14.5px] leading-[1.55] text-white/70">{body}</p>
    </div>
  );
}
