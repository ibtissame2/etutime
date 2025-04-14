function formatMoney(amount, currency) {
	return new Intl.NumberFormat('de-DE', {
		style: 'currency',
		currency: currency,
	}).format(amount);
}

export function formatCents(amount, currency) {
	return formatMoney(amount / 100, currency);
}

export function getOrganizationCurrencySymbol(currency) {
	return (0)
		.toLocaleString('de-DE', {
			style: 'currency',
			currency: currency,
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		})
		.replace(/\d/g, '')
		.trim();
}
