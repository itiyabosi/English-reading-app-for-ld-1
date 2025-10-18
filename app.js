// ========================================
// 英語音読トレーニングアプリ - メインスクリプト
// バージョン: 2.00
// ========================================

// ========================================
// 1. 定数定義
// ========================================
const APP_VERSION = "2.00";

// Firebase設定（後で設定してください）
const firebaseConfig = {
    apiKey: "AIzaSyBGf8dDrU7mZ1FvJQxKxO9vP2fH3LYnKsE",
    authDomain: "english-reading-app-for-ld.firebaseapp.com",
    projectId: "english-reading-app-for-ld",
    storageBucket: "english-reading-app-for-ld.firebasestorage.app",
    messagingSenderId: "478058095337",
    appId: "1:478058095337:web:98f0e7f6c8e5d4b3c2a1f0"
};

// ========================================
// 2. アプリケーション状態管理
// ========================================
const app = {
    questions: [],
    currentQuestionIndex: 0,
    readingStartTime: null,
    readingEndTime: null,
    answerStartTime: null,
    results: [],
    totalQuestions: 5,
    recognition: null,
    recognizedText: '',
    isRecording: false,
    recognitionHistory: [],
    questionStartTime: null
};

// Firebase関連
let db = null;
let firebaseInitialized = false;

// DOM要素（後で初期化）
let elements = null;

// ========================================
// 3. 問題データ定義
// ========================================
const questionPool = [
    {
        passage: "Tom goes to school by bus every day. He gets up at seven o'clock and has breakfast with his family. After breakfast, he walks to the bus stop near his house. The bus comes at eight o'clock.",
        question: "トムは毎日どうやって学校に行きますか？",
        choices: ["歩いて", "バスで", "自転車で", "電車で"],
        correctAnswer: 1
    },
    {
        passage: "Mary loves animals very much. She has a dog named Max and a cat named Lucy. Every morning, she feeds them before she goes to school. On weekends, she takes Max to the park and plays with him.",
        question: "メアリーは朝学校に行く前に何をしますか？",
        choices: ["宿題をする", "ペットに餌をやる", "公園に行く", "本を読む"],
        correctAnswer: 1
    },
    {
        passage: "John is a good student. He studies hard every day after school. He likes math and science the best. His dream is to become a scientist in the future. He reads many books about space and planets.",
        question: "ジョンの夢は何ですか？",
        choices: ["先生になること", "科学者になること", "医者になること", "パイロットになること"],
        correctAnswer: 1
    },
    {
        passage: "Lisa goes shopping with her mother every Saturday. They buy food and other things they need. Lisa's favorite part is choosing fruits. She loves apples and oranges. Sometimes they also buy flowers.",
        question: "リサは買い物で何を選ぶのが好きですか？",
        choices: ["野菜", "果物", "パン", "お菓子"],
        correctAnswer: 1
    },
    {
        passage: "Mike plays soccer every Sunday with his friends. He practices very hard because he wants to join the school team. His father comes to watch him play. Mike feels happy when his father is there.",
        question: "マイクは日曜日に何をしますか？",
        choices: ["野球をする", "サッカーをする", "テニスをする", "バスケをする"],
        correctAnswer: 1
    },
    {
        passage: "Sarah has a piano lesson every Wednesday. She has been learning piano for three years. She practices for one hour every day. Her teacher says she is getting better and better. She will perform at a concert next month.",
        question: "サラはどのくらいピアノを習っていますか？",
        choices: ["1年", "2年", "3年", "4年"],
        correctAnswer: 2
    },
    {
        passage: "Ken loves reading books. He goes to the library every Friday after school. He borrows three books at a time. He likes adventure stories and science fiction. Reading helps him learn new words and ideas.",
        question: "ケンは図書館で何冊の本を借りますか？",
        choices: ["1冊", "2冊", "3冊", "4冊"],
        correctAnswer: 2
    },
    {
        passage: "Emma has a part-time job at a flower shop. She works there every Saturday and Sunday. She waters the plants and helps customers. She learns the names of many different flowers. She wants to have her own shop someday.",
        question: "エマはいつアルバイトをしますか？",
        choices: ["平日", "月曜日と金曜日", "土曜日と日曜日", "毎日"],
        correctAnswer: 2
    },
    {
        passage: "David enjoys cooking. He learned how to cook from his grandmother. Every Sunday, he makes lunch for his family. His specialty is pasta. Everyone in his family loves his cooking. He dreams of becoming a chef.",
        question: "デイビッドは誰から料理を習いましたか？",
        choices: ["母親", "父親", "祖母", "先生"],
        correctAnswer: 2
    },
    {
        passage: "Anna goes jogging in the park every morning before breakfast. She runs for thirty minutes. She likes to see the sunrise while running. After jogging, she feels fresh and ready for the day. Exercise gives her energy.",
        question: "アンナは朝ジョギングで何分走りますか？",
        choices: ["20分", "30分", "40分", "1時間"],
        correctAnswer: 1
    },
    {
        passage: "Bob is learning to play the guitar. He practices every evening after finishing his homework. He watches online videos to learn new songs. His favorite music is rock. He wants to play in a band with his friends.",
        question: "ボブはいつギターを練習しますか？",
        choices: ["朝", "昼休み", "宿題の後", "寝る前"],
        correctAnswer: 2
    },
    {
        passage: "Kate visits her grandparents every month. They live in the countryside. She helps them with gardening and feeding the chickens. She loves the fresh air and quiet life there. Her grandparents always make delicious food for her.",
        question: "ケイトはどのくらいの頻度で祖父母を訪ねますか？",
        choices: ["毎週", "毎月", "3ヶ月に1回", "1年に1回"],
        correctAnswer: 1
    },
    {
        passage: "James is interested in photography. He takes his camera everywhere he goes. He likes to photograph nature, especially birds and flowers. Last week, he won a prize in a school photo contest. He was very proud of himself.",
        question: "ジェームズは先週何を受賞しましたか？",
        choices: ["絵画コンテスト", "写真コンテスト", "作文コンテスト", "歌のコンテスト"],
        correctAnswer: 1
    },
    {
        passage: "Nancy volunteers at an animal shelter twice a week. She helps take care of dogs and cats that don't have homes. She feeds them, plays with them, and cleans their cages. She hopes all the animals will find loving families soon.",
        question: "ナンシーは週に何回ボランティアをしますか？",
        choices: ["1回", "2回", "3回", "毎日"],
        correctAnswer: 1
    },
    {
        passage: "Paul collects stamps from different countries. He has stamps from over fifty countries. He keeps them in a special album. His uncle often sends him stamps from his travels. Paul learns about geography and culture through his hobby.",
        question: "ポールはいくつの国の切手を持っていますか？",
        choices: ["20ヶ国以上", "30ヶ国以上", "50ヶ国以上", "100ヶ国以上"],
        correctAnswer: 2
    }
];

