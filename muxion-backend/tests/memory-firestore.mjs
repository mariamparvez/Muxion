import assert from 'node:assert/strict';
export class MemoryFirestore {
  constructor(){this.records=new Map();this.tail=Promise.resolve();}
  collection(p){return new Collection(this,p);}
  runTransaction(fn){const task=this.tail.then(async()=>{const draft=new Map(structuredClone([...this.records]));let writing=false;const tx={get:async ref=>{assert.equal(writing,false,'Firestore reads must precede writes');return snapshot(ref.path,draft.get(ref.path));},set:(ref,value)=>{writing=true;draft.set(ref.path,structuredClone(value));}};const result=await fn(tx);this.records=draft;return result;});this.tail=task.catch(()=>{});return task;}
}
const snapshot=(path,data)=>({id:path.split('/').pop(),exists:data!==undefined,data:()=>structuredClone(data)});
class Collection {
  constructor(db,path,filters=[],sort=null,cap=10000,cursor=null){Object.assign(this,{db,path,filters,sort,cap,cursor});}
  doc(id='audit'+Math.random().toString(36).slice(2)){return {path:this.path+'/'+id,collection:p=>new Collection(this.db,this.path+'/'+id+'/'+p),get:async()=>snapshot(this.path+'/'+id,this.db.records.get(this.path+'/'+id))};}
  where(k,op,v){assert.equal(op,'==');return new Collection(this.db,this.path,[...this.filters,[k,v]],this.sort,this.cap,this.cursor);}
  orderBy(k,d='asc'){return new Collection(this.db,this.path,this.filters,[k,d],this.cap,this.cursor);}
  limit(cap){return new Collection(this.db,this.path,this.filters,this.sort,cap,this.cursor);}
  startAfter(cursor){return new Collection(this.db,this.path,this.filters,this.sort,this.cap,cursor);}
  async get(){let docs=[...this.db.records].filter(([p,v])=>p.startsWith(this.path+'/')&&p.split('/').length===this.path.split('/').length+1&&this.filters.every(([k,value])=>v[k]===value)).map(([p,v])=>snapshot(p,v));if(this.sort){const[k,d]=this.sort;docs.sort((a,b)=>String(k==='__name__'?a.id:a.data()[k]).localeCompare(String(k==='__name__'?b.id:b.data()[k]))*(d==='desc'?-1:1));}if(this.cursor)docs=docs.filter(d=>d.id>this.cursor);return {docs:docs.slice(0,this.cap)};}
}
