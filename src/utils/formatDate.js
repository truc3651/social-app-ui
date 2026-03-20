import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export function timeAgo(date) {
  return dayjs(date).fromNow()
}

export function formatDate(date) {
  return dayjs(date).format('MMM D, YYYY')
}

export function formatDateTime(date) {
  return dayjs(date).format('MMM D, YYYY h:mm A')
}
