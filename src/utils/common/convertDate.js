import moment from 'moment';

export function convertDateLocal(time) {
    return moment(time).utc().add(7, 'hour').format("DD/MM/YYYY HH:mm");
}

export function convertDateLocalHour(time) {
    return moment(time).utc().add(7, 'hour').format("HH:mm");
}

export function dynamicDateServer(time) {
    return moment(time).utc("00:00")
}