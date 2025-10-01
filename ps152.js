// --- MOCK AUTHENTICATION AND USER DATA ---

const MOCK_USERS = {
    "admin@gia.in": {
        name: "Central Administrator",
        role: "Admin",
        password: "admin123"
    },
    "enumerator@field.in": {
        name: "Field Enumerator",
        role: "Enumerator",
        password: "field456"
    },
    "priya@ajay.in": {
        name: "Priya Sharma",
        role: "Beneficiary",
        password: "user789",
        beneficiaryId: 'AJAY24001'
    },
};

let currentUser = null;

function mockLogin(email, password) {
    const user = MOCK_USERS[email];
    if (user && user.password === password) {
        currentUser = {
            ...user,
            email
        };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        return true;
    }
    showToast('Invalid email or password.', 'red');
    return false;
}

function mockLogout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    renderApp();
}

// --- MOCK DATABASE ---

const mockBeneficiaries = [{
        id: 'AJAY24001',
        name: 'Priya Sharma',
        district: 'Pune, MH',
        status: 'Approved',
        income: 'Livelihood Kit Issued',
        progress: 85,
        score: 98.2
    },
    {
        id: 'AJAY24002',
        name: 'Ravi Kumar',
        district: 'Lucknow, UP',
        status: 'Verified',
        income: 'Skill Training Assigned',
        progress: 40,
        score: 95.1
    },
    {
        id: 'AJAY24003',
        name: 'Sunita Devi',
        district: 'Patna, BR',
        status: 'Pending Approval',
        income: 'Awaiting DBT Link',
        progress: 10,
        score: 78.5
    },
    {
        id: 'AJAY24004',
        name: 'Mohan Singh',
        district: 'Jaipur, RJ',
        status: 'Ineligible (Duplicate)',
        income: 'N/A',
        progress: 0,
        score: 55.9
    },
    {
        id: 'AJAY24005',
        name: 'Geeta Varma',
        district: 'Chennai, TN',
        status: 'Approved (DBT)',
        income: 'Micro-Finance Sanctioned',
        progress: 65,
        score: 99.5
    },
    {
        id: 'AJAY24006',
        name: 'Amit Jha',
        district: 'Bhopal, MP',
        status: 'Verification Pending',
        income: 'N/A',
        progress: 5,
        score: 88.0
    },
    {
        id: 'AJAY24007',
        name: 'Laxmi Koli',
        district: 'Surat, GJ',
        status: 'Verified (Field)',
        income: 'Infrastructure Support',
        progress: 55,
        score: 97.0
    },
];

// --- UI UTILITIES ---

function showToast(message, color = 'green') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `p-3 rounded-lg shadow-xl text-white text-sm transition-opacity duration-300 mb-2
                                 ${color === 'red' ? 'bg-red-500' : 'bg-green-500'}`;
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('opacity-0');
        toast.addEventListener('transitionend', () => toast.remove());
    }, 3000);
}


// --- VIEW RENDERING FUNCTIONS ---

