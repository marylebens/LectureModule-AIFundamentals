// AI Fundamentals Lesson JavaScript
let currentSlide = 1;
const totalSlides = 32; // Total number of slides including all content, quizzes, score report, and credits

// Audio mapping for slides with audio narration
// Placeholders for all non-quiz slides (quiz slides don't have audio)
const slideAudioMap = {
    1: './audio/slide01.mp3',   // Welcome
    2: './audio/slide02.mp3',   // What is AI?
    3: './audio/slide03.mp3',   // AI Basics
    4: './audio/slide04.mp3',   // Types of AI Tools
    // Slides 5-6 are Quiz 1-2
    7: './audio/slide07.mp3',   // Microsoft Copilot Intro
    8: './audio/slide08.mp3',   // What is Copilot?
    9: './audio/slide09.mp3',   // How Copilot Helps
    10: './audio/slide10.mp3',  // Accessing Copilot
    11: './audio/slide11.mp3',  // Copilot Interface
    // Slides 12-13 are Quiz 3-4
    14: './audio/slide14.mp3',  // Using Copilot for Python
    15: './audio/slide15.mp3',  // First Conversation
    16: './audio/slide16.mp3',  // Try It Yourself #1
    17: './audio/slide17.mp3',  // Code Help: Variables
    18: './audio/slide18.mp3',  // Code Help: Print
    19: './audio/slide19.mp3',  // Code Help: Input
    20: './audio/slide20.mp3',  // Code Help: Math
    21: './audio/slide21.mp3',  // Writing Good Prompts
    // Slide 22 is Quiz 5
    23: './audio/slide23.mp3',  // Evaluating AI Output
    24: './audio/slide24.mp3',  // AI Isn't Perfect
    25: './audio/slide25.mp3',  // How to Check Code
    // Slide 26 is Quiz 6
    27: './audio/slide27.mp3',  // When to Use AI
    // Slide 28 is Quiz 7
    29: './audio/slide29.mp3',  // AI Ethics Intro
    30: './audio/slide30.mp3',  // Using AI Responsibly
    31: './audio/slide31.mp3',  // CHECK YOUR SYLLABUS!
    // Slide 32 is Quiz 8
    33: './audio/slide33.mp3',  // How to Cite AI
    // Slide 34 is Quiz 9
    35: './audio/slide35.mp3',  // Privacy and Security
    // Slide 36 is Quiz 10
    37: './audio/slide37.mp3',  // Practice & Application
    38: './audio/slide38.mp3',  // Try It Yourself #2
    // Slide 39 is Quiz 11
    40: './audio/slide40.mp3',  // Common Mistakes
    // Slide 41 is Quiz 12
    42: './audio/slide42.mp3',  // Summary
    43: './audio/slide43.mp3',  // Key Takeaways
    44: './audio/slide44.mp3',  // Resources
    45: './audio/slide45.mp3',  // Score Report
    46: './audio/slide46.mp3'   // Credits
};

// Track visited slides for progress
let visitedSlides = new Set([1]); // Start with slide 1 as visited

// Persistent audio player element
let persistentAudio = null;

// Quiz answers - All 12 quiz questions
const quizAnswers = {
    q1: 'b',   // Which is an example of AI? Answer: Voice assistant like Siri/Alexa
    q2: 'a',   // How does AI get better? Answer: By seeing lots of examples
    q3: 'b',   // What website for Copilot? Answer: copilot.microsoft.com
    q4: 'd',   // What account to login? Answer: StarID@go.minneapolis.edu
    q5: 'b',   // Better prompt? Answer: "Write Python code to print my name"
    q6: 'a',   // When you READ code, what are you checking? Answer: Do I understand what it does?
    q7: 'b',   // What to do with AI code? Answer: Read, test, understand it
    q8: 'c',   // Professional practice with AI code? Answer: Review, understand, test, validate
    q9: 'c',   // Never input to public AI? Answer: Company proprietary code or credentials
    q10: 'd',  // Never share with AI? Answer: Your password
    q11: 'c',  // Copilot code has error? Answer: Read code carefully to find mistake
    q12: 'a'   // Best way to use Copilot? Answer: Understand examples, then practice
};

// Track answered questions
const answeredQuestions = {
    q1: false,
    q2: false,
    q3: false,
    q4: false,
    q5: false,
    q6: false,
    q7: false,
    q8: false,
    q9: false,
    q10: false,
    q11: false,
    q12: false
};

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    updateSlideDisplay();
    updateProgressBar();
    setupQuizListeners();
    updateMenuHighlight();
    initializePersistentAudioPlayer();

    console.log("Lesson initialized");
});

