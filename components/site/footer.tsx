import { Logo } from "./logo";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border/60 bg-secondary/40">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              The modern intake layer for accident claims. Built in Austin for
              people on the worst day of their life.
            </p>
          </div>

          <div className="md:col-span-2">
            <FooterHeading>Product</FooterHeading>
            <FooterLinks
              items={[
                ["How it works", "#how-it-works"],
                ["Benefits", "#benefits"],
                ["Demo", "#demo"],
                ["FAQ", "#faq"],
              ]}
            />
          </div>
          <div className="md:col-span-2">
            <FooterHeading>For attorneys</FooterHeading>
            <FooterLinks
              items={[
                ["Overview", "#attorneys"],
                ["Integrations", "#attorneys"],
                ["Pricing", "#faq"],
                ["Partnerships", "#contact"],
              ]}
            />
          </div>
          <div className="md:col-span-2">
            <FooterHeading>Company</FooterHeading>
            <FooterLinks
              items={[
                ["About", "#about"],
                ["Careers", "#contact"],
                ["Press", "#contact"],
                ["Contact", "#contact"],
              ]}
            />
          </div>
          <div className="md:col-span-2">
            <FooterHeading>Legal</FooterHeading>
            <FooterLinks
              items={[
                ["Terms", "#"],
                ["Privacy", "#"],
                ["Disclosures", "#"],
                ["Security", "#"],
              ]}
            />
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <div>
            © {year} AccidentMaxxing, Inc. · All rights reserved.
          </div>
          <div className="max-w-xl text-[11px] leading-relaxed">
            AccidentMaxxing is not a law firm and does not provide legal
            advice. We connect accident victims with independent attorneys
            licensed in their jurisdiction. No attorney-client relationship is
            formed by use of this site.
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-foreground/80">
      {children}
    </div>
  );
}

function FooterLinks({ items }: { items: Array<[string, string]> }) {
  return (
    <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
      {items.map(([label, href]) => (
        <li key={label}>
          <a
            href={href}
            className="transition-colors hover:text-foreground"
          >
            {label}
          </a>
        </li>
      ))}
    </ul>
  );
}
