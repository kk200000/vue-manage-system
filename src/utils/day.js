import moment from 'moment'

export function formatDate (dateStr, formatStr) {

  return moment(dateStr).format('YYYY年MM月DD日 HH时mm分ss秒')
}


