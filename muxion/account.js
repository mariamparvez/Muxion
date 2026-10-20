import {firebaseConfig} from './firebase-config.js';
let sdkPromise,auth,authApi;
export let currentUser=null;
async function sdk(){
  if(!sdkPromise)sdkPromise=(async()=>{const [app,api]=await Promise.all([import('https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js'),import('https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js')]);authApi=api;auth=api.getAuth(app.getApps()[0]||app.initializeApp(firebaseConfig));await api.setPersistence(auth,api.browserLocalPersistence);return api;})().catch(error=>{sdkPromise=null;throw error;});
  return sdkPromise;
}
export async function initializeAccounts(onChange){const api=await sdk();return new Promise(resolve=>{let initial=true;api.onAuthStateChanged(auth,async user=>{currentUser=user;try{await onChange(user);}finally{if(initial){initial=false;resolve();}}});});}
export async function signInGoogle(){if(currentUser)return {user:currentUser};const api=await sdk();return api.signInWithPopup(auth,new api.GoogleAuthProvider());}
export async function signInEmail(email,password){const api=await sdk();return api.signInWithEmailAndPassword(auth,email,password);}
export async function createAccount(name,email,password){const api=await sdk();const result=await api.createUserWithEmailAndPassword(auth,email,password);await api.updateProfile(result.user,{displayName:name.trim().slice(0,100)});await api.sendEmailVerification(result.user);return result;}
export async function sendVerification(){const api=await sdk();if(!auth.currentUser)throw Error('Sign in first.');await auth.currentUser.reload();await api.sendEmailVerification(auth.currentUser);}
export async function resetPassword(email){const api=await sdk();return api.sendPasswordResetEmail(auth,email);}
export async function signOutAccount(){const api=await sdk();return api.signOut(auth);}
export async function authorizationHeaders(){return currentUser?{Authorization:'Bearer '+await currentUser.getIdToken()}:{};}
export async function platformRequest(action,{body,query={}}={}){
  const params=new URLSearchParams(query);const response=await fetch('/api/'+action+(params.size?'?'+params:''),{method:body===undefined?'GET':'POST',credentials:'same-origin',headers:{...await authorizationHeaders(),...(body===undefined?{}:{'Content-Type':'application/json'})},body:body===undefined?undefined:JSON.stringify(body),signal:AbortSignal.timeout(20000)});
  const result=await response.json().catch(()=>({error:'Account service returned an invalid response.'}));if(!response.ok)throw Error(result.error||'Account request failed.');return result;
}