// ========================================
// 4. Firebase初期化
// ========================================
async function initializeFirebase() {
    try {
        const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js');
        const { getFirestore, collection, addDoc, query, where, getDocs, orderBy } =
            await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js');

        const firebaseApp = initializeApp(firebaseConfig);
        db = getFirestore(firebaseApp);
        firebaseInitialized = true;

        // グローバルに関数を保存
        window.firestoreAddDoc = addDoc;
        window.firestoreCollection = collection;
        window.firestoreQuery = query;
        window.firestoreWhere = where;
        window.firestoreGetDocs = getDocs;
        window.firestoreOrderBy = orderBy;

        console.log('✓ Firebase初期化完了');
    } catch (error) {
        console.warn('Firebase初期化失敗（オフラインモードで続行）:', error);
        firebaseInitialized = false;
    }
}

// ========================================
// 5. ユーザーID管理
// ========================================
function getUserId() {
    let userId = localStorage.getItem('userId');
    if (!userId) {
        const randomString = Math.random().toString(36).substring(2, 10);
        const timestamp = Date.now();
        userId = `user_${randomString}_${timestamp}`;
        localStorage.setItem('userId', userId);
    }
    return userId;
}

function getCustomUserId() {
    return localStorage.getItem('customUserId') || '';
}

function setCustomUserId(customId) {
    if (customId && customId.trim()) {
        localStorage.setItem('customUserId', customId.trim());
        return true;
    }
    return false;
}

function getDisplayUserId() {
    const customId = getCustomUserId();
    return customId || getUserId();
}

function getBrowserInfo() {
    return {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform
    };
}

// ========================================
// 6. 問題生成
// ========================================
async function generateQuestions() {
    console.log('問題を生成中...');
    elements.loading.classList.remove('hidden');

    // ランダムに5問選択
    app.questions = [];
    const usedIndices = new Set();

    while (app.questions.length < app.totalQuestions) {
        const randomIndex = Math.floor(Math.random() * questionPool.length);
        if (!usedIndices.has(randomIndex)) {
            app.questions.push(questionPool[randomIndex]);
            usedIndices.add(randomIndex);
        }
    }

    // ローディングを少し表示（UX向上）
    await new Promise(resolve => setTimeout(resolve, 500));

    elements.loading.classList.add('hidden');
    console.log('✓ 問題生成完了:', app.questions.length, '問');
}

// ========================================
// 7. クイズ開始
// ========================================
async function startQuiz() {
    console.log('=== クイズ開始 ===');

    // 状態をリセット
    app.currentQuestionIndex = 0;
    app.results = [];
    app.questionStartTime = Date.now();

    // 問題生成
    await generateQuestions();

    // 画面切り替え
    showScreen('question');

    // 最初の問題を表示
    displayQuestion();
}

// ========================================
// 8. 画面切り替え
// ========================================
function showScreen(screenName) {
    const screens = ['start', 'question', 'result', 'history', 'progress'];
    screens.forEach(name => {
        const screenElement = elements[`${name}Screen`];
        if (screenElement) {
            if (name === screenName) {
                screenElement.classList.add('active');
            } else {
                screenElement.classList.remove('active');
            }
        }
    });
}

// ========================================
// 9. 問題表示
// ========================================
function displayQuestion() {
    const questionData = app.questions[app.currentQuestionIndex];
    const questionNumber = app.currentQuestionIndex + 1;

    console.log(`問題 ${questionNumber} を表示中`);

    // 進捗バー更新
    const progressPercent = (questionNumber / app.totalQuestions) * 100;
    elements.progress.style.width = `${progressPercent}%`;

    // 問題番号表示
    elements.questionNumber.textContent = `問題 ${questionNumber}/${app.totalQuestions}`;

    // タイマーリセット
    elements.timer.textContent = '0.0秒';

    // 指示テキストは非表示
    elements.readingInstruction.textContent = '';

    // 文章表示
    elements.passage.textContent = questionData.passage;

    // 問題文表示
    elements.questionText.textContent = questionData.question;

    // 選択肢表示
    elements.choices.innerHTML = '';
    questionData.choices.forEach((choiceText, index) => {
        const choiceButton = document.createElement('button');
        choiceButton.className = 'choice';
        choiceButton.textContent = choiceText;
        choiceButton.setAttribute('data-index', index);
        choiceButton.addEventListener('click', () => handleAnswer(index));
        elements.choices.appendChild(choiceButton);
    });

    // ボタン状態リセット
    elements.startRecordingBtn.classList.remove('hidden');
    elements.stopRecordingBtn.classList.add('hidden');

    // フィードバックのみ非表示（音声認識結果は残す）
    elements.feedback.classList.add('hidden');

    // 音読状態リセット
    app.readingStartTime = null;
    app.readingEndTime = null;
    app.answerStartTime = null;
    app.recognizedText = '';
    app.recognitionHistory = [];
    app.isRecording = false;

    console.log('✓ 問題表示完了');
}

