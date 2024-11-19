// script.js

const questions = [
    { text: "주변 사람들의 표정이나 말투 변화에 민감하게 반응한다.", category: "sensory_sensitivity" },
    { text: "대중교통이나 복잡한 환경의 소음에 쉽게 피로감을 느낀다.", category: "sensory_sensitivity" },
    { text: "네온사인, 전광판처럼 강한 빛에 노출되면 눈이 금방 피로해진다", category: "sensory_sensitivity" },
    { text: "배달 음식을 주문할 때 포장 상태나 재료의 신선도를 민감하게 따진다.", category: "sensory_sensitivity" },
    { text: "카페나 공공장소에서 주변이 시끄러우면 집중하기 힘들다.", category: "sensory_sensitivity" },
    { text: "조용한 환경에서 더 잘 집중할 수 있다.", category: "sensory_sensitivity" },
    { text: "복잡한 쇼핑몰이나 사람이 붐비는 장소에서는 금방 피로감을 느낀다.", category: "sensory_sensitivity" },
    { text: "지나치게 매운 음식이나 강한 자극이 부담스럽게 느껴질 때가 있다.", category: "sensory_sensitivity" },
    { text: "날씨가 극단적으로 덥거나 추울 때 쉽게 지친다.", category: "sensory_sensitivity" },
  
    { text: "예의 없는 행동을 보면 쉽게 불편함을 느낀다.", category: "emotional_reactivity" },
    { text: "갑작스러운 전화나 메시지에 긴장하거나 불편함을 느낄 때가 있다.", category: "emotional_reactivity" },
    { text: "사람이 많은 명절이나 회식 자리에서는 쉽게 지친다.", category: "emotional_reactivity" },
    { text: "중요한 일을 준비할 때 계획대로 되지 않으면 불안감을 느낀다.", category: "emotional_reactivity" },
    { text: "주변 사람이 힘들어 보일 때 자연스럽게 도움을 주고 싶어진다.", category: "emotional_reactivity" },
    { text: "폭력적이거나 자극적인 영상은 의도적으로 피하려고 한다.", category: "emotional_reactivity" },
    { text: "업무나 발표 중 누군가가 평가하고 있다는 생각이 들면 긴장한다.", category: "emotional_reactivity" },
    { text: "여러 가지 일을 한꺼번에 처리하면 스트레스를 크게 받는다.", category: "cognitive_depth" },
    { text: "실수를 줄이기 위해 항상 꼼꼼하게 확인하려 한다.", category: "cognitive_depth" },
    { text: "음악을 들으며 깊은 감동을 느끼고, 이를 오래 기억한다.", category: "cognitive_depth" },
    { text: "새로운 아이디어나 문제를 깊이 있게 분석하려는 성향이 있다.", category: "cognitive_depth" }
];

