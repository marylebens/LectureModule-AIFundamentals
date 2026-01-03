// GitHub Lesson JavaScript
let currentSlide = 1;
const totalSlides = 23; // Updated from 19 to 23 (added 4 new quiz slides)

// Audio mapping for persistent player
const slideAudioMap = {
    1: './audio/slide1.mp3',    // Welcome
    2: './audio/slide2.mp3',    // What is GitHub
    4: './audio/slide4.mp3',    // Version Control
    11: './audio/slide7.mp3',   // Repositories (was slide 7)
    13: './audio/slide10.mp3',  // Branching - uses slide10.mp3
    15: './audio/slide11.mp3',  // Forking (was slide 11)
    17: './audio/slide13.mp3',  // Sharing (was slide 13)
    19: './audio/slide15.mp3',  // Tips for Success (was slide 15)
    21: './audio/slide18.mp3',  // Conclusion
    23: './audio/slide19.mp3'   // Credits
};

// Track visited slides for progress
let visitedSlides = new Set([1]); // Start with slide 1 as visited

// Persistent audio player element
let persistentAudio = null;

// Quiz answers
const quizAnswers = {
    q1: 'c', // Microsoft
    q2: 'b', // Track changes and collaborate safely
    q4: 'c', // To experiment without breaking main code
    q5: 'b', // Forking creates copy on GitHub; cloning downloads
    q6: 'true', // Can share private repo with instructor
    q7: 'b',  // Clear commit messages
    q8: 'c', // git add stages files
    q9: 'b', // git commit saves snapshot
    q10: 'a' // git push uploads to GitHub
};

// Matching quiz answers
const matchingAnswers = {
    match1: 'b', // Repository - folder containing project and history
    match2: 'a', // Commit - snapshot of project
    match3: 'c'  // Main branch - main development branch
};

// Ordering quiz answer (correct order for git workflow)
const correctOrder = ['stage', 'commit', 'push'];

// Track answered questions
const answeredQuestions = {
    q1: false,
    q2: false,
    q4: false,
    q5: false,
    q6: false,
    q7: false,
    q8: false,
    q9: false,
    q10: false,
    matching: false,
    ordering: false
};

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    updateSlideDisplay();
    updateProgressBar();
    setupQuizListeners();
    setupOrderingQuiz();
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

    // Scroll to top
    window.scrollTo(0, 0);
}

// Reset animations when a slide becomes active
function resetAnimations(slide) {
    // Reset commit animation
    const commitNodes = slide.querySelectorAll('.commit-node');
    const commitArrows = slide.querySelectorAll('.commit-arrow');
    
    commitNodes.forEach(function(node) {
        node.style.animation = 'none';
        setTimeout(function() {
            node.style.animation = '';
        }, 10);
    });
    
    commitArrows.forEach(function(arrow) {
        arrow.style.animation = 'none';
        setTimeout(function() {
            arrow.style.animation = '';
        }, 10);
    });
    
    // Reset branch animation
    const branchCommits = slide.querySelectorAll('.branch-commit');
    
    branchCommits.forEach(function(commit) {
        commit.style.animation = 'none';
        setTimeout(function() {
            commit.style.animation = '';
        }, 10);
    });
    
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
    if (currentSlide < 21 && currentStatus !== 'passed' && currentStatus !== 'failed' && currentStatus !== 'completed') {
        scorm.setIncomplete();
    }

    // Commit changes
    scorm.save();

    console.log(`Progress: ${progress}% (Slide ${currentSlide}/${totalSlides})`);
}

