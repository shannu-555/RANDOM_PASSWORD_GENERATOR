// Password generation function
function generatePassword(length, options) {
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let chars = '';
    if (options.uppercase) chars += uppercaseChars;
    if (options.lowercase) chars += lowercaseChars;
    if (options.numbers) chars += numberChars;
    if (options.symbols) chars += symbolChars;

    // Validate that at least one character set is selected
    if (chars.length === 0) {
        throw new Error('Please select at least one character type');
    }

    // Validate length
    if (length < 4 || length > 128) {
        throw new Error('Password length must be between 4 and 128 characters');
    }

    let password = '';
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);

    for (let i = 0; i < length; i++) {
        const randomIndex = array[i] % chars.length;
        password += chars[randomIndex];
    }

    // Ensure password contains at least one character from each selected type
    if (options.uppercase && !/[A-Z]/.test(password)) {
        const randomIndex = Math.floor(Math.random() * length);
        password = password.substring(0, randomIndex) + 
                  uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)] + 
                  password.substring(randomIndex + 1);
    }
    if (options.lowercase && !/[a-z]/.test(password)) {
        const randomIndex = Math.floor(Math.random() * length);
        password = password.substring(0, randomIndex) + 
                  lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)] + 
                  password.substring(randomIndex + 1);
    }
    if (options.numbers && !/[0-9]/.test(password)) {
        const randomIndex = Math.floor(Math.random() * length);
        password = password.substring(0, randomIndex) + 
                  numberChars[Math.floor(Math.random() * numberChars.length)] + 
                  password.substring(randomIndex + 1);
    }
    if (options.symbols && !/[^A-Za-z0-9]/.test(password)) {
        const randomIndex = Math.floor(Math.random() * length);
        password = password.substring(0, randomIndex) + 
                  symbolChars[Math.floor(Math.random() * symbolChars.length)] + 
                  password.substring(randomIndex + 1);
    }

    return password;
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const generateBtn = document.getElementById('generate-btn');
    const copyBtn = document.getElementById('copy-btn');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');
    const lengthInput = document.getElementById('length');
    const lengthValue = document.querySelector('.length-value');
    const strengthMeter = document.querySelector('.strength-meter-fill');
    const strengthValue = document.getElementById('strength-value');
    const copyTooltip = document.getElementById('copy-tooltip');

    // Update length value display
    lengthInput.addEventListener('input', function() {
        lengthValue.textContent = this.value;
    });

    // Calculate password strength
    function calculateStrength(password) {
        let strength = 0;
        if (password.length >= 8) strength += 1;
        if (password.length >= 12) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[a-z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;
        
        const strengthLevels = ['None', 'Very Weak', 'Weak', 'Medium', 'Strong', 'Very Strong'];
        const strengthColors = ['#ff4d4d', '#ff4d4d', '#ffa64d', '#ffd24d', '#4dff4d', '#4dff4d'];
        
        strengthMeter.style.width = `${(strength / 6) * 100}%`;
        strengthMeter.style.backgroundColor = strengthColors[strength];
        strengthValue.textContent = strengthLevels[strength];
        strengthValue.style.color = strengthColors[strength];
    }

    generateBtn.addEventListener('click', function() {
        const length = parseInt(lengthInput.value);
        const options = {
            uppercase: document.getElementById('uppercase').checked,
            lowercase: document.getElementById('lowercase').checked,
            numbers: document.getElementById('numbers').checked,
            symbols: document.getElementById('symbols').checked
        };

        try {
            const password = generatePassword(length, options);
            passwordInput.value = password;
            calculateStrength(password);
            errorMessage.textContent = '';
        } catch (error) {
            errorMessage.textContent = error.message;
            passwordInput.value = '';
            calculateStrength('');
        }
    });

    copyBtn.addEventListener('click', function() {
        passwordInput.select();
        document.execCommand('copy');
        
        // Show tooltip
        copyTooltip.classList.add('show');
        setTimeout(() => {
            copyTooltip.classList.remove('show');
        }, 2000);
    });
}); 