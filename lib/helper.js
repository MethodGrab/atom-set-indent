'use babel';

// Pluralize a string
// eg: `pluralize( 5, { n: 'events', 1: 'event' }) === 'events'`
// :: (count: Int, variations: { <n|Int>: String } ) --> String
export function pluralize( count, variations ) {
	return variations[count] || variations.n || false;
}
