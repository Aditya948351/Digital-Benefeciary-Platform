// Demo Credentials Configuration
const CREDENTIALS = {
    // Citizen Login: Email (no password)
    Citizen: { id: 'citize@gma.com', path: 'pages/citizen.html' }, 
    // Office Login: Email and Password 'pass123'
    Office: { id: 'officer@gmail.com', password: 'pass123', path: 'pages/officer.html' },
    // Admin Login: Email and Password 'pass123'
    Admin: { id: 'admin@gmail.com', password: 'pass123', path: 'pages/admin.html' }
};

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    lucide.createIcons();

    const tabButtons = document.querySelectorAll('.tab-button');
    const loginContents = document.querySelectorAll('.login-content');
    
    // Function to handle tab switching
    function switchTab(tabName) {
        const messageBox = document.getElementById('message-box');
        
        // 1. Update Buttons (Style and Active Class)
        tabButtons.forEach(button => {
            const isActive = button.getAttribute('data-tab') === tabName;
            
            // Remove current active styles
            button.classList.remove('active', 'text-white'); 
            button.classList.add('text-gray-600'); 
            
            // Apply active styles
            if (isActive) {
                button.classList.add('active', 'text-gray-800');
                // Set text color dynamically based on tab, for better contrast/feel
                if (tabName === 'citizen') {
                    button.classList.add('text-green-700');
                } else if (tabName === 'office') {
                    button.classList.add('text-indigo-700');
                } else if (tabName === 'admin') {
                    button.classList.add('text-orange-700');
                }
            } else {
                 button.classList.remove('text-green-700', 'text-indigo-700', 'text-orange-700');
            }
        });

        // 2. Update Content Display
        loginContents.forEach(content => {
            const contentId = 'content-' + tabName;
            if (content.id === contentId) {
                content.classList.remove('hidden');
                content.classList.add('active');
            } else {
                content.classList.add('hidden');
                content.classList.remove('active');
            }
        });
        
        // Clear any previous messages
        messageBox.classList.add('hidden');
    }

    // Attach event listeners to tab buttons
    tabButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const tabName = e.currentTarget.getAttribute('data-tab');
            switchTab(tabName);
        });
    });

    // Set the initial active tab (Citizen)
    switchTab('citizen');
});

// Function to handle form submission and validation
function handleLogin(event, role, demoPath) {
    event.preventDefault(); 
    const messageBox = document.getElementById('message-box');
    const requiredCreds = CREDENTIALS[role];
    let success = false;
    let submittedId = '';
    let submittedPassword = '';
    let visitorPassId = ''; // Variable to hold the generated pass ID

    // 1. Get submitted values and check credentials
    if (role === 'Citizen') {
        submittedId = document.getElementById('citizen-id').value;
        if (submittedId === requiredCreds.id) {
            success = true;
            visitorPassId = 'VP-C-001'; // Demo Visitor Pass ID for Citizen
        }
    } else if (role === 'Office') {
        submittedId = document.getElementById('office-id').value;
        submittedPassword = document.getElementById('office-password').value;
        if (submittedId === requiredCreds.id && submittedPassword === requiredCreds.password) {
            success = true;
            visitorPassId = 'VP-O-456'; // Demo Visitor Pass ID for Office
        }
    } else if (role === 'Admin') {
        submittedId = document.getElementById('admin-id').value;
        submittedPassword = document.getElementById('admin-password').value;
        if (submittedId === requiredCreds.id && submittedPassword === requiredCreds.password) {
            success = true;
            visitorPassId = 'VP-A-999'; // Demo Visitor Pass ID for Admin
        }
    }
    
    // 2. Prepare message box for attempt
    messageBox.classList.remove('hidden', 'bg-red-100', 'text-red-700', 'bg-green-100', 'text-green-700');
    messageBox.classList.add('bg-blue-100', 'text-blue-700');
    messageBox.innerHTML = `Attempting secure login as **${role}**...`;

    // 3. Show result after simulated delay
    setTimeout(() => {
        messageBox.classList.remove('bg-blue-100', 'text-blue-700');

        if (success) {
            messageBox.classList.add('bg-green-100', 'text-green-700', 'py-4'); // Added padding for multiline content
            
            // Display both User ID and Visitor Pass ID in the success message
            messageBox.innerHTML = `
                ✅ **Success!** Authenticated as **${role}**.
                <div class="mt-2 font-mono text-sm space-y-1">
                    <p>User ID: <strong>${submittedId}</strong></p>
                    <p>Visitor Pass ID: <strong>${visitorPassId}</strong></p>
                </div>
                <p class="mt-2 text-xs opacity-80">Redirecting to Dashboard at: <code>${demoPath}</code>...</p>
            `;
            // Perform actual redirect after a short pause
            setTimeout(() => {
                // Prefer the per-role configured path if not provided explicitly
                const targetPath = demoPath || (CREDENTIALS[role] && CREDENTIALS[role].path) || 'index.html';
                window.location.href = targetPath;
            }, 800);
        } else {
            messageBox.classList.add('bg-red-100', 'text-red-700');
            messageBox.innerHTML = `❌ **Login Failed!** Invalid credentials for **${role}** portal. Please check the demo credentials.`;
        }

    }, 1000); // 1 second delay
    
    console.log(`Login attempt for role: ${role}. ID: ${submittedId}, Password: ${submittedPassword ? '***' : 'N/A'}. Success: ${success}`);
}