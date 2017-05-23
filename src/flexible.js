;(function (win, lib) {
  var doc = win.document;
  var docEl = doc.documentElement;
  var flexible = lib.flexible || (lib.flexible = {});
  var metaEl = doc.querySelector('meta[name="viewport"]');
  // 像素比
  var dpr = win.devicePixelRatio || 1;
  // 基准像素
  var baseFontSize = 100;

  var ua = win.navigator.userAgent;
  var isChrome = win.chrome;
  // var isAndroid = win.navigator.appVersion.match(/android/gi);
  var isAndroid = ua.match(/Android[\S\s]+AppleWebkit\/(\d{3})/i);
  var isIos = win.navigator.appVersion.match(/(iphone|ipad|ipod)/gi);
  var isX5 = /TBS\/\d+/.test(ua);
  var UCversion = ua.match(/U3\/((\d+|\.){5,})/i);
  var isUCHd = UCversion && parseInt(UCversion[1].split('.').join(''), 10) >= 80;
  if (!isIos && !(isAndroid && isAndroid[1] > 534) && !isChrome && !isUCHd && !isX5) {
    // 如果非iOS, 非Android4.3以上, 非UC内核, 就不执行高清, dpr设为1;
    dpr = 1;
  }
  // 缩放
  var scale = 1 / dpr;

  // 高清
  var rem = baseFontSize / 2 * dpr;

  if (!metaEl) {
    metaEl = doc.createElement('meta');
    metaEl.setAttribute('name', 'viewport');
    doc.head.appendChild(metaEl);
  }

  metaEl.setAttribute('content', 'width=device-width,initial-scale=' + scale + ',maximum-scale=' + scale + ',minimum-scale=' + scale + ',user-scalable=no');

  docEl.style.fontSize = rem + 'px';
  // 设置data-dpr属性，留作的css hack之用
  docEl.setAttribute('data-dpr', dpr);

  if (doc.readyState === 'complete') {
    doc.body.style.fontSize = 12 * dpr + 'px';
  } else {
    doc.addEventListener('DOMContentLoaded', function (e) {
      doc.body.style.fontSize = 12 * dpr + 'px';
    }, false);
  }

  flexible.dpr = win.dpr = dpr;
  flexible.rem = win.rem = rem;
})(window, window['lib'] || (window['lib'] = {}));