// Initialize Persistent Audio Player
function initializePersistentAudioPlayer() {
    persistentAudio = document.getElementById('persistentAudio');

    // Update audio for current slide
    updateAudioForSlide(currentSlide);
}


// Update audio for slide change
function updateAudioForSlide(slideNum) {
    // Stop current audio
    if (persistentAudio && !persistentAudio.paused) {
        persistentAudio.pause();
        persistentAudio.currentTime = 0;
    }

    // Check if slide has audio
    if (slideAudioMap[slideNum]) {
        persistentAudio.src = slideAudioMap[slideNum];
        persistentAudio.load();
        // Show the audio player
        persistentAudio.style.display = 'block';
    } else {
        // No audio for this slide - hide the audio player
        persistentAudio.src = '';
        persistentAudio.style.display = 'none';
    }
}

// Go to specific slide
function goToSlide(slideNum) {
    const slides = document.querySelectorAll('.slide');

    if (slideNum < 1 || slideNum > totalSlides) return;

    // Hide current slide
    slides[currentSlide - 1].classList.remove('active');

    // Update slide number
    currentSlide = slideNum;

    // Show new slide
    slides[currentSlide - 1].classList.add('active');

    // Reset animations on the new slide
    resetAnimations(slides[currentSlide - 1]);

    // Update display
    updateSlideDisplay();
    updateProgressBar();
    updateMenuHighlight();

    // Update audio player for new slide
    if (persistentAudio) {
        updateAudioForSlide(slideNum);
    }

    // Mark slide as visited
    markSlideAsVisited(slideNum);

    // Track progress in SCORM
    trackProgress();

    // Generate score report when visiting slide 45
    if (slideNum === 31) {
        generateScoreReport();
    }

    // Scroll to top
    window.scrollTo(0, 0);
}

// Reset animations when a slide becomes active
function resetAnimations(slide) {
    // Reset credits scroll
    const creditsScroll = slide.querySelector('.credits-scroll');
    if (creditsScroll) {
        creditsScroll.style.animation = 'none';
        setTimeout(function() {
            creditsScroll.style.animation = '';
        }, 10);
    }
}

// Change slide
function changeSlide(direction) {
    const newSlide = currentSlide + direction;

    if (newSlide < 1 || newSlide > totalSlides) return;

    goToSlide(newSlide);
}

// Toggle submenu accordion
function toggleSubmenu(toggleIcon) {
    const parentLi = toggleIcon.closest('.has-submenu');
    const submenu = parentLi.querySelector('.submenu');

    // Toggle expanded class on both icon and submenu
    toggleIcon.classList.toggle('expanded');
    submenu.classList.toggle('expanded');
}

// Update slide indicator and button states
function updateSlideDisplay() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicator = document.getElementById('slideIndicator');

    // Update indicator
    indicator.textContent = `Slide ${currentSlide} of ${totalSlides}`;

    // Update button states
    prevBtn.disabled = (currentSlide === 1);
    nextBtn.disabled = (currentSlide === totalSlides);

    // Change button text on last slide
    if (currentSlide === totalSlides) {
        nextBtn.textContent = 'Finish';
    } else {
        nextBtn.textContent = 'Next →';
    }
}

// Update progress bar
function updateProgressBar() {
    const progressBar = document.getElementById('progressBar');
    const progress = (currentSlide / totalSlides) * 100;
    progressBar.style.width = progress + '%';
    progressBar.setAttribute('aria-valuenow', Math.round(progress));
}

// Update menu highlighting
function updateMenuHighlight() {
    // Remove active class from all menu items
    const menuItems = document.querySelectorAll('.sidebar-menu a');
    menuItems.forEach(item => item.classList.remove('active'));

    // Add active class to current menu item (only for content slides in menu)
    const currentMenuItem = document.getElementById('nav-' + currentSlide);
    if (currentMenuItem) {
        currentMenuItem.classList.add('active');
    }
}

// Track progress in SCORM
function trackProgress() {
    const progress = Math.round((currentSlide / totalSlides) * 100);

    // Set location (bookmark)
    scorm.set('cmi.core.lesson_location', currentSlide.toString());

    // Only set incomplete status if not already passed/failed
    // Don't override the final status once set
    const currentStatus = scorm.get('cmi.core.lesson_status');
    const scoreSlideNum = totalSlides - 1; // Typically score slide is second to last
    if (currentSlide < scoreSlideNum && currentStatus !== 'passed' && currentStatus !== 'failed' && currentStatus !== 'completed') {
        scorm.setIncomplete();
    }

    // Commit changes
    scorm.save();

    console.log(`Progress: ${progress}% (Slide ${currentSlide}/${totalSlides})`);
}

