// MathMaster - Interactive Math Learning Website
// Global variables
let currentProblem = null;
let currentDifficulty = 'easy';
let problemsSolved = 0;
let correctAnswers = 0;
let currentStreak = 0;
let lessonsCompleted = 0;
let userProgress = {};
let recentActivity = [];

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Main initialization function
function initializeApp() {
    setupNavigation();
    setupDifficultySelector();
    loadUserProgress();
    generateNewProblem();
    updateStats();
    loadLessons();
    setupProgressChart();
}

// Navigation functionality
function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');

    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const sectionName = this.getAttribute('data-section');

            // Update active nav button
            navButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Show selected section
            showSection(sectionName);
        });
    });
}

// Show selected section and hide others
function showSection(sectionName) {
    const sections = document.querySelectorAll('.section');

    sections.forEach(section => {
        section.classList.remove('active');
    });

    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');

        // Generate new problem if switching to practice section
        if (sectionName === 'practice') {
            generateNewProblem();
        }
    }
}

// Difficulty selector functionality
function setupDifficultySelector() {
    const difficultyButtons = document.querySelectorAll('.difficulty-btn');

    difficultyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const difficulty = this.getAttribute('data-difficulty');

            // Update active difficulty button
            difficultyButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Update current difficulty and generate new problem
            currentDifficulty = difficulty;
            generateNewProblem();
        });
    });
}

// Math problem generation based on difficulty
function generateNewProblem() {
    const problemDisplay = document.getElementById('problem-display');
    const feedback = document.getElementById('feedback');
    const userAnswer = document.getElementById('user-answer');

    // Clear previous feedback and input
    feedback.textContent = '';
    userAnswer.value = '';

    let num1, num2, operation, answer, problemText;

    switch (currentDifficulty) {
        case 'easy':
            num1 = Math.floor(Math.random() * 10) + 1;
            num2 = Math.floor(Math.random() * 10) + 1;
            break;
        case 'medium':
            num1 = Math.floor(Math.random() * 50) + 10;
            num2 = Math.floor(Math.random() * 20) + 5;
            break;
        case 'hard':
            num1 = Math.floor(Math.random() * 100) + 20;
            num2 = Math.floor(Math.random() * 50) + 10;
            break;
    }

    // Randomly select operation
    const operations = ['+', '-', '×', '÷'];
    const randomOp = operations[Math.floor(Math.random() * operations.length)];

    switch (randomOp) {
        case '+':
            answer = num1 + num2;
            problemText = `${num1} + ${num2}`;
            break;
        case '-':
            // Ensure positive result for subtraction
            if (num1 < num2) {
                [num1, num2] = [num2, num1];
            }
            answer = num1 - num2;
            problemText = `${num1} - ${num2}`;
            break;
        case '×':
            answer = num1 * num2;
            problemText = `${num1} × ${num2}`;
            break;
        case '÷':
            // Ensure clean division
            num1 = num2 * Math.floor(Math.random() * 10 + 1);
            answer = num1 / num2;
            problemText = `${num1} ÷ ${num2}`;
            break;
    }

    currentProblem = {
        num1: num1,
        num2: num2,
        operation: randomOp,
        answer: Math.round(answer * 100) / 100, // Round to 2 decimal places for division
        problemText: problemText
    };

    problemDisplay.textContent = problemText;
    userAnswer.focus();
}

// Check user's answer
function checkAnswer() {
    const userAnswer = document.getElementById('user-answer');
    const feedback = document.getElementById('feedback');

    if (!userAnswer.value || !currentProblem) {
        feedback.textContent = 'Please enter an answer!';
        feedback.className = 'feedback incorrect';
        return;
    }

    const userAnswerNum = parseFloat(userAnswer.value);
    const correctAnswer = currentProblem.answer;

    // Check if answer is correct (with small tolerance for floating point)
    const isCorrect = Math.abs(userAnswerNum - correctAnswer) < 0.01;

    if (isCorrect) {
        feedback.textContent = '🎉 Correct! Well done!';
        feedback.className = 'feedback correct';
        handleCorrectAnswer();
    } else {
        feedback.textContent = `❌ Incorrect. The correct answer is ${correctAnswer}`;
        feedback.className = 'feedback incorrect';
        handleIncorrectAnswer();
    }

    // Generate new problem after a delay
    setTimeout(() => {
        generateNewProblem();
    }, 2000);

    // Update progress
    updateProgress();
}

