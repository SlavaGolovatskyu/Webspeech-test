const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
const divTest2 = document.querySelector('#test2');

let isMicrophoneEnabled = false;

function getLocalStream() {
  window.navigator.mediaDevices
    .getUserMedia({ video: false, audio: true })
    .then((stream) => {
      isMicrophoneEnabled = true;
    })
    .catch((err) => {
      console.error(`you got an error: ${err}`);
    });
}

recognition.continuous = true;
recognition.lang = 'en-US';
recognition.interimResults = true;
recognition.maxAlternatives = 10;

function startRecognition() {
  if (!isMicrophoneEnabled) {
    getLocalStream();
    return;
  }

  recognition.start();
}

function stopRecognition() {
  if (!isMicrophoneEnabled) return;

  recognition.stop();
}

recognition.onresult = function(event) {
  // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
  // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
  // It has a getter so it can be accessed like an array
  // The first [0] returns the SpeechRecognitionResult at the last position.
  // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
  // These also have getters so they can be accessed like arrays.
  // The second [0] returns the SpeechRecognitionAlternative at position 0.
  // We then return the transcript property of the SpeechRecognitionAlternative object
  const color = event.results[0][0].transcript;
  divTest2.textContent = 'Result received: ' + color + '.' + 'confidence';
  console.log(event.results);
}

recognition.onspeechend = function() {
  recognition.stop();
}

recognition.onnomatch = function(event) {
  divTest2.textContent = "I didn't recognise that color.";
}

recognition.onerror = function(event) {
  divTest2.textContent = 'Error occurred in recognition: ' + event.error;
}