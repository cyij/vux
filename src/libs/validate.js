import trim from './trim'

let checkVal = function (ignoreEmpty, val, min, max, checkLen) {
  val = trim(val)
  if (val === null || val === undefined) {
    return ignoreEmpty
  }
  if (ignoreEmpty && (val+'').length < 1) {
    return true
  }
  if (checkLen) {
    val = (val+'').length
  }
  if (typeof min === undefined) {
    min = 0
  }
  return (val >= min && val <= max)
}

let validater = {
  email: function (ignoreEmpty, val) {
    val = trim(val)
    if (!val) {
      return ignoreEmpty
    }
    return /^([a-zA-Z0-9]+[_|\_|\.-]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.-]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,6}$/.test(val)
  },
  phone: function (ignoreEmpty, val) {
    val = trim(val)
    if (!val) {
      return ignoreEmpty
    }
    return /^1[3|4|5|8][0-9]\d{4,8}$/.test(val)
  },
  idcard: function (ignoreEmpty, val) {
    val = trim(val)
    if (!val) {
      return ignoreEmpty
    }
    return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(val)
  },
  length: function (ignoreEmpty, val, minLen, maxLen) {
    return checkVal(ignoreEmpty, val, minLen, maxLen, true)
  },
  equal: function (ignoreEmpty, val, min, max) {
    return checkVal(ignoreEmpty, val, min, max)
  },
  required: function (ignoreEmpty, val) {
    return checkVal(ignoreEmpty, val, 1, 1, true)
  },
  numeric: function (ignoreEmpty, val) {
    val = trim(val)
    if (!val) {
      return ignoreEmpty
    }
    return !isNaN(parseFloat(val)) && isFinite(val)
  },
  pattern: function (ignoreEmpty, val, pattern) {
    pattern = trim(pattern)
    if (!pattern) {
      return false 
    }
    val = trim(val)
    if (val === null || val === undefined) {
      return ignoreEmpty
    }
    return pattern.test(val)
  }
}

export default function (types, val, args, ignoreEmpty) {
  if (typeof types !== 'object') {
    types = [types]
    args = [args]
  }
  let status = true
  ignoreEmpty = !!ignoreEmpty
  for (let i=0; i<types.length; i++) {
    if (validater[types[i]]) {
      let args0 = [ignoreEmpty, val].concat(args[i])
      status = status && validater[types[i]].apply({}, args0)
    } else {
      return false
    }
    if (!status) {
      return false
    }
  }
  return status
}
