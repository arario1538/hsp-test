// script.js

const questions = [
    "시끄러운 소리나 밝은 빛이 있으면 쉽게 불편함을 느낀다.",
    "주변에서 작은 변화를 금방 알아차린다.",
    "다른 사람의 기분을 잘 느낀다.",
    "몸이 아프거나 불편한 걸 더 크게 느낀다.",
    "바쁜 날이 지나면 혼자 쉬는 시간이 꼭 필요하다.",
    "커피나 차를 마시면 예민하게 반응한다.",
    "상상을 많이 하고 생각이 깊다.",
    "갑자기 큰 소리가 나면 깜짝 놀란다.",
    "그림이나 음악 같은 예술을 보면 크게 감동한다.",
    "작은 부분까지 꼼꼼히 신경 쓴다.",
    "예상 못한 일이 생기면 쉽게 당황한다.",
    "시간이 부족하면 금방 스트레스를 받는다.",
    "다른 사람이 힘들어 보이면 빨리 알아차리고 돕고 싶어진다.",
    "여러 가지 일을 한꺼번에 하면 쉽게 힘들어진다.",
    "실수를 안 하려고 항상 조심한다.",
    "폭력적이거나 무서운 영상을 보지 않으려고 한다.",
    "사람이 많거나 복잡한 곳에서는 빨리 지친다.",
    "배가 고프거나 목이 마르면 금방 불편해진다.",
    "일상의 작은 변화에도 금방 영향을 받는다.",
    "맛, 냄새, 소리의 작은 차이를 잘 알아낸다.",
    "시끄럽고 복잡한 곳은 되도록 가지 않으려고 한다.",
    "경쟁하거나 평가받는 상황에서 많이 긴장한다.",
    "어릴 때부터 다른 사람들에게 예민하다는 말을 자주 들었다.",
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

    document.getElementById('next-btn').onclick = nextQuestion;
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
                    beginAtZero: true,
                    max: 32 // 최대 점수 설정
                }
            }
        }
    });

    // 텍스트 분석 결과 추가
    const analysisDiv = document.getElementById('analysis');
    analysisDiv.innerHTML = generateAnalysis(scores);

    showSection('result');
}

function calculateScores() {
    return {
        sensory_sensitivity: answers.slice(0, 8).reduce((a, b) => a + b, 0),
        emotional_reactivity: answers.slice(8, 16).reduce((a, b) => a + b, 0),
        cognitive_depth: answers.slice(16).reduce((a, b) => a + b, 0)
    };
}

function generateAnalysis(scores) {
    let analysis = '<h3>분석 결과</h3>';
    
    // 각 영역별 분석
    analysis += generateCategoryAnalysis('감각적 민감성', scores.sensory_sensitivity);
    analysis += generateCategoryAnalysis('정서적 반응성', scores.emotional_reactivity);
    analysis += generateCategoryAnalysis('인지적 처리 깊이', scores.cognitive_depth);

    // 종합 분석 추가
    analysis += generateOverallAnalysis(scores);

    return analysis;
}

function generateCategoryAnalysis(category, score) {
    let analysis = `<p><strong>${category}:</strong> ${score}/32점 - `;
    if (score > 24) {
        analysis += '매우 높은 수준을 보입니다. ';
    } else if (score > 16) {
        analysis += '중간 수준을 보입니다. ';
    } else {
        analysis += '낮은 수준을 보입니다. ';
    }

    switch(category) {
        case '감각적 민감성':
            if (score > 24) analysis += '환경 자극에 매우 민감하게 반응하며, 쉽게 피로해질 수 있습니다. 적절한 휴식과 환경 조절이 필요합니다.';
            else if (score > 16) analysis += '환경 자극에 어느 정도 민감하게 반응합니다. 때에 따라 휴식이 필요할 수 있습니다.';
            else analysis += '대부분의 환경 자극에 잘 적응할 수 있습니다.';
            break;
        case '정서적 반응성':
            if (score > 24) analysis += '타인의 감정과 주변 상황에 매우 민감하게 반응합니다. 자신의 감정 관리에 주의를 기울일 필요가 있습니다.';
            else if (score > 16) analysis += '타인의 감정을 잘 이해하면서도 적절한 거리를 유지할 수 있습니다.';
            else analysis += '감정적 영향을 덜 받지만, 때로는 타인의 감정을 이해하는 데 더 많은 노력이 필요할 수 있습니다.';
            break;
        case '인지적 처리 깊이':
            if (score > 24) analysis += '정보를 매우 깊이 있게 처리하고 분석합니다. 이는 창의적 사고에 도움이 되지만, 때로는 과도한 고민으로 이어질 수 있으니 주의가 필요합니다.';
            else if (score > 16) analysis += '상황을 적절히 분석하면서도 실용적인 결정을 내릴 수 있습니다.';
            else analysis += '빠른 결정을 내릴 수 있지만, 중요한 상황에서는 더 깊이 있는 고민이 필요할 수 있습니다.';
            break;
    }
    analysis += '</p>';
    return analysis;
}

