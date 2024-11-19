// script.js

const questions = [
    "주변 사람들의 표정이나 말투 변화에 민감하게 반응한다.",
    "대중교통이나 복잡한 환경의 소음에 쉽게 피로감을 느낀다.",
    "네온사인, 전광판처럼 강한 빛에 노출되면 눈이 금방 피로해진다.",
    "예의 없는 행동을 보면 쉽게 불편함을 느낀다.",
    "배달 음식을 주문할 때 포장 상태나 재료의 신선도를 민감하게 따진다.",
    "갑작스러운 전화나 메시지에 긴장하거나 불편함을 느낄 때가 있다.",
    "카페나 공공장소에서 시끄러운 소리가 집중을 방해한다.",
    "사람들이 많은 명절이나 회식 자리는 쉽게 지치게 한다.",
    "중요한 일을 준비할 때 계획대로 되지 않으면 불안감을 느낀다.",
    "여러 가지 일을 한꺼번에 처리하면 스트레스를 크게 받는다.",
    "주변 사람이 힘들어 보일 때 자연스럽게 도움을 주고 싶어진다.",
    "폭력적이거나 자극적인 영상은 의도적으로 피하려고 한다.",
    "업무나 발표 중 누군가가 평가하고 있다는 생각에 긴장한다.",
    "조용한 환경에서 더 잘 집중할 수 있다.",
    "가족이나 친구와의 약속이 끝난 후 혼자만의 시간이 필요하다.",
    "복잡한 쇼핑몰이나 사람이 붐비는 장소에서 금방 피로감을 느낀다.",
    "지나치게 매운 음식이나 강한 자극이 부담스럽게 느껴질 때가 있다.",
    "날씨가 극단적으로 덥거나 추울 때 쉽게 지친다.",
    "실수를 줄이기 위해 항상 꼼꼼하게 확인하려 한다.",
    "음악을 들으며 깊은 감동을 느끼고, 이를 오래 기억한다.",
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
    let analysis = `<p><strong>${category}:</strong> ${score}/20점 - `;
    if (score > 15) {
        analysis += '✨ 아주 높은 점수입니다! ';
    } else if (score > 10) {
        analysis += '😊 중간 정도의 점수입니다. ';
    } else {
        analysis += '😌 낮은 점수입니다. ';
    }

    switch (category) {
        case '감각적인 반응':
            if (score > 15) {
                analysis += '소리나 빛 같은 자극에 아주 민감하게 반응해요. 📢🔆 너무 시끄럽거나 밝은 곳에서는 금방 피곤해질 수 있으니, 조용하고 편안한 환경을 만들어 보세요. 예를 들어, 이어폰으로 차분한 음악 🎶을 들으며 휴식하거나, 커튼으로 방의 조명을 조절하는 것도 도움이 돼요.';
            } else if (score > 10) {
                analysis += '주변 자극에 어느 정도 민감하게 반응해요. 🕊️ 필요할 때는 조용한 공간에서 스스로만의 시간을 가져보세요.';
            } else {
                analysis += '주변 자극에 잘 적응하는 편이에요. 👍 하지만 필요할 때는 자신의 편안함을 위해 환경을 조절하는 것도 좋아요.';
            }
            break;
        case '감정적인 반응':
            if (score > 15) {
                analysis += '다른 사람의 감정을 아주 잘 느끼고 영향을 받는 편이에요. ❤️ 다른 사람을 돕는 일에 기쁨을 느낄 수 있지만, 스스로 너무 지치지 않도록 주의하세요. 예를 들어, 친구의 이야기를 들어주면서도 "내가 쉬는 시간도 필요해!"라고 말해보세요. 🚪';
            } else if (score > 10) {
                analysis += '다른 사람의 감정을 잘 이해하고, 적절히 조절할 수 있어요. 😊 타인을 돕는 것도 중요하지만, 자신의 감정도 충분히 돌보세요. 쉬는 날에는 좋아하는 활동 🎨이나 취미를 즐기는 것이 좋아요.';
            } else {
                analysis += '다른 사람의 감정에 크게 영향을 받지 않는 편이에요. 😌 하지만 가끔은 주변 사람의 기분을 살피고 공감하려고 노력해보세요.';
            }
            break;
        case '깊이 생각하는 능력':
            if (score > 15) {
                analysis += '정보를 아주 깊이 있게 생각하고 분석해요. 💡 이 능력은 문제를 해결하거나 창의적인 아이디어를 내는 데 큰 도움이 돼요. 하지만 너무 많은 고민은 스트레스를 줄 수 있으니, 생각이 복잡해질 때는 산책 🏞️이나 운동 🏃를 통해 마음을 정리해 보세요.';
            } else if (score > 10) {
                analysis += '상황을 잘 분석하면서도 실용적인 결정을 내릴 수 있어요. 🎯 때로는 깊게 생각하기보다 빠르게 행동으로 옮기는 연습도 해보세요.';
            } else {
                analysis += '빠른 결정을 내리는 데 강점이 있어요. 🏃 중요한 상황에서는 조금 더 깊이 생각하는 연습도 도움이 될 수 있어요.';
            }
            break;
    }
    analysis += '</p>';
    return analysis;
}

