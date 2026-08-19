const seed=[{id:'c1',name:'Imen',messages:[{id:'m1',from:'them',text:'Bonjour, votre arrivée est bien confirmée.'},{id:'m2',from:'me',text:'Merci, à bientôt.'}]},{id:'c2',name:'Seif',messages:[{id:'m3',from:'them',text:'Je reste disponible si besoin.'}]}]

export const MessagingService={
  list(){return seed.map(({id,name})=>({id,name}))},
  get(id){return seed.find(c=>c.id===id)||null},
}
