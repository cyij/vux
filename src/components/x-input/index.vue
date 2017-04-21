<template>
<div class="weui-cell" :class="{'weui-cell_warn': !!error}">
  <div class="weui-cell__hd">
    <slot name="label">
      <label class="weui-label" :style="{width: $parent.labelWidth || (labelWidth + 'em'), textAlign: $parent.labelAlign, marginRight: $parent.labelMarginRight}" v-if="title" v-html="title"></label>
      <inline-desc v-if="inlineDesc">{{inlineDesc}}</inline-desc>
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
import Icon from '../icon'
import InlineDesc from '../inline-desc'
import Debounce from '../../tools/debounce'

export default {
  components: {
    Icon,
    InlineDesc
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
    inlineDesc: String,
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
    debounce: Number
  },
  data () {
    return {
      hasLengthEqual: false,
      currentValue: '',
      currentVCodeDelay: 0,
      vcodeTimer: ''
    }
  },
  created () {
    this.currentValue = this.value || ''
    if (this.debounce) {
      this._debounce = Debounce(() => {
        this.$emit('on-change', this.currentValue)
      }, this.debounce)
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
    if (this.vcodeTimer) {
      clearInterval(this.vcodeTimer)
    }
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
      if (this.validate) {
        this.validate(true)
      }
    },
    clear () {
      this.currentValue = ''
      this.$refs.input.focus()
      if (this.validate) {
        this.validate(true)
      }
    },
    focus () {
      this.$refs.input.focus()
    },
    focusHandler () {
      this.$emit('on-focus', this.currentValue)
    },
    blur () {
      if (this.validate) {
        this.validate(true)
      }
      this.$emit('on-blur', this.currentValue)
    },
    vcodeClick () {
      if (this.currentVCodeDelay > 0) {
        return
      }
      this.$emit('on-vcode-click')
    },
    showDelay () {
      let that = this
      this.vcodeTimer = setInterval(function() {
        if (that.currentVCodeDelay >= that.vcodeDelay) {
          clearInterval(that.vcodeTimer)
          that.vcodeTimer = ''
          that.currentVCodeDelay = 0
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
<style lang="less">
@import '../../styles/weui/widget/weui_cell/weui_access';
@import '../../styles/weui/widget/weui_cell/weui_cell_global';
@import '../../styles/weui/widget/weui_cell/weui_form/weui_form_common';
@import '../../styles/weui/widget/weui_cell/weui_form/weui_vcode';
</style>