function renderApp() {
    const appContainer = document.getElementById('app-container');
    const storedUser = localStorage.getItem('currentUser');

    if (storedUser) {
        currentUser = JSON.parse(storedUser);
    }

    if (currentUser) {
        appContainer.innerHTML = generateMainDashboardHTML();
        // Ensure icons and initial tab are loaded after rendering
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        renderBeneficiaries();
        // Check if the URL has a tab hash, otherwise default to dashboard
        const initialTab = window.location.hash.substring(1) || 'dashboard';
        switchTab(initialTab);
    } else {
        appContainer.innerHTML = generateLoginHTML('login');
        // Ensure icons are loaded
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
}

function navigateAuth(view) {
    document.getElementById('app-container').innerHTML = generateLoginHTML(view);
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}


// --- LOGIN/SIGNUP HTML ---
function generateLoginHTML(view) {
    const isLogin = view === 'login';

    let formTitle = isLogin ? 'Sign In to PM-AJAY Digital Platform' : 'Register for Access';
    let formContent = isLogin ?
        `
            <form id="login-form" onsubmit="handleLogin(event)" class="space-y-6">
                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700">Email Address (Demo Role)</label>
                    <input type="email" id="email" required placeholder="e.g., admin@gia.in" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-secondary focus:border-secondary sm:text-sm">
                </div>
                <div>
                    <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                    <input type="password" id="password" required placeholder="******" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-secondary focus:border-secondary sm:text-sm">
                </div>
                <button type="submit" class="auth-button w-full bg-secondary text-white hover:bg-secondary/90">
                    Log In
                </button>
            </form>
            <p class="mt-6 text-center text-sm text-gray-600">
                Don't have an account? 
                <a href="#" onclick="navigateAuth('signup')" class="font-medium text-secondary hover:text-secondary/80">Sign up now</a>
            </p>
        ` :
        `
            <div class="space-y-6">
                <div class="text-center text-sm text-gray-500">
                    User registration is handled offline by PMU teams. For demo purposes, please use the pre-defined accounts.
                </div>
                <form onsubmit="handleSignup(event)" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Full Name</label>
                        <input type="text" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Designation / Role</label>
                        <select required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
                            <option>Central Official</option>
                            <option>State PMU Staff</option>
                            <option>Field Enumerator</option>
                            <option>Beneficiary</option>
                        </select>
                    </div>
                    <button type="submit" class="auth-button w-full bg-primary text-white hover:bg-primary/90">
                        Submit Application (Mock)
                    </button>
                </form>
                <p class="mt-6 text-center text-sm text-gray-600">
                    Already have an account? 
                    <a href="#" onclick="navigateAuth('login')" class="font-medium text-secondary hover:text-secondary/80">Log in</a>
                </p>
            </div>
        `;

    return `
        <div class="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <div class="w-full max-w-md">
                <div class="flex justify-center mb-6">
                    <i data-lucide="shield-plus" class="w-12 h-12 text-secondary"></i>
                </div>
                <h2 class="text-center text-3xl font-extrabold text-gray-900">
                    ${formTitle}
                </h2>
                <p class="mt-2 text-center text-sm text-gray-600">
                    PM-AJAY Grant-in-Aid Digital Mechanism
                </p>
            </div>

            <div class="mt-8 bg-white p-8 w-full max-w-md rounded-xl shadow-2xl">
                ${formContent}
            </div>
            
            <div class="mt-6 p-4 text-xs text-center text-gray-500 bg-yellow-50 rounded-lg border border-yellow-200 w-full max-w-md">
                <p><strong>NOTE:</strong> This is a mock authentication demo. Use the pre-defined credentials provided in the chat to log in.</p>
            </div>
        </div>
    `;
}

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (mockLogin(email, password)) {
        showToast('Login Successful!', 'green');
        renderApp();
    }
}

function handleSignup(event) {
    event.preventDefault();
    showToast('Registration application submitted (Mock). Please log in with existing credentials.', 'green');
    navigateAuth('login');
}

