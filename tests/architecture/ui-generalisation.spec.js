import { expect, test } from '@playwright/test'
import fs from 'node:fs'

const read=path=>fs.readFileSync(new URL(`../../${path}`,import.meta.url),'utf8')

test('shared UI exposes the generalized premium layout primitives',()=>{
 const ui=read('src/shared/ui/index.jsx')
 for(const name of ['AppShell','PageFrame','PageStack','PageSection','SectionHeading','StickyActionBar']) expect(ui).toContain(name)
})

test('guest and host shells use the same shared AppShell',()=>{
 const guest=read('src/pages/layouts/GuestLayout.jsx')
 const host=read('src/pages/layouts/HostLayout.jsx')
 expect(guest).toContain("import { AppShell } from '../../shared/ui/index.jsx'")
 expect(host).toContain("import { AppShell } from '../../shared/ui/index.jsx'")
 expect(guest).not.toContain('function AppLink')
 expect(host).not.toContain('function AppLink')
})

test('route architecture keeps all product domains on the generalized shells',()=>{
 const routes=read('src/pages/routes.jsx')
 for(const route of ["path:'/'","path:'/map'","path:'/listing/:id'","path:'/booking/:id'","path:'/favorites'","path:'/profile'","path:'/host'"]) expect(routes).toContain(route)
})

test('Search remains the reference implementation of shared UI and Motion',()=>{
 const search=read('src/features/search/SearchExperience.jsx')
 expect(search).toContain("../../shared/ui/index.jsx")
 expect(search).toContain("../../shared/motion/index.jsx")
})
