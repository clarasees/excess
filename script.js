import { remove } from 'https://cdn.jsdelivr.net/npm/background-removal-js';
window.removeBackground = remove;

// drag and drop

const dropArea = document.getElementById('drop-area');

dropArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropArea.classList.add('hover');
});

dropArea.addEventListener('dragleave', () => {
  dropArea.classList.remove('hover');
});

dropArea.addEventListener('drop', (e) => {
  e.preventDefault();
  dropArea.classList.remove('hover');
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    handleFile(files[0]);
  }

});



dropArea.addEventListener('click', () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFile(file);
    }
  };
  input.click();
});

function handleFile(file) {
  if (!file.type.startsWith('image/')) {
    alert('Please upload an image file.');
    console.log("if is working!");
    return;
  }
  console.log("drop is working!");  

// remove.bg

const img = document.createElement('img');
img.src = URL.createObjectURL(file);

img.onload = async () => {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    // use background-removal-js 
    const processedCanvas = await removeBackground(img);

    dropArea.innerHTML = ''; // clear the drop area
    dropArea.appendChild(processedCanvas); // display processed image

  .catch(error => {
    console.error('Error:', error);
    alert('Failed to remove background.');
  });
}


   // Convert processed image to vector
   convertToVector(processedCanvas);
  };

  function convertToVector(canvas) {
    const imgData = canvas.toDataURL('image/png');

    const options = {
        colorsampling: 0,
        numberofcolors: 2,
        pathomit: 8,
        ltres: 1,
        qtres: 1,
        lcpr: 0,
        qcpr: 0,
    };

    ImageTracer.imageToSVG(imgData, function(svgString) {
        dropArea.innerHTML = ''; // Clear the drop area
        dropArea.innerHTML = svgString; // Display SVG
    }, options);
}