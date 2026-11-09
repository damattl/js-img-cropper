export function download(url: string) {
  const a = document.createElement('a')
  a.href = url
  a.classList.add("hidden")
  a.download = url
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
