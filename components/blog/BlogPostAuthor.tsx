import Link from "next/link";

interface Props {
  name: string | null;
  role: string | null;
  bio: string | null;
}

export function BlogPostAuthor({ name, role, bio }: Props) {
  const displayName = name ?? "Selva Santosh";
  const displayRole = role ?? "Data quality, for people who ship";
  const displayBio =
    bio ??
    "Selva writes practical guides on data quality, profiling, and governance to help teams ship better data.";
  const initial = displayName.charAt(0).toUpperCase();
  const isDefaultAuthor = displayName === "Selva Santosh";

  return (
    <div className="author-block article-wrap" style={{ maxWidth: 820 }}>
      <div className="author-block__avatar" aria-hidden="true">
        {initial}
      </div>
      <div>
        <p className="author-block__name">
          {isDefaultAuthor ? (
            <Link href="/blog/author/selva-santosh">{displayName}</Link>
          ) : (
            displayName
          )}
        </p>
        <p className="author-block__role">{displayRole}</p>
        <p className="author-block__bio">{displayBio}</p>
      </div>
    </div>
  );
}