// ========================================
// 10. 音声認識初期化
// ========================================
function initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        alert('このブラウザは音声認識に対応していません。Google Chromeをお使いください。');
        return;
    }

    app.recognition = new SpeechRecognition();
    app.recognition.lang = 'en-US';
    app.recognition.continuous = true;
    app.recognition.interimResults = true;

    app.recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript + ' ';
            } else {
                interimTranscript += transcript;
            }
        }

        if (finalTranscript) {
            app.recognizedText += finalTranscript;
            app.recognitionHistory.push(finalTranscript.trim());
        }

        // リアルタイム表示更新
        const displayText = app.recognizedText + interimTranscript;
        elements.recognizedText.textContent = displayText;

        // 読了チェック
        checkIfReadingComplete();

        // タイマー更新
        updateTimer();
    };

    app.recognition.onerror = (event) => {
        console.error('音声認識エラー:', event.error);
        if (event.error === 'no-speech') {
            console.warn('音声が検出されませんでした');
        } else if (event.error === 'not-allowed') {
            alert('マイクへのアクセスが許可されていません。ブラウザの設定を確認してください。');
        }
    };

    app.recognition.onend = () => {
        if (app.isRecording) {
            console.log('音声認識が予期せず終了しました。再開します。');
            try {
                app.recognition.start();
            } catch (error) {
                console.error('音声認識の再開に失敗:', error);
            }
        }
    };

    console.log('✓ 音声認識初期化完了');
}

// ========================================
// 11. 音声認識開始
// ========================================
function startRecording() {
    console.log('=== 音声認識開始 ===');

    if (!app.recognition) {
        initSpeechRecognition();
    }

    app.recognizedText = '';
    app.recognitionHistory = [];
    app.readingStartTime = Date.now();
    app.isRecording = true;

    // ボタン切り替え
    elements.startRecordingBtn.classList.add('hidden');
    elements.stopRecordingBtn.classList.remove('hidden');

    // 状態表示
    elements.recognitionStatus.classList.remove('hidden');
    elements.recognitionText.textContent = '音声を認識中...';
    elements.recognizedText.textContent = '';

    // 指示は表示しない
    elements.readingInstruction.textContent = '';

    try {
        app.recognition.start();
        console.log('✓ 音声認識スタート');
    } catch (error) {
        console.error('音声認識の開始に失敗:', error);
        alert('音声認識の開始に失敗しました。もう一度お試しください。');
        stopRecording();
    }
}

// ========================================
// 12. 音声認識停止
// ========================================
function stopRecording() {
    console.log('=== 音声認識停止 ===');

    app.isRecording = false;

    if (app.recognition) {
        try {
            app.recognition.stop();
        } catch (error) {
            console.error('音声認識の停止でエラー:', error);
        }
    }

    // ボタン切り替え
    elements.startRecordingBtn.classList.remove('hidden');
    elements.stopRecordingBtn.classList.add('hidden');

    // 状態更新
    elements.recognitionText.textContent = '音声認識を停止しました';

    // 音読が完了していなければ、現在時刻を記録
    if (!app.readingEndTime) {
        app.readingEndTime = Date.now();
        app.answerStartTime = app.readingEndTime;
    }

    // 音読結果を表示
    compareTextWithPassage();

    console.log('✓ 音声認識停止完了');
}

// ========================================
// 13. タイマー更新
// ========================================
function updateTimer() {
    if (!app.readingStartTime) return;

    const currentTime = Date.now();
    const elapsedSeconds = (currentTime - app.readingStartTime) / 1000;
    elements.timer.textContent = `${elapsedSeconds.toFixed(1)}秒`;
}

// ========================================
// 14. 読了チェック（80%検出）
// ========================================
function checkIfReadingComplete() {
    if (!app.isRecording || !app.recognizedText) return;
    if (app.readingEndTime) return; // 既に完了

    const questionData = app.questions[app.currentQuestionIndex];
    const originalText = questionData.passage.toLowerCase().replace(/[.,!?]/g, '');
    const recognizedTextCleaned = app.recognizedText.toLowerCase().replace(/[.,!?]/g, '');

    const originalWords = originalText.split(/\s+/).filter(w => w.length > 0);
    const recognizedWords = recognizedTextCleaned.split(/\s+/).filter(w => w.length > 0);

    // 80%完了で読了とみなす
    const completionRatio = recognizedWords.length / originalWords.length;

    if (completionRatio >= 0.8) {
        app.readingEndTime = Date.now();
        app.answerStartTime = app.readingEndTime;

        console.log('✓ 音読完了を検出しました (', Math.round(completionRatio * 100), '%)');

        // 音声認識は継続（解答まで）
        elements.readingInstruction.textContent = '';
        elements.recognitionText.textContent = '';
    }
}

