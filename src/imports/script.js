import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut, onAuthStateChanged, setPersistence, browserSessionPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, deleteField } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

const correctPassword = "@uiux2024masterclass";

    function promptForPassword() {
        if (localStorage.getItem("passwordVerified") === "true") {
            document.getElementById("content").style.display = "block";
            return;
        }

        let password = prompt("Enter the password to access the course:");
        
        if (password === correctPassword) {
            document.getElementById("content").style.display = "block";
            localStorage.setItem("passwordVerified", "true");
        } else {
            alert("Incorrect password. Access denied.");
            promptForPassword();
        }
    }

    window.onload = promptForPassword;

    const firebaseConfig = {
        apiKey: "AIzaSyDPvVfVrlwz27THPDlVw3qzST5IMAEYWGQ",
        authDomain: "ui-ux-design-course.firebaseapp.com",
        projectId: "ui-ux-design-course",
        storageBucket: "ui-ux-design-course.appspot.com",
        messagingSenderId: "537402298695",
        appId: "1:537402298695:web:473113ff6a80a086d93c62",
        measurementId: "G-76X3EVSTCW"
    };

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);
    const provider = new GoogleAuthProvider();

    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');
    const rememberMeCheckbox = document.getElementById('remember-me');
    const forgotPasswordLink = document.getElementById('forgot-password');
    const logoutButton = document.getElementById('logout-button');
    const notesList = document.getElementById('notesList');
    const newNoteText = document.getElementById('newNoteText');
    const addNoteButton = document.getElementById('addNoteButton');
    const toggleToLogin = document.getElementById('toggle-to-login');
    const toggleToSignup = document.getElementById('toggle-to-signup');
    const googleSignupButton = document.getElementById('google-signup');
    const googleLoginButton = document.getElementById('google-login');
    const videoPlayer = document.getElementById('videoPlayer');
    const videoSource = document.getElementById('videoSource');
    const totalProgressBar = document.getElementById('totalProgressBar');
    const progressLabel = document.getElementById('progressLabel');
    const videoListItems = document.getElementById('videoList').getElementsByTagName('li');

    let totalWatchedVideos = 0;
    const totalVideos = videoListItems.length;
    let watchedVideos = new Set();
    let currentUserId = null;
    let userProgress = [];
    let currentPlaybackTime = 0;

    async function loadVideo(videoUrl) {
        videoSource.src = videoUrl;
        videoPlayer.load();

        if (currentUserId) {
            const userDoc = await getDoc(doc(db, "users", currentUserId));
            const userData = userDoc.data();
            if (userData && userData.lastPlayedVideo === videoUrl) {
                videoPlayer.currentTime = userData.playbackTime || 0;
            }
        }
        videoPlayer.play();
    }

    function updateProgressBar() {
        const progressPercentage = (totalWatchedVideos / totalVideos) * 100;
        totalProgressBar.style.width = progressPercentage + '%';
        progressLabel.textContent = Math.floor(progressPercentage) + '% Completed';
    }

    async function loadUserProgress(uid) {
        const userDoc = await getDoc(doc(db, "users", uid));
        if (userDoc.exists()) {
            userProgress = userDoc.data().progress || [];
            watchedVideos = new Set(userProgress);
            totalWatchedVideos = watchedVideos.size;

            Array.from(videoListItems).forEach((item, index) => {
                if (watchedVideos.has(index)) {
                    item.classList.add('watched');
                    item.querySelector('.completed-label').style.display = 'block';
                }
            });
            updateProgressBar();
        }
    }

    async function loginWithEmailAndPassword(email, password) {
        const persistence = rememberMeCheckbox.checked ? browserLocalPersistence : browserSessionPersistence;
        try {
            await setPersistence(auth, persistence);
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            currentUserId = userCredential.user.uid;
            alert("Logged in successfully");
            await loadUserProgress(currentUserId);  
        } catch (error) {
            alert("Error: " + error.message);
        }
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        loginWithEmailAndPassword(email, password);
    });
    

    function updateUIForAuthenticatedUser(user) {
        if (user) {
            document.getElementById('container-course').style.display = 'flex';
            document.getElementById('auth-container').style.display = 'none';
            document.getElementById('contact').style.display = 'block';
        } else {
            document.getElementById('container-course').style.display = 'none';
            document.getElementById('auth-container').style.display = 'block';
            document.getElementById('contact').style.display = 'none';
        }
    }
    
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            currentUserId = user.uid;
            updateUIForAuthenticatedUser(user);
            await loadUserProgress(currentUserId); 
        } else {
            currentUserId = null;
            updateUIForAuthenticatedUser(null);
        }
    });
    

    async function saveUserProgress(uid) {
        userProgress = Array.from(watchedVideos);
        await setDoc(doc(db, "users", uid), {
            progress: userProgress,
            lastPlayedVideo: videoSource.src,
            playbackTime: currentPlaybackTime
        }, { merge: true });
    }

    videoPlayer.addEventListener('timeupdate', () => {
        currentPlaybackTime = videoPlayer.currentTime;
    });

    videoPlayer.addEventListener('pause', async () => {
        if (currentUserId) await saveUserProgress(currentUserId);  
    });

    videoPlayer.addEventListener('ended', () => {
        const currentVideoSrc = videoSource.src.split('/').pop();
        const currentIndex = Array.from(videoListItems).findIndex(li => li.getAttribute('data-src').includes(currentVideoSrc));

        if (currentIndex !== -1 && !watchedVideos.has(currentIndex)) {
            watchedVideos.add(currentIndex);
            totalWatchedVideos = watchedVideos.size;

            videoListItems[currentIndex].classList.add('watched');
            videoListItems[currentIndex].querySelector('.completed-label').style.display = 'block';

            updateProgressBar();
            if (currentUserId) saveUserProgress(currentUserId);
        }
    });

    Array.from(videoListItems).forEach((item, index) => {
        item.addEventListener('click', () => {
            loadVideo(item.getAttribute('data-src'));
        });
    });

    toggleToLogin.addEventListener('click', () => {
        document.getElementById('signup-section').style.display = 'none';
        document.getElementById('login-section').style.display = 'block';
    });

    toggleToSignup.addEventListener('click', () => {
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('signup-section').style.display = 'block';
    });

    googleSignupButton.addEventListener('click', async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            currentUserId = result.user.uid;
            alert("Signed up with Google successfully");
        } catch (error) {
            alert("Error: " + error.message);
        }
    });

    googleLoginButton.addEventListener('click', async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            currentUserId = result.user.uid;
            alert("Logged in with Google successfully");
        } catch (error) {
            alert("Error: " + error.message);
        }
    });

    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            currentUserId = userCredential.user.uid;
            alert("User registered successfully");
            document.getElementById('signup-section').style.display = 'none';
            document.getElementById('login-section').style.display = 'block';
        } catch (error) {
            alert("Error: " + error.message);
        }
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const persistence = rememberMeCheckbox.checked ? browserLocalPersistence : browserSessionPersistence;

        try {
            await setPersistence(auth, persistence);
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            currentUserId = userCredential.user.uid;
            alert("Logged in successfully");
        } catch (error) {
            alert("Error: " + error.message);
        }
    });

    forgotPasswordLink.addEventListener('click', async (e) => {
    e.preventDefault();
    let email = document.getElementById('login-email').value;
    if (!email) {
        email = prompt("Please enter your email to reset your password:");
    }
    if (email) {
        try {
            await sendPasswordResetEmail(auth, email);
            alert("Password reset email sent successfully");
        } catch (error) {
            alert("Error: " + error.message);
        }
    } else {
        alert("Email is required to reset password");
    }
});


    logoutButton.addEventListener('click', async () => {
        try {
            await signOut(auth);
            alert("Logged out successfully");
        } catch (error) {
            alert("Error: " + error.message);
        }
    });

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            currentUserId = user.uid;
            const rememberMe = localStorage.getItem('rememberMe') === 'true';
            if (rememberMe) {
                localStorage.setItem('authUser', JSON.stringify(user));
            } else {
                sessionStorage.setItem('authUser', JSON.stringify(user));
            }

            document.getElementById('container-course').style.display = 'flex';
            document.getElementById('video-player-container').style.display = 'block';
            document.getElementById('playlist-container').style.display = 'block';
            document.getElementById('progress-container').style.display = 'block';
            document.getElementById('logout-button').style.display = 'block';
            document.getElementById('notes-container').style.display = 'block';
            document.getElementById('auth-container').style.display = 'none';
            document.getElementById('contact').style.display = 'block'
            loadNotes();
            await loadUserProgress(user.uid);
        } else {
            currentUserId = null;
            document.getElementById('container-course').style.display = 'none';
            document.getElementById('video-player-container').style.display = 'none';
            document.getElementById('playlist-container').style.display = 'none';
            document.getElementById('progress-container').style.display = 'none';
            document.getElementById('notes-container').style.display = 'none';
            document.getElementById('logout-button').style.display = 'none';
            document.getElementById('auth-container').style.display = 'block';
                  document.getElementById('contact').style.display = 'none'
            localStorage.removeItem('authUser');
            sessionStorage.removeItem('authUser');
            notesList.innerHTML = '';
        }
    });

    async function loadNotes() {
        notesList.innerHTML = '';
        const notesDoc = await getDoc(doc(db, "users", currentUserId, "notes", "notesData"));
        const notesData = notesDoc.exists() ? notesDoc.data() : {};
        Object.keys(notesData).forEach(noteId => {
            const noteItem = document.createElement('li');
            noteItem.className = 'note-item';
            noteItem.textContent = notesData[noteId].text;
    
            const btnGroup = document.createElement('div');
            btnGroup.className = 'btn-group';
    
            const editBtn = document.createElement('button');
            editBtn.className = 'btn btn-icon m-2 rounded';
            editBtn.innerHTML = '<i class="fas fa-edit"></i>';
            editBtn.onclick = () => editNote(noteId);
    
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn btn-icon m-2 rounded';
            deleteBtn.innerHTML = '<i class="fa-regular fa-trash-can"></i>';
            deleteBtn.onclick = () => deleteNote(noteId);
    
            btnGroup.appendChild(editBtn);
            btnGroup.appendChild(deleteBtn);
    
            noteItem.appendChild(btnGroup);
            notesList.appendChild(noteItem);
        });
    }
    
    async function saveNote() {
        const noteText = newNoteText.value;
        const noteId = `note-${Date.now()}`;
        await setDoc(doc(db, "users", currentUserId, "notes", "notesData"), {
            [noteId]: { text: noteText, date: new Date().toISOString() }
        }, { merge: true });
        newNoteText.value = '';
        loadNotes();
    }
    

    async function editNote(noteId) {
        const newText = prompt("Edit your note:");
        if (newText) {
            await updateDoc(doc(db, "users", currentUserId, "notes", "notesData"), {
                [noteId]: { text: newText, date: new Date().toISOString() }
            });
            loadNotes();
        }
    }

    async function deleteNote(noteId) {
        await updateDoc(doc(db, "users", currentUserId, "notes", "notesData"), {
            [noteId]: deleteField()
        });
        loadNotes();
    }

    addNoteButton.addEventListener('click', saveNote);

    //----------------//

    let currentIndex = 0;
    const slides = Array.from(document.querySelectorAll('.slider'));
  
    slides.sort(() => Math.random() - 0.5);
  
    const totalSlides = slides.length;
    const displayDuration = 100000; 
  
    slides.forEach(slide => {
      const img = new Image();
      img.src = slide.style.backgroundImage.replace(/url\(["']?/, '').replace(/["']?\)$/, '');
    });
  
    function showSlide(index) {
      slides.forEach((slide, i) => {
        slide.classList.remove('active');
      });
  
      slides[index].classList.add('active');
    }
  
    function nextSlide() {
      currentIndex = (currentIndex + 1) % totalSlides;
      showSlide(currentIndex);
    }
    showSlide(currentIndex);
    setInterval(nextSlide, displayDuration);
  









    