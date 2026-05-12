# Formspree Setup Guide

## Step 1: Create Formspree Account
1. Go to [https://formspree.io/](https://formspree.io/)
2. Click "Get Started" (it's free)
3. Sign up with email or GitHub

## Step 2: Create a New Form
1. After signing in, click "New Form"
2. Give your form a name (e.g., "Portfolio Contact Form")
3. Click "Create Form"

## Step 3: Get Your Form ID
1. After creating the form, you'll see your form endpoint URL
2. It will look like: `https://formspree.io/f/xxxxxxxxxx`
3. Copy the part after `/f/` - this is your Form ID

## Step 4: Update Your HTML
In `index.html`, find the contact form and update line ~313:

```html
<!-- Replace: -->
action="https://formspree.io/f/YOUR_FORMSPREE_FORM_ID"

<!-- With your actual form ID: -->
action="https://formspree.io/f/your-actual-form-id-here"