// ========================================
// 15. 音読結果の比較（最重要アルゴリズム）
// ========================================
function compareTextWithPassage() {
    console.log('=== 音読結果を比較中 ===');

    const questionData = app.questions[app.currentQuestionIndex];
    const originalText = questionData.passage.toLowerCase().replace(/[.,!?]/g, '');
    const recognizedTextCleaned = app.recognizedText.toLowerCase().replace(/[.,!?]/g, '');

    const originalWords = originalText.split(/\s+/).filter(w => w.length > 0);
    const recognizedWords = recognizedTextCleaned.split(/\s+/).filter(w => w.length > 0);
    const displayWords = questionData.passage.split(/\s+/).filter(w => w.length > 0);

    console.log('元の単語数:', originalWords.length);
    console.log('認識された単語数:', recognizedWords.length);

    // 動的計画法で最適なマッチングを計算
    const matchResult = findOptimalMatching(originalWords, recognizedWords);

    // マッチング結果から表示HTMLを生成
    let comparisonHTML = '';
    let incorrectCount = 0;
    let missingCount = 0;
    let selfCorrectedCount = 0;

    matchResult.matches.forEach((matchInfo, index) => {
        const displayWord = displayWords[index];

        if (matchInfo.type === 'exact' || matchInfo.type === 'similar') {
            comparisonHTML += `${displayWord} `;
        } else if (matchInfo.type === 'incorrect') {
            incorrectCount++;
            comparisonHTML += `<span class="word-incorrect">${displayWord}</span> `;
        } else if (matchInfo.type === 'missing') {
            missingCount++;
            comparisonHTML += `<span class="word-missing">${displayWord}</span> `;
        } else if (matchInfo.type === 'self-corrected') {
            selfCorrectedCount++;
            comparisonHTML += `<span class="word-self-corrected">${displayWord} ✓</span> `;
        }
    });

    elements.comparisonDisplay.innerHTML = comparisonHTML;

    // 精度計算（読み飛ばしを除外）
    const totalWords = originalWords.length;
    const actuallyReadWords = totalWords - missingCount;
    const correctlyRecognized = actuallyReadWords - incorrectCount;
    const accuracy = actuallyReadWords > 0 ? (correctlyRecognized / actuallyReadWords) * 100 : 0;

    console.log('総単語数:', totalWords);
    console.log('実際に読んだ単語数:', actuallyReadWords);
    console.log('正しく読めた単語数:', correctlyRecognized);
    console.log('不正解:', incorrectCount);
    console.log('読み飛ばし:', missingCount);
    console.log('自己修正:', selfCorrectedCount);
    console.log('精度:', accuracy.toFixed(1), '%');

    // フィードバック表示
    let feedbackText = '';
    let feedbackClass = '';

    if (accuracy >= 90) {
        feedbackText = `素晴らしい！ほぼ完璧に読めています。(精度: ${accuracy.toFixed(1)}%)`;
        feedbackClass = 'excellent';
    } else if (accuracy >= 70) {
        feedbackText = `良く読めています。さらに練習すれば完璧です。(精度: ${accuracy.toFixed(1)}%)`;
        feedbackClass = 'good';
    } else {
        feedbackText = `もう少し練習しましょう。(精度: ${accuracy.toFixed(1)}%)`;
        feedbackClass = 'needs-practice';
    }

    elements.recognitionFeedback.textContent = feedbackText;
    elements.recognitionFeedback.className = `recognition-feedback ${feedbackClass}`;
    elements.recognitionResult.classList.remove('hidden');

    console.log('✓ 音読結果の比較完了');
}

// ========================================
// 16. 動的計画法による最適マッチング
// ========================================
function findOptimalMatching(originalWords, recognizedWords) {
    const n = originalWords.length;
    const m = recognizedWords.length;

    // DPテーブル: dp[i][j] = 最初のi個の元単語と最初のj個の認識単語のマッチスコア
    const dp = Array(n + 1).fill(null).map(() => Array(m + 1).fill(0));

    // バックトラック用
    const parent = Array(n + 1).fill(null).map(() => Array(m + 1).fill(null));

    // 初期化: 元単語がすべて読み飛ばされた場合
    for (let i = 1; i <= n; i++) {
        dp[i][0] = i * -5; // 読み飛ばしペナルティ
        parent[i][0] = { type: 'skip', i: i - 1, j: 0 };
    }

    // DP計算
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= m; j++) {
            const matchScoreValue = getMatchScore(originalWords[i - 1], recognizedWords[j - 1]);

            // オプション1: マッチ
            const matchOption = dp[i - 1][j - 1] + matchScoreValue;

            // オプション2: 読み飛ばし
            const skipOption = dp[i - 1][j] - 5;

            // オプション3: 余分な単語（認識側）
            const extraOption = dp[i][j - 1] - 2;

            // 最大スコアを選択
            const maxScore = Math.max(matchOption, skipOption, extraOption);
            dp[i][j] = maxScore;

            if (maxScore === matchOption) {
                parent[i][j] = { type: 'match', i: i - 1, j: j - 1 };
            } else if (maxScore === skipOption) {
                parent[i][j] = { type: 'skip', i: i - 1, j: j };
            } else {
                parent[i][j] = { type: 'extra', i: i, j: j - 1 };
            }
        }
    }

    // バックトラック
    const matches = Array(n).fill(null).map(() => ({ type: 'missing', recognized: null }));
    let i = n;
    let j = m;

    while (i > 0 || j > 0) {
        const currentParent = parent[i][j];

        if (!currentParent) break;

        if (currentParent.type === 'match') {
            const scoreValue = getMatchScore(originalWords[i - 1], recognizedWords[j - 1]);
            const matchType = classifyMatch(originalWords[i - 1], recognizedWords[j - 1], scoreValue);
            matches[i - 1] = { type: matchType, recognized: recognizedWords[j - 1] };
            i = currentParent.i;
            j = currentParent.j;
        } else if (currentParent.type === 'skip') {
            matches[i - 1] = { type: 'missing', recognized: null };
            i = currentParent.i;
            j = currentParent.j;
        } else {
            // extra（余分な単語）は無視
            i = currentParent.i;
            j = currentParent.j;
        }
    }

    // 自己修正の検出
    detectSelfCorrections(originalWords, recognizedWords, matches);

    return {
        matches: matches,
        score: dp[n][m]
    };
}

// ========================================
// 17. マッチスコア計算
// ========================================
function getMatchScore(word1, word2) {
    if (word1 === word2) {
        return 10; // 完全一致
    }

    if (isSimilar(word1, word2)) {
        return 8; // 類似
    }

    // レーベンシュタイン距離を計算
    const distance = levenshteinDistance(word1, word2);
    const maxLength = Math.max(word1.length, word2.length);
    const similarity = 1 - (distance / maxLength);

    if (similarity > 0.7) {
        return 5; // やや類似
    } else if (similarity > 0.5) {
        return 2; // 少し類似
    } else {
        return -3; // 不一致
    }
}

// ========================================
// 18. マッチ分類
// ========================================
function classifyMatch(word1, word2, scoreValue) {
    if (word1 === word2) {
        return 'exact';
    }

    if (scoreValue >= 8) {
        return 'similar';
    } else if (scoreValue >= 2) {
        return 'incorrect';
    } else {
        return 'incorrect';
    }
}

// ========================================
// 19. 類似度判定
// ========================================
function isSimilar(word1, word2) {
    // 一般的な発音の揺れを許容
    const similarPairs = [
        ['color', 'colour'],
        ['center', 'centre'],
        ['traveled', 'travelled'],
        ['gray', 'grey']
    ];

    for (const pair of similarPairs) {
        if ((word1 === pair[0] && word2 === pair[1]) || (word1 === pair[1] && word2 === pair[0])) {
            return true;
        }
    }

    // レーベンシュタイン距離が1以下なら類似とみなす
    return levenshteinDistance(word1, word2) <= 1;
}