// Set up quiz question listeners
function setupQuizListeners() {
    const questions = ['q1', 'q2', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10'];
    
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

// Check matching answers
function checkMatching() {
    let allCorrect = true;
    let score = 0;
    
    for (let key in matchingAnswers) {
        const select = document.getElementById(key);
        const selectedValue = select.value;
        const correctValue = matchingAnswers[key];
        
        if (selectedValue === correctValue) {
            score++;
            select.style.borderColor = '#28a745';
            select.style.backgroundColor = '#d4edda';
        } else {
            allCorrect = false;
            select.style.borderColor = '#dc3545';
            select.style.backgroundColor = '#f8d7da';
        }
    }
    
    const feedbackDiv = document.getElementById('feedback-matching');
    
    if (allCorrect) {
        feedbackDiv.className = 'feedback correct';
        feedbackDiv.textContent = '✓ Perfect! All matches are correct!';
        answeredQuestions.matching = true;
    } else {
        feedbackDiv.className = 'feedback incorrect';
        feedbackDiv.textContent = `✗ You got ${score} out of 3 correct. Please try again.`;
        answeredQuestions.matching = false;
    }
}

// Setup drag and drop for ordering quiz
function setupOrderingQuiz() {
    const container = document.getElementById('orderingContainer');
    if (!container) return;
    
    let draggedElement = null;
    
    const items = container.querySelectorAll('.ordering-item');
    items.forEach(item => {
        item.addEventListener('dragstart', function(e) {
            draggedElement = this;
            this.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
        });
        
        item.addEventListener('dragend', function() {
            this.classList.remove('dragging');
        });
        
        item.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            
            const afterElement = getDragAfterElement(container, e.clientY);
            if (afterElement == null) {
                container.appendChild(draggedElement);
            } else {
                container.insertBefore(draggedElement, afterElement);
            }
        });
    });
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.ordering-item:not(.dragging)')];
    
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Check ordering quiz
function checkOrdering() {
    const container = document.getElementById('orderingContainer');
    const items = container.querySelectorAll('.ordering-item');
    const currentOrder = [];
    
    items.forEach(item => {
        currentOrder.push(item.dataset.step);
    });
    
    const feedbackDiv = document.getElementById('feedback-ordering');
    
    let isCorrect = true;
    for (let i = 0; i < correctOrder.length; i++) {
        if (currentOrder[i] !== correctOrder[i]) {
            isCorrect = false;
            break;
        }
    }
    
    if (isCorrect) {
        feedbackDiv.className = 'feedback correct';
        feedbackDiv.textContent = '✓ Perfect! You have the steps in the correct order!';
        answeredQuestions.ordering = true;
    } else {
        feedbackDiv.className = 'feedback incorrect';
        feedbackDiv.textContent = '✗ Not quite right. Think about the workflow: you prepare changes locally, save them, then share them with GitHub.';
        answeredQuestions.ordering = false;
    }
}

// Generate score report
function generateScoreReport() {
    let totalQuestions = 11; // 8 multiple choice + 1 matching + 1 ordering + 1 true/false
    let correctAnswers = 0;

    // Get display elements
    const resultsDiv = document.getElementById('scoreResults');
    const displayDiv = document.getElementById('scoreDisplay');
    const breakdownDiv = document.getElementById('scoreBreakdown');

    // Count answered questions
    const answeredCount = Object.keys(answeredQuestions).length;

    // Check if all questions have been answered
    if (answeredCount < totalQuestions) {
        resultsDiv.style.display = 'block';
        displayDiv.className = 'warning';
        displayDiv.innerHTML = `
            <p><strong>⚠️ Please Complete All Quiz Questions First</strong></p>
            <p>You have answered ${answeredCount} out of ${totalQuestions} questions.</p>
            <p>Please go back and answer all quiz questions before viewing your score report.</p>
            <p style="margin-top: 15px; font-size: 14px;">Quiz questions are located throughout the lesson. Use the navigation menu on the left and expand the topics to see all quiz questions.</p>
        `;
        breakdownDiv.innerHTML = '';
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

    // Display results
    resultsDiv.style.display = 'block';
    
    // Store score data for email/print
    window.scoreData = {
        correct: correctAnswers,
        total: totalQuestions,
        percentage: percentage,
        passed: passed,
        date: new Date().toLocaleDateString(),
        breakdown: answeredQuestions
    };
    
    // Score display
    if (passed) {
        displayDiv.className = 'pass';
        displayDiv.innerHTML = `<p>Congratulations! You passed!</p>
                                <p>Score: ${correctAnswers} out of ${totalQuestions} (${percentage}%)</p>
                                <p>Date: ${window.scoreData.date}</p>`;

        // Set score and status for D2L
        scorm.setScore(percentage, 0, 100);
        scorm.setPassed();  // Set status to "passed"
        scorm.save();       // Save AFTER setting all values
    } else {
        displayDiv.className = 'fail';
        displayDiv.innerHTML = `<p>You scored ${correctAnswers} out of ${totalQuestions} (${percentage}%)</p>
                                <p>You need at least 70% to pass. Please review the material and retake the quizzes.</p>
                                <p>Date: ${window.scoreData.date}</p>`;

        // Set score and status for D2L
        scorm.setScore(percentage, 0, 100);
        scorm.setFailed();  // Set status to "failed"
        scorm.save();       // Save AFTER setting all values
    }
    
    // Breakdown
    breakdownDiv.innerHTML = '<h3>Question Breakdown</h3>';
    
    const questionLabels = {
        q1: 'Question 1: What company owns GitHub?',
        q2: 'Question 2: Purpose of version control?',
        matching: 'Question 3: Match the terms',
        q4: 'Question 4: Why use branches?',
        q5: 'Question 5: Forking vs. cloning?',
        q6: 'Question 6: Share private repository?',
        ordering: 'Question 7: Order the Git workflow steps',
        q8: 'Question 8: What does git add do?',
        q9: 'Question 9: What does git commit do?',
        q10: 'Question 10: What does git push do?',
        q7: 'Question 11: Best commit message practice?'
    };
    
    for (let key in answeredQuestions) {
        const isCorrect = answeredQuestions[key];
        const itemClass = isCorrect ? 'correct' : 'incorrect';
        const icon = isCorrect ? '✓' : '✗';
        
        breakdownDiv.innerHTML += `
            <div class="score-item ${itemClass}">
                <span>${questionLabels[key]}</span>
                <span class="score-icon">${icon}</span>
            </div>
        `;
    }
    
    // Add action buttons
    breakdownDiv.innerHTML += `
        <div class="score-actions">
            <button onclick="printScoreReport()" class="print-button">🖨️ Print Score Report</button>
            <button onclick="showEmailModal()" class="email-button">📧 Email Score Report</button>
            ${passed ? '<button onclick="generateCertificate()" class="certificate-button">🎓 Download Certificate</button>' : ''}
        </div>
    `;

    // Scroll to results
    resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
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
        q1: 'Question 1: What company owns GitHub?',
        q2: 'Question 2: Purpose of version control?',
        matching: 'Question 3: Match the terms',
        q4: 'Question 4: Why use branches?',
        q5: 'Question 5: Forking vs. cloning?',
        q6: 'Question 6: Share private repository?',
        ordering: 'Question 7: Order the Git workflow steps',
        q8: 'Question 8: What does git add do?',
        q9: 'Question 9: What does git commit do?',
        q10: 'Question 10: What does git push do?',
        q7: 'Question 11: Best commit message practice?'
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
            <h2 style="color: #666;">Introduction to GitHub and Version Control</h2>
            <p style="color: #888; margin-bottom: 30px;">Minneapolis College</p>

            <div style="background: ${window.scoreData.passed ? '#d4edda' : '#f8d7da'}; padding: 20px; margin: 20px 0; border-radius: 8px; border: 2px solid ${window.scoreData.passed ? '#28a745' : '#dc3545'};">
                <h2 style="margin-top: 0; color: ${window.scoreData.passed ? '#155724' : '#721c24'};">
                    ${window.scoreData.passed ? '✓ PASSED' : '✗ NOT PASSED'}
                </h2>
                <p style="font-size: 18px; margin: 10px 0;"><strong>Score:</strong> ${window.scoreData.correct} out of ${window.scoreData.total} (${window.scoreData.percentage}%)</p>
                <p style="font-size: 14px; margin: 10px 0;"><strong>Date:</strong> ${window.scoreData.date}</p>
                <p style="font-size: 14px; margin: 10px 0;">${window.scoreData.passed ?
                    'Congratulations! You have successfully completed the GitHub lesson.' :
                    'You need at least 70% to pass. Please review the material and retake the quiz.'}</p>
            </div>

            <h3 style="color: #4a148c; margin-top: 30px;">Question Breakdown</h3>
            <div style="margin: 20px 0;">
                ${breakdownHTML}
            </div>

            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #888; font-size: 12px;">
                <p>This is an automated score report from the GitHub lesson SCORM package.</p>
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

// Show email modal
function showEmailModal() {
    const modal = document.getElementById('emailModal');
    modal.style.display = 'block';
    
    // Focus on email input
    document.getElementById('studentEmail').focus();
}

// Close email modal
function closeEmailModal() {
    const modal = document.getElementById('emailModal');
    modal.style.display = 'none';
    document.getElementById('studentEmail').value = '';
}

// Send email with score report
function sendScoreEmail() {
    const email = document.getElementById('studentEmail').value;
    
    if (!email || !email.includes('@')) {
        alert('Please enter a valid email address.');
        return;
    }
    
    const subject = 'GitHub Lesson Score Report';
    const body = `GitHub and Version Control Lesson - Score Report

Date: ${window.scoreData.date}
Score: ${window.scoreData.correct} out of ${window.scoreData.total} (${window.scoreData.percentage}%)
Result: ${window.scoreData.passed ? 'PASSED' : 'NOT PASSED'}

${window.scoreData.passed ? 
    'Congratulations! You have successfully completed the GitHub lesson.' :
    'You need at least 70% to pass. Please review the material and retake the quiz.'}

Course: Introduction to GitHub and Version Control
Institution: Minneapolis College

---
This is an automated message from the GitHub lesson SCORM package.`;
    
    // Create mailto link
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    // Close modal
    closeEmailModal();
    
    // Show confirmation
    alert(`An email draft has been created. Please send it from your email client to: ${email}`);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('emailModal');
    if (event.target === modal) {
        closeEmailModal();
    }
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

// Toggle audio playback
// Removed toggleAudio - replaced with persistent audio player (WCAG 2.1 AA compliant)


// ============================================
// CERTIFICATE GENERATION
// ============================================
function generateCertificate() {
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
    ctx.fillText('Introduction to GitHub and Version Control', 600, 220);

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
    link.download = 'GitHub-Certificate.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
}

// ============================================
// LIGHTBOX FUNCTIONALITY
// ============================================
function showLightbox(title, content) {
    const existing = document.querySelector('.lightbox');
    if (existing) existing.remove();

    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = '<div class="lightbox-content"><button class="close-lightbox">&times;</button><h3>' + title + '</h3><div>' + content + '</div></div>';
    document.body.appendChild(lightbox);

    lightbox.querySelector('.close-lightbox').onclick = function() {
        lightbox.remove();
    };
    lightbox.onclick = function(e) {
        if (e.target === lightbox) lightbox.remove();
    };
}

// ============================================
// VISITED SLIDES TRACKING
// ============================================
function markSlideAsVisited(slideNum) {
    visitedSlides.add(slideNum);
    const navItem = document.getElementById('nav-' + slideNum);
    if (navItem) navItem.classList.add('visited');
}
