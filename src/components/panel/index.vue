<template>
  <div class="weui-panel weui-panel_access">
    <div class="weui-panel__hd" v-if="header" @click="onClickHeader" v-html="header"></div>
    <div class="weui-panel__bd">
      <!--type==='1'-->
      <template v-if="type === '1'">
        <a v-for="item in list" @click.prevent="onItemClick(item)" class="weui-media-box weui-media-box_appmsg">
          <div class="weui-media-box__hd" v-if="item.src">
            <img class="weui-media-box__thumb" :src="item.src" alt="">
          </div>
          <div class="weui-media-box__bd">
            <h4 class="weui-media-box__title">{{item.title}}</h4>
            <p class="weui-media-box__desc">{{item.desc}}</p>
          </div>
        </a>
      </template>
      <!--type==='2'-->
      <template v-if="type === '2'">
        <div class="weui-media-box weui-media-box_text" v-for="item in list" @click.prevent="onItemClick(item)">
            <h4 class="weui-media-box__title">{{item.title}}</h4>
            <p class="weui-media-box__desc">{{item.desc}}</p>
        </div>
      </template>
      <!--type==='3'-->
      <template v-if="type === '3'">
        <div class="weui-media-box weui-media-box_small-appmsg">
            <div class="weui-cells">
              <a class="weui-cell weui-cell_access" v-for="item in list" @click.prevent="onItemClick(item)">
                <div class="weui-cell__hd">
                  <img :src="item.src" alt="" style="width:20px;margin-right:5px;display:block">
                </div>
                <div class="weui-cell__bd">
                  <p>{{item.title}}</p>
                </div>
                <span class="weui-cell__ft"></span>
              </a>
            </div>
        </div>
      </template>
    </div>
    <div class="weui-panel__ft">
      <a class="weui-cell weui-cell_access weui-cell_link" v-if="footer && type !== '3'" @click.prevent="onClickFooter">
        <div class="weui-cell__bd" v-html="footer.title"></div>
      </a>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    header: String,
    footer: Object,
    list: Array,
    type: {
      type: String,
      default: '1'
    }
  },
  methods: {
    onClickFooter () {
      this.$emit('on-click-footer', this.footer)
    },
    onClickHeader () {
      this.$emit('on-click-header')
    },
    onItemClick (item) {
      this.$emit('on-click-item', item)
    }
  }
}
</script>

<style lang="less">
@import '../../styles/weui/widget/weui_cell/weui_cell_global';
@import '../../styles/weui/widget/weui_cell/weui_access';
@import '../../styles/weui/widget/weui_panel/weui_panel';
@import '../../styles/weui/widget/weui_media_box/weui_media_box';

.weui-panel .weui-cell:first-child:before {
  display: block;
}
</style>
