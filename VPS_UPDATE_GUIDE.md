# VPS Update Guide - Email Fix Deployment

## Problem Fixed
Removed broken Cloudinary logo attachment that was causing 404 errors in verification emails.

## Files Changed
- `backend/utils/emailSender.js` - Removed logo attachment, replaced with text heading
- `backend/utils/sendUpdateEmail.js` - Removed logo attachment, replaced with text heading

---

## Option 1: Manual File Update (Fastest)

### Step 1: Connect to your VPS
```bash
ssh root@72.60.218.219
```

### Step 2: Update the email files
```bash
cd /root/Nextute-main/backend/utils
```

### Step 3: Edit emailSender.js
```bash
nano emailSender.js
```

Find the line with `attachments: [` (around line 51) and remove the entire attachments section:
```javascript
// REMOVE THIS:
      attachments: [
        {
          filename: "logo.png",
          path: "https://res.cloudinary.com/drhrgs6y5/image/upload/v1750255401/logo_pumpy6.png",
          cid: "logo@nextute",
        },
      ],
```

Also change the logo image line to text:
```javascript
// CHANGE THIS:
<img src="cid:logo@nextute" alt="Logo" width="100" />

// TO THIS:
<h1 style="color: #007bff; margin: 0;">Nextute</h1>
```

Save with `Ctrl+X`, then `Y`, then `Enter`

### Step 4: Edit sendUpdateEmail.js
```bash
nano sendUpdateEmail.js
```

Make the same changes as above. Save and exit.

### Step 5: Restart backend
```bash
pm2 restart nextute-backend
pm2 logs nextute-backend --lines 50
```

---

## Option 2: Git Push (If you fix authentication)

### Fix Git Authentication First
```bash
# On your local machine (Windows)
git config user.name "AshutoshIIT1234"
git remote set-url origin https://github.com/AshutoshIIT1234/Nextute-main.git

# Then push
git push origin main
```

### Then on VPS
```bash
ssh root@72.60.218.219
cd /root/Nextute-main
git pull origin main
pm2 restart nextute-backend
pm2 logs nextute-backend --lines 50
```

---

## Option 3: Use SCP to Copy Files (Recommended)

### On your local machine (Windows PowerShell):
```powershell
# Copy the fixed files to VPS
scp M:\one\Nextute-main\backend\utils\emailSender.js root@72.60.218.219:/root/Nextute-main/backend/utils/
scp M:\one\Nextute-main\backend\utils\sendUpdateEmail.js root@72.60.218.219:/root/Nextute-main/backend/utils/
```

### Then SSH to VPS and restart:
```bash
ssh root@72.60.218.219
pm2 restart nextute-backend
pm2 logs nextute-backend --lines 50
```

---

## Verify the Fix

After restarting, test the email:
1. Try registering a new user
2. Check the logs: `pm2 logs nextute-backend`
3. You should see "✅ Email sent successfully" instead of 404 errors

---

## Troubleshooting

If emails still fail:
```bash
# Check if backend restarted
pm2 status

# View full logs
pm2 logs nextute-backend --lines 100

# Force restart
pm2 delete nextute-backend
pm2 start /root/Nextute-main/backend/server.js --name nextute-backend
```
