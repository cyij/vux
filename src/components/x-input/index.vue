<template>
<div class="weui-cell" :class="{'weui-cell_warn': !!error}">
  <div class="weui-cell__hd">
    <slot name="label">
      <label class="weui-label" :style="{width: $parent.labelWidth || (labelWidth + 'em'), textAlign: $parent.labelAlign, marginRight: $parent.labelMarginRight}" v-if="title" v-html="title"></label>
      <span v-show="tips">{{tips}}</span>
    </slot>
  </div>
  <div class="weui-cell__bd">
    <input class="weui-input" 
           type="text" 
           :placeholder="placeholder"
           :style="inputStyle"
           :readonly="readonly"
           :disabled="disabled"
           v-model="currentValue"
           :spellcheck="spellcheck"
           :autocapitalize="autocapitalize"
           :autocomplete="autocomplete"
           :autocorrect="autocorrect"
           @focus="focusHandler"
           @blur="blur"
           ref="input" />
  </div>

  <div class="weui-cell__ft">
    <icon type="clear" v-show="!readonly && !disabled && currentValue && showClear" @click.native="clear"></icon>
    <a v-if="showVcode" href="javascript:;" :style="vcodeStyle" class="weui-vcode-btn" @click="vcodeClick" ref="vcode">{{vcodeText}}</a>

    <slot name="right"></slot>
  </div>
</div>
</template>

<script>
import {Icon} from 'vux'
import Validator from '../../libs/util/validate'
import Util from '../../libs/util/util'

export default {
  components: {
    Icon
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    showVcode: {
      type: Boolean,
      default: false
    },
    vcodeDelay: {
      type: Number,
      default: 60
    },
    vcodeText: {
      type: String,
      default: '获取验证码'
    },
    vcodeDelayText: {
      type: String,
      default: '重新发送 (__)'
    },
    vcodeStyle: Object,
    placeholder: String,
    value: [String, Number],
    readonly: Boolean,
    disabled: Boolean,
    tips: String,
    showClear: {
      type: Boolean,
      default: true
    },
    textAlign: String,
    // https://github.com/yisibl/blog/issues/3
    autocomplete: {
      type: String,
      default: 'off'
    },
    autocapitalize: {
      type: String,
      default: 'off'
    },
    autocorrect: {
      type: String,
      default: 'off'
    },
    spellcheck: {
      type: String,
      default: 'false'
    },
    validator: String
  },
  data () {
    return {
      firstError: '',
      forceShowError: false,
      hasLengthEqual: false,
      currentValue: '',
      currentVCodeDelay: 0,
      validators: [],
      error: ''
    }
  },
  created () {
    this.currentValue = this.value || ''
    if (this.validator) {
      let vs = this.validator.split(';')
      for (let i=0; i<vs.length; i++) {
        vs[i] = Util.trim(vs[i])
        if (!vs[i]) {
          continue
        }
        let func, params=[], error
        vs[i] = vs[i].split('|')
        let tmp = Util.trim(vs[i][0])
        if (vs[i].length > 1) {
          error = Util.trim(vs[i][1])
        }
        let pos = tmp.indexOf('(')
        if (pos >= 0) {
          func = Util.trim(tmp.substr(0, pos))
          tmp = tmp.substr(pos+1, tmp.length-pos-2).split(',')
          for (let j=0; j<tmp.length; j++) {
            tmp[j] = Util.trim(tmp[j])
            if (tmp[j]) {
              params.push(tmp[j])
            }
          }
        } else {
          func = tmp
        }
        this.validators.push([func, params, error])
      }
    }
  },
  mounted () {
    this.$nextTick(function () {
      if (this.type) {
        this.$refs.input.setAttribute('type', this.type)
      }
    })
  },
  beforeDestroy () {
    if (this._debounce) {
      this._debounce.cancel()
    }
  },
  computed: {
    labelWidth () {
      return this.title.replace(/[^x00-xff]/g, '00').length / 2 + 1
    },
    inputStyle () {
      if (this.textAlign) {
        return {
          textAlign: this.textAlign
        }
      }
    }
  },
  methods: {
    reset (value = '') {
      this.dirty = false
      this.currentValue = value
      this.firstError = ''
      this.validate(true)
    },
    clear () {
      this.currentValue = ''
      this.$refs.input.focus()
      this.validate(true)
    },
    focus () {
      this.$refs.input.focus()
    },
    getError () {
      return this.error
    },
    focusHandler () {
      this.$emit('on-focus', this.currentValue)
    },
    blur () {
      this.validate(true)
      this.$emit('on-blur', this.currentValue)
    },
    validate (ignoreEmpty) {
      if (this.validators.length < 1) {
        return true 
      }
      let status = true, error
      for (let i=0; i<this.validators.length; i++) {
        let validate = this.validators[i]
        if (!Validator(validate[0], this.currentValue, validate[1], ignoreEmpty)) {
          status = false
          error = validate[2]
          break
        }
      }
      if (!status) {
        if (!error) {
          error = this.title + '不正确'
        }
        this.error = error
      } else {
        this.error = ''
      }
      return status
    },
    vcodeClick () {
      if (this.currentVCodeDelay > 0) {
        return
      }
      this.$emit('on-vcode-click')
    },
    showDelay () {
      let that = this
      let t = setInterval(function() {
        if (that.currentVCodeDelay >= that.vcodeDelay) {
          clearInterval(t)
          this.currentVCodeDelay = 0
          that.$refs.vcode.innerHTML = that.vcodeText
        } else {
          that.currentVCodeDelay++
          let vcodeDelayText = that.vcodeDelayText
          if (vcodeDelayText.indexOf('__') >= 0) {
            vcodeDelayText = vcodeDelayText.replace(/__/, (that.vcodeDelay - that.currentVCodeDelay))
          } else {
            vcodeDelayText = vcodeDelayText + (that.vcodeDelay - that.currentVCodeDelay)
          }
          that.$refs.vcode.innerHTML = vcodeDelayText
        }
      }, 1000)
    }
  },
  watch: {
    value (val) {
      this.currentValue = val
      this.$emit('on-change', val)
      this.$emit('input', val)
    },
    currentValue (newVal) {
      this.$emit('input', newVal)
      if (this._debounce) {
        this._debounce()
      } else {
        this.$emit('on-change', newVal)
      }
    }
  }
}
</script>