function generateOverallAnalysis(scores) {
    const totalScore = scores.sensory_sensitivity + scores.emotional_reactivity + scores.cognitive_depth;
    let analysis = '<h3>전체 분석 🌟</h3>';
    analysis += `<p>총점: ${totalScore}/60점</p>`;

    if (totalScore > 45) {
        analysis += '<p>🌈 당신은 주변 환경과 다른 사람의 감정에 아주 민감한 편이에요. 이런 민감함은 창의적이고 세심한 장점이 될 수 있어요. 하지만 자극이 너무 많으면 스트레스를 받을 수 있으니, 스스로를 돌보는 시간이 꼭 필요해요.</p>';
        analysis += '<p><strong>조언:</strong> 🛌 자기 전에 따뜻한 차 🍵를 마시거나, 조용한 음악 🎧을 들으며 하루를 마무리해 보세요. 주말에는 자연 속에서 산책하거나 🏞️ 좋아하는 책 📚을 읽으며 휴식을 취하는 것도 좋아요. 또한, 스트레스가 심할 때는 믿을 만한 친구에게 고민을 이야기해보세요. 🤝</p>';
    } else if (totalScore > 30) {
        analysis += '<p>⚖️ 당신은 민감함과 균형을 잘 유지하는 편이에요. 상황에 따라 민감하게 반응하거나 여유롭게 대처할 수 있어요. 이런 균형 잡힌 성격은 여러 상황에서 큰 도움이 돼요.</p>';
        analysis += '<p><strong>조언:</strong> 🔄 필요할 때는 민감하게 반응하고, 필요하지 않을 때는 여유를 유지하는 연습을 해보세요. 예를 들어, 중요한 시험이나 발표가 끝난 후에는 스스로를 칭찬하고 🎉 보상을 주는 시간을 가져보세요. 좋아하는 간식 🍪이나 짧은 여행 🚌으로 자신을 격려해보세요.</p>';
    } else {
        analysis += '<p>💪 당신은 대부분의 환경에 잘 적응하고 스트레스를 덜 받는 편이에요. 이런 안정적인 성격은 여러 상황에서 강점이 될 수 있어요. 하지만 가끔은 주변 사람의 감정이나 작은 상황 변화에 조금 더 신경 써보세요.</p>';
        analysis += '<p><strong>조언:</strong> 🌟 당신의 강점인 차분함을 유지하면서도, 중요한 관계에서는 더 많은 관심과 공감을 보여주세요. 예를 들어, 가족이나 친구에게 하루를 어떻게 보냈는지 물어보고 이야기를 들어보세요. 🤗 작은 대화가 관계를 더 돈독하게 만들 수 있어요.</p>';
    }

    return analysis;
}



document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('start-btn').addEventListener('click', () => {
        showSection('test-container');
        createQuestion();
    });
});
