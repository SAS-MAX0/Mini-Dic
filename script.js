const searchInput = document.getElementById("input");
const infoText = document.getElementById("infor");
const wordName = document.getElementById("word-name");
const wordPhonetic = document.getElementById("word-phonetic");
const phoneticsList = document.getElementById("phonetics-list");
const wordOrigin = document.getElementById("word-origin");
const meaningsContainer = document.getElementById("meanings-container");
const synonymsList = document.getElementById("synonyms-list");
const antonymsList = document.getElementById("antonyms-list");
const audioPlayer = document.getElementById("audio-player");

let audio = null;

function clearSearch() {
  searchInput.value = "";
  infoText.innerText = "Search for a word to know its meaning";
  clearResults();
}

function clearResults() {
  wordName.innerText = "";
  wordPhonetic.innerText = "";
  phoneticsList.innerHTML = "";
  wordOrigin.innerText = "";
  meaningsContainer.innerHTML = "";
  synonymsList.innerHTML = "";
  antonymsList.innerHTML = "";
  audio = null;
}

function displayData(data) {
  if (!data || data.title) {
    infoText.innerHTML = `Oops! We couldn't find "<strong>${searchInput.value}</strong>".`;
    return;
  }

  infoText.innerText = "";
  const entry = data[0];

  wordName.innerText = entry.word || "N/A";
  wordPhonetic.innerText = entry.phonetics[0]?.text || "N/A";

  phoneticsList.innerHTML = "";
  entry.phonetics.forEach((phonetic) => {
    const li = document.createElement("li");
    li.innerText = phonetic.text || "N/A";
    phoneticsList.appendChild(li);

    if (phonetic.audio) {
      audio = new Audio(phonetic.audio);
    }
  });

  wordOrigin.innerText = entry.origin || "Not available";

  meaningsContainer.innerHTML = "";
  entry.meanings.forEach((meaning) => {
    const section = document.createElement("div");
    const partOfSpeech = document.createElement("h4");
    const definitionsList = document.createElement("ul");

    partOfSpeech.innerText = meaning.partOfSpeech || "Unknown";
    meaning.definitions.forEach((definition) => {
      const li = document.createElement("li");
      li.innerText = definition.definition || "No definition available";
      definitionsList.appendChild(li);
    });

    section.appendChild(partOfSpeech);
    section.appendChild(definitionsList);
    meaningsContainer.appendChild(section);
  });

  synonymsList.innerHTML = "";
  antonymsList.innerHTML = "";
  if (entry.meanings.length > 0) {
    const synonyms = entry.meanings[0].synonyms || [];
    const antonyms = entry.meanings[0].antonyms || [];
    synonyms.forEach((syn) => {
      const li = document.createElement("li");
      li.innerText = syn;
      synonymsList.appendChild(li);
    });
    antonyms.forEach((ant) => {
      const li = document.createElement("li");
      li.innerText = ant;
      antonymsList.appendChild(li);
    });
  }
}

function fetchWordData(word) {
  const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
  clearResults();
  infoText.innerText = `Searching for "${word}"...`;

  fetch(url)
    .then((response) => response.json())
    .then(displayData)
    .catch(() => {
      infoText.innerText = `An error occurred while searching for "${word}".`;
    });
}

function searchWord() {
  const word = searchInput.value.trim();
  if (word) {
    fetchWordData(word);
  }
}

searchInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter" && searchInput.value.trim()) {
    searchWord();
  }
});
