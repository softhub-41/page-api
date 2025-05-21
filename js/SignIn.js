// Form validation function
function validateForm(userData) {
    if (!userData.mobile || !userData.email || !userData.password) {
        alert('Please fill in all fields');
        return false;
    }
    if (userData.mobile.length !== 10) {
        alert('Mobile number must be 10 digits');
        return false;
    }
    if (!userData.email.includes('@')) {
        alert('Please enter a valid email');
        return false;
    }
    if (userData.password.length < 6) {
        alert("password must be at least 6 characters including numbers and letters");
        return false;
    }
    return true;
}

// Toogle password activity

function togglePassword() {
    const passwordInput = document.getElementById("password");
    const eyeIcon = document.getElementById("eyeIcon");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        eyeIcon.classList.remove("fa-eye-slash");
        eyeIcon.classList.add("fa-eye");
    } else {
        passwordInput.type = "password";
        eyeIcon.classList.remove("fa-eye");
        eyeIcon.classList.add("fa-eye-slash");
    }
}


// Form submission handler
async function handleSubmit(event) {
    event.preventDefault();

    try {
        const formData = new FormData(event.target);
        const userData = {
            mobile: formData.get('mobile'),
            email: formData.get('email'),
            password: formData.get('password')
        };

        console.log('Sending data to the server:', userData);

        if (!validateForm(userData)) {
            return;
        }

        // Test if server is running first
        await fetch('http://localhost:3000/test')
            .catch(() => {
                throw new Error('Server is not running');
            });

        const response = await fetch('http://localhost:3000/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Server error');
        }

        const result = await response.json();
        console.log('Success:', result);
        alert('Data saved successfully!');
        event.target.reset();
    } catch (error) {
        console.error('Error:', error);
        alert(error.message);
    }
}
