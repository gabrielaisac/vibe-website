/**
 * 🦶 FOOTER STARTER - Footer minimal pentru cursanți
 *
 * Footer simplu cu copyright.
 * Fără rețele sociale, fără linkuri complexe.
 */

export default function FooterStarter() {
  return (
    <footer id="footer" className="bg-gray-900 text-white py-8">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <p className="text-gray-400">
          © 2026 Vibe Caffè. Construit cu Next.js + Tailwind CSS.
        </p>
        <p className="text-gray-600 text-sm mt-2">
          Landing page creat de{' '}
          <span className="text-gray-400 font-medium">Gabriela Isac</span>
          {' '}·{' '}
          <span className="text-gray-500">Vibe Coder</span>
          {' '}·{' '}
          <a
            href="mailto:isac.gabriela@gmail.com"
            className="text-amber-600 hover:text-amber-400 transition-colors duration-200"
          >
            isac.gabriela@gmail.com
          </a>
        </p>
      </div>
    </footer>
  );
}
