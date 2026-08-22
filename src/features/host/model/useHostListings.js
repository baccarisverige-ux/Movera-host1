import { useSyncExternalStore } from 'react'
import { hostListingsStore } from './hostListingsStore.js'

export function useHostListings() {
  const items = useSyncExternalStore(
    hostListingsStore.subscribe,
    hostListingsStore.getSnapshot,
    hostListingsStore.getServerSnapshot,
  )
  return [items, hostListingsStore.replace]
}
