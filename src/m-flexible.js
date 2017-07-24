;(function (win, lib) {
  var flexible = lib.flexible || (lib.flexible = {});
  var doc = win.document;
  var docEl = doc.documentElement;
  var metaEl = doc.querySelector('meta[name="viewport"]');
  var styleEl = document.createElement("style");
  var tid;
  // 像素比
  var dpr;
  // 缩放
  var scale;
  // 基准像素
  var baseFontSize = 100;

  if (metaEl) {
    console.warn('将根据已有的meta标签来设置缩放比例');
    var match = metaEl.getAttribute('content').match(/initial\-scale=([\d\.]+)/);
    if (match) {
      scale = parseFloat(match[1]);
      dpr = parseInt(1 / scale);
    }
  }

  if (!dpr && !scale) {
    dpr = win.devicePixelRatio || 1;
    scale = 1 / dpr;
  }

  // 设置data-dpr属性，留作的css hack之用
  docEl.setAttribute('data-dpr', dpr);
  if (!metaEl) {
    metaEl = doc.createElement('meta');
    metaEl.setAttribute('name', 'viewport');
    // 最好设置一下width=device-width，在安卓中X5浏览器有bug
    metaEl.setAttribute('content', 'width=device-width,initial-scale=' + scale + ',maximum-scale=' + scale + ',minimum-scale=' + scale + ',user-scalable=no');
    if (docEl.firstElementChild) {
      docEl.firstElementChild.appendChild(metaEl);
      docEl.firstElementChild.appendChild(styleEl);
    } else {
      var wrap = doc.createElement('div');
      wrap.appendChild(metaEl);
      doc.write(wrap.innerHTML);
    }
    if (980 == docEl.clientWidth) {
      metaEl.setAttribute("content", "target-densitydpi=device-dpi,width=device-width,user-scalable=no,initial-scale=1,maximum-scale=1,minimum-scale=1");
    }
  }

  function refreshRem() {
    var width = docEl.clientWidth;
    var ua = win.navigator.userAgent;
    var style = "}";
    if (!ua.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i)) {
      if (width > 1024) {
        width = 640;
        style = ";max-width:" + width + "px;margin-right:auto!important;margin-left:auto!important;}";
      }
    }
    
    // 高清
    // win.rem = width / 10;
    win.rem = baseFontSize / 2 * dpr;

    // if (/ZTE U930_TD/.test(ua)) {
    //   win.rem = 1.13 * win.rem;
    // }
    // if (/Android\s+4\.4\.4;\s+M351\s/.test(ua)) {
    //   win.rem = win.rem / 1.05;
    // }
    // if (/Android\s+5\.0\.1;\s+MX4\s/.test(ua)) {
    //   win.rem = 1.06382 * win.rem;
    // }
    // styleEl.innerHTML = "html{font-size:" + win.rem + "px!important;}body{font-size:" + parseInt(12 * (width / 320)) + "px" + style;
    styleEl.innerHTML = "html{font-size:" + win.rem + "px!important;}body{font-size:" + (12 * dpr) + "px" + style;
  }

  win.addEventListener('resize', function () {
    clearTimeout(tid);
    tid = setTimeout(refreshRem, 300);
  }, false);

  win.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      clearTimeout(tid);
      tid = setTimeout(refreshRem, 300);
    }
  }, false);

  refreshRem();

  flexible.dpr = win.dpr = dpr;
  flexible.rem = win.rem;
  flexible.refreshRem = refreshRem;
})(window, window['lib'] || (window['lib'] = {}));