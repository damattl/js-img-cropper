import './style.css'
import { ImageCropper} from 'js-img-cropper';
import { download } from 'js-img-cropper/utils';

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

const canvas = document.getElementById("crop-canvas") as HTMLCanvasElement;
const cropper = new ImageCropper(canvas)



const saveButton = document.getElementById("save") as HTMLButtonElement
saveButton.addEventListener("click", async () => {
    const blob = await cropper.save()
    const url = window.URL.createObjectURL(blob)
    download(url)
})

const uploadForm = document.querySelector(`input#upload`) as HTMLInputElement

uploadForm.addEventListener("change", async () => {
    if (uploadForm.files.length === 1) {
        console.log("File selected: ", uploadForm.files[0]);
        const file = uploadForm.files[0]

        uploadForm.labels[0].innerText = "Loading..."
        await cropper.load(file)
        uploadForm.labels[0].innerText = "Bild hochladen"
    }
})
