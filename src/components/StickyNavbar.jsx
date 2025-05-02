/**
 * Navbar.jsx
 * Loaf Life – fixed top navigation bar with Browse, Save, Live Well links.
 *
 * AI Acknowledgment:
 * This component was generated with assistance from OpenAI’s ChatGPT.
 */

export default function Navbar() {
  return (
    <nav className="bg-[#F5E3C6] fixed w-full z-20 top-0 left-0 border-b border-[#D1905A]">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between p-4">
        {/* Logo + Title */}
        <Link href="/" className="flex items-center space-x-3">
          <img
            src="/images/logo.png"
            alt="Loaf Life Logo"
            className="h-8 w-8"
          />
          <span className="text-2xl font-semibold text-[#8B4C24]">
            LOAF LIFE
          </span>
        </Link>

        {/* Nav Links */}
        <div className="flex space-x-8">
          <Link
            href="/browse"
            className="flex flex-col items-center text-sm text-[#8B4C24] hover:text-[#639751]"
          >
            <img
              src="/images/browse.png"
              alt="Browse"
              className="h-6 w-6 mb-1"
            />
            <span>Browse</span>
          </Link>

          <Link
            href="/save"
            className="flex flex-col items-center text-sm text-[#8B4C24] hover:text-[#639751]"
          >
            <img
              src="/images/save.png"
              alt="Save"
              className="h-6 w-6 mb-1"
            />
            <span>Save</span>
          </Link>

          <Link
            href="/live-well"
            className="flex flex-col items-center text-sm text-[#8B4C24] hover:text-[#639751]"
          >
            <img
              src="/images/live.png"
              alt="Live Well"
              className="h-6 w-6 mb-1"
            />
            <span>Live Well</span>
          </Link>
        </div>
      </div>
    </nav>
  )
}
