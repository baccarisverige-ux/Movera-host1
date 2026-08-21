import { storageAdapter } from '../../services/storage/storageAdapter.js'

const KEY='movera-favorites-v1'
const EVENT='movera:favorites-change'
function read(){return storageAdapter.getJson(KEY,[])}
function write(ids){storageAdapter.setJson(KEY,[...new Set(ids)]);window.dispatchEvent(new CustomEvent(EVENT))}
export const favoritesStore={
  getAll:read,
  has:(id)=>read().includes(id),
  toggle(id){const ids=read();const next=ids.includes(id)?ids.filter(x=>x!==id):[...ids,id];write(next);return next},
  clear(){write([])},
  subscribe(fn){window.addEventListener(EVENT,fn);return()=>window.removeEventListener(EVENT,fn)}
}
