
import F2 from '@antv/f2';

function wrapEvent(e) {
  if (!e) return;
  if (!e.preventDefault) {
    e.preventDefault = function() {};
  }
  return e;
}

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    onInit: {
      type: 'Function',
      value: () => {}
    },
    opts: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  ready() {
    if (!this.data.opts.lazyLoad) {
      this.init();
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    init (callback) {
      const query = wx.createSelectorQuery().in(this);
      query.select('.f2-canvas').fields({
        node: true,
        size: true
      }).exec(res => {
        const { node, width, height } = res[0];
        const context = node.getContext('2d');
        const pixelRatio = wx.getSystemInfoSync().pixelRatio;
        // 高清设置
        node.width = width * pixelRatio;
        node.height = height * pixelRatio;

        F2.Global.fontFamily = 'sans-serif';
        const config = { context, width, height, pixelRatio };
        if (!this.chart) {
          if (this.data.opts.padding) {
            config.padding = this.data.opts.padding
          }
          this.chart = new F2.Chart(config)
        } else {
          this.chart.clear();
        }
        if (typeof callback === 'function') {
          callback(this.chart);
        } else if (this.data.onInit) {
          this.data.onInit(this.chart);
        }
        this.canvasEl = this.chart.get('el');
      });
    },
    touchStart(e) {
      const canvasEl = this.canvasEl;
      if (!canvasEl) {
        return;
      }
      canvasEl.dispatchEvent('touchstart', wrapEvent(e));
    },
    touchMove(e) {
      const canvasEl = this.canvasEl;
      if (!canvasEl) {
        return;
      }
      canvasEl.dispatchEvent('touchmove', wrapEvent(e));
    },
    touchEnd(e) {
      const canvasEl = this.canvasEl;
      if (!canvasEl) {
        return;
      }
      canvasEl.dispatchEvent('touchend', wrapEvent(e));
    }
  }
});
