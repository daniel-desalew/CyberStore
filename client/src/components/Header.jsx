import { Link } from "react-router-dom";

export default function Header() {
  return (
    <section className="bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-950 text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-5 py-5 sm:px-8 md:min-h-48 md:flex-row">
        <div className="shrink-0 text-center md:text-left">
          <p className="text-xs uppercase tracking-[0.2em] text-violet-300">
            Discover our collection
          </p>
          <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">
            Smartphones
          </h1>
          <Link
            to="/shop?category=smartphones"
            className="mt-3 inline-block text-sm text-violet-200 underline underline-offset-4 transition hover:text-white"
          >
            Shop smartphones
          </Link>
        </div>
        <img
          src="/smartphone-lineup.svg"
          alt="Ten smartphones, shown from the front and back"
          className="w-full max-w-[460px] md:w-[55%]"
        />
      </div>
    </section>
  );
}
