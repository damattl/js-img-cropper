import './style.css'
import './crop.ts'
import { initCroppingTool } from './crop.ts';
import { download } from './utils.ts';

document.addEventListener("gesturestart", function (e) {
	e.preventDefault();
    document.body.style.zoom = "0.99";
});

document.addEventListener("gesturechange", function (e) {
	e.preventDefault();

  document.body.style.zoom = "0.99";
});
document.addEventListener("gestureend", function (e) {
	  e.preventDefault();
    document.body.style.zoom = "1";
});

window.addEventListener('touchstart', function(e) {
  if (e.targetTouches.length === 2) {
    e.preventDefault();
  }
}, false);



// TODO: Update example to look better

initCroppingTool((blob, clear) => {
    const url = window.URL.createObjectURL(blob)
    download(url)
    clear()
}, (start, done) => {
    const upload = document.getElementById("upload") as HTMLInputElement;
    if (start) {
        upload.labels[0].innerText = "Loading..."
    }
    if (done) {
        upload.labels[0].innerText = "Bild hochladen"
    }
})
