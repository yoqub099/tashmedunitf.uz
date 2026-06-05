import Link from "next/link";

export default function AntiCard({ title, href }: { title: string; href: string }) {
  return (
    <Link href={href}>
      <div className="anti-hover-card rounded-2xl p-4 md:p-6 lg:rounded-3xl flex h-48 flex-col justify-between">
        <h6 className="font-serif text-base font-semibold leading-tight lg:text-lg">
          {title}
        </h6>
        <div className="flex">
          <button
            className="ac-btn flex size-10 items-center justify-center rounded-full border bg-white text-sm ml-auto"
            type="button"
          >
            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="24" width="24" xmlns="http://www.w3.org/2000/svg">
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </button>
        </div>
      </div>
    </Link>
  );
}
