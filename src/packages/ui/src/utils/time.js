import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import isToday from 'dayjs/plugin/isToday';
import isYesterday from 'dayjs/plugin/isYesterday';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import updateLocale from 'dayjs/plugin/updateLocale';
import { computed } from 'vue';
import { getUserTimezone, getWeekStart } from './settings';

dayjs.extend(relativeTime);
dayjs.extend(isToday);
dayjs.extend(isYesterday);
dayjs.extend(duration);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(updateLocale);
dayjs.extend(weekOfYear);

export function getDayJsInstance() {
    dayjs.updateLocale('en', {
        weekStart: firstDayIndex.value,
    });
    return dayjs;
}

export const firstDayIndex = computed(() => {
    const apiDayOrder = [
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
    ];
    return apiDayOrder.indexOf(getWeekStart());
});

export function formatHumanReadableDuration(duration) {
    const dayJsDuration = dayjs.duration(duration, 's');
    const hours = Math.floor(dayJsDuration.asHours());
    const minutes = dayJsDuration.minutes();
    return `${hours}h ${minutes.toString().padStart(2, '0')}min`;
}

export function formatDuration(duration) {
    const dayJsDuration = dayjs.duration(duration, 's');
    const hours = Math.floor(dayJsDuration.asHours());
    const minutes = dayJsDuration.minutes();
    const seconds = dayJsDuration.seconds();
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function calculateDifference(start, end) {
    if (end === null) {
        end = dayjs().utc().format();
    }
    return dayjs(end).diff(dayjs(start), 'second');
}

export function formatTime(date) {
    return dayjs.utc(date).tz(getUserTimezone()).format('HH:mm');
}

export function getLocalizedDayJs(timestamp) {
    return dayjs.utc(timestamp).tz(getUserTimezone());
}

export function getLocalizedDateFromTimestamp(timestamp) {
    return getLocalizedDayJs(timestamp).format('YYYY-MM-DD');
}

export function formatDate(date) {
    if (date?.includes('+')) {
        console.warn(
            'Date contains timezone information, use formatDateLocalized instead'
        );
    }
    return getDayJsInstance()(date).format('DD.MM.YYYY');
}

export function formatDateLocalized(date) {
    return getLocalizedDayJs(date).format('DD.MM.YYYY');
}

export function formatDateTimeLocalized(date) {
    return getLocalizedDayJs(date).format('DD.MM.YYYY HH:mm');
}

export function formatWeek(date) {
    return 'Week ' + getDayJsInstance()(date).week();
}

export function formatHumanReadableDate(date) {
    if (dayjs(date).isToday()) {
        return 'Today';
    } else if (dayjs(date).isYesterday()) {
        return 'Yesterday';
    }
    return dayjs(date).fromNow();
}

export function formatWeekday(date) {
    return dayjs(date).format('dddd');
}

export function formatStartEnd(start, end) {
    if (end) {
        return `${formatTime(start)} - ${formatTime(end)}`;
    } else {
        return `${formatTime(start)} - ...`;
    }
}
