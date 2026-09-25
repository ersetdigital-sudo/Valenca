export default function RichText({
  text,
  strongClassName = "text-navy",
}: {
  text: string;
  strongClassName?: string;
}) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className={strongClassName}>
            {part}
          </strong>
        ) : (
          part
        )
      )}
    </>
  );
}