// Fisher-Yates 알고리즘을 사용하여 질문을 무작위로 섞습니다.
function shuffleQuestions(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

shuffleQuestions(questions);

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
            <p>${currentQuestion + 1}. ${questions[currentQuestion].text}</p>
            <div class="options">
                <label><input type="radio" name="q" value="1"> 전혀 아니다</label>
                <label><input type="radio" name="q" value="2"> 약간 그렇다</label>
                <label><input type="radio" name="q" value="3"> 꽤 그렇다</label>
                <label><input type="radio" name="q" value="4"> 매우 그렇다</label>
                <label><input type="radio" name="q" value="5"> 완전히 그렇다</label>
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

    const value = parseInt(selected.value, 10);
    answers.push({ value: value, category: questions[currentQuestion].category });

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
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.raw}점`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 45, // 최대 점수 설정
                    title: {
                        display: true,
                        text: '점수'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: '카테고리'
                    }
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
    // 각 카테고리 점수를 0으로 초기화합니다.
    const scores = {
        sensory_sensitivity: 0,
        emotional_reactivity: 0,
        cognitive_depth: 0
    };

    answers.forEach(answer => {
        scores[answer.category] += answer.value;
    });

    return scores;
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
    let maxScore;
    let highThreshold;
    let midThreshold;

    switch (category) {
        case '감각적 민감성':
            maxScore = 45;
            highThreshold = 30;
            midThreshold = 20;
            break;
        case '정서적 반응성':
            maxScore = 35;
            highThreshold = 24;
            midThreshold = 15;
            break;
        case '인지적 처리 깊이':
            maxScore = 20;
            highThreshold = 15;
            midThreshold = 10;
            break;
    }

    let analysis = `<p><strong>${category}:</strong> ${score}/${maxScore}점 - `;
    if (score >= highThreshold) {
        analysis += '✨ 아주 높은 점수입니다! ';
        switch (category) {
            case '감각적 민감성':
                analysis += '소리, 빛 등 주변 자극에 매우 민감하게 반응합니다. 이러한 민감성은 창의력과 직관력을 높이는 데 도움이 되지만, 과도한 자극은 스트레스를 초래할 수 있습니다. 조용한 환경을 만들고 충분한 휴식을 취하는 것이 중요합니다.';
                break;
            case '정서적 반응성':
                analysis += '타인의 감정에 매우 잘 공감하며, 상황에 대한 감정적 반응이 강합니다. 이는 대인관계에서 좋은 장점이 될 수 있지만, 과도한 공감은 피로를 유발할 수 있습니다. 자신을 돌보는 시간을 확보하는 것이 필요합니다.';
                break;
            case '인지적 처리 깊이':
                analysis += '정보를 깊이 있게 처리하며, 세부사항을 꼼꼼히 분석하는 성향이 강합니다. 이러한 능력은 문제 해결과 창의적 사고에 유리하지만, 지나친 고민은 스트레스를 초래할 수 있습니다. 때때로 생각을 멈추고 휴식을 취하는 것도 도움이 됩니다.';
                break;
        }
    } else if (score >= midThreshold) {
        analysis += '😊 중간 정도의 점수입니다. ';
        switch (category) {
            case '감각적 민감성':
                analysis += '주변 자극에 어느 정도 민감하며, 필요한 경우 자극을 조절하려는 성향이 있습니다. 조용한 환경에서 휴식을 취하거나, 자극적인 상황을 피하는 것이 도움이 될 수 있습니다.';
                break;
            case '정서적 반응성':
                analysis += '타인의 감정을 잘 이해하며, 상황에 따라 적절히 반응하는 균형 잡힌 성향을 가지고 있습니다. 대인 관계에서 감정적으로 지치지 않도록 자기 돌봄을 실천하는 것이 좋습니다.';
                break;
            case '인지적 처리 깊이':
                analysis += '상황을 잘 분석하고 신중하게 생각하는 경향이 있습니다. 이 점수는 복잡한 문제 해결에 도움이 되며, 때로는 직관에 따라 빠르게 결정을 내리는 연습도 필요합니다.';
                break;
        }
    } else {
        analysis += '😌 낮은 점수입니다. ';
        switch (category) {
            case '감각적 민감성':
                analysis += '주변 자극에 비교적 둔감하며, 다양한 환경에서도 스트레스를 덜 받는 편입니다. 이는 안정감을 유지하는 데 도움이 되지만, 가끔은 자신에게 필요한 편안한 환경을 만들어 주는 것도 중요합니다.';
                break;
            case '정서적 반응성':
                analysis += '타인의 감정에 크게 영향을 받지 않으며, 감정적으로 안정된 상태를 유지하는 편입니다. 그러나 가끔은 주변 사람들의 감정에 관심을 기울이는 연습도 필요할 수 있습니다.';
                break;
            case '인지적 처리 깊이':
                analysis += '빠르게 결정을 내리고 실용적인 접근을 선호합니다. 이는 효율적이지만, 중요한 상황에서는 조금 더 깊이 생각하는 연습도 도움이 될 수 있습니다.';
                break;
        }
    }
    analysis += '</p>';
    return analysis;
}:</strong> ${score}/35점 - `;
    if (score > 20) {
        analysis += '✨ 아주 높은 점수입니다! ';
        switch (category) {
            case '감각적 민감성':
                analysis += '소리, 빛 등 주변 자극에 매우 민감하게 반응합니다. 이러한 민감성은 창의력과 직관력을 높이는 데 도움이 되지만, 과도한 자극은 스트레스를 초래할 수 있습니다. 조용한 환경을 만들고 충분한 휴식을 취하는 것이 중요합니다.';
                break;
            case '정서적 반응성':
                analysis += '타인의 감정에 매우 잘 공감하며, 상황에 대한 감정적 반응이 강합니다. 이는 대인관계에서 좋은 장점이 될 수 있지만, 과도한 공감은 피로를 유발할 수 있습니다. 자신을 돌보는 시간을 확보하는 것이 필요합니다.';
                break;
            case '인지적 처리 깊이':
                analysis += '정보를 깊이 있게 처리하며, 세부사항을 꼼꼼히 분석하는 성향이 강합니다. 이러한 능력은 문제 해결과 창의적 사고에 유리하지만, 지나친 고민은 스트레스를 초래할 수 있습니다. 때때로 생각을 멈추고 휴식을 취하는 것도 도움이 됩니다.';
                break;
        }
    } else if (score > 14) {
        analysis += '😊 중간 정도의 점수입니다. ';
        switch (category) {
            case '감각적 민감성':
                analysis += '주변 자극에 어느 정도 민감하며, 필요한 경우 자극을 조절하려는 성향이 있습니다. 조용한 환경에서 휴식을 취하거나, 자극적인 상황을 피하는 것이 도움이 될 수 있습니다.';
                break;
            case '정서적 반응성':
                analysis += '타인의 감정을 잘 이해하며, 상황에 따라 적절히 반응하는 균형 잡힌 성향을 가지고 있습니다. 대인 관계에서 감정적으로 지치지 않도록 자기 돌봄을 실천하는 것이 좋습니다.';
                break;
            case '인지적 처리 깊이':
                analysis += '상황을 잘 분석하고 신중하게 생각하는 경향이 있습니다. 이 점수는 복잡한 문제 해결에 도움이 되며, 때로는 직관에 따라 빠르게 결정을 내리는 연습도 필요합니다.';
                break;
        }
    } else {
        analysis += '😌 낮은 점수입니다. ';
        switch (category) {
            case '감각적 민감성':
                analysis += '주변 자극에 비교적 둔감하며, 다양한 환경에서도 스트레스를 덜 받는 편입니다. 이는 안정감을 유지하는 데 도움이 되지만, 가끔은 자신에게 필요한 편안한 환경을 만들어 주는 것도 중요합니다.';
                break;
            case '정서적 반응성':
                analysis += '타인의 감정에 크게 영향을 받지 않으며, 감정적으로 안정된 상태를 유지하는 편입니다. 그러나 가끔은 주변 사람들의 감정에 관심을 기울이는 연습도 필요할 수 있습니다.';
                break;
            case '인지적 처리 깊이':
                analysis += '빠르게 결정을 내리고 실용적인 접근을 선호합니다. 이는 효율적이지만, 중요한 상황에서는 조금 더 깊이 생각하는 연습도 도움이 될 수 있습니다.';
                break;
        }
    }
    analysis += '</p>';
    return analysis;
}

