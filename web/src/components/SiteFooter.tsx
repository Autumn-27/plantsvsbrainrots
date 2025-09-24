export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 mt-16 bg-[#141824]/60 backdrop-blur">
      <div className="max-w-6xl mx-auto px-5 py-10 text-sm text-white/80 grid gap-8 md:grid-cols-4">
        <div>
          <p className="font-semibold text-white">Plants vs Brainrots</p>
          <p className="mt-2 text-white/70">Unofficial wiki, tools, and calculators. Data is consolidated and lightly rewritten for clarity.</p>
        </div>
        <nav>
          <p className="font-semibold text-white">Site</p>
          <ul className="mt-2 space-y-2">
            <li><a className="hover:underline" href="/plants">Plants</a></li>
            <li><a className="hover:underline" href="/brainrots">Brainrots</a></li>
            <li><a className="hover:underline" href="/codes">Codes</a></li>
            <li><a className="hover:underline" href="/changelog">Changelog</a></li>
          </ul>
        </nav>
        <nav>
          <p className="font-semibold text-white">Tools</p>
          <ul className="mt-2 space-y-2">
            <li><a className="hover:underline" href="/income">Income Calculator</a></li>
            <li><a className="hover:underline" href="/roi">Time-to-Afford</a></li>
          </ul>
        </nav>
        <nav>
          <p className="font-semibold text-white">Company</p>
          <ul className="mt-2 space-y-2">
            <li><a className="hover:underline" href="/about">About</a></li>
            <li><a className="hover:underline" href="/terms">Terms of Service</a></li>
            <li><a className="hover:underline" href="/privacy">Privacy Policy</a></li>
          </ul>
        </nav>
      </div>
      <div className="max-w-6xl mx-auto px-5 pb-8 text-xs text-white/60">© {new Date().getFullYear()} plants-vs-brainrots.com</div>
    </footer>
  );
}


