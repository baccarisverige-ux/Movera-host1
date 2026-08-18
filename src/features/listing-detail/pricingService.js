export function getPricingSummary(listing) {
  if (!listing) return null
  return {
    nightlyLabel: `${listing.nightlyRate} ${listing.currency} / nuit`,
    feesLabel: `${listing.fees} ${listing.currency} frais`,
    bookingLabel: `Réserver à partir de ${listing.nightlyRate} ${listing.currency}`,
  }
}
