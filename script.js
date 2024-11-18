const questions = [
    "강한 감각 자극(빛, 소리, 냄새 등)에 쉽게 피곤해진다.",
    "주변의 미묘한 변화를 잘 알아차린다.",
    "다른 사람의 기분에 쉽게 영향을 받는다.",
    "통증에 매우 민감하다.",
    "바쁜 날 후에는 혼자만의 시간이 필요하다.",
    // ... 나머지 질문들을 추가하세요
];

let currentQuestion = 0;
let answers = [];

function showSection(id) {
    document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

function createQuestion() {
    const testContainer = document.getElementById('test-container');
    testContainer.innerHTML = `
        <div class="progress-bar">
            <span class="progress" style="width: ${(currentQuestion / questions.length) * 100}%"></span>
        </div>
        <div class="question">
            <p>${currentQuestion + 1}. ${questions[currentQuestion]}</p>
            <div class="options">
                <label><input type="radio" name="q" value="1"> 전혀 아니다</label>
                <label><input type="radio" name="q" value="2"> 약간 그렇다</label>
                <label><input type="radio" name="q" value="3"> 꽤 그렇다</label>
                <label><input type="radio" name="q" value="4"> 매우 그렇다</label>
            </div>
        </div>
        <button id="next-btn">${currentQuestion === questions.length - 1 ? '결과 보기' : '다음'}</button>
    `;

    document.getElementById('next-btn').addEventListener('click', nextQuestion);
}

function nextQuestion() {
    const selected = document.querySelector('input[name="q"]:checked');
    if (!selected) {
        alert('답변을 선택해주세요.');
        return;
    }

    answers.push(parseInt(selected.value));

    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        createQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    const score = answers.reduce((sum, answer) => sum + answer, 0);
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
        <h2>테스트 결과</h2>
        <p>당신의 점수: ${score}점</p>
        <p>${score >= 56 ? 'HSP 성향이 높습니다.' : 'HSP 성향이 낮습니다.'}</p>
        <button id="restart-btn">다시 시작</button>
    `;
    showSection('result');

    document.getElementById('restart-btn').addEventListener('click', () => {
        currentQuestion = 0;
        answers = [];
        showSection('intro');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('start-btn').addEventListener('click', () => {
        showSection('test-container');
        createQuestion();
    });
});