// ========================================
// 20. レーベンシュタイン距離
// ========================================
function levenshteinDistance(str1, str2) {
    const len1 = str1.length;
    const len2 = str2.length;

    const distanceMatrix = Array(len1 + 1).fill(null).map(() => Array(len2 + 1).fill(0));

    for (let i = 0; i <= len1; i++) {
        distanceMatrix[i][0] = i;
    }

    for (let j = 0; j <= len2; j++) {
        distanceMatrix[0][j] = j;
    }

    for (let i = 1; i <= len1; i++) {
        for (let j = 1; j <= len2; j++) {
            const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
            distanceMatrix[i][j] = Math.min(
                distanceMatrix[i - 1][j] + 1,      // 削除
                distanceMatrix[i][j - 1] + 1,      // 挿入
                distanceMatrix[i - 1][j - 1] + cost // 置換
            );
        }
    }

    return distanceMatrix[len1][len2];
}

// ========================================
// 21. 自己修正の検出
// ========================================
function detectSelfCorrections(originalWords, recognizedWords, matches) {
    // 認識履歴から同じ単語が複数回出現した場合、最後のものを採用
    const wordOccurrences = {};

    recognizedWords.forEach((word, index) => {
        if (!wordOccurrences[word]) {
            wordOccurrences[word] = [];
        }
        wordOccurrences[word].push(index);
    });

    // 自己修正の可能性がある単語を検出
    matches.forEach((matchInfo, index) => {
        const originalWord = originalWords[index];

        if (matchInfo.type === 'exact' && wordOccurrences[originalWord]) {
            // 同じ単語が複数回認識されている場合、自己修正とみなす
            if (wordOccurrences[originalWord].length > 1) {
                matchInfo.type = 'self-corrected';
            }
        }
    });
}

// ========================================
// 22. 解答処理
// ========================================
function handleAnswer(selectedIndex) {
    console.log('=== 解答処理開始 ===');

    // 音声認識を停止（まだ動いていれば）
    if (app.isRecording) {
        stopRecording();
    }

    const questionData = app.questions[app.currentQuestionIndex];
    const isCorrectAnswer = selectedIndex === questionData.correctAnswer;

    // 解答時刻を記録
    const answerEndTime = Date.now();

    // 音読時間計算
    const readingTimeMs = app.readingEndTime - app.readingStartTime;
    const readingTimeSec = readingTimeMs / 1000;

    // 解答時間計算
    const answerTimeMs = answerEndTime - app.answerStartTime;
    const answerTimeSec = answerTimeMs / 1000;

    // WPM計算
    const totalWords = questionData.passage.split(/\s+/).filter(w => w.length > 0).length;
    const readingTimeMin = readingTimeSec / 60;
    const wpm = totalWords / readingTimeMin;

    console.log('音読時間:', readingTimeSec.toFixed(2), '秒');
    console.log('解答時間:', answerTimeSec.toFixed(2), '秒');
    console.log('WPM:', wpm.toFixed(0));

    // 結果を保存
    app.results.push({
        questionNumber: app.currentQuestionIndex + 1,
        isCorrect: isCorrectAnswer,
        readingTime: readingTimeSec,
        answerTime: answerTimeSec,
        wpm: wpm,
        question: questionData.question,
        selectedAnswer: questionData.choices[selectedIndex],
        correctAnswer: questionData.choices[questionData.correctAnswer]
    });

    // フィードバック表示
    if (isCorrectAnswer) {
        elements.feedback.textContent = '⭕ 正解です！';
        elements.feedback.className = 'feedback correct';
    } else {
        elements.feedback.textContent = `❌ 不正解です。正解は「${questionData.choices[questionData.correctAnswer]}」です。`;
        elements.feedback.className = 'feedback incorrect';
    }
    elements.feedback.classList.remove('hidden');

    // 選択肢を無効化
    const allChoices = elements.choices.querySelectorAll('.choice');
    allChoices.forEach((choiceBtn, index) => {
        choiceBtn.disabled = true;
        if (index === questionData.correctAnswer) {
            choiceBtn.classList.add('correct');
        } else if (index === selectedIndex && !isCorrectAnswer) {
            choiceBtn.classList.add('incorrect');
        }
    });

    // 次の問題へ（2秒後）
    setTimeout(() => {
        if (app.currentQuestionIndex < app.totalQuestions - 1) {
            app.currentQuestionIndex++;
            displayQuestion();
        } else {
            // 全問終了
            showResults();
        }
    }, 2000);

    console.log('✓ 解答処理完了');
}

// ========================================
// 23. 結果表示
// ========================================
function showResults() {
    console.log('=== 結果表示 ===');

    // 画面切り替え
    showScreen('result');

    // スコア計算
    const correctAnswers = app.results.filter(r => r.isCorrect).length;
    const totalReadingTimeValue = app.results.reduce((sum, r) => sum + r.readingTime, 0);
    const totalAnswerTimeValue = app.results.reduce((sum, r) => sum + r.answerTime, 0);
    const avgReadingTimeValue = totalReadingTimeValue / app.totalQuestions;
    const avgAnswerTimeValue = totalAnswerTimeValue / app.totalQuestions;
    const avgWPMValue = app.results.reduce((sum, r) => sum + r.wpm, 0) / app.totalQuestions;

    // スコア表示
    elements.finalScore.textContent = `${correctAnswers}/${app.totalQuestions}`;
    elements.avgWPM.textContent = `${Math.round(avgWPMValue)} WPM`;

    // 詳細結果表示
    let detailsHTML = '';
    app.results.forEach((resultItem, index) => {
        const resultClass = resultItem.isCorrect ? 'correct' : 'incorrect';
        const resultIcon = resultItem.isCorrect ? '⭕' : '❌';

        detailsHTML += `
            <div class="result-item">
                <h4>問題 ${resultItem.questionNumber} ${resultIcon}</h4>
                <p><strong>問題:</strong> ${resultItem.question}</p>
                <p><strong>あなたの解答:</strong> ${resultItem.selectedAnswer}</p>
                <p><strong>正解:</strong> ${resultItem.correctAnswer}</p>
                <p class="wpm-display">${Math.round(resultItem.wpm)} WPM (音読時間: ${resultItem.readingTime.toFixed(1)}秒)</p>
            </div>
        `;
    });
    elements.resultDetails.innerHTML = detailsHTML;

    // スコアデータを作成
    const scoreData = {
        date: new Date().toISOString(),
        correctCount: correctAnswers,
        totalQuestions: app.totalQuestions,
        avgReadingTime: avgReadingTimeValue,
        avgAnswerTime: avgAnswerTimeValue,
        avgWPM: avgWPMValue,
        results: app.results
    };

    // スコアを保存
    saveScore(scoreData);

    // ユーザーID表示（カスタムIDがあればそれを表示、なければランダムID）
    const displayId = getDisplayUserId();
    const originalId = getUserId();
    const customId = getCustomUserId();

    if (customId) {
        elements.currentUserId.textContent = customId;
    } else {
        elements.currentUserId.textContent = originalId;
    }

    console.log('✓ 結果表示完了');
}

