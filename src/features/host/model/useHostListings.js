import { useState } from 'react'
import { storageAdapter } from '../../../services/storage/storageAdapter.js'
import { DEFAULT_HOST_LISTINGS } from './hostData.js'

const KEY = 'movera-host-listings-v1'
function load() { return storageAdapter.getJson(KEY, DEFAULT_HOST_LISTINGS) }
function save(items) { storageAdapter.setJson(KEY, items); window.dispatchEvent(new Event('host-listings-change')) }
export function useHostListings() { const [items, setItems] = useState(load); const commit = next => { setItems(next); save(next) }; return [items, commit] }