function generateOverallAnalysis(scores) {
    const totalScore = scores.sensory_sensitivity + scores.emotional_reactivity + scores.cognitive_depth;
    let analysis = '<h3>전체 분석 🌟</h3>';
    analysis += `<p>총점: ${totalScore}/100점 (각 문항 최대 5점 기준)</p>`;

    if (totalScore > 75) {
        analysis += '<p>🌈 당신은 주변 환경과 다른 사람의 감정에 아주 민감한 편이에요. 이런 민감함은 창의적이고 세심한 장점이 될 수 있어요. 하지만 자극이 너무 많으면 스트레스를 받을 수 있으니, 스스로를 돌보는 시간이 꼭 필요해요.</p>';
    } else if (totalScore > 50) {
        analysis += '<p>⚖️ 당신은 민감함과 균형을 잘 유지하는 편이에요. 상황에 따라 민감하게 반응하거나 여유롭게 대처할 수 있어요. 이런 균형 잡힌 성격은 여러 상황에서 큰 도움이 돼요.</p>';
    } else {
        analysis += '<p>💪 당신은 대부분의 환경에 잘 적응하고 스트레스를 덜 받는 편이에요. 이런 안정적인 성격은 여러 상황에서 강점이 될 수 있어요. 하지만 가끔은 주변 사람의 감정이나 작은 상황 변화에 조금 더 신경 써보세요.</p>';
    }

    return analysis;
}

// DOMContentLoaded 이벤트 리스너 수정
document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM fully loaded and parsed");
    const startBtn = document.getElementById('start-btn');
    console.log("Start button:", startBtn);

    if (startBtn) {
        startBtn.addEventListener('click', function () {
            console.log("Start button clicked");
            showSection('test-container');
            createQuestion();
        });
    } else {
        console.error("Start button not found. Please check the HTML structure.");
    }
});