// ========================================
// 24. スコア保存
// ========================================
function saveScore(scoreData) {
    console.log('=== スコア保存開始 ===');

    try {
        const scores = JSON.parse(localStorage.getItem('scores') || '[]');
        scores.push(scoreData);
        localStorage.setItem('scores', JSON.stringify(scores));
        console.log('✓ ローカルストレージに保存しました');
    } catch (error) {
        console.error('ローカルストレージへの保存に失敗:', error);
    }

    // Firebase保存（非同期）
    if (elements.consentCheckbox.checked) {
        saveScoreToFirebase(scoreData);
    } else {
        console.log('データ収集に同意されていないため、Firebaseへの保存をスキップします');
    }
}

// ========================================
// 25. Firebase保存
// ========================================
async function saveScoreToFirebase(scoreData) {
    if (!firebaseInitialized) {
        console.warn('Firebaseが初期化されていません');
        return;
    }

    try {
        const dataToSave = {
            userId: getUserId(),              // 元のランダムID
            customUserId: getCustomUserId(),  // ユーザーが設定したカスタムID
            displayUserId: getDisplayUserId(), // 表示用ID（カスタムIDがあればそれ、なければランダムID）
            ...scoreData,
            browser: getBrowserInfo(),
            timestamp: new Date()
        };

        await window.firestoreAddDoc(
            window.firestoreCollection(db, 'userScores'),
            dataToSave
        );

        console.log('✓ Firebaseに保存しました');
    } catch (error) {
        console.error('Firebase保存エラー:', error);
    }
}

// ========================================
// 26. スコア取得
// ========================================
function getAllScores() {
    try {
        const scores = JSON.parse(localStorage.getItem('scores') || '[]');
        return scores;
    } catch (error) {
        console.error('スコアの取得に失敗:', error);
        return [];
    }
}

// ========================================
// 27. CSV出力
// ========================================
function exportScoresToCSV() {
    console.log('=== CSV出力開始 ===');

    const scores = getAllScores();

    if (scores.length === 0) {
        alert('エクスポートするスコアがありません。');
        return;
    }

    // CSVヘッダー
    let csvContent = '日時,正解数,問題数,正答率(%),平均音読時間(秒),平均解答時間(秒),平均WPM\n';

    // スコアデータ
    scores.forEach(scoreItem => {
        const scoreDate = new Date(scoreItem.date).toLocaleString('ja-JP');
        const accuracy = (scoreItem.correctCount / scoreItem.totalQuestions) * 100;

        csvContent += `${scoreDate},${scoreItem.correctCount},${scoreItem.totalQuestions},${accuracy.toFixed(1)},${scoreItem.avgReadingTime.toFixed(2)},${scoreItem.avgAnswerTime.toFixed(2)},${Math.round(scoreItem.avgWPM)}\n`;
    });

    // ファイルダウンロード
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `スコア_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log('✓ CSV出力完了');
}

// ========================================
// 28. 全履歴CSV出力
// ========================================
function exportAllScoresToCSV() {
    console.log('=== 全履歴CSV出力開始 ===');

    const scores = getAllScores();

    if (scores.length === 0) {
        alert('エクスポートするスコアがありません。');
        return;
    }

    // CSVヘッダー（詳細版）
    let csvContent = '日時,問題番号,正誤,音読時間(秒),解答時間(秒),WPM,問題文,選択した答え,正解\n';

    // 全スコアの全問題データ
    scores.forEach(scoreItem => {
        const scoreDate = new Date(scoreItem.date).toLocaleString('ja-JP');

        scoreItem.results.forEach(resultItem => {
            const correctStr = resultItem.isCorrect ? '正解' : '不正解';
            csvContent += `${scoreDate},${resultItem.questionNumber},${correctStr},${resultItem.readingTime.toFixed(2)},${resultItem.answerTime.toFixed(2)},${Math.round(resultItem.wpm)},"${resultItem.question}","${resultItem.selectedAnswer}","${resultItem.correctAnswer}"\n`;
        });
    });

    // ファイルダウンロード
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `全履歴_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log('✓ 全履歴CSV出力完了');
}

// ========================================
// 29. 履歴表示
// ========================================
function displayHistory() {
    console.log('=== 履歴表示 ===');

    showScreen('history');

    const scores = getAllScores();

    if (scores.length === 0) {
        elements.historyList.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">スコア履歴がありません。</p>';
        return;
    }

    // 新しい順にソート
    const sortedScores = [...scores].reverse();

    let historyHTML = '';
    sortedScores.forEach((scoreItem, index) => {
        const historyDate = new Date(scoreItem.date).toLocaleString('ja-JP');
        const accuracy = (scoreItem.correctCount / scoreItem.totalQuestions) * 100;

        historyHTML += `
            <div class="history-item">
                <div class="history-date">${historyDate}</div>
                <div class="history-scores">
                    <div class="history-score-item">
                        <strong>正解数</strong>
                        <span>${scoreItem.correctCount}/${scoreItem.totalQuestions}</span>
                    </div>
                    <div class="history-score-item">
                        <strong>正答率</strong>
                        <span>${accuracy.toFixed(0)}%</span>
                    </div>
                    <div class="history-score-item">
                        <strong>平均WPM</strong>
                        <span>${Math.round(scoreItem.avgWPM)}</span>
                    </div>
                </div>
            </div>
        `;
    });

    elements.historyList.innerHTML = historyHTML;

    console.log('✓ 履歴表示完了');
}

