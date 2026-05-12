# EmailJS Setup Guide

## Step 1: Create EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## Step 2: Add Email Service
1. In EmailJS dashboard, click "Add New Service"
2. Choose your email provider (Gmail recommended)
3. Connect your email account
4. Copy the **Service ID**

## Step 3: Create Email Template
1. Click "Create New Template"
2. Design your contact form template:
   - Subject: New message from {{name}}
   - Content:
     ```
     Name: {{name}}
     Email: {{email}}
     Message: {{message}}
     ```
3. Save and copy the **Template ID**

## Step 4: Get API Key
1. Go to Account > API Keys
2. Copy your **Public Key**

## Step 5: Update JavaScript
Open `javascript/index.js` and update lines 3-5:
```javascript
const EMAILJS_PUBLIC_KEY = 'your_public_key_here';
const EMAILJS_SERVICE_ID = 'your_service_id_here';
const EMAILJS_TEMPLATE_ID = 'your_template_id_here';