// --- MAIN DASHBOARD HTML ---
function generateMainDashboardHTML() {
    const role = currentUser.role;
    const initials = currentUser.name.split(' ').map(n => n[0]).join('');
    const isBeneficiary = role === 'Beneficiary';
    const showTabs = role === 'Admin' || role === 'Enumerator';

    return `
        <header class="bg-white shadow-md sticky top-0 z-10">
            <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                <div class="flex items-center space-x-3">
                    <div class="text-2xl font-bold text-secondary">PM-AJAY GIA</div>
                    <div class="hidden sm:block text-gray-500 font-medium text-sm">| Digital Monitoring Platform</div>
                </div>
                <div class="flex items-center space-x-4">
                    <span class="text-sm font-medium text-gray-600 hidden sm:block">${role} Portal</span>
                    <button class="text-gray-600 hover:text-secondary p-2 rounded-full transition duration-150">
                        <i data-lucide="bell" class="w-5 h-5"></i>
                    </button>
                    <div class="flex items-center space-x-2 cursor-pointer group">
                        <span class="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-semibold">${initials}</span>
                        <span class="hidden md:block text-gray-700 font-medium">${currentUser.name}</span>
                        <button onclick="mockLogout()" class="text-red-500 hover:text-red-700 p-1 text-sm rounded-lg border border-red-500 hover:border-red-700 transition">
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </header>

        <main class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
            ${showTabs ? `
            <div class="flex border-b border-gray-200 mb-6 sticky top-[68px] bg-white z-[5]">
                <button id="tab-dashboard" onclick="switchTab('dashboard')"
                        class="tab-button py-3 px-6 text-sm font-semibold transition duration-200 border-b-2 border-transparent text-gray-500 hover:text-secondary hover:border-secondary">
                    ${role === 'Admin' ? 'Progress Dashboard' : 'Field Overview'}
                </button>
                <button id="tab-beneficiaries" onclick="switchTab('beneficiaries')"
                        class="tab-button py-3 px-6 text-sm font-semibold transition duration-200 border-b-2 border-transparent text-gray-500 hover:text-secondary hover:border-secondary">
                    Verification & Tracking
                </button>
                ${role === 'Admin' ? `
                    <button id="tab-analytics" onclick="switchTab('analytics')"
                            class="tab-button py-3 px-6 text-sm font-semibold transition duration-200 border-b-2 border-transparent text-gray-500 hover:text-secondary hover:border-secondary">
                        AI/ML Insights
                    </button>
                ` : ''}
            </div>
            ` : ''}

            <div id="dynamic-content">
                ${isBeneficiary ? generateBeneficiaryView() : generateOfficialDashboardContent(role)}
            </div>
        </main>
    `;
}

function generateBeneficiaryView() {
    const userBeneficiary = mockBeneficiaries.find(b => b.id === currentUser.beneficiaryId);

    if (!userBeneficiary) {
        return `
            <div class="bg-yellow-100 p-6 rounded-xl border border-yellow-300 text-yellow-800 flex items-center space-x-3">
                <i data-lucide="alert-triangle" class="w-6 h-6"></i>
                <p class="font-medium">Your account is active, but your PM-AJAY beneficiary ID could not be found. Please contact your Field Enumerator.</p>
            </div>
        `;
    }

    return `
        <h2 class="text-3xl font-extrabold text-gray-800 mb-6">My Grant-in-Aid Application Status</h2>
        
        <div class="bg-white p-8 rounded-xl shadow-2xl space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 border-b pb-4">
                <div class="flex items-center space-x-4">
                    <i data-lucide="user-check" class="w-8 h-8 text-secondary"></i>
                    <div>
                        <p class="text-sm text-gray-500">Beneficiary Name</p>
                        <p class="text-lg font-semibold text-gray-800">${userBeneficiary.name}</p>
                    </div>
                </div>
                <div class="flex items-center space-x-4">
                    <i data-lucide="map-pin" class="w-8 h-8 text-secondary"></i>
                    <div>
                        <p class="text-sm text-gray-500">Location</p>
                        <p class="text-lg font-semibold text-gray-800">${userBeneficiary.district}</p>
                    </div>
                </div>
                <div class="flex items-center space-x-4">
                    <i data-lucide="fingerprint" class="w-8 h-8 text-secondary"></i>
                    <div>
                        <p class="text-sm text-gray-500">Unique ID</p>
                        <p class="text-lg font-semibold text-secondary">${userBeneficiary.id}</p>
                    </div>
                </div>
            </div>
            
            <h3 class="text-xl font-bold text-gray-800 pt-4">Current Status & Progress</h3>
            
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p class="text-sm font-medium text-gray-700">Application Stage</p>
                    <div class="mt-2">${getStatusBadge(userBeneficiary.status)}</div>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p class="text-sm font-medium text-gray-700">Financial Benefit</p>
                    <p class="mt-2 text-lg font-semibold text-primary">${userBeneficiary.income}</p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p class="text-sm font-medium text-gray-700">Overall Progress</p>
                    <div class="mt-2">${getProgressBar(userBeneficiary.progress)}</div>
                </div>
            </div>

            <div class="pt-6">
                <h4 class="text-lg font-bold text-gray-800 mb-3">Next Steps & Grievance Redressal</h4>
                <button class="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition flex items-center">
                    <i data-lucide="message-square" class="w-4 h-4 mr-2"></i>
                    Raise a Grievance
                </button>
                <p class="mt-3 text-sm text-gray-500">The next step is **Disbursal via DBT**. Please ensure your bank details are accurate.</p>
            </div>
        </div>
    `;
}

