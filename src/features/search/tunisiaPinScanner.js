// Compatibility boundary for the live Search feature.
// The implementation now lives in services/geocoding so Search, Host onboarding
// and the future backend adapter can share one provider-independent contract.
export { scanTunisia as scanTunisiaByVirtualPin } from '../../services/geocoding/index.js'
