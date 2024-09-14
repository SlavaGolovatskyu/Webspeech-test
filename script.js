const synth = window.speechSynthesis;
const user = detect.parse(navigator.userAgent);

const test = {"source":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Edg/128.0.0.0","browser":{"family":"Chrome","major":128,"minor":0,"patch":0,"name":"Chrome 128","version":"128"},"os":{"family":"Windows 10","major":null,"minor":null,"patch":null,"name":"Windows 10","version":""},"device":{"family":"Other","type":"Desktop","manufacturer":null}}

const browser = user.browser.family?.toLowerCase();

const IS_EDGE = browser?.includes('chrome') && user.source?.toLowerCase()?.includes('edg');
const IS_CHROME = browser?.includes('chrome') && !IS_EDGE;
const IS_SAFARI = browser?.includes('safari');

const inputForm = document.querySelector("form");
const inputTxt = document.querySelector(".txt");
const voiceSelect = document.querySelector("select");
const divTest = document.querySelector('#test1')

const pitch = document.querySelector("#pitch");
const pitchValue = document.querySelector(".pitch-value");
const rate = document.querySelector("#rate");
const rateValue = document.querySelector(".rate-value");

let voices = [];

let theBestVoices = [];
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
if (IS_EDGE) {
  theBestVoices = MICROSOFT_EDGE_VOICES;
} else if (IS_CHROME) {
  theBestVoices = GOOGLE_CHROME_VOICES;
} else if (IS_SAFARI) {
  theBestVoices = SAFARI_VOICES;
}

function populateVoiceList() {
  console.log(synth.getVoices())
  voices = synth.getVoices()
    .filter((voice) => theBestVoices.map((voice) => voice.name).includes(voice?.name?.toLowerCase()))
    .sort(function (a, b) {
      const aname = a.name.toUpperCase();
      const bname = b.name.toUpperCase();

      if (aname < bname) {
        return -1;
      } else if (aname == bname) {
        return 0;
      } else {
        return +1;
      }
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
  console.log('test1')
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