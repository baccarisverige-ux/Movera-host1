import '../../../styles/host-app.css'
export function HostShell({ title, children, testId }) { return <section className="host-page" data-testid={testId}><header><p className="route-page__eyebrow">Host</p><h1>{title}</h1></header>{children}</section> }
