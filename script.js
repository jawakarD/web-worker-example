document.addEventListener('DOMContentLoaded', () => {
  const worker = new Worker('filter_worker.js');

  const inputImage = document.getElementById('image-to-filter');
  const outputC = document.getElementById('output');
  const filter = document.querySelector('#filter');
  const oCtx = outputC.getContext('2d');
  const img = new Image();
  let imageData;

  const sendDataToWorker = () =>
    worker.postMessage({imageData, filter: filter.value});

  const receiveFromWorker = e => oCtx.putImageData(e.data, 0, 0);

  worker.onmessage = receiveFromWorker;

  const drawImg = () => {
    outputC.height = img.height;
    outputC.width = img.width;

    console.log(img.height);
    oCtx.drawImage(img, 0, 0);
    imageData = oCtx.getImageData(0, 0, img.height, img.width);
    sendDataToWorker();
  };

  inputImage.addEventListener('change', e => {
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.onload = e => {
      img.src = e.target.result;
      img.style.display = 'none';
      img.onload = () => {
        document.body.appendChild(img);
        drawImg();
      };
    };

    reader.readAsDataURL(file);
  });

  filter.addEventListener('change', e => sendDataToWorker());
});
