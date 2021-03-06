import AlertComponent from '../../components/alert'
import { mergeOptions } from '../../libs/plugin_helper'

let $vm

const plugin = {
  install (Vue) {
    if (!$vm) {
      const Alert = Vue.extend(AlertComponent)
      $vm = new Alert({
        el: document.createElement('div')
      })
      document.body.appendChild($vm.$el)
    }

    const alert = {
      isShow: false,
      show (options = {}) {
        if (typeof options === 'object') {
          mergeOptions($vm, options)
        } else if (typeof options === 'string') {
          $vm.title = options
        }
        this.watcher && this.watcher()
        this.watcher = $vm.$watch('showValue', (val) => {
          val && options.onShow && options.onShow($vm)
          if (val === false && options.onHide) {
            options.onHide($vm)
            this.isShow = false
            this.watcher && this.watcher()
          }
        })
        $vm.showValue = true
        this.isShow = true
      },
      hide () {
        $vm.showValue = false
        this.watcher && this.watcher()
        this.watcher = null
        this.isShow = false
      }
    }

    if (!Vue.$vux) {
      Vue.$vux = {
        alert
      }
    } else {
      Vue.$vux.alert = alert
    }

    Vue.mixin({
      created: function () {
        this.$vux = Vue.$vux
      }
    })
  }
}

export default plugin
export const install = plugin.install

