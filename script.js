
(function () {

    'use strict';

    const pixel = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';

    const voiceName = 'Samantha';

    const synth = window.speechSynthesis;

    const imageSize = 600;

    const sourceUrl = 'https://source.unsplash.com';

    const words = [
        'red',
        'yellow',
        'blue',
        'green',
        'car',
        'bicycle',
        'computer',
        'flower',
        'truck',
        // 'phone',
        // 'house',
        'dog',
        'cat',
        'purple',
        // 'black',
        'white',
        'coffee',
        'sun',
        'tree',
        'water',
        'game',
        'bottle',
        'music',
        'lake',
        'beach',
        'forest',
        'mountain',
        'fish',
        'road',
        'boy',
        'girl',
        'man',
        'woman',
        'fruit',
        'meat',
        'vegetable',
        'cake',
        'pie',
        'airplane',
        'monkey',
        'door',
        'city',
        'moon',
        'stars',
        'sky',
        'baby',
        'grass',
        'hand',
        'bird',
        'horse',
        'boat',
        'bridge',
    ];

    let currentWord = undefined;

    let voice = undefined;

    let pickedWords = [];

    function getImageUrl(word) {
        return `${sourceUrl}/${imageSize}x${imageSize}?${word}`;
    }

    function sayWord(word) {
        const utter = new SpeechSynthesisUtterance(word);
        utter.voice = voice;
        utter.pitch = 0.9;
        utter.rate = 0.7;
        synth.speak(utter);
    }

    function sayCurrentWord() {
        sayWord(currentWord);
    }

    function getRandomWord() {
        const length = words.length;
        return words[Math.floor(Math.random() * length)];
    }

    function nextWord() {
        let newWord;
        if (pickedWords.length === words.length) {
            sayWord('Yay! You finished the game! See you next time!');
            return;
        }
        while (pickedWords.indexOf(newWord = getRandomWord()) !== -1);
        currentWord = newWord;
        pickedWords.push(currentWord);
        loadImages().then(sayCurrentWord).catch((e) => {
            console.error(e);
        });
    }

    function loadImages() {
        let imageWords = [ currentWord ];
        while (imageWords.length < 3) {
            let randomWord;
            while (imageWords.indexOf(randomWord = getRandomWord()) !== -1);
            imageWords.push(randomWord);
        }
        shuffle(imageWords);
        return new Promise((resolve, reject) => {
            let loaded = 0;
            for (let i = imageWords.length - 1; i >= 0; i--) {
                const word = imageWords[i];
                const image = document.getElementById(`image_${i}`);
                image.src = pixel;
                window.setTimeout(() => {
                    image.addEventListener('load', () => {
                        if (++loaded === imageWords.length) {
                            return resolve();
                        }
                    }, false);
                    image.src = getImageUrl(word);
                    image.dataset.word = word;
                }, 100);
            }
        });
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }

    function checkWord(event) {
        const correct = event.target.dataset.word === currentWord;
        const result = document.getElementById('result');
        if (correct) {
            result.innerHTML = 'Good job!';
            window.setTimeout(() => {
                result.innerHTML = '';
                nextWord();
            }, 5000);
        } else {
            result.innerHTML = 'Oops! Try again.';
        }
    }

    function init() {
        const voices = synth.getVoices();
        if (!voices || voices.length === 0) {
            throw new Error('No voice is available.');
        }
        for (let i in voices) {
            if (voices[i].name === voiceName) {
                voice = voices[i];
                break;
            }
        }
        if (!voice) {
            voice = voices[0];
        }
        nextWord();
    }

    document.getElementById('repeat').addEventListener('click', sayCurrentWord, false);

    const images = document.getElementsByTagName('img');
    for (let i = images.length - 1; i >= 0; i--) {
        images[i].addEventListener('click', checkWord, false);
    }

    if (typeof synth !== 'undefined' && synth.onvoiceschanged !== undefined) {
        speechSynthesis.addEventListener('voiceschanged', init, false);
    }

})();
