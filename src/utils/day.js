import moment from 'moment'

export function formatDate (dateStr, formatStr = 'YYYY年MM月DD日 HH时mm分ss秒') {

  return moment(dateStr).format(formatStr)
}

/**
 * 
 * @param {*} tableData 数组
 * @param {*} SelectedDateTime 数组下需要格式化的变量名
 */
export function formatDateForList (tableData, SelectedDateTime) {
  tableData.forEach((element) => {
    const res = formatDate(
      element[SelectedDateTime],
      'YYYY-MM-DD HH:mm:ss'
    )

    element[SelectedDateTime] = res
  })
}


