const fs = require('fs');
const path = require('path');

async function testUpload() {
  try {
    // 1. Login
    console.log('Logging in...');
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'admin123' })
    });
    const loginData = await loginRes.json();
    console.log('Login Response:', loginData);
    if (!loginData.token) return;

    // 2. Upload
    console.log('Uploading image...');
    const formData = new FormData();
    // we need to use a Blob for fetch API
    const imageBuffer = fs.readFileSync(path.join(__dirname, '..', 'client', 'public', 'uploads', 'logos', 'logo-1771568786871.png'));
    const blob = new Blob([imageBuffer], { type: 'image/png' });
    formData.append('images', blob, 'logo.png');

    const uploadRes = await fetch('http://localhost:5000/api/upload-cert-images', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${loginData.token}`
      },
      body: formData
    });
    
    console.log('Upload Route Status:', uploadRes.status);
    const uploadData = await uploadRes.text();
    console.log('Upload Response:', uploadData);

  } catch(e) {
    console.error(e);
  }
}

testUpload();
