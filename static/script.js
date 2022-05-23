const form = document.querySelector("form.upload-form"),
fileInput = document.querySelector(".file-input"),
progressArea = document.querySelector(".progress-area"),
uploadedArea = document.querySelector(".uploaded-area");
const dragArea = document.querySelector(".drag-area"),
dragText = dragArea.querySelector("p");
const toast = document.querySelector(".toast");
const sharingContainer = document.querySelector(".sharing-container");
const copyURLBtn = document.querySelector("#copyURLBtn");
const fileURL = document.querySelector("#fileURL");
const mailForm = document.querySelector("#emailForm"),
mailUrl = document.querySelector(".fileId"),
sendMailBtn = document.querySelector("#sendMailBtn");



const maxfileSize = 10485760;

const nameSplit = file =>{
  if(file){
    let fileName = file.name;
    if(fileName.length >= 12){
      let splitName = fileName.split('.');
      fileName = splitName[0].substring(0, 13) + "... ." + splitName[1];
    }
    if(file.size >=10485760 ){
      showToast("Max file size is 10MB");
    }else if(file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/gif" || file.type === "image/jpg" || file.type === "image/webp"){
      uploadFile(fileName);
    } else {
      showToast("Only Images Allow (jpeg, png, gif, jpg, webp)");
      
    }
  }
}

dragArea.addEventListener("click", () =>{
  fileInput.click();
  sharingContainer.style.display = "none";
});

dragArea.addEventListener("dragover", (event)=>{
  event.preventDefault(); //preventing from default behaviour
  form.classList.add("active");
  dragText.textContent = "Release to Upload File";
});

dragArea.addEventListener("dragleave", ()=>{
  form.classList.remove("active");
  dragText.textContent = "Drag and Drop File";
});

dragArea.addEventListener("drop", (event)=>{
  event.preventDefault();
  sharingContainer.style.display = "none";
  form.classList.remove("active");
  dragText.textContent = "Drag and Drop File";
  let dropfile = event.dataTransfer.files[0];
  const data = new DataTransfer();
  data.items.add(dropfile);
  fileInput.files = data.files;
  nameSplit(fileInput.files[0]);
});

fileInput.onchange = ({target})=>{
  let file = target.files[0];
  nameSplit(file);
}

sendMailBtn.addEventListener("click", sendFile);

function uploadFile(name){
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/api/upload");
  xhr.upload.addEventListener("progress", ({loaded, total}) =>{
    let fileLoaded = Math.floor((loaded / total) * 100);
    let fileTotal = Math.floor(total / 1000);
    let fileSize;
    (fileTotal < 1024) ? fileSize = fileTotal + " KB" : fileSize = (loaded / (1024*1024)).toFixed(2) + " MB";
    let progressHTML = `<li class="row">
                          <i class="fas fa-file-alt"></i>
                          <div class="content">
                            <div class="details">
                              <span class="name">${name} • Uploading</span>
                              <span class="percent">${fileLoaded}%</span>
                            </div>
                            <div class="progress-bar">
                              <div class="progress" style="width: ${fileLoaded}%"></div>
                            </div>
                          </div>
                        </li>`;
    uploadedArea.classList.add("onprogress");
    progressArea.innerHTML = progressHTML;
  });
  let data = new FormData(form);
  xhr.onerror = () =>{
    showToast("Error in uploading file");
  }
  xhr.onload = () =>{
    let response = JSON.parse(xhr.responseText);
    uploadSuccess(response);
  }
  xhr.send(data);

}

uploadSuccess = (response) => {
  fileInput.value = "";
  const filePath = response.url;
  sharingContainer.style.display = "block";
  progressArea.innerHTML = "";
  fileURL.value = filePath;
  mailUrl.value = filePath.split("/").pop();
}

function sendFile(event){
  event.preventDefault();
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/files/send");
  xhr.onload = () =>{
    let response = JSON.parse(xhr.responseText);
    showToast(response.message);
    sharingContainer.style.display = "none";
  }
  xhr.onerror = () =>{
    showToast("Error in sending file");
  }
  let data = new FormData(mailForm);
  xhr.send(data);
}


copyURLBtn.addEventListener("click", () => {
  fileURL.select();
  document.execCommand("copy");
  showToast("Copied to clipboard");
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