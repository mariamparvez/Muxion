# MUXION Admin Panel Guide

## 🔐 Admin Access

**URL:** `muxion.in/admin`

**Login Credentials:**
- Email: `designwithmariam@gmail.com`
- Password: `Mfmk.2112`

---

## 🎯 Features Overview

The MUXION Admin Panel provides complete control over your course platform with the following capabilities:

### ✅ Course Management
- **Create New Courses** - Add unlimited courses with custom details
- **Edit Course Information** - Update titles, descriptions, pricing, and metadata
- **Delete Courses** - Remove courses that are no longer needed

### ✅ Video Management
- **Upload Videos** - Add videos to any course (YouTube, Vimeo, or direct links)
- **Edit Video Details** - Modify video titles, URLs, durations, and descriptions
- **Delete Videos** - Remove individual videos from courses
- **Automatic Appending** - Videos automatically appear in the course structure

### ✅ Real-Time Updates
- All changes are saved instantly to localStorage
- Course pages update automatically with new content
- No page refresh needed - changes reflect immediately

---

## 📚 How to Use the Admin Panel

### 1. Login to Admin Dashboard

1. Navigate to `muxion.in/admin`
2. Enter your admin email and password
3. Click "Login to Admin Panel"
4. You'll be redirected to the dashboard

### 2. View Dashboard Statistics

The dashboard displays:
- **Total Courses** - Number of active courses
- **Total Videos** - Combined video count across all courses
- **Revenue Potential** - Sum of all course prices

### 3. Create a New Course

1. Click the **"Create New Course"** button
2. Fill in the course details:
   - **Course Title** (required) - e.g., "Advanced Figma Techniques"
   - **Description** (required) - Brief overview of the course
   - **Price** - Cost in ₹ (e.g., 299)
   - **Duration** - Total course length (e.g., "10 hours")
   - **Level** - Beginner, Intermediate, Advanced, or All Levels
   - **Language** - Default is English
   - **Instructor** - Default is Mariam Parvez
3. Click **"Create Course"**
4. The course will appear in your dashboard and on the website

### 4. Upload Videos to a Course

1. Find the course in the dashboard
2. Click **"Add Video"** button
3. Fill in video details:
   - **Video Title** (required) - e.g., "Introduction to Design Principles"
   - **Video URL** (required) - YouTube, Vimeo, or direct video link
     - Example: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
   - **Duration** - Video length (e.g., "15:30")
   - **Description** (optional) - What the video covers
4. Click **"Upload Video"**
5. Watch the upload progress bar (simulated)
6. Video will be added to the course automatically

### 5. Edit an Existing Video

1. Click **"Show Videos"** to expand the course
2. Click the **Edit** button (pencil icon) next to any video
3. Modify the video details
4. Click **"Save Changes"**

### 6. Delete a Video

1. Click **"Show Videos"** to expand the course
2. Click the **Delete** button (trash icon) next to the video
3. Confirm the deletion
4. Video will be removed immediately

### 7. Delete a Course

1. Click the **Delete** button (trash icon) in the course header
2. Confirm the deletion
3. The entire course and all its videos will be removed

---

## 🎬 Supported Video Formats

The admin panel accepts video URLs from:

- **YouTube** - `https://www.youtube.com/watch?v=...`
- **Vimeo** - `https://vimeo.com/...`
- **Direct Links** - Any `.mp4`, `.webm`, or `.mov` file URL

> **Note:** For best performance, host large video files on YouTube or Vimeo instead of direct links.

---

## 💾 Data Storage

All course and video data is stored in **localStorage** with the key `muxion_courses`.

### Default Courses
The system comes pre-loaded with 5 courses:
1. Adobe Photoshop (₹299)
2. Adobe Illustrator (₹299)
3. Figma (₹349)
4. UI/UX Mastery (₹599)
5. Frontend Development Basics (₹299)

### How Data Updates Work
- When you add/edit/delete courses or videos, changes save to localStorage
- The live site reads from localStorage first, then falls back to default courses
- Your changes persist across browser sessions
- Admin-created courses appear in all dropdowns and navigation

---

## 🔄 Course Integration

When you create a new course, it automatically:
- ✅ Appears in the homepage course selection modal
- ✅ Shows in the navigation dropdown
- ✅ Gets its own dedicated course page
- ✅ Supports payment flow (first video free, rest locked)
- ✅ Tracks student progress

---

## 🎨 Best Practices

### Creating Courses
- Use clear, descriptive titles
- Write engaging descriptions (2-3 sentences)
- Set competitive pricing based on course value
- Add accurate duration estimates

### Uploading Videos
- Use consistent naming (e.g., "Lesson 1: Introduction")
- Include duration for better UX
- Add descriptions to help students understand content
- Upload in logical sequence

### Video URLs
- **YouTube:** Best for accessibility and reliability
- **Vimeo:** Good for professional, ad-free content
- **Direct Links:** Only use for self-hosted videos

---

## 🚀 Quick Start Checklist

- [ ] Login to admin panel at `/admin`
- [ ] Review existing courses
- [ ] Create your first custom course
- [ ] Upload a test video
- [ ] Preview the course on the live site
- [ ] Edit video details as needed
- [ ] Share course with students

---

## 🛡️ Security Notes

- Only the admin email (`designwithmariam@gmail.com`) has access
- All other users must pay to access locked content
- Admin access is session-based and stored in localStorage
- Logout clears admin session immediately

---

## 📱 Mobile Access

The admin panel is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

---

## 💡 Tips & Tricks

1. **Upload videos in order** - Students see them sequentially
2. **Use descriptive titles** - Makes content easier to find
3. **Add durations** - Helps students manage their time
4. **Test on live site** - Verify everything works before sharing
5. **Keep course updated** - Add new content every Wednesday!

---

## 🆘 Troubleshooting

**Problem:** Videos not showing after upload
- **Solution:** Refresh the course page or click "Show Videos"

**Problem:** Can't login to admin
- **Solution:** Verify email is `designwithmariam@gmail.com` and password is correct

**Problem:** Changes not saving
- **Solution:** Check browser console for errors, ensure localStorage is enabled

---

## 📞 Support

For technical issues or questions, contact the developer or check the browser console for error messages.

---

**Happy Course Creating! 🎓✨**
