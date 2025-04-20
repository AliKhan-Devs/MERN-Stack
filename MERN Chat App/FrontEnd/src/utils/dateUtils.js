import moment from 'moment'

export const formatDistanceToNow = (date) => {
  const now = new Date()
  const diff = Math.abs(now - date)
  
  // If less than 24 hours ago, show time (8:30 AM)
  if (diff < 24 * 60 * 60 * 1000) {
    return moment(date).format('h:mm A')
  }
  
  // If less than 7 days ago, show day name (Monday)
  if (diff < 7 * 24 * 60 * 60 * 1000) {
    return moment(date).format('dddd')
  }
  
  // Otherwise, show date (MM/DD/YYYY)
  return moment(date).format('MM/DD/YYYY')
}

export const formatMessageTime = (date) => {
  return moment(date).format('h:mm A')
}