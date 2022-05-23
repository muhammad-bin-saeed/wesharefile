const downloadButton = document.querySelector("p.download-button");
const toast = document.querySelector(".toast");

downloadButton.addEventListener("click", ()=>{
  showToast("Downloading...");
  setTimeout(()=>{
    showToast("Downloaded");
  }
  , 2000); 
});

let toastTimer;

const showToast = (msg) => {
  clearTimeout(toastTimer);
  toast.innerText = msg;
  toast.classList.add("show");
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
};