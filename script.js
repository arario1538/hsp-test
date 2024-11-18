const questions = [
    "강한 감각 자극(빛, 소리, 냄새 등)에 쉽게 피곤해진다.",
    "주변의 미묘한 변화를 잘 알아차린다.",
    "다른 사람의 기분에 쉽게 영향을 받는다.",
    "통증에 매우 민감하다.",
    "바쁜 날 후에는 혼자만의 시간이 필요하다.",
    "카페인에 특히 민감하게 반응한다.",
    "복잡하고 풍부한 내면 세계를 가지고 있다.",
    "큰 소리에 불편함을 느낀다.",
    "예술(음악, 미술 등)에 깊은 감동을 받는다.",
    "양심적이고 꼼꼼한 편이다.",
    "쉽게 놀란다.",
    "짧은 시간 내 많은 일을 해야 할 때 당황한다.",
    "타인의 불편함을 잘 알아차리고 해결하려 한다.",
    "동시에 여러 가지 요구를 받으면 짜증이 난다.",
    "실수나 망각을 피하려고 노력한다.",
    "폭력적인 영상을 피하려 한다.",
    "주변에 많은 일이 일어나면 불편함을 느낀다.",
    "배고픔에 민감하게 반응한다.",
    "생활의 변화에 쉽게 동요한다.",
    "섬세한 감각(향기, 맛, 소리 등)을 즐긴다.",
    "소란스러운 상황을 피하려고 노력한다.",
    "경쟁 상황이나 관찰받는 상황에서 긴장한다.",
    "어릴 때 예민하다는 말을 자주 들었다."
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
    const scores = calculateScores();
    
    // Chart.js로 그래프 그리기
    const ctx = document.getElementById('myChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['감각적 민감성', '정서적 반응성', '인지적 처리 깊이'],
            datasets: [{
                label: 'HSP 점수',
                data: [scores.sensory_sensitivity, scores.emotional_reactivity, scores.cognitive_depth],
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    showSection('result');
}

// 각 영역별 점수 계산 (예시로 임의로 나눔)
function calculateScores() {
    return {
        sensory_sensitivity: answers.slice(0, 2).reduce((a, b) => a + b, 0),
        emotional_reactivity: answers.slice(2, 4).reduce((a, b) => a + b, 0),
        cognitive_depth: answers.slice(4).reduce((a, b) => a + b, 0)
    };
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('start-btn').addEventListener('click', () => {
        showSection('test-container');
        createQuestion();
    });
});