// Handle correct answer
function handleCorrectAnswer() {
    problemsSolved++;
    correctAnswers++;
    currentStreak++;

    // Add to recent activity
    addToRecentActivity(`✅ Solved: ${currentProblem.problemText} = ${currentProblem.answer}`, true);

    // Check for streak milestones
    if (currentStreak % 10 === 0) {
        showNotification(`🔥 Amazing! ${currentStreak} problem streak!`);
    }

    // Random encouragement
    const encouragements = [
        "Great job!",
        "You're on fire!",
        "Excellent work!",
        "Keep it up!",
        "Fantastic!",
        "You're a math star!"
    ];

    setTimeout(() => {
        feedback.textContent = encouragements[Math.floor(Math.random() * encouragements.length)];
    }, 1000);
}

// Handle incorrect answer
function handleIncorrectAnswer() {
    currentStreak = 0;
    addToRecentActivity(`❌ Missed: ${currentProblem.problemText} = ${currentProblem.answer}`, false);
}

// Update statistics display
function updateStats() {
    const accuracy = problemsSolved > 0 ? Math.round((correctAnswers / problemsSolved) * 100) : 0;

    document.getElementById('problems-solved').textContent = problemsSolved;
    document.getElementById('accuracy-rate').textContent = `${accuracy}%`;
    document.getElementById('current-streak').textContent = currentStreak;
    document.getElementById('lessons-completed').textContent = lessonsCompleted;
}

// Add activity to recent activity list
function addToRecentActivity(activity, isCorrect) {
    const activityList = document.getElementById('recent-activity');

    recentActivity.unshift({
        text: activity,
        timestamp: new Date(),
        isCorrect: isCorrect
    });

    // Keep only last 10 activities
    if (recentActivity.length > 10) {
        recentActivity = recentActivity.slice(0, 10);
    }

    // Update activity display
    activityList.innerHTML = '';

    recentActivity.forEach(activity => {
        const activityItem = document.createElement('div');
        activityItem.className = `activity-item ${activity.isCorrect ? 'correct' : 'incorrect'}`;
        activityItem.textContent = activity.text;
        activityList.appendChild(activityItem);
    });
}

// Load lessons
function loadLessons() {
    const lessonsContainer = document.getElementById('lessons-container');

    const lessons = [
        {
            id: 'addition-basics',
            title: 'Addition Basics',
            description: 'Learn the fundamentals of addition with single and double-digit numbers.',
            icon: '➕',
            difficulty: 'easy',
            completed: false,
            progress: 0
        },
        {
            id: 'subtraction-basics',
            title: 'Subtraction Basics',
            description: 'Master subtraction concepts and solve simple subtraction problems.',
            icon: '➖',
            difficulty: 'easy',
            completed: false,
            progress: 0
        },
        {
            id: 'multiplication-intro',
            title: 'Multiplication Introduction',
            description: 'Discover the magic of multiplication and repeated addition.',
            icon: '✖️',
            difficulty: 'medium',
            completed: false,
            progress: 0
        },
        {
            id: 'division-basics',
            title: 'Division Basics',
            description: 'Learn how to divide numbers and understand sharing concepts.',
            icon: '➗',
            difficulty: 'medium',
            completed: false,
            progress: 0
        },
        {
            id: 'mixed-operations',
            title: 'Mixed Operations',
            description: 'Practice combining addition, subtraction, multiplication, and division.',
            icon: '🔢',
            difficulty: 'hard',
            completed: false,
            progress: 0
        },
        {
            id: 'word-problems',
            title: 'Word Problems',
            description: 'Apply math skills to real-world scenarios and story problems.',
            icon: '📚',
            difficulty: 'hard',
            completed: false,
            progress: 0
        }
    ];

    lessonsContainer.innerHTML = '';

    lessons.forEach((lesson, index) => {
        const lessonCard = document.createElement('div');
        lessonCard.className = `lesson-card ${lesson.completed ? 'completed' : ''}`;
        lessonCard.onclick = () => startLesson(lesson.id);

        lessonCard.innerHTML = `
            <div class="lesson-icon">${lesson.icon}</div>
            <div class="lesson-title">${lesson.title}</div>
            <div class="lesson-description">${lesson.description}</div>
            <div class="lesson-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${lesson.progress}%"></div>
                </div>
                <span class="difficulty-badge ${lesson.difficulty}">${lesson.difficulty}</span>
            </div>
        `;

        lessonsContainer.appendChild(lessonCard);
    });
}

// Start a lesson
function startLesson(lessonId) {
    // For now, just switch to practice mode with lesson-specific problems
    showSection('practice');
    showNotification(`Starting lesson: ${lessonId.replace('-', ' ').toUpperCase()}`);

    // Could implement lesson-specific problem generation here
    generateNewProblem();
}

// Update user progress
function updateProgress() {
    // Save to localStorage
    const progress = {
        problemsSolved: problemsSolved,
        correctAnswers: correctAnswers,
        currentStreak: currentStreak,
        lessonsCompleted: lessonsCompleted,
        lastPlayed: new Date().toISOString(),
        recentActivity: recentActivity
    };

    localStorage.setItem('mathMasterProgress', JSON.stringify(progress));
    updateStats();
}

