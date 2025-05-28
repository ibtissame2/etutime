import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import isToday from 'dayjs/plugin/isToday';
import isYesterday from 'dayjs/plugin/isYesterday';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import updateLocale from 'dayjs/plugin/updateLocale';
import 'dayjs/locale/fr';

dayjs.locale('fr');
dayjs.extend(relativeTime);
dayjs.extend(isToday);
dayjs.extend(isYesterday);
dayjs.extend(duration);
dayjs.extend(updateLocale);
dayjs.extend(weekOfYear);

export function formatHumanReadableDuration(duration) {
	const dayJsDuration = dayjs.duration(duration, 's');
	const hours = Math.floor(dayJsDuration.asHours()).toString().padStart(2, '0');
	const minutes = Math.floor(dayJsDuration.minutes()).toString().padStart(2, '0');
	const seconds = Math.floor(dayJsDuration.seconds()).toString().padStart(2, '0');
	return `${hours}:${minutes}:${seconds}`;
}

export function formatDuration(duration) {
	const dayJsDuration = dayjs.duration(duration, 's');
	const hours = Math.floor(dayJsDuration.asHours());
	const minutes = dayJsDuration.minutes();
	const seconds = dayJsDuration.seconds();
	return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
		.toString()
		.padStart(2, '0')}`;
}

export function formatDate(date) {
	return dayjs(date).format('YYYY-MM-DD');
}

export function formatDateLocalized(date) {
	return dayjs(date).format('YYYY-MM-DD');
}

export function formatDateTimeLocalized(date) {
	return dayjs(date).format('YYYY-MM-DD HH:mm');
}

export function formatWeek(date) {
	return 'Week ' + dayjs(date).week();
}

export function formatHumanReadableDate(date) {
	if (dayjs(date).isToday()) {
		return 'Aujourd’hui';
	} else if (dayjs(date).isYesterday()) {
		return 'Hier';
	}
	return dayjs(date).fromNow();
}

export function formatStartEnd(start, end) {
	const formatTime = (date) => dayjs(date).format('HH:mm');
	if (end) {
		return `${formatTime(start)} - ${formatTime(end)}`;
	} else {
		return `${formatTime(start)} - ...`;
	}
}
