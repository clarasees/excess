
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
    return;
  }

// remove.bg

  const formData = new FormData();
  formData.append('image_file', file);
  formData.append('size', 'auto');

  fetch('https://api.remove.bg/v1.0/removebg', {
    method: 'POST',
    headers: {
      'X-Api-Key': 'b2rrpYqtm1c79UPFfusgev82'
    },
    body: formData
  })
  .then(response => response.blob())
  .then(blob => {
    const img = document.createElement('img');
    img.src = URL.createObjectURL(blob);
    img.onload = () => {
      convertToVector(img);
    };
    dropArea.innerHTML = '';
    dropArea.appendChild(img);
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Failed to remove background.');
  });
}



//edge detector, turn to SVG

//Douglas Peucker algorithm, or turn into lowpoly vector

function convertToVector(image) {
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);
  console.log("working")
    const imgData = canvas.toDataURL('image/png');

    const options = {
      colorsampling: 0,
      numberofcolors: 2,
      pathomit: 8,
      ltres: 1,
      qtres: 1,
      roundcoords: 1,
      lcpr: 0,
      qcpr: 0,
    };

    ImageTracer.imageToSVG(imgData, function(svgString) {
      dropArea.innerHTML = '';
      dropArea.innerHTML = svgString;
    }, options);
  }
