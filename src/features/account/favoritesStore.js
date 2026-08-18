const KEY='movera-favorites-v1'
const EVENT='movera:favorites-change'
function read(){try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch{return []}}
function write(ids){localStorage.setItem(KEY,JSON.stringify([...new Set(ids)]));window.dispatchEvent(new CustomEvent(EVENT))}
export const favoritesStore={
  getAll:read,
  has:(id)=>read().includes(id),
  toggle(id){const ids=read();const next=ids.includes(id)?ids.filter(x=>x!==id):[...ids,id];write(next);return next},
  clear(){write([])},
  subscribe(fn){window.addEventListener(EVENT,fn);return()=>window.removeEventListener(EVENT,fn)}
}
