<template>
<div class="weui-cells_checkbox">
  <label class="weui-cell weui-check__label" v-for="(one, index) in datas">
    <div v-if="align !== 'right'" class="weui-cell__hd" :style="{width: $parent.labelWidth, marginRight: $parent.labelMarginRight}">
      <input type="radio" class="weui-check" v-model="currentValue" :name="name" ref="input" :value="index" @click="onClick">
      <i class="weui-icon-checked"></i>
    </div>
    <div class="weui-cell__bd">
      <p :style="{textAlign: $parent.labelAlign}">{{one}}</p>
    </div>
    <div v-if="align === 'right'" class="weui-cell__ft">
      <span class="weui-icon-checked"></span>
    </div>
  </label>
</div>
</template>

<script>

export default {
  props: {
    datas: {
      type: Array,
      required: true
    },
    value: [String, Number],
    name: String,
    align: String,
    type: String
  },
  mounted () {
    this.$nextTick(function () {
      if (this.type) {
        this.$refs.input.setAttribute('type', this.type)
      }
    })
  },
  data () {
    return {
      currentValue: this.value,
      preValue: this.value
    } 
  },
  methods: {
    onClick (e) {
      if (this.value != null && this.currentValue == this.preValue) {
        this.currentValue = null
      } else {
        this.preValue = this.currentValue
      }
    }
  },
  watch: {
    value (val) {
      this.currentValue = val
    },
    currentValue (newVal) {
      this.$emit('input', newVal)
    },
  },
  data () {
    return {
      currentValue: this.value
    }
  }
}

</script>

<style lang="less">
@import '../../styles/weui/widget/weui_cell/weui_check';
@import '../../styles/weui/widget/weui_cell/weui_form/weui_form_common';
@import '../../styles/weui/icon/weui_icon_font';
.weui-cell_radio > * {
  pointer-events: none;
}
.vux-radio-icon {
  width: 24px;
  height:24px;
  display: inline-block;
  vertical-align: middle;
  margin-right: 5px;
}
.vux-radio-label {
  vertical-align: middle;
}
</style>
