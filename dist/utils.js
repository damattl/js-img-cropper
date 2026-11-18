// lib/utils.ts
function e(e) {
	let t = document.createElement("a");
	t.href = e, t.classList.add("hidden"), t.download = e, document.body.appendChild(t), t.click(), document.body.removeChild(t);
}
export { e as download };
