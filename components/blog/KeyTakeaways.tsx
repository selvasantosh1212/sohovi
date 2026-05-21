interface Props {
  items: string[];
}

export function KeyTakeaways({ items }: Props) {
  if (items.length < 3) return null;

  return (
    <section className="tldr" aria-label="Key takeaways">
      <div className="tldr__head">
        <div className="tldr__icon" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <span className="tldr__label">Key Takeaways</span>
      </div>
      <ul className="tldr__list">
        {items.map((item, i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
        ))}
      </ul>
    </section>
  );
}
