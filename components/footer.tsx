export default function Footer() {
  return (
    <footer className="border-t border-rule mt-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 flex flex-col sm:flex-row gap-4 sm:items-end sm:justify-between text-sm text-mute">
        <div className="flex flex-col gap-1 max-w-xl">
          <span>Bailarn, 2017–2018. Built by <a className="text-ink underline decoration-rule underline-offset-4 hover:decoration-red" href="https://www.ammarinjtk.com">Amarin Jettakul</a> at Chulalongkorn University.</span>
          <span>Supported by the Department of Computer Engineering, Chulalongkorn University, and NECTEC.</span>
        </div>
        <div className="flex gap-5 font-mono text-[13px]">
          <a className="hover:text-ink" href="https://github.com/ammarinjtk/Bailarn-python-library">Python library</a>
          <a className="hover:text-ink" href="https://github.com/ammarinjtk/Bailarn-website">Source</a>
        </div>
      </div>
    </footer>
  )
}