// Set up quiz question listeners
function setupQuizListeners() {
    // All 12 quiz questions
    const questions = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10', 'q11', 'q12'];

    questions.forEach(function(questionName) {
        const radios = document.getElementsByName(questionName);
        radios.forEach(function(radio) {
            radio.addEventListener('change', function() {
                checkAnswer(questionName, this.value);
            });
        });
    });
}

// Check individual answer
function checkAnswer(question, answer) {
    const feedbackDiv = document.getElementById('feedback-' + question);
    const correctAnswer = quizAnswers[question];

    if (answer === correctAnswer) {
        feedbackDiv.className = 'feedback correct';
        feedbackDiv.textContent = '✓ Correct!';
        answeredQuestions[question] = true;
    } else {
        feedbackDiv.className = 'feedback incorrect';
        feedbackDiv.textContent = '✗ Incorrect. Please try again.';
        answeredQuestions[question] = false;
    }
}

// Generate score report
function generateScoreReport() {
    let totalQuestions = 12; // Total quiz questions in AI Fundamentals lesson
    let correctAnswers = 0;

    // Get display elements
    const scoreDisplay = document.getElementById('scoreDisplay');
    const percentageDisplay = document.getElementById('percentageDisplay');
    const passFailDisplay = document.getElementById('passFailDisplay');
    const questionBreakdown = document.getElementById('questionBreakdown');

    // Count how many questions have been answered (not necessarily correctly)
    let answeredCount = 0;
    for (let key in answeredQuestions) {
        if (answeredQuestions[key] !== null && answeredQuestions[key] !== undefined) {
            answeredCount++;
        }
    }

    // Check if all questions have been answered
    if (answeredCount < totalQuestions) {
        scoreDisplay.textContent = '--/12';
        percentageDisplay.textContent = '--%';
        passFailDisplay.style.backgroundColor = '#fff3cd';
        passFailDisplay.style.borderColor = '#ffc107';
        passFailDisplay.innerHTML = `
            <strong>⚠️ Please Complete All Quiz Questions First</strong><br><br>
            You have answered ${answeredCount} out of ${totalQuestions} questions.<br><br>
            Please go back and answer all quiz questions before viewing your score report.<br><br>
            <small>Quiz questions are located throughout the lesson. Use the navigation menu on the left and expand the topics to see all quiz questions.</small>
        `;
        questionBreakdown.innerHTML = '';
        return;
    }

    // Count correct answers
    for (let key in answeredQuestions) {
        if (answeredQuestions[key] === true) {
            correctAnswers++;
        }
    }

    // Calculate percentage
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);
    const passed = percentage >= 70;

    console.log(`Quiz Score: ${correctAnswers}/${totalQuestions} = ${percentage}%`);
    console.log(`Pass Status: ${passed}`);

    // Store score data for email/print/certificate
    window.scoreData = {
        correct: correctAnswers,
        total: totalQuestions,
        percentage: percentage,
        passed: passed,
        date: new Date().toLocaleDateString(),
        breakdown: answeredQuestions
    };

    // Update score display
    scoreDisplay.textContent = `${correctAnswers}/12`;
    percentageDisplay.textContent = `${percentage}%`;

    // Update pass/fail display
    const certificateButton = document.getElementById('certificateButton');
    if (passed) {
        passFailDisplay.style.backgroundColor = '#d4edda';
        passFailDisplay.style.borderColor = '#28a745';
        passFailDisplay.style.color = '#155724';
        passFailDisplay.innerHTML = `
            <strong>✓ PASSED</strong><br><br>
            Congratulations! You have successfully completed the lesson.<br>
            Date: ${window.scoreData.date}
        `;

        // Show certificate button
        if (certificateButton) {
            certificateButton.style.display = 'inline-block';
        }

        // Set score and status for SCORM
        scorm.setScore(percentage, 0, 100);
        scorm.setPassed();
        scorm.save();
    } else {
        passFailDisplay.style.backgroundColor = '#f8d7da';
        passFailDisplay.style.borderColor = '#dc3545';
        passFailDisplay.style.color = '#721c24';
        passFailDisplay.innerHTML = `
            <strong>✗ NOT PASSED</strong><br><br>
            You need at least 70% to pass. Please review the material and retake the quizzes.<br>
            Date: ${window.scoreData.date}
        `;

        // Hide certificate button
        if (certificateButton) {
            certificateButton.style.display = 'none';
        }

        // Set score and status for SCORM
        scorm.setScore(percentage, 0, 100);
        scorm.setFailed();
        scorm.save();
    }

    // Build question breakdown
    const questionLabels = {
        q1: 'Question 1: Example of AI',
        q2: 'Question 2: How AI learns',
        q3: 'Question 3: Copilot website',
        q4: 'Question 4: Login account',
        q5: 'Question 5: Better prompt',
        q6: 'Question 6: Checking code',
        q7: 'Question 7: Using AI-generated code',
        q8: 'Question 8: AI policy uncertainty',
        q9: 'Question 9: Citing AI assistance',
        q10: 'Question 10: Privacy and security',
        q11: 'Question 11: Code with errors',
        q12: 'Question 12: Best way to use Copilot'
    };

    questionBreakdown.innerHTML = '';
    for (let key in answeredQuestions) {
        const isCorrect = answeredQuestions[key];
        const icon = isCorrect ? '✓' : '✗';
        const color = isCorrect ? '#28a745' : '#dc3545';
        const bgColor = isCorrect ? '#d4edda' : '#f8d7da';

        questionBreakdown.innerHTML += `
            <div style="padding: 10px; margin: 5px 0; background-color: ${bgColor}; border-left: 4px solid ${color}; border-radius: 4px;">
                <strong>${questionLabels[key]}:</strong> <span style="color: ${color};">${icon} ${isCorrect ? 'Correct' : 'Incorrect'}</span>
            </div>
        `;
    }

    console.log(`Quiz completed: ${correctAnswers}/${totalQuestions} (${percentage}%)`);
}

