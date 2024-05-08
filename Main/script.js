document.addEventListener('DOMContentLoaded', function() {
    const jokeText = document.getElementById('joke-text');
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');
    let currentJokeIndex = 0;
    let jokes = [];

    function fetchJokes() {
        fetch('https://v2.jokeapi.dev/joke/Any?type=single&amount=10')
            .then(response => response.json())
            .then(data => {
                jokes = data.jokes;
                displayJoke();
            })
            .catch(error => console.error('Error fetching jokes:', error));
    }

    function displayJoke() {
        if (jokes.length > 0 && jokes[currentJokeIndex]) {
            jokeText.textContent = jokes[currentJokeIndex].joke;
        }
    }

    prevButton.addEventListener('click', () => {
        if (currentJokeIndex > 0) {
            currentJokeIndex--;
            displayJoke();
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentJokeIndex < jokes.length - 1) {
            currentJokeIndex++;
            displayJoke();
        } else {
            currentJokeIndex = 0; // Loop back to the first joke
            displayJoke();
        }
    });

    fetchJokes();
});