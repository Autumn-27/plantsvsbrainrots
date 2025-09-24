export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 mt-16 bg-[#141824]/60 backdrop-blur">
      <div className="max-w-6xl mx-auto px-5 py-8 text-sm text-white/70">
        <p>
          Wiki and tools for Plants vs Brainrots. Data is rewritten for clarity and may change with game updates.
        </p>
        <p className="mt-2">© {new Date().getFullYear()} plants-vs-brainrots.com</p>
      </div>
    </footer>
  );
}