// Load user progress from localStorage
function loadUserProgress() {
    const savedProgress = localStorage.getItem('mathMasterProgress');

    if (savedProgress) {
        const progress = JSON.parse(savedProgress);

        problemsSolved = progress.problemsSolved || 0;
        correctAnswers = progress.correctAnswers || 0;
        currentStreak = progress.currentStreak || 0;
        lessonsCompleted = progress.lessonsCompleted || 0;
        recentActivity = progress.recentActivity || [];

        // Update activity display
        const activityList = document.getElementById('recent-activity');
        activityList.innerHTML = '';

        recentActivity.forEach(activity => {
            const activityItem = document.createElement('div');
            activityItem.className = `activity-item ${activity.isCorrect ? 'correct' : 'incorrect'}`;
            activityItem.textContent = activity.text;
            activityList.appendChild(activityItem);
        });
    }
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #667eea;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        animation: slideInRight 0.3s ease;
        font-weight: 500;
    `;

    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Setup progress chart (enhanced implementation)
function setupProgressChart() {
    const canvas = document.getElementById('progress-chart');
    const ctx = canvas.getContext('2d');

    // Enhanced progress visualization with animations
    function drawProgressChart() {
        const accuracy = problemsSolved > 0 ? (correctAnswers / problemsSolved) * 100 : 0;
        const problemsToday = getProblemsSolvedToday();
        const avgAccuracy = calculateAverageAccuracy();

        // Clear canvas with fade effect
        ctx.globalAlpha = 0.1;
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1;

        // Draw outer ring (total problems)
        ctx.beginPath();
        ctx.arc(150, 150, 120, 0, 2 * Math.PI);
        ctx.strokeStyle = 'rgba(102, 126, 234, 0.2)';
        ctx.lineWidth = 8;
        ctx.stroke();

        // Draw progress arc (accuracy)
        const progressAngle = (accuracy / 100) * 2 * Math.PI;
        ctx.beginPath();
        ctx.arc(150, 150, 120, -Math.PI/2, -Math.PI/2 + progressAngle);
        ctx.strokeStyle = '#667eea';
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Draw inner ring (streak)
        const streakAngle = Math.min(currentStreak / 20, 1) * 2 * Math.PI; // Max 20 streak
        ctx.beginPath();
        ctx.arc(150, 150, 80, -Math.PI/2, -Math.PI/2 + streakAngle);
        ctx.strokeStyle = '#27ae60';
        ctx.lineWidth = 12;
        ctx.stroke();

        // Draw center statistics
        ctx.fillStyle = '#2c3e50';
        ctx.font = 'bold 20px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(`${Math.round(accuracy)}%`, 150, 135);

        ctx.font = '14px Inter';
        ctx.fillText('Accuracy', 150, 155);

        ctx.font = 'bold 16px Inter';
        ctx.fillText(`🔥 ${currentStreak}`, 150, 180);

        // Add some decorative elements
        if (accuracy >= 80) {
            ctx.font = '20px Inter';
            ctx.fillText('⭐', 150, 200);
        }
    }

    drawProgressChart();

    // Redraw chart when progress updates
    setInterval(drawProgressChart, 3000);
}

// Helper functions for enhanced progress tracking
function getProblemsSolvedToday() {
    const today = new Date().toDateString();
    return recentActivity.filter(activity => {
        const activityDate = new Date(activity.timestamp).toDateString();
        return activityDate === today;
    }).length;
}

function calculateAverageAccuracy() {
    if (recentActivity.length === 0) return 0;

    const correctAnswers = recentActivity.filter(a => a.isCorrect).length;
    return (correctAnswers / recentActivity.length) * 100;
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Enter key to submit answer in practice mode
    if (e.key === 'Enter' && document.getElementById('practice').classList.contains('active')) {
        checkAnswer();
    }

    // Number keys for quick navigation
    if (e.key >= '1' && e.key <= '4') {
        const sections = ['home', 'lessons', 'practice', 'progress'];
        const sectionIndex = parseInt(e.key) - 1;
        if (sections[sectionIndex]) {
            showSection(sections[sectionIndex]);
        }
    }
});

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }

    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }

    .difficulty-badge {
        padding: 0.25rem 0.75rem;
        border-radius: 15px;
        font-size: 0.8rem;
        font-weight: 600;
        text-transform: uppercase;
    }

    .difficulty-badge.easy {
        background: #d4edda;
        color: #155724;
    }

    .difficulty-badge.medium {
        background: #fff3cd;
        color: #856404;
    }

    .difficulty-badge.hard {
        background: #f8d7da;
        color: #721c24;
    }
`;
document.head.appendChild(style);
