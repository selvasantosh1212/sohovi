interface Props {
  faqs: { q: string; a: string }[];
}

export function BlogFAQ({ faqs }: Props) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="faq-section article-wrap" aria-label="Frequently asked questions">
      <h2 className="faq-section__title">Frequently Asked Questions</h2>
      <div className="faq__list">
        {faqs.map((faq, i) => (
          <details key={i} className="faq__item" open={i === 0}>
            <summary>{faq.q}</summary>
            <div className="faq__body">
              <p>{faq.a}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
