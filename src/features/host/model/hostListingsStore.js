import { storageAdapter } from '../../../services/storage/storageAdapter.js'
import { DEFAULT_HOST_LISTINGS } from './hostData.js'

const KEY = 'movera-host-listings-v1'
const listeners = new Set()
let snapshot
let storageListenerAttached = false

function read() {
  return storageAdapter.getJson(KEY, DEFAULT_HOST_LISTINGS)
}

function notify() {
  listeners.forEach((listener) => listener())
}

function onStorage(event) {
  if (event.key !== KEY) return
  snapshot = read()
  notify()
}

function attachStorageListener() {
  if (storageListenerAttached || typeof window === 'undefined') return
  window.addEventListener('storage', onStorage)
  storageListenerAttached = true
}

function detachStorageListener() {
  if (!storageListenerAttached || typeof window === 'undefined') return
  window.removeEventListener('storage', onStorage)
  storageListenerAttached = false
}

export const hostListingsStore = {
  getSnapshot() {
    snapshot ??= read()
    return snapshot
  },
  getServerSnapshot() {
    return DEFAULT_HOST_LISTINGS
  },
  replace(next) {
    snapshot = typeof next === 'function' ? next(hostListingsStore.getSnapshot()) : next
    storageAdapter.setJson(KEY, snapshot)
    notify()
  },
  subscribe(listener) {
    listeners.add(listener)
    attachStorageListener()
    return () => {
      listeners.delete(listener)
      if (listeners.size === 0) detachStorageListener()
    }
  },
}
