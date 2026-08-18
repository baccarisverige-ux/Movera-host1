import { Suspense, useEffect, useMemo, useState } from 'react'
import { authStore } from '../../features/account/authStore.js'
import { GuestLayout } from '../../pages/layouts/GuestLayout.jsx'
import { HostLayout } from '../../pages/layouts/HostLayout.jsx'
import { routeDefinitions, NotFoundPage } from '../../pages/routes.jsx'
function compilePattern(pattern){const keys=[];const source=pattern.split('/').map(segment=>{if(!segment)return'';if(segment.startsWith(':')){keys.push(segment.slice(1));return'([^/]+)'}return segment.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}).join('/');return{regex:new RegExp(`^${source||'/'}$`),keys}}
const compiledRoutes=routeDefinitions.map(route=>({...route,...compilePattern(route.path)}))
function resolveRoute(pathname){for(const route of compiledRoutes){const match=pathname.match(route.regex);if(!match)continue;const params=Object.fromEntries(route.keys.map((key,index)=>[key,decodeURIComponent(match[index+1])]));return{route,params}}return null}
export function navigate(to){if(window.location.pathname===to)return;window.history.pushState({},'',to);window.dispatchEvent(new PopStateEvent('popstate'))}
function ProtectedRedirect(){useEffect(()=>navigate('/login'),[]);return <section data-testid="protected-redirect"><p>Connexion requise…</p></section>}
function RouteFallback(){return <section className="route-page" data-testid="route-loading" aria-live="polite"><p>Chargement…</p></section>}
export function AppRouter(){
 const [locationKey,setLocationKey]=useState(()=>`${window.location.pathname}${window.location.search}`)
 useEffect(()=>{const onPopState=()=>setLocationKey(`${window.location.pathname}${window.location.search}`);const onSession=()=>setLocationKey(`${window.location.pathname}${window.location.search}:${Date.now()}`);window.addEventListener('popstate',onPopState);const unsub=authStore.subscribe(onSession);return()=>{window.removeEventListener('popstate',onPopState);unsub()}},[])
 const resolved=useMemo(()=>resolveRoute(window.location.pathname),[locationKey])
 if(new URLSearchParams(window.location.search).get('__testError')==='1')throw new Error('Phase 4 error-boundary verification')
 if(!resolved)return <NotFoundPage onNavigate={navigate}/>
 const {route,params}=resolved
 if(route.protected&&!authStore.isAuthenticated())return <ProtectedRedirect/>
 const Page=route.component;const Layout=route.area==='host'?HostLayout:GuestLayout
 return <Layout currentPath={window.location.pathname} onNavigate={navigate}><Suspense fallback={<RouteFallback/>}><Page params={params} onNavigate={navigate}/></Suspense></Layout>
}
