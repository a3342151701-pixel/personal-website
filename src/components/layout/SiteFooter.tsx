import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-border mt-auto border-t px-6 py-8">
      <div className="text-muted mx-auto flex w-full max-w-[1200px] flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {siteConfig.name}
        </p>
        <ul className="flex flex-wrap gap-4">
          {siteConfig.socials.map((social) => (
            <li key={social.label}>
              <a
                className="hover:text-fg ease-smooth transition-colors duration-200"
                href={social.href}
                {...(social.href.startsWith("http")
                  ? { target: "_blank", rel: "noreferrer" }
                  : {})}
              >
                {social.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
