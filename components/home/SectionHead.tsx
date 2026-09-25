export default function SectionHead({
  title,
  desc,
  center = false,
}: {
  title: string;
  desc: string;
  center?: boolean;
}) {
  return (
    <div className={`mb-11 ${center ? "text-center" : ""}`}>
      <h2 className="font-display text-[clamp(28px,4.5vw,42px)] leading-[1.15]">
        {title}
      </h2>
      <p
        className={`mt-[10px] max-w-[54ch] text-base text-muted ${center ? "mx-auto" : ""}`}
      >
        {desc}
      </p>
    </div>
  );
}