// ========================================
// 30. 推移グラフ表示
// ========================================
function displayProgressChart() {
    console.log('=== 推移グラフ表示 ===');

    showScreen('progress');

    const scores = getAllScores();

    if (scores.length === 0) {
        elements.progressChart.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">スコア履歴がありません。</p>';
        elements.progressStats.innerHTML = '';
        return;
    }

    // ユーザーID表示（カスタムIDがあればそれを表示）
    elements.userIdDisplay.textContent = `ユーザーID: ${getDisplayUserId()}`;

    // グラフデータ準備
    const chartData = scores.map((scoreItem, index) => {
        const accuracy = (scoreItem.correctCount / scoreItem.totalQuestions) * 100;
        const playDate = new Date(scoreItem.date).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' });

        return {
            date: playDate,
            accuracy: accuracy,
            wpm: scoreItem.avgWPM
        };
    });

    // 最大WPMを計算
    const maxWPMValue = Math.max(...chartData.map(d => d.wpm));

    // 正答率グラフ
    let accuracyChartHTML = '<div class="chart-item"><h3 class="chart-title">正答率の推移</h3><div class="chart-bars">';

    chartData.forEach(dataPoint => {
        let accuracyBarColor = '';
        if (dataPoint.accuracy >= 80) {
            accuracyBarColor = 'excellent';
        } else if (dataPoint.accuracy >= 60) {
            accuracyBarColor = 'good';
        } else {
            accuracyBarColor = 'needs-practice';
        }

        accuracyChartHTML += `
            <div class="chart-bar-wrapper">
                <div class="chart-label">${dataPoint.date}</div>
                <div class="chart-bar-container">
                    <div class="chart-bar ${accuracyBarColor}" style="width: ${dataPoint.accuracy}%">
                        ${dataPoint.accuracy.toFixed(0)}%
                    </div>
                </div>
            </div>
        `;
    });

    accuracyChartHTML += '</div></div>';

    // WPMグラフ
    let wpmChartHTML = '<div class="chart-item"><h3 class="chart-title">WPMの推移</h3><div class="chart-bars">';

    chartData.forEach(dataPoint => {
        const wpmWidthPercent = (dataPoint.wpm / maxWPMValue) * 100;
        let wpmBarColorClass = '';

        if (dataPoint.wpm >= 150) {
            wpmBarColorClass = 'excellent';
        } else if (dataPoint.wpm >= 100) {
            wpmBarColorClass = 'good';
        } else {
            wpmBarColorClass = 'needs-practice';
        }

        wpmChartHTML += `
            <div class="chart-bar-wrapper">
                <div class="chart-label">${dataPoint.date}</div>
                <div class="chart-bar-container">
                    <div class="chart-bar ${wpmBarColorClass}" style="width: ${wpmWidthPercent}%">
                        ${Math.round(dataPoint.wpm)} WPM
                    </div>
                </div>
            </div>
        `;
    });

    wpmChartHTML += '</div></div>';

    elements.progressChart.innerHTML = accuracyChartHTML + wpmChartHTML;

    // 統計情報
    const totalPlays = scores.length;
    const avgAccuracy = chartData.reduce((sum, d) => sum + d.accuracy, 0) / totalPlays;
    const avgWPMTotal = chartData.reduce((sum, d) => sum + d.wpm, 0) / totalPlays;
    const maxAccuracy = Math.max(...chartData.map(d => d.accuracy));
    const maxWPM = Math.max(...chartData.map(d => d.wpm));

    elements.progressStats.innerHTML = `
        <div class="stat-card">
            <h4>総プレイ回数</h4>
            <div class="stat-value">${totalPlays}</div>
            <div class="stat-label">回</div>
        </div>
        <div class="stat-card">
            <h4>平均正答率</h4>
            <div class="stat-value">${avgAccuracy.toFixed(0)}</div>
            <div class="stat-label">%</div>
        </div>
        <div class="stat-card">
            <h4>平均WPM</h4>
            <div class="stat-value">${Math.round(avgWPMTotal)}</div>
            <div class="stat-label">WPM</div>
        </div>
        <div class="stat-card">
            <h4>最高正答率</h4>
            <div class="stat-value">${maxAccuracy.toFixed(0)}</div>
            <div class="stat-label">%</div>
        </div>
        <div class="stat-card">
            <h4>最高WPM</h4>
            <div class="stat-value">${Math.round(maxWPM)}</div>
            <div class="stat-label">WPM</div>
        </div>
    `;

    console.log('✓ 推移グラフ表示完了');
}

// ========================================
// 31. 履歴削除
// ========================================
function clearHistory() {
    if (!confirm('本当にすべての履歴を削除しますか？この操作は取り消せません。')) {
        return;
    }

    localStorage.removeItem('scores');
    alert('履歴を削除しました。');
    displayHistory();
}

// ========================================
// 32. クイズリセット
// ========================================
function resetQuiz() {
    console.log('=== クイズリセット ===');

    // 状態をリセット
    app.currentQuestionIndex = 0;
    app.results = [];
    app.questions = [];
    app.readingStartTime = null;
    app.readingEndTime = null;
    app.answerStartTime = null;
    app.recognizedText = '';
    app.recognitionHistory = [];
    app.isRecording = false;

    // 音声認識を停止
    if (app.recognition && app.isRecording) {
        try {
            app.recognition.stop();
        } catch (error) {
            console.error('音声認識の停止でエラー:', error);
        }
    }

    // スタート画面に戻る
    showScreen('start');

    console.log('✓ クイズリセット完了');
}

