import { existsSync } from "node:fs";
import path from "node:path";
import Image from "next/image";
import { siteConfig } from "@/lib/site";
import { ButtonLink } from "@/components/ui/ButtonLink";

/**
 * 简历 PDF 还没提供时隐藏「下载简历」入口：
 * 资源放在 public/ 后重新构建即可自动出现，不需要改代码。
 */
const resumeAvailable =
  siteConfig.resume.length > 0 &&
  existsSync(
    path.join(process.cwd(), "public", siteConfig.resume.replace(/^\//, "")),
  );

export function Hero() {
  return (
    <section className="relative px-6 pt-20 pb-16 sm:pt-28 sm:pb-24">
      <div
        aria-hidden
        className="bg-accent/10 pointer-events-none absolute -top-40 left-1/2 -z-10 size-[36rem] max-w-[90vw] -translate-x-1/2 rounded-full blur-[120px]"
      />

      <div className="mx-auto flex w-full max-w-[1200px] flex-col-reverse items-start gap-10 sm:flex-row sm:items-center sm:justify-between sm:gap-16">
        <div className="max-w-2xl">
          <p className="text-accent text-sm font-medium tracking-[0.2em] uppercase">
            Hello
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            {siteConfig.name}
          </h1>
          <p className="text-muted mt-3 text-lg">{siteConfig.role}</p>
          <p className="text-muted mt-6 max-w-xl leading-relaxed">
            {siteConfig.bio}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="#projects">查看项目</ButtonLink>
            <ButtonLink href="#contact" variant="secondary">
              联系我
            </ButtonLink>
            {resumeAvailable ? (
              <ButtonLink href={siteConfig.resume} variant="ghost" download>
                下载简历
              </ButtonLink>
            ) : null}
          </div>
        </div>

        <Image
          src={siteConfig.avatar}
          alt={`${siteConfig.name}的头像`}
          width={420}
          height={420}
          priority
          unoptimized
          className="border-border size-28 rounded-full border object-cover sm:size-40"
        />
      </div>
    </section>
  );
}
