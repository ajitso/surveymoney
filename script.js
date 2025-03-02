document.addEventListener('DOMContentLoaded', function() {
    // App State
    const appState = {
        isLoggedIn: false,
        currentUser: null,
        surveys: [],
        transactions: []
    };

    // DOM Elements
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('main > section');
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const authButtons = document.querySelector('.auth-buttons');
    const userProfile = document.querySelector('.user-profile');
    const getStartedBtn = document.getElementById('getStartedBtn');
    const surveyLoginBtn = document.getElementById('surveyLoginBtn');
    const surveySignupBtn = document.getElementById('surveySignupBtn');
    const earningsLoginBtn = document.getElementById('earningsLoginBtn');
    const earningsSignupBtn = document.getElementById('earningsSignupBtn');
    const profileLoginBtn = document.getElementById('profileLoginBtn');
    const profileSignupBtn = document.getElementById('profileSignupBtn');
    
    // Modal Elements
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    const forgotPasswordModal = document.getElementById('forgotPasswordModal');
    const changePasswordModal = document.getElementById('changePasswordModal');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    const loginToSignupLink = document.getElementById('loginToSignup');
    const signupToLoginLink = document.getElementById('signupToLogin');
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    const backToLoginLink = document.getElementById('backToLogin');
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    
    // Forms
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    const changePasswordForm = document.getElementById('changePasswordForm');
    const withdrawalForm = document.getElementById('withdrawalForm');
    const profileForm = document.getElementById('profileForm');
    
    // Payment Method Selection
    const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
    const upiDetails = document.getElementById('upiDetails');
    const paytmDetails = document.getElementById('paytmDetails');
    const bankDetails = document.getElementById('bankDetails');
    
    // Toast Notification
    const toast = document.getElementById('toastNotification');
    const toastMessage = document.getElementById('toastMessage');

    // Sample data - In a real app, this would come from a backend
    const sampleSurveys = [
        {
            id: 1,
            title: 'Consumer Preferences Survey',
            description: 'Share your opinions about your favorite brands and products.',
            time: '5-10 minutes',
            reward: '₹50',
            provider: 'BrandInsights',
            status: 'Available',
            questions: 10
        },
        {
            id: 2,
            title: 'Technology Usage Habits',
            description: 'Tell us about how you use technology in your daily life.',
            time: '10-15 minutes',
            reward: '₹75',
            provider: 'TechTrends',
            status: 'Available',
            questions: 15
        },
        {
            id: 3,
            title: 'Food Delivery App Feedback',
            description: 'Provide feedback on your experience with food delivery apps.',
            time: '8-12 minutes',
            reward: '₹60',
            provider: 'FoodTech',
            status: 'Available',
            questions: 12
        },
        {
            id: 4,
            title: 'Online Shopping Behavior',
            description: 'Share insights about your online shopping preferences and habits.',
            time: '12-15 minutes',
            reward: '₹90',
            provider: 'RetailInsights',
            status: 'Available',
            questions: 18
        },
        {
            id: 5,
            title: 'Travel Preferences Post-Pandemic',
            description: 'Help us understand how travel preferences have changed.',
            time: '10-12 minutes',
            reward: '₹70',
            provider: 'TravelTrends',
            status: 'Available',
            questions: 14
        },
        {
            id: 6,
            title: 'Streaming Service Satisfaction',
            description: 'Rate your experience with various streaming platforms.',
            time: '7-10 minutes',
            reward: '₹55',
            provider: 'MediaInsights',
            status: 'Available',
            questions: 10
        }
    ];

    const sampleTransactions = [
        {
            id: 1,
            date: '2023-08-15',
            type: 'Earning',
            description: 'Completed "Consumer Preferences Survey"',
            amount: '₹50',
            status: 'Completed'
        },
        {
            id: 2,
            date: '2023-08-17',
            type: 'Earning',
            description: 'Completed "Technology Usage Habits"',
            amount: '₹75',
            status: 'Completed'
        },
        {
            id: 3,
            date: '2023-08-20',
            type: 'Withdrawal',
            description: 'UPI withdrawal to account@upi',
            amount: '₹100',
            status: 'Processed'
        },
        {
            id: 4,
            date: '2023-08-22',
            type: 'Earning',
            description: 'Completed "Food Delivery App Feedback"',
            amount: '₹60',
            status: 'Pending'
        }
    ];

    // Initialize the app
    appState.surveys = sampleSurveys;
    appState.transactions = sampleTransactions;

    // Navigation
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = this.getAttribute('data-target');
            
            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Show the target section
            sections.forEach(section => {
                if (section.id === targetSection) {
                    section.classList.remove('hidden');
                    section.classList.add('section-active');
                } else {
                    section.classList.add('hidden');
                    section.classList.remove('section-active');
                }
            });
        });
    });

    // Auth UI State Management
    function updateAuthUI() {
        if (appState.isLoggedIn) {
            authButtons.classList.add('hidden');
            userProfile.classList.remove('hidden');
            
            // Update username and points
            document.getElementById('username').textContent = appState.currentUser.name;
            document.getElementById('userPoints').textContent = `${appState.currentUser.points} pts`;
            
            // Update profile details
            document.getElementById('profileName').textContent = appState.currentUser.name;
            document.getElementById('profileEmail').textContent = appState.currentUser.email;
            document.getElementById('profileJoined').textContent = `Joined: ${appState.currentUser.joined}`;
            document.getElementById('profileSurveys').textContent = `Surveys Completed: ${appState.currentUser.surveysCompleted}`;
            
            // Fill profile form
            document.getElementById('fullName').value = appState.currentUser.name;
            document.getElementById('email').value = appState.currentUser.email;
            document.getElementById('phone').value = appState.currentUser.phone || '';
            
            // Show surveys and dashboard
            document.querySelectorAll('.auth-required-message').forEach(msg => {
                msg.classList.add('hidden');
            });
            document.querySelector('.surveys-container').classList.remove('hidden');
            document.querySelector('.earnings-dashboard').classList.remove('hidden');
            document.querySelector('.profile-details').classList.remove('hidden');
            
            // Update earnings info
            document.getElementById('totalEarned').textContent = appState.currentUser.totalEarned;
            document.getElementById('availableBalance').textContent = appState.currentUser.availableBalance;
            document.getElementById('pendingRewards').textContent = appState.currentUser.pendingRewards;
            
            // Load surveys and transactions
            loadSurveys();
            loadTransactions();
        } else {
            authButtons.classList.remove('hidden');
            userProfile.classList.add('hidden');
            
            // Hide surveys and dashboard
            document.querySelectorAll('.auth-required-message').forEach(msg => {
                msg.classList.remove('hidden');
            });
            document.querySelector('.surveys-container').classList.add('hidden');
            document.querySelector('.earnings-dashboard').classList.add('hidden');
            document.querySelector('.profile-details').classList.add('hidden');
        }
    }

    // Load surveys into the survey container
    function loadSurveys() {
        const surveysContainer = document.querySelector('.surveys-container');
        surveysContainer.innerHTML = '';
        
        appState.surveys.forEach(survey => {
            const surveyCard = document.createElement('div');
            surveyCard.className = 'survey-card';
            surveyCard.innerHTML = `
                <div class="survey-header">
                    <h3>${survey.title}</h3>
                </div>
                <div class="survey-content">
                    <p>${survey.description}</p>
                    <div class="survey-details">
                        <span><i class="fas fa-clock"></i> ${survey.time}</span>
                        <span><i class="fas fa-question-circle"></i> ${survey.questions} questions</span>
                    </div>
                    <div class="survey-provider">
                        <small>Provided by: ${survey.provider}</small>
                    </div>
                </div>
                <div class="survey-footer">
                    <div class="survey-reward">
                        <i class="fas fa-coins"></i> ${survey.reward}
                    </div>
                    <button class="survey-action" data-survey-id="${survey.id}">Take Survey</button>
                </div>
            `;
            surveysContainer.appendChild(surveyCard);
        });
        
        // Add event listeners to survey action buttons
        document.querySelectorAll('.survey-action').forEach(button => {
            button.addEventListener('click', function() {
                const surveyId = this.getAttribute('data-survey-id');
                takeSurvey(surveyId);
            });
        });
    }

    // Load transactions into the transaction history
    function loadTransactions() {
        const transactionTable = document.getElementById('transactionHistory');
        transactionTable.innerHTML = '';
        
        appState.transactions.forEach(transaction => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${formatDate(transaction.date)}</td>
                <td>
                    <span class="${transaction.type.toLowerCase()}-transaction">
                        ${transaction.type}
                    </span>
                </td>
                <td>${transaction.description}</td>
                <td>${transaction.amount}</td>
                <td>
                    <span class="status-${transaction.status.toLowerCase()}">
                        ${transaction.status}
                    </span>
                </td>
            `;
            transactionTable.appendChild(row);
        });
    }

    // Format date to a more readable format
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    // Handle survey taking
    function takeSurvey(surveyId) {
        // In a real app, this would navigate to the survey page or open a modal with the survey
        showToast('Survey will open in a new window. Complete it to earn rewards!');
        
        // For demo purposes, simulate completing a survey after a delay
        setTimeout(() => {
            const survey = appState.surveys.find(s => s.id == surveyId);
            
            if (survey) {
                // Update user data
                const rewardAmount = parseInt(survey.reward.replace('₹', ''));
                appState.currentUser.pendingRewards += rewardAmount;
                appState.currentUser.surveysCompleted += 1;
                
                // Add transaction
                const newTransaction = {
                    id: appState.transactions.length + 1,
                    date: new Date().toISOString().split('T')[0],
                    type: 'Earning',
                    description: `Completed "${survey.title}"`,
                    amount: survey.reward,
                    status: 'Pending'
                };
                
                appState.transactions.unshift(newTransaction);
                
                // Update UI
                document.getElementById('userPoints').textContent = `${appState.currentUser.points} pts`;
                document.getElementById('profileSurveys').textContent = `Surveys Completed: ${appState.currentUser.surveysCompleted}`;
                document.getElementById('pendingRewards').textContent = appState.currentUser.pendingRewards;
                
                loadTransactions();
                showToast('Survey completed! Reward will be credited once approved.');
                
                // For demo purposes, approve the pending reward after 5 seconds
                setTimeout(() => {
                    newTransaction.status = 'Completed';
                    appState.currentUser.pendingRewards -= rewardAmount;
                    appState.currentUser.availableBalance += rewardAmount;
                    appState.currentUser.totalEarned += rewardAmount;
                    
                    document.getElementById('totalEarned').textContent = appState.currentUser.totalEarned;
                    document.getElementById('availableBalance').textContent = appState.currentUser.availableBalance;
                    document.getElementById('pendingRewards').textContent = appState.currentUser.pendingRewards;
                    
                    loadTransactions();
                    showToast('Your reward has been approved and added to your balance!');
                }, 5000);
            }
        }, 2000);
    }

    // Show toast notification
    function showToast(message) {
        toastMessage.textContent = message;
        toast.classList.remove('hidden');
        
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 3000);
    }

    // Authentication Functions
    function login(email, password) {
        // In a real app, this would validate against a backend
        // For demo purposes, accept any credentials
        appState.isLoggedIn = true;
        appState.currentUser = {
            name: 'Demo User',
            email: email,
            joined: 'August 1, 2023',
            surveysCompleted: 3,
            points: 275,
            totalEarned: 185,
            availableBalance: 85,
            pendingRewards: 100
        };
        
        updateAuthUI();
        showToast('Successfully logged in!');
    }

    function signup(name, email, password) {
        // In a real app, this would register with a backend
        // For demo purposes, create a new user
        appState.isLoggedIn = true;
        appState.currentUser = {
            name: name,
            email: email,
            joined: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            surveysCompleted: 0,
            points: 100, // Welcome bonus
            totalEarned: 0,
            availableBalance: 0,
            pendingRewards: 0
        };
        
        updateAuthUI();
        showToast('Account created successfully! Welcome bonus: 100 points');
    }

    function logout() {
        appState.isLoggedIn = false;
        appState.currentUser = null;
        updateAuthUI();
        
        // Navigate to home
        document.querySelector('.nav-item[data-target="home"]').click();
        
        showToast('You have been logged out successfully');
    }

    // Event Listeners
    loginBtn.addEventListener('click', () => loginModal.classList.remove('hidden'));
    signupBtn.addEventListener('click', () => signupModal.classList.remove('hidden'));
    logoutBtn.addEventListener('click', logout);
    
    surveyLoginBtn.addEventListener('click', () => loginModal.classList.remove('hidden'));
    surveySignupBtn.addEventListener('click', () => signupModal.classList.remove('hidden'));
    earningsLoginBtn.addEventListener('click', () => loginModal.classList.remove('hidden'));
    earningsSignupBtn.addEventListener('click', () => signupModal.classList.remove('hidden'));
    profileLoginBtn.addEventListener('click', () => loginModal.classList.remove('hidden'));
    profileSignupBtn.addEventListener('click', () => signupModal.classList.remove('hidden'));
    
    getStartedBtn.addEventListener('click', () => {
        if (appState.isLoggedIn) {
            document.querySelector('.nav-item[data-target="surveys"]').click();
        } else {
            signupModal.classList.remove('hidden');
        }
    });
    
    // Close modals
    closeModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.modal').classList.add('hidden');
        });
    });
    
    // Modal navigation
    loginToSignupLink.addEventListener('click', function(e) {
        e.preventDefault();
        loginModal.classList.add('hidden');
        signupModal.classList.remove('hidden');
    });
    
    signupToLoginLink.addEventListener('click', function(e) {
        e.preventDefault();
        signupModal.classList.add('hidden');
        loginModal.classList.remove('hidden');
    });
    
    forgotPasswordLink.addEventListener('click', function(e) {
        e.preventDefault();
        loginModal.classList.add('hidden');
        forgotPasswordModal.classList.remove('hidden');
    });
    
    backToLoginLink.addEventListener('click', function(e) {
        e.preventDefault();
        forgotPasswordModal.classList.add('hidden');
        loginModal.classList.remove('hidden');
    });
    
    changePasswordBtn.addEventListener('click', function() {
        changePasswordModal.classList.remove('hidden');
    });
    
    // Form submissions
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        login(email, password);
        loginModal.classList.add('hidden');
    });
    
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('signupConfirmPassword').value;
        
        if (password !== confirmPassword) {
            showToast('Passwords do not match');
            return;
        }
        
        signup(name, email, password);
        signupModal.classList.add('hidden');
    });
    
    forgotPasswordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('resetEmail').value;
        
        showToast(`Password reset link sent to ${email}`);
        forgotPasswordModal.classList.add('hidden');
    });
    
    changePasswordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmNewPassword = document.getElementById('confirmNewPassword').value;
        
        if (newPassword !== confirmNewPassword) {
            showToast('New passwords do not match');
            return;
        }
        
        showToast('Password updated successfully');
        changePasswordModal.classList.add('hidden');
    });
    
    withdrawalForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const amount = document.getElementById('withdrawAmount').value;
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
        
        if (amount < 10) {
            showToast('Minimum withdrawal amount is ₹10');
            return;
        }
        
        if (appState.currentUser.points < 500) {
            showToast('You need at least 500 points to withdraw');
            return;
        }
        
        if (amount > appState.currentUser.availableBalance) {
            showToast('Insufficient balance for withdrawal');
            return;
        }
        
        // Process withdrawal
        appState.currentUser.availableBalance -= parseInt(amount);
        appState.currentUser.points -= 500; // Deduct 500 points for withdrawal
        
        // Add transaction
        const newTransaction = {
            id: appState.transactions.length + 1,
            date: new Date().toISOString().split('T')[0],
            type: 'Withdrawal',
            description: `${paymentMethod.toUpperCase()} withdrawal`,
            amount: `₹${amount}`,
            status: 'Processing'
        };
        
        appState.transactions.unshift(newTransaction);
        
        // Update UI
        document.getElementById('availableBalance').textContent = appState.currentUser.availableBalance;
        document.getElementById('userPoints').textContent = `${appState.currentUser.points} pts`;
        loadTransactions();
        
        showToast(`Withdrawal request of ₹${amount} submitted successfully`);
        
        // Reset form
        withdrawalForm.reset();
        
        // For demo purposes, complete the transaction after 3 seconds
        setTimeout(() => {
            newTransaction.status = 'Processed';
            loadTransactions();
            showToast('Your withdrawal has been processed!');
        }, 3000);
    });
    
    profileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('fullName').value;
        const phone = document.getElementById('phone').value;
        
        appState.currentUser.name = name;
        appState.currentUser.phone = phone;
        
        document.getElementById('username').textContent = name;
        document.getElementById('profileName').textContent = name;
        
        showToast('Profile updated successfully');
    });
    
    // Payment method selection
    paymentMethods.forEach(method => {
        method.addEventListener('change', function() {
            const paymentType = this.value;
            
            // Hide all payment details sections
            document.querySelectorAll('.payment-details').forEach(section => {
                section.classList.add('hidden');
            });
            
            // Show the selected payment details section
            if (paymentType === 'upi') {
                upiDetails.classList.remove('hidden');
            } else if (paymentType === 'paytm') {
                paytmDetails.classList.remove('hidden');
            } else if (paymentType === 'bank') {
                bankDetails.classList.remove('hidden');
            }
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        document.querySelectorAll('.modal').forEach(modal => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    });

    // Initialize UI
    updateAuthUI();
});