function generateOfficialDashboardContent(role) {
    return `
        <section id="dashboard" class="tab-content space-y-8 hidden">
            <h2 class="text-3xl font-extrabold text-gray-800">System Overview & Impact</h2>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div class="bg-white p-6 rounded-xl shadow-lg border-t-4 border-primary/70">
                    <div class="flex justify-between items-start">
                        <i data-lucide="users" class="w-8 h-8 text-primary"></i>
                        <span class="text-2xl font-bold text-gray-800">32,890</span>
                    </div>
                    <p class="text-sm text-gray-500 mt-2">Total Beneficiaries Enrolled</p>
                    <div class="mt-3 text-xs font-medium text-green-600 flex items-center">
                        <i data-lucide="trending-up" class="w-4 h-4 mr-1"></i>
                        +12.5% since last quarter
                    </div>
                </div>

                <div class="bg-white p-6 rounded-xl shadow-lg border-t-4 border-yellow-500/70">
                    <div class="flex justify-between items-start">
                        <i data-lucide="shield-check" class="w-8 h-8 text-yellow-600"></i>
                        <span class="text-2xl font-bold text-gray-800">98.5%</span>
                    </div>
                    <p class="text-sm text-gray-500 mt-2">Inclusion Accuracy Score</p>
                    <div class="mt-3 text-xs font-medium text-red-600 flex items-center">
                        <i data-lucide="alert-triangle" class="w-4 h-4 mr-1"></i>
                        1.5% Potential Exclusion Error
                    </div>
                </div>

                <div class="bg-white p-6 rounded-xl shadow-lg border-t-4 border-indigo-500/70">
                    <div class="flex justify-between items-start">
                        <i data-lucide="banknote" class="w-8 h-8 text-indigo-600"></i>
                        <span class="text-2xl font-bold text-gray-800">₹ 45 Cr</span>
                    </div>
                    <p class="text-sm text-gray-500 mt-2">Total Funds Disbursed (DBT)</p>
                    <div class="mt-3 text-xs font-medium text-indigo-600">
                        Avg. Disbursal Time: 2 days (Post-Approval)
                    </div>
                </div>

                <div class="bg-white p-6 rounded-xl shadow-lg border-t-4 border-secondary/70">
                    <div class="flex justify-between items-start">
                        <i data-lucide="map-pin" class="w-8 h-8 text-secondary"></i>
                        <span class="text-2xl font-bold text-gray-800">2,100</span>
                    </div>
                    <p class="text-sm text-gray-500 mt-2">Real-Time Field Verifications</p>
                    <div class="mt-3 text-xs font-medium text-secondary">
                        Field Enumerator App Usage
                    </div>
                </div>
            </div>

            <div class="bg-white p-8 rounded-xl shadow-lg">
                <h3 class="text-xl font-semibold text-gray-800 mb-4">Tracking Beneficiary Outcomes</h3>
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div class="space-y-4">
                        <h4 class="text-lg font-medium text-gray-700">Workflow Status (Live)</h4>
                        <div class="flex items-center space-x-3">
                            <i data-lucide="database" class="w-5 h-5 text-gray-400"></i>
                            <span class="text-sm font-medium">1. Data Integration:</span>
                            <span class="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-semibold">9 States Integrated</span>
                        </div>
                        <div class="flex items-center space-x-3">
                            <i data-lucide="cpu" class="w-5 h-5 text-gray-400"></i>
                            <span class="text-sm font-medium">2. AI Eligibility Check:</span>
                            <span class="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full font-semibold">Running Daily</span>
                        </div>
                        <div class="flex items-center space-x-3">
                            <i data-lucide="check-circle-2" class="w-5 h-5 text-gray-400"></i>
                            <span class="text-sm font-medium">3. Digital Verification:</span>
                            <span class="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-semibold">4,500 Pending</span>
                        </div>
                        <div class="flex items-center space-x-3">
                            <i data-lucide="send" class="w-5 h-5 text-gray-400"></i>
                            <span class="text-sm font-medium">4. DBT Disbursal:</span>
                            <span class="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-semibold">78% Auto-Linked</span>
                        </div>
                    </div>

                    <div class="lg:col-span-2">
                        <h4 class="text-lg font-medium text-gray-700 mb-4">Average Income Improvement (Post-Scheme)</h4>
                        <div class="h-48 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center p-4 text-gray-500 text-sm">
                            <div class="w-full">
                                <div class="bg-gray-200 h-2 rounded-full mb-6">
                                    <div class="bg-primary h-2 rounded-full" style="width: 60%;"></div>
                                </div>
                                <div class="flex justify-between text-xs text-gray-500">
                                    <span>Baseline</span>
                                    <span>Mid-Term (Expected 40%)</span>
                                    <span class="font-bold text-primary">Actual Average: 60%</span>
                                </div>
                            </div>
                        </div>
                        <p class="text-xs text-gray-500 mt-2">Source: Real-time data updates from field enumerators.</p>
                    </div>
                </div>
            </div>
        </section>

        <section id="beneficiaries" class="tab-content hidden">
            <h2 class="text-3xl font-extrabold text-gray-800 mb-6">Unified Database & Smart Identification</h2>

            <div class="bg-white p-6 rounded-xl shadow-lg">
                <div class="flex flex-col md:flex-row justify-between items-center mb-6 space-y-3 md:space-y-0">
                    <input type="text" placeholder="Search by Aadhaar, Name, or ID..."
                        class="w-full md:w-2/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-secondary focus:border-secondary transition">
                    <button class="w-full md:w-1/4 bg-secondary text-white font-semibold py-2 rounded-lg hover:bg-secondary/90 transition">
                        New Application
                    </button>
                </div>

                <div class="overflow-x-auto rounded-lg border border-gray-200">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Beneficiary ID</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name & Location</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GIA Status</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Smart ID Score</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody id="beneficiary-list" class="bg-white divide-y divide-gray-200">
                            </tbody>
                    </table>
                </div>
            </div>
        </section>

        ${role === 'Admin' ? `
        <section id="analytics" class="tab-content hidden">
            <h2 class="text-3xl font-extrabold text-gray-800 mb-6">AI/ML Insights & Fraud Detection</h2>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="bg-white p-6 rounded-xl shadow-lg border-l-4 border-red-500">
                    <h3 class="text-xl font-semibold text-gray-800 mb-3 flex items-center"><i data-lucide="zap" class="w-5 h-5 mr-2 text-red-500"></i>Fraud Detection</h3>
                    <p class="text-4xl font-bold text-red-600">0.2%</p>
                    <p class="text-sm text-gray-500 mt-1">Suspicious Applications Flagged</p>
                    <button class="mt-4 text-sm font-medium text-red-500 hover:underline">Review Alerts</button>
                </div>
                
                <div class="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
                    <h3 class="text-xl font-semibold text-gray-800 mb-3 flex items-center"><i data-lucide="check-square" class="w-5 h-5 mr-2 text-green-500"></i>Eligibility Scoring</h3>
                    <p class="text-4xl font-bold text-green-600">89.7%</p>
                    <p class="text-sm text-gray-500 mt-1">Applications Above 90% Eligibility Threshold</p>
                    <p class="mt-4 text-xs text-gray-400">Model: Scikit-learn + Local Records</p>
                </div>

                <div class="bg-white p-6 rounded-xl shadow-lg border-l-4 border-indigo-500">
                    <h3 class="text-xl font-semibold text-gray-800 mb-3 flex items-center"><i data-lucide="link" class="w-5 h-5 mr-2 text-indigo-500"></i>Integration Gaps</h3>
                    <p class="text-4xl font-bold text-indigo-600">3</p>
                    <p class="text-sm text-gray-500 mt-1">Pending State/UT Data Connects</p>
                    <button class="mt-4 text-sm font-medium text-indigo-500 hover:underline">View Integration Map</button>
                </div>
            </div>
            
            <div class="mt-8 bg-white p-6 rounded-xl shadow-lg">
                <h3 class="text-xl font-semibold text-gray-800 mb-4">Inclusion/Exclusion Error Analysis</h3>
                <p class="text-gray-600">The AI/ML layer continually analyzes exclusion errors (eligible individuals missed) and inclusion errors (ineligible individuals selected) to optimize the selection criteria.</p>
                <ul class="mt-4 space-y-2 list-disc list-inside text-gray-600 text-sm">
                    <li><span class="font-medium text-red-600">Inclusion Error Rate (Manual Baseline):</span> 10.4%</li>
                    <li><span class="font-medium text-primary">Target Inclusion Error Rate (Digital):</span> < 2%</li>
                </ul>
            </div>
        </section>
        ` : ''}
    `;
}