// Print score report
function printScoreReport() {
    // Remove any existing printable report
    const existingReport = document.getElementById('printableScoreReport');
    if (existingReport) {
        existingReport.remove();
    }

    // Question labels for breakdown
    const questionLabels = {
        q1: 'Question 1: Example of AI',
        q2: 'Question 2: How AI learns',
        q3: 'Question 3: Copilot website',
        q4: 'Question 4: Login account',
        q5: 'Question 5: Better prompt',
        q6: 'Question 6: Checking code',
        q7: 'Question 7: Using AI-generated code',
        q8: 'Question 8: AI policy uncertainty',
        q9: 'Question 9: Citing AI assistance',
        q10: 'Question 10: Privacy and security',
        q11: 'Question 11: Code with errors',
        q12: 'Question 12: Best way to use Copilot'
    };

    // Build breakdown HTML
    let breakdownHTML = '';
    for (let key in window.scoreData.breakdown) {
        const isCorrect = window.scoreData.breakdown[key];
        const icon = isCorrect ? '✓ Correct' : '✗ Incorrect';
        breakdownHTML += `<div style="padding: 8px; margin: 4px 0; background: ${isCorrect ? '#d4edda' : '#f8d7da'}; border-left: 4px solid ${isCorrect ? '#28a745' : '#dc3545'};">
            <strong>${questionLabels[key]}:</strong> ${icon}
        </div>`;
    }

    // Create printable report
    const printableDiv = document.createElement('div');
    printableDiv.id = 'printableScoreReport';
    printableDiv.innerHTML = `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
            <h1 style="color: #4a148c; border-bottom: 3px solid #4a148c; padding-bottom: 10px;">Score Report</h1>
            <h2 style="color: #666;">AI Fundamentals: Using Microsoft Copilot for Python</h2>
            <p style="color: #888; margin-bottom: 30px;">Minnesota State</p>

            <div style="background: ${window.scoreData.passed ? '#d4edda' : '#f8d7da'}; padding: 20px; margin: 20px 0; border-radius: 8px; border: 2px solid ${window.scoreData.passed ? '#28a745' : '#dc3545'};">
                <h2 style="margin-top: 0; color: ${window.scoreData.passed ? '#155724' : '#721c24'};">
                    ${window.scoreData.passed ? '✓ PASSED' : '✗ NOT PASSED'}
                </h2>
                <p style="font-size: 18px; margin: 10px 0;"><strong>Score:</strong> ${window.scoreData.correct} out of ${window.scoreData.total} (${window.scoreData.percentage}%)</p>
                <p style="font-size: 14px; margin: 10px 0;"><strong>Date:</strong> ${window.scoreData.date}</p>
                <p style="font-size: 14px; margin: 10px 0;">${window.scoreData.passed ?
                    'Congratulations! You have successfully completed the lesson.' :
                    'You need at least 70% to pass. Please review the material and retake the quiz.'}</p>
            </div>

            <h3 style="color: #4a148c; margin-top: 30px;">Question Breakdown</h3>
            <div style="margin: 20px 0;">
                ${breakdownHTML}
            </div>

            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #888; font-size: 12px;">
                <p>This is an automated score report from the lesson SCORM package.</p>
            </div>
        </div>
    `;

    // Add to body
    document.body.appendChild(printableDiv);

    // Print
    window.print();

    // Remove after printing
    setTimeout(() => {
        printableDiv.remove();
    }, 1000);
}

