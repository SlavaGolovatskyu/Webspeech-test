const synth = window.speechSynthesis;
const user = detect.parse(navigator.userAgent);

const browser = user.browser.family?.toLowerCase();

const IS_EDGE = browser?.includes('chrome') && user.source?.toLowerCase()?.includes('edg');
const IS_CHROME = browser?.includes('chrome') && !IS_EDGE;
const IS_SAFARI = browser?.includes('safari');

const inputForm = document.querySelector("form");
const inputTxt = document.querySelector(".txt");
const voiceSelect = document.querySelector("select");
const divTest = document.querySelector('#test1');

const pitch = document.querySelector("#pitch");
const pitchValue = document.querySelector(".pitch-value");
const rate = document.querySelector("#rate");
const rateValue = document.querySelector(".rate-value");

let voices = [];

let theBestVoices = [];
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
if (IS_EDGE) {
  theBestVoices = MICROSOFT_EDGE_VOICES;
}

if (IS_CHROME) {
  theBestVoices = GOOGLE_CHROME_VOICES;
}

if (IS_SAFARI) {
  theBestVoices = SAFARI_VOICES;
}
   
function populateVoiceList() {
  voices = synth.getVoices()
    .filter((voice) => {
      // A stop sign from being shot if user uses a different browser from what is being supported right now
      if (theBestVoices.length === 0) return true;

      const name = voice.name?.toLowerCase();
      const uri = voice.voiceURI?.toLowerCase();

      return theBestVoices.find((v) => {
        if (v?.voiceURI && uri === v.voiceURI?.toLowerCase()) return true;
        if (name && name === v.name?.toLowerCase()) return true;

        return false;
      });
    });

  const selectedIndex =
    voiceSelect.selectedIndex < 0 ? 0 : voiceSelect.selectedIndex;
  voiceSelect.innerHTML = "";

  for (let i = 0; i < voices.length; i++) {
    const option = document.createElement("option");
    option.textContent = `${voices[i].name} (${voices[i].lang})`;

    if (voices[i].default) {
      option.textContent += " -- DEFAULT";
    }

    option.setAttribute("data-lang", voices[i].lang);
    option.setAttribute("data-name", voices[i].name);
    voiceSelect.appendChild(option);
  }
  voiceSelect.selectedIndex = selectedIndex;
}

populateVoiceList();

if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

function speak() {
  if (synth.speaking) {
    console.error("speechSynthesis.speaking");
    return;
  }

  divTest.textContent = JSON.stringify(user);

  if (inputTxt.value !== "") {
    const utterThis = new SpeechSynthesisUtterance(inputTxt.value);
    console.log(utterThis, voices, 'voices');

    utterThis.onend = function (event) {
      console.log("SpeechSynthesisUtterance.onend");
    };

    utterThis.onerror = function (event) {
      console.error("SpeechSynthesisUtterance.onerror");
    };

    const selectedOption =
      voiceSelect.selectedOptions[0].getAttribute("data-name");

    for (let i = 0; i < voices.length; i++) {
      if (voices[i].name === selectedOption) {
        utterThis.voice = voices[i];
        break;
      }
    }
    utterThis.pitch = pitch.value;
    utterThis.rate = rate.value;
    synth.speak(utterThis);
  }
}

function stopSpeaking() {
  synth.cancel();
}

function playSpeaking() {
  speak();

  inputTxt.blur();
};

pitch.onchange = function () {
  pitchValue.textContent = pitch.value;
};

rate.onchange = function () {
  rateValue.textContent = rate.value;
};

voiceSelect.onchange = function () {
  speak();
};