// --- CORE APPLICATION LOGIC ---
// Note: These functions were already well-defined, they just need to be in the separate JS file.

function getStatusBadge(status) {
    let color = 'gray';
    if (status.includes('Approved') || status.includes('Verified (Field)')) {
        color = 'green';
    } else if (status.includes('Pending')) {
        color = 'yellow';
    } else if (status.includes('Ineligible')) {
        color = 'red';
    }
    return `<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-${color}-100 text-${color}-800">${status}</span>`;
}

function getProgressBar(progress) {
    let color = 'bg-primary';
    if (progress < 50) color = 'bg-yellow-500';
    if (progress === 0) color = 'bg-gray-300';

    return `
        <div class="w-full bg-gray-200 rounded-full h-2.5">
            <div class="${color} h-2.5 rounded-full transition-all duration-500" style="width: ${progress}%;"></div>
        </div>
        <span class="text-xs text-gray-500 mt-1">${progress}%</span>
    `;
}

function renderBeneficiaries() {
    const container = document.getElementById('beneficiary-list');
    if (!container) return;

    const filteredBeneficiaries = currentUser.role === 'Enumerator' ?
        mockBeneficiaries.filter(b => b.district.includes('Lucknow') || b.district.includes('Patna') || b.status.includes('Verification Pending')) :
        mockBeneficiaries;

    container.innerHTML = filteredBeneficiaries.map(b => `
        <tr class="hover:bg-gray-50 transition duration-150">
            <td class="px-4 py-4 whitespace-nowrap text-sm font-medium text-secondary">${b.id}</td>
            <td class="px-4 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">${b.name}</div>
                <div class="text-xs text-gray-500">${b.district}</div>
            </td>
            <td class="px-4 py-4 whitespace-nowrap">${getStatusBadge(b.status)}</td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                <span class="font-bold ${b.score > 90 ? 'text-green-600' : b.score > 70 ? 'text-yellow-600' : 'text-red-600'}">${b.score.toFixed(1)}</span>
            </td>
            <td class="px-4 py-4">
                <div class="w-32 flex flex-col items-start">
                    ${getProgressBar(b.progress)}
                </div>
            </td>
            <td class="px-4 py-4 whitespace-nowrap text-sm font-medium">
                <a href="#" class="text-secondary hover:text-secondary/80">${currentUser.role === 'Enumerator' ? 'Verify Now' : 'View Profile'}</a>
            </td>
        </tr>
    `).join('');
}

function switchTab(tabId) {
    // Update URL hash
    window.location.hash = tabId;

    // Hide all content and reset tab styles
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.add('hidden');
    });
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active-tab');
    });

    // Show the selected content and set tab style
    const contentElement = document.getElementById(tabId);
    const selectedButton = document.getElementById(`tab-${tabId}`);

    if (contentElement) {
        contentElement.classList.remove('hidden');
    }

    if (selectedButton) {
        selectedButton.classList.add('active-tab');
    }
}

// Event listener to start the application when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    renderApp();
});