function generateOverallAnalysis(scores) {
    const totalScore = scores.sensory_sensitivity + scores.emotional_reactivity + scores.cognitive_depth;
    let analysis = '<h3>종합 분석</h3>';
    analysis += `<p>총점: ${totalScore}/92점</p>`;

    if (totalScore > 69) {
        analysis += '<p>당신은 높은 수준의 HSP(고감도 성향) 특성을 보입니다. 이는 당신이 주변 환경과 타인의 감정에 매우 민감하게 반응하며, 깊이 있는 사고를 하는 경향이 있음을 의미합니다. 이러한 특성은 창의성, 공감 능력, 세심한 관찰력 등의 장점으로 작용할 수 있습니다. 하지만 동시에 쉽게 피로해지거나 과도한 자극에 스트레스를 받을 수 있으므로, 자기 관리와 적절한 휴식이 매우 중요합니다.</p>';
    } else if (totalScore > 46) {
        analysis += '<p>당신은 중간 수준의 HSP(고감도 성향) 특성을 보입니다. 이는 상황에 따라 민감하게 반응할 수 있지만, 대체로 균형 잡힌 방식으로 환경과 상호작용함을 의미합니다. 당신은 타인의 감정을 잘 이해하면서도 자신의 감정을 적절히 조절할 수 있는 능력이 있습니다. 복잡한 상황을 분석할 수 있는 동시에 실용적인 결정을 내릴 수 있는 균형 잡힌 특성을 가지고 있습니다.</p>';
    } else {
        analysis += '<p>당신은 낮은 수준의 HSP(고감도 성향) 특성을 보입니다. 이는 대부분의 환경에 잘 적응하고, 강한 자극에도 크게 영향받지 않음을 의미합니다. 이러한 특성은 스트레스가 많은 환경에서 일하거나 빠른 결정이 필요한 상황에서 장점으로 작용할 수 있습니다. 다만, 때로는 타인의 미묘한 감정 변화나 환경의 작은 변화를 놓칠 수 있으므로, 중요한 인간관계나 결정에서는 조금 더 신중하게 접근하는 것이 도움이 될 수 있습니다.</p>';
    }

    analysis += '<p><strong>조언:</strong> ';
    if (totalScore > 69) {
        analysis += '자신의 높은 민감성을 인정하고, 이를 강점으로 활용하세요. 동시에 과도한 자극을 피하고 정기적인 휴식을 취하는 등의 자기 관리 전략을 개발하는 것이 중요합니다. 명상, 요가, 자연 속에서의 시간 등이 도움이 될 수 있습니다.';
    } else if (totalScore > 46) {
        analysis += '당신의 균형 잡힌 특성을 활용하여 다양한 상황에 유연하게 대처하세요. 필요에 따라 더 민감하게 반응하거나, 반대로 덜 민감하게 반응하는 능력을 개발하면 더욱 효과적으로 생활할 수 있습니다.';
    } else {
        analysis += '당신의 강점인 안정성과 적응력을 잘 활용하세요. 동시에 주변 사람들의 감정이나 미묘한 상황 변화에 조금 더 주의를 기울이는 연습을 하면, 더욱 풍부한 대인 관계와 경험을 쌓을 수 있을 것입니다.';
    }
    analysis += '</p>';
    return analysis;
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('start-btn').addEventListener('click', () => {
        showSection('test-container');
        createQuestion();
    });
});
