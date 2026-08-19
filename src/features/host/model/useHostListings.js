import { useState } from 'react'
import { DEFAULT_HOST_LISTINGS } from './hostData.js'

const KEY = 'movera-host-listings-v1'
function load() { try { return JSON.parse(localStorage.getItem(KEY)) || DEFAULT_HOST_LISTINGS } catch { return DEFAULT_HOST_LISTINGS } }
function save(items) { localStorage.setItem(KEY, JSON.stringify(items)); window.dispatchEvent(new Event('host-listings-change')) }
export function useHostListings() { const [items, setItems] = useState(load); const commit = next => { setItems(next); save(next) }; return [items, commit] }
