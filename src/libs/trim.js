// http://www.cnblogs.com/rubylouvre/archive/2009/09/18/1568794.html
export default function (str, replaceBreak) {
  str = str.replace(/^\s\s*/, '')
  var ws = /\s/
  var i = str.length, rs = str
  while (ws.test(str.charAt(--i))) {
    rs = str.slice(0, i)
  }
  if (!rs) {
    return ''
  }
  if (!replaceBreak) {
    return rs
  } else {
    return rs.replace(/(?:\r\n|\r|\n)/g, '')
  }
}
