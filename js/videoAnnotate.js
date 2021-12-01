const fileinput = document.getElementById("fileinput");
const output = document.getElementById("output");
const video = document.getElementById("video");

const annotateFunctions = (frameRate, duration, frameCount) => {
  //   console.log(frameCount);
  localStorage["frameRate"] = frameRate;
  localStorage["duration"] = duration;
  localStorage["frameCount"] = frameCount;
};

function getCurrentFrameNumber() {
  if (localStorage["frameCount"] != "0") {
    let fps = Number.parseInt(localStorage["frameRate"]);
    let currentTime = Number.parseFloat(video.currentTime);
    console.log(Math.floor(fps * currentTime));
  } else {
    //no file or not video
  }
}

const onChangeFile = (mediainfo) => {
  const file = fileinput.files[0];
  if (file) {
    output.value = "Working…";

    const getSize = () => file.size;

    const readChunk = (chunkSize, offset) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target.error) {
            reject(event.target.error);
          }
          resolve(new Uint8Array(event.target.result));
        };
        reader.readAsArrayBuffer(file.slice(offset, offset + chunkSize));
      });

    mediainfo
      .analyzeData(getSize, readChunk)
      .then((result) => {
        // output.value = result;

        annotateFunctions(
          result.media.track[1].FrameRate,
          result.media.track[1].Duration,
          result.media.track[1].FrameCount
        );
      })
      .catch((error) => {
        output.value = `An error occured:\n${error.stack}`;
      });
  }
};

MediaInfo({ format: "object" }, (mediainfo) => {
  fileinput.addEventListener("change", () => onChangeFile(mediainfo));
});
