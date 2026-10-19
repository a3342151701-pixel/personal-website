import { siteConfig } from "@/lib/site";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { CopyEmailButton } from "@/components/ui/CopyEmailButton";

/** 联系区：首页先提供邮箱与社交链接，表单等联系页做好后再引到这里。 */
export function ContactSection() {
  const profiles = siteConfig.socials.filter(
    (social) => social.icon !== "mail",
  );

  return (
    <section id="contact" className="scroll-mt-24 px-6 py-16 sm:py-20">
      <div className="mx-auto w-full max-w-[1200px]">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          联系
        </h2>
        <p className="text-muted mt-2 max-w-xl text-sm leading-relaxed">
          想聊聊项目、请教问题，或者只是打个招呼，都欢迎发邮件给我。
        </p>

        <div className="rounded-card border-border bg-surface mt-8 flex flex-wrap items-center gap-3 border p-5 sm:justify-between">
          <a
            className="hover:text-accent ease-smooth font-mono text-sm break-all transition-colors duration-200 sm:text-base"
            href={`mailto:${siteConfig.email}`}
          >
            {siteConfig.email}
          </a>
          <CopyEmailButton email={siteConfig.email} />
        </div>

        {profiles.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-3">
            {profiles.map((profile) => (
              <li key={profile.label}>
                <ButtonLink
                  href={profile.href}
                  target="_blank"
                  rel="noreferrer"
                  variant="secondary"
                >
                  {profile.label}
                  <span aria-hidden>↗</span>
                  <span className="sr-only">（在新标签页打开）</span>
                </ButtonLink>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