// Email score report
function emailScoreReport() {
    if (!window.scoreData) {
        alert('Please complete all quiz questions first to generate your score report.');
        return;
    }

    // Prompt for email address
    const email = prompt('Enter your email address to receive the score report:');

    if (!email || !email.includes('@')) {
        if (email !== null) {
            alert('Please enter a valid email address.');
        }
        return;
    }

    const subject = 'AI Fundamentals: Using Microsoft Copilot for Python - Score Report';
    const body = `AI Fundamentals: Using Microsoft Copilot for Python - Score Report

Date: ${window.scoreData.date}
Score: ${window.scoreData.correct} out of ${window.scoreData.total} (${window.scoreData.percentage}%)
Result: ${window.scoreData.passed ? 'PASSED' : 'NOT PASSED'}

${window.scoreData.passed ?
    'Congratulations! You have successfully completed the lesson.' :
    'You need at least 70% to pass. Please review the material and retake the quiz.'}

Course: Introduction to Python Programming
Institution: Minnesota State

---
This is an automated message from the lesson SCORM package.`;

    // Create mailto link
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Open email client
    window.location.href = mailtoLink;

    // Show confirmation
    alert(`An email draft has been created. Please send it from your email client to: ${email}`);
}

// Resume from bookmark if available
window.addEventListener('load', function() {
    const bookmark = scorm.get('cmi.core.lesson_location');

    if (bookmark && bookmark !== '') {
        const savedSlide = parseInt(bookmark);
        if (savedSlide > 1 && savedSlide <= totalSlides) {
            // Ask user if they want to resume
            const resume = confirm(`You previously left off at slide ${savedSlide}. Would you like to continue from there?`);
            if (resume) {
                goToSlide(savedSlide);
            }
        }
    }
});

// ============================================
// CERTIFICATE GENERATION
// ============================================
function printCertificate() {
    if (!window.scoreData || window.scoreData.percentage < 70) {
        alert('You must pass the quiz with 70% or higher to generate a certificate.');
        return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 1200, 800);

    // Border
    ctx.strokeStyle = '#7c3aed';
    ctx.lineWidth = 15;
    ctx.strokeRect(30, 30, 1140, 740);

    // Inner border
    ctx.strokeStyle = '#2d3748';
    ctx.lineWidth = 3;
    ctx.strokeRect(50, 50, 1100, 700);

    // Title
    ctx.fillStyle = '#2d3748';
    ctx.font = 'bold 60px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Certificate of Completion', 600, 150);

    // Subtitle
    ctx.font = '32px Arial';
    ctx.fillStyle = '#4a5568';
    ctx.fillText('AI Fundamentals: Using Microsoft Copilot for Python', 600, 220);

    // Student name
    if (!window.studentName) {
        window.studentName = prompt('Enter your name for the certificate:', '');
        if (!window.studentName) return;
    }
    ctx.font = 'bold 48px Arial';
    ctx.fillStyle = '#7c3aed';
    ctx.fillText(window.studentName, 600, 350);

    // Details
    ctx.font = '22px Arial';
    ctx.fillStyle = '#4a5568';
    ctx.fillText('Score: ' + window.scoreData.percentage + '%', 600, 450);
    ctx.fillText('Date: ' + window.scoreData.date, 600, 490);

    // Download
    const link = document.createElement('a');
    link.download = 'AI-Fundamentals-Certificate.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
}

// ============================================
// VISITED SLIDES TRACKING
// ============================================
function markSlideAsVisited(slideNum) {
    visitedSlides.add(slideNum);
    const navItem = document.getElementById('nav-' + slideNum);
    if (navItem) navItem.classList.add('visited');
}

// ============================================
// INTERACTIVE ELEMENTS
// ============================================

// Accordion functionality
function toggleAccordion(element) {
    element.classList.toggle('active');
    const content = element.nextElementSibling;
    content.classList.toggle('active');
}

// Flip card functionality (for mobile/touch devices)
function toggleFlipCard(card) {
    card.classList.toggle('flipped');
}

// Initialize interactive elements when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Set up accordion click handlers
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            toggleAccordion(this);
        });
    });

    // Set up flip card click handlers for mobile
    const flipCards = document.querySelectorAll('.flip-card');
    flipCards.forEach(card => {
        card.addEventListener('click', function() {
            toggleFlipCard(this);
        });
    });
});
