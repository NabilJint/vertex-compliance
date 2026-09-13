function MicrosoftLogo() {
  return (
    <div className="grid h-5 w-5 grid-cols-2 gap-[2px]">
      <div className="bg-[#F25022]" />
      <div className="bg-[#7FBA00]" />
      <div className="bg-[#00A4EF]" />
      <div className="bg-[#FFB900]" />
    </div>
  )
}

function GoogleLogo() {
  return (
    <span className="text-[20px] font-medium">
      <span style={{ color: "#4285F4" }}>G</span>
      <span style={{ color: "#EA4335" }}>o</span>
      <span style={{ color: "#FBBC05" }}>o</span>
      <span style={{ color: "#4285F4" }}>g</span>
      <span style={{ color: "#34A853" }}>l</span>
      <span style={{ color: "#EA4335" }}>e</span>
    </span>
  )
}

function AmazonLogo() {
  return (
    <span className="text-[22px] font-bold tracking-tighter" style={{ color: "#232F3E" }}>
      amazon
    </span>
  )
}

function MetaLogo() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="#0668E1">
      <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z" />
    </svg>
  )
}

function JPMorganLogo() {
  return (
    <span className="text-[16px] font-semibold" style={{ color: "#003D6B" }}>
      J.P.Morgan
    </span>
  )
}

function SpotifyLogo() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="#1DB954">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  )
}

export function TrustStrip() {
  return (
    <section className="border-y bg-white py-10" style={{ borderColor: "#E5E7EB" }}>
      <div className="mx-auto max-w-7xl px-6">
        <p className="mb-8 text-center text-[12px] font-semibold uppercase tracking-widest" style={{ color: "#94A3B8" }}>
          Trusted by compliance teams at
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-14 gap-y-6">
          <div className="flex items-center gap-2"><MicrosoftLogo /> <span className="text-[18px] font-semibold" style={{ color: "#737373" }}>Microsoft</span></div>
          <div className="flex items-center"><GoogleLogo /></div>
          <div className="flex items-center"><AmazonLogo /></div>
          <div className="flex items-center gap-1.5"><MetaLogo /> <span className="text-[18px] font-semibold" style={{ color: "#737373" }}>Meta</span></div>
          <div className="flex items-center"><JPMorganLogo /></div>
          <div className="flex items-center gap-1.5"><SpotifyLogo /> <span className="text-[18px] font-bold" style={{ color: "#737373" }}>Spotify</span></div>
        </div>
      </div>
    </section>
  )
}
