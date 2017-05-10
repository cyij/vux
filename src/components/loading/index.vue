<template>
  <transition name="vux-mask">
    <div class="weui-loading_toast" v-show="show">
      <div class="weui-mask_transparent"></div>
      <div class="weui-toast" :style="{ position: position; width: width }">
        <i class="weui-loading weui-icon_toast"></i>
        <p class="weui-toast__content">{{ text }}<slot></slot></p>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: '加载中'
    },
    position: String
  },
  created () {
    this.show = this.value
    let width = this.text.length
    if (width > 20) {
      width = 20
    }
    width += 2
    this.width = width + 'em'
  },
  data () {
    return {
      show: false,
      width: 'auto'
    }
  },
  watch: {
    value (val) {
      this.show = val
    },
    show (val) {
      this.$emit('input', val)
    }
  }
}
</script>

<style lang="less">
@import '../../styles/weui/widget/weui_tips/weui_mask';
@import '../../styles/weui/widget/weui_tips/weui_toast';
@import '../../styles/weui/widget/weui-loading/weui-loading.less';

.weui-icon_toast.weui-loading {
  margin: 30px 0 0;
  width: 38px;
  height: 38px;
  vertical-align: baseline;
  display: inline-block;
}
.vux-mask-enter, .vux-mask-leave-active {
  opacity: 0;
}
.vux-mask-leave-active, .vux-mask-enter-active {
  transition: opacity 300ms;
}
</style>
