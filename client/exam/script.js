let currentQuestionIndex = 0;
let questions = [];
const flaggedQuestions = new Set();
const selectedAnswers = {};

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; 
    }
}

async function loadQuestions() {
    try {
        const response = await fetch('../exam/questions.json');
        questions = await response.json();

        if (questions.length > 0) {
            shuffleArray(questions); 
            loadQuestion(currentQuestionIndex);
        } else {
            console.error('No questions available.');
        }
    } catch (error) {
        console.error('Error loading questions:', error);
    }
}


// Load the current question and answers
function loadQuestion(index) {
    const questionObj = questions[index];
    document.getElementById('question-container').textContent = questionObj.question;

    const answersContainer = document.getElementById('answers-container');
    answersContainer.innerHTML = '';

    questionObj.answers.forEach((answer, i) => {
        const answerButton = document.createElement('button');
        answerButton.textContent = answer;
        answerButton.classList.add('control-btn');
        if (selectedAnswers[index] === i) {
            answerButton.classList.add('selected');
        }
        answerButton.addEventListener('click', () => selectAnswer(i));
        answersContainer.appendChild(answerButton);
    });

    document.getElementById('prev-btn').disabled = index === 0;
    document.getElementById('next-btn').disabled = index === questions.length - 1;

    const flagBtn = document.getElementById('flag-btn');
    flagBtn.classList.toggle('flagged', flaggedQuestions.has(index));
    flagBtn.innerHTML = flaggedQuestions.has(index) ? 'Unflag' : '<i class="bi bi-flag"></i>';
}


function selectAnswer(selectedIndex) {
    const answerButtons = document.querySelectorAll('#answers-container button');
    answerButtons.forEach((button, index) => {
        if (index === selectedIndex) {
            button.classList.add('selected');
            selectedAnswers[currentQuestionIndex] = selectedIndex;
        } else {
            button.classList.remove('selected');
        }
    });
}

document.getElementById('flag-btn').addEventListener('click', () => {
    const flaggedList = document.getElementById('flagged-questions');
    const flagBtn = document.getElementById('flag-btn');

    if (flaggedQuestions.has(currentQuestionIndex)) {
        flaggedQuestions.delete(currentQuestionIndex);
        flagBtn.classList.remove('flagged');
        flagBtn.innerHTML = '<i class="bi bi-flag"></i>';

        const listItem = document.querySelector(`li[data-question-index="${currentQuestionIndex}"]`);
        if (listItem) {
            flaggedList.removeChild(listItem);
        }
    } else {
        flaggedQuestions.add(currentQuestionIndex);
        flagBtn.classList.add('flagged');
        flagBtn.textContent = 'Unflag';

        const listItem = document.createElement('li');
        listItem.textContent = `Question ${currentQuestionIndex + 1}`;
        listItem.dataset.questionIndex = currentQuestionIndex;

        listItem.addEventListener('click', function () {
            currentQuestionIndex = parseInt(this.dataset.questionIndex);
            loadQuestion(currentQuestionIndex);
        });

        flaggedList.appendChild(listItem);
    }
});

const stName = localStorage.getItem("fullName");
if (stName) {
    document.querySelector(".stName").textContent = stName;
} else {
    document.querySelector(".stName").textContent = "Name not available";
}

function calculateResult() {
    let correctAnswers = 0;

    questions.forEach((question, index) => {
        if (selectedAnswers[index] === question.correctAnswer) {
            correctAnswers++;
        }
    });

    const totalQuestions = questions.length;
    let scores = JSON.parse(localStorage.getItem('examScores')) || [];

    const newScore = {
        correctAnswers: correctAnswers,
        totalQuestions: totalQuestions,
        date: new Date().toISOString(),
    };

    scores.push(newScore);
    localStorage.setItem('examScores', JSON.stringify(scores));
}

document.getElementById('submit-btn').addEventListener('click', () => {
    calculateResult();

    setTimeout(() => {
        window.location.href = "../Result_Page/result.html";
    }, 1000);
});

document.getElementById('next-btn').addEventListener('click', () => {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        loadQuestion(currentQuestionIndex);
    }
});

document.getElementById('prev-btn').addEventListener('click', () => {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        loadQuestion(currentQuestionIndex);
    }
});

let timerDuration = 5 * 60; 
let timerInterval;

function startTimer() {
    const timerElement = document.getElementById('timer');

    function updateTimer() {
        let minutes = Math.floor(timerDuration / 60);
        let seconds = timerDuration % 60;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;
        timerElement.textContent = `${minutes}:${seconds}`;

        if (timerDuration <= 0) {
            clearInterval(timerInterval);
            setTimeout(() => {
                window.location.href = "../Timeout_Page/timeout.html";
            }, 1000);

        } else {
            timerDuration--;
        }
    }

    updateTimer(); 
    timerInterval = setInterval(updateTimer, 1000); 
}

window.onload = () => {
    startTimer()
    loadQuestions();
    history.pushState(null, null, location.href);

    window.onpopstate = () => {
        history.go(1);
    };
};
