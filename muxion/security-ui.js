export const escapeHTML=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function safeLink(value,{resource=false}={}){
  if(typeof value!=='string'||/[\u0000-\u001f\u007f\\]/.test(value))return '#';
  if(!resource&&((value.startsWith('/')&&!value.startsWith('//'))||value.startsWith('#')))return escapeHTML(value);
  try{
    const u=new URL(value);
    const protocols=resource?['https:','blob:']:['https:','mailto:','tel:'];
    return protocols.includes(u.protocol)&&!u.username&&!u.password?escapeHTML(value):'#';
  }catch{return '#';}
}