// ========================================
// 33. カスタムユーザーID設定
// ========================================
function loadUserId() {
    const inputCustomId = elements.userIdInput.value.trim();

    if (!inputCustomId) {
        elements.userIdMessage.textContent = '❌ ユーザーIDを入力してください';
        elements.userIdMessage.style.color = '#dc3545';
        return;
    }

    // カスタムユーザーIDを設定
    const success = setCustomUserId(inputCustomId);

    if (success) {
        // 表示更新
        elements.currentUserId.textContent = inputCustomId;
        elements.userIdMessage.textContent = '✓ カスタムIDを設定しました';
        elements.userIdMessage.style.color = '#28a745';

        console.log('カスタムID設定:', inputCustomId);
        console.log('元のID:', getUserId());
    } else {
        elements.userIdMessage.textContent = '❌ IDの設定に失敗しました';
        elements.userIdMessage.style.color = '#dc3545';
    }
}

// ========================================
// 34. ユーザーIDコピー
// ========================================
function copyUserId() {
    const displayId = getDisplayUserId();

    navigator.clipboard.writeText(displayId).then(() => {
        elements.userIdMessage.textContent = '✓ ユーザーIDをコピーしました';
        elements.userIdMessage.style.color = '#28a745';

        setTimeout(() => {
            elements.userIdMessage.textContent = '';
        }, 3000);
    }).catch(error => {
        console.error('クリップボードへのコピーに失敗:', error);
        elements.userIdMessage.textContent = '❌ コピーに失敗しました';
        elements.userIdMessage.style.color = '#dc3545';
    });
}

// ========================================
// 35. DOM初期化
// ========================================
function initializeDOMElements() {
    console.log('=== DOM初期化開始 ===');
    console.log('APP_VERSION:', APP_VERSION);

    // DOM要素の取得
    elements = {
        // 画面
        startScreen: document.getElementById('start-screen'),
        questionScreen: document.getElementById('question-screen'),
        resultScreen: document.getElementById('result-screen'),
        historyScreen: document.getElementById('history-screen'),
        progressScreen: document.getElementById('progress-screen'),
        loading: document.getElementById('loading'),

        // スタート画面
        startBtn: document.getElementById('start-btn'),
        consentCheckbox: document.getElementById('consent-checkbox'),
        appVersion: document.getElementById('app-version'),

        // 問題画面
        progress: document.getElementById('progress'),
        questionNumber: document.getElementById('question-number'),
        timer: document.getElementById('timer'),
        startRecordingBtn: document.getElementById('start-recording-btn'),
        stopRecordingBtn: document.getElementById('stop-recording-btn'),
        readingInstruction: document.getElementById('reading-instruction'),
        passage: document.getElementById('passage'),
        questionText: document.getElementById('question-text'),
        choices: document.getElementById('choices'),
        recognitionStatus: document.getElementById('recognition-status'),
        recognitionText: document.getElementById('recognition-text'),
        recognizedText: document.getElementById('recognized-text'),
        recognitionResult: document.getElementById('recognition-result'),
        comparisonDisplay: document.getElementById('comparison-display'),
        recognitionFeedback: document.getElementById('recognition-feedback'),
        feedback: document.getElementById('feedback'),

        // 結果画面
        finalScore: document.getElementById('final-score'),
        avgWPM: document.getElementById('avg-wpm'),
        resultDetails: document.getElementById('result-details'),
        currentUserId: document.getElementById('current-user-id'),
        userIdInput: document.getElementById('user-id-input'),
        loadUserIdBtn: document.getElementById('load-user-id-btn'),
        copyUserIdBtn: document.getElementById('copy-user-id-btn'),
        userIdMessage: document.getElementById('user-id-message'),
        restartBtn: document.getElementById('restart-btn'),
        exportCsvBtn: document.getElementById('export-csv-btn'),
        viewHistoryBtn: document.getElementById('view-history-btn'),

        // 履歴画面
        historyList: document.getElementById('history-list'),
        backToStartBtn: document.getElementById('back-to-start-btn'),
        viewProgressBtn: document.getElementById('view-progress-btn'),
        exportAllBtn: document.getElementById('export-all-btn'),
        clearHistoryBtn: document.getElementById('clear-history-btn'),

        // 推移画面
        userIdDisplay: document.getElementById('user-id-display'),
        progressChart: document.getElementById('progress-chart'),
        progressStats: document.getElementById('progress-stats'),
        backToHistoryBtn: document.getElementById('back-to-history-btn')
    };

    // イベントリスナーの設定
    elements.startBtn.addEventListener('click', () => {
        console.log('>>> スタートボタンがクリックされました！');
        startQuiz();
    });

    elements.startRecordingBtn.addEventListener('click', startRecording);
    elements.stopRecordingBtn.addEventListener('click', stopRecording);

    elements.restartBtn.addEventListener('click', resetQuiz);
    elements.exportCsvBtn.addEventListener('click', exportScoresToCSV);
    elements.viewHistoryBtn.addEventListener('click', displayHistory);

    elements.backToStartBtn.addEventListener('click', () => showScreen('start'));
    elements.viewProgressBtn.addEventListener('click', displayProgressChart);
    elements.exportAllBtn.addEventListener('click', exportAllScoresToCSV);
    elements.clearHistoryBtn.addEventListener('click', clearHistory);

    elements.backToHistoryBtn.addEventListener('click', displayHistory);

    elements.loadUserIdBtn.addEventListener('click', loadUserId);
    elements.copyUserIdBtn.addEventListener('click', copyUserId);

    // バージョン表示
    if (elements.appVersion) {
        elements.appVersion.textContent = `バージョン: ${APP_VERSION}`;
        console.log('✓ バージョン表示:', APP_VERSION);
    }

    // Firebase初期化
    initializeFirebase();

    console.log('✓ DOM初期化完了');
}

// ========================================
// 36. アプリケーション起動
// ========================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeDOMElements);
} else {
    initializeDOMElements();
}

console.log('=== アプリケーション読み込み完了 ===');
