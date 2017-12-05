var _PullToRefresh = (function (win) {
  /**
   * 下拉刷新上拉加载更多
   * @class
   * @param {Dom} el 滚动条节点
   * @param {Object} options 选项
   * @param {Function} IScroll IScroll方法
   */
    function _PullDown(el, options, IScroll) {
        var _this = this;
        _this.el = _this._getEl(el);
        if (!_this.el || !IScroll) {
            return;
        }
        _this.__IScroll = IScroll;
        _this._prefixes = ['Webkit', 'Moz', 'O', 'Ms', 'Khtml'];
        var _options = _this._options = _this._extend({ // 默认选项
            sleep: 500, // 等待完成时间
            pullDownHeight: 54,
            pullUpDistance: -10, // 距离底部触发下拉的距离
            pullDownTextEl: '.hook_text', // 下拉显示文字的节点
            isPullDown: false, // 是否启用下拉刷新效果
            isPullUp: true, // 是否启用上拉加载效果
            pullUpAutoInit: false, // 自动初始化上拉加载效果
            pullDownAutoInit: false, // 自动初始化下拉刷新效果
            iScroll: {
                click: true
            },
            pullUpCallback: function () {
                // setTimeout(function(){
                //     _this.pullUpFinish();
                // },1000);
            },
            scrollUpCallback: function (position) { // 滚动条向上滚动回调position：为当前移动位置

            },
            scrollDownCallback: function (position) { // 滚动条向下滚动回调position：为当前移动位置

            }
        }, options);
        _this._iScrollInit();

        _options.pullDownAutoInit && _this.pullDownInit();
        _options.pullUpAutoInit && _this.pullUpInit();
        _this._bind();
  }

  _PullDown.prototype = {

        /**
         * 合并对象
         *
         * @param {Object} def 默认对象
         * @param {Object} now 被合并的对象
         * @returns {Object} def合并完的对象
         */
        _extend: function (def, now) {
            if (def || now) {
                for (var item in now) {
                    def[item] = now[item];
                }
            }
            return def;
        },

        /**
         * 格式化正则文本
         *
         * @param {any} regText 需要格式化的文本
         * @returns {String} 格式化好的文本
         */
        _formatRegText: function (regText) {
            if (!regText) {
                return regText;
            }
            return regText.replace(/[-[\]{}()*+?.^$|/]/g, '\\$&');
        },

        /**
         * 添加class名
         * @param {Dom} el 元素节点
         * @param {String} className class名称
         * @return {Dom} 节点
         */
        _addClassName: function (el, className) {
            var _this = this;
            if (!el || !className) {
                return el;
            }
            var reg = new RegExp('\\s*' + _this._formatRegText(className) + '(\\s*|$)', 'g');
            var _className = el.className.replace(reg, function ($1) {
                return ' ';
            });

            el.className = _className + ' ' + className;
            return el;
        },

        /**
         * 移除class名
         * @param {Dom} el 元素节点
         * @param {String} className class名称
         * @return {Dom} 节点
         */
        _removeClassName: function (el, className) {
            var _this = this;
            if (!el || !className) {
                return el;
            }
            var reg = new RegExp('\\s*' + _this._formatRegText(className) + '(\\s*|$)', 'g');
            el.className = el.className.replace(reg, '');
            return el;
        },
        /**
         * 给CSS3属性名称加前缀
         * @protected
         * @param {String} text CSS3属性名
         * @return {String} 返回加前缀后的名称
         */
        _formatStyle: function (text) { // 格式化CSS3属性名
            var _this = this,
                prefixes = _this._prefixes,
                ret = '',
                i,
                plength,
                elm = document.createElement('div');
            _this._memory = _this._memory || {};
            if (!text) {
                return ret + text;
            }
            if (!_this._memory[text]) {
                for (i = 0, plength = prefixes.length; i < plength; i++) {
                    var _fix = '-' + prefixes[i].toLowerCase() + '-';
                    if (typeof elm.style[_fix + text] !== 'undefined') {
                        ret = _fix;
                        _this._prefixes = [];
                        _this._prefixes.push(prefixes[i]);
                        break;
                    }
                }
                if (!ret && typeof elm.style[text] !== 'undefined') { // IE9有可能有些属性不加前缀也是可以，但是没有效果
                    ret = '';
                }

                if (typeof elm.style[ret + text] !== 'undefined') {
                    _this._memory[text] = ret + text;
                } else {
                    _this._memory[text] = '';
                }
            }

            return _this._memory[text];
        },

        /**
         * 初始化iScroll插件
         */
        _iScrollInit: function () {
            var _this = this,
            _el = this.el,
            _options = _this._options;
            var _iScrollopt = _this._extend({
                bounce: false,
                scrollbar: true,
                scrollbars: true,
                // fadeScrollbars: true,
                // shrinkScrollbars: 'clip',
                probeType: 3,
                freeScroll: false
            }, _options.iScroll);
            _iScrollopt.scrollbar = _iScrollopt.scrollbars;
            _this.myIScroll = new _this.__IScroll(_el, _iScrollopt);

            _this.pullDownInit();

            var imgList = _el.querySelectorAll('img'),
                imgTimeout;

            if (imgList && !_iScrollopt.imgLoad) {
                for (var i = 0; i < imgList.length; i++) {
                    var _element = imgList[i];
                    _element.addEventListener('load', function () {
                        imgTimeout && clearTimeout(imgTimeout);
                        imgTimeout = setTimeout(function () {
                            if (!_this._downLock) {
                                _this.myIScroll.refresh();
                            }
                        }, 20);
                    });
                }
            }
        },
        /*
        *获取节点
        *@param {Node|String} el 节点、class或ID
        *@param {Node} parent 父节点
        */
        _getEl: function (el, parent) {
            var _el = '';
            parent = parent || document;
            if (typeof el == 'string') {
                _el = parent.querySelector(el);
            } else {
                _el = el;
            }
            return _el;
        },

        /**
         * 创建转换成dom元素
         *
         * @param {String} html html文本
         * @returns {Node} DOM节点/元素
         */
        _createNode: function (html) {
            var _cloneItem = document.createDocumentFragment(),
                _divDom = document.createElement('div'),
                _divDomChilds;

            _cloneItem.appendChild(_divDom);
            _divDom.innerHTML = html;
            _divDomChilds = _divDom.childNodes || [];

            for (var i = 0; i < _divDomChilds.length; i++) {
                _cloneItem.appendChild(_divDomChilds[i]);
            }
            _cloneItem.removeChild(_divDom);

            return _cloneItem;
        },

        /**
         * 设置下拉节点高度
         *
         * @param {Dom} el 下拉的节点
         * @param {Number} _height 高度
         * @param {Number} _time 结束时动画的时间
         */
        _setNodeHeight: function (el, _height, _time) {
            var _this = this,
                _attr = _this._formatStyle('transition-duration');
            if (el) {
                el.style[_attr] = _time + 'ms';
                el.style.height = _height + 'px';
            }
            if (_this._domDown == el && el) {
                _this._domDownDelTimeout && clearTimeout(_this._domDownDelTimeout);
                if (_height <= 0) {
                    _this._domDownDelTimeout = setTimeout(function () {
                        if (el.parentNode) {
                            el.parentNode.removeChild(el);
                        }
                        _this._domDown = undefined;
                        _this.myIScroll.refresh();
                    }, _time);
                }
            }
        },

        /**
         *初始化上拉加载
        */
        pullUpInit: function () {
            var _this = this,
                _options = _this._options,
                _myIScroll = _this.myIScroll;

            if (!_options.isPullUp) {
                return;
            }

            _this.resetPullUp();
            _myIScroll.on('slideUp', function (y) {
                _this._slideUp(y);
            });
        },

        /**
         *重置上拉
        */
        resetPullUp: function () {
            var _this = this,
                _options = _this._options;
            if (!_options.isPullUp) {
                return;
            }
            _this.clearPullUp();
            _this._domUp = _this._domUp || _this._createUpNode();
            // _this._upLock = false;
            // _this._pullUpFinish = false;
            setTimeout(function () {
                _this.myIScroll.refresh();
            }, 100);
        },

        /**
         * 清除上拉加载
         */
        clearPullUp: function () {
            var _this = this;
            if (_this._domUp && _this._domUp.parentNode) {
                _this._domUp.parentNode.removeChild(_this._domUp);
            }
            _this._domUp = undefined;
            _this._upLock = false;
            _this._pullUpFinish = false;
        },
        /**
         *上拉完成加载
        *
        */
        pullUpFinish: function () {
            var _this = this,
                _options = _this._options,
                _myIScroll = _this.myIScroll;
            if (!_options.isPullUp) {
                return;
            }
            _this._upLock = true;
            _this._pullUpFinish = true;
            if (_this._domUp && _this._domUp.parentNode) {
                _this._domUp = _this._domUp;
            } else {
                _this._domUp = _this._createUpNode();
            }

            if (_this._domUp) {
                var _msgText = _this._getEl('.kid_text', _this._domUp);
                var _msgIcon = _this._getEl('.kid_icon', _this._domUp);
                _msgText.innerHTML = '没有更多数据了';
                _this._removeClassName(_msgText, 'kid_loading');
                _msgIcon.style.display = 'block';
                _myIScroll.refresh();
                // _myIScroll.scrollTo(0,_myIScroll.maxScrollY);
            }
        },
        /**
         * 上拉开始加载
         * @param {Boolean} isPullUp 是否执行回调（true是）
         */
        startUpLoad: function(isPullUp) {
            var _this = this;
            // 这里不用重置是阻止有的时候正在执行上拉的时候调用了本方法
            _this._domUp = _this._domUp || _this._createUpNode();
            _this._startUpLoad(!isPullUp);
        },
        /**
         * 上拉开始加载
         * @param {Boolean} isPullUp 是否执行回调（true否）
         */
        _startUpLoad: function (isPullUp) {
            var _this = this,
                _options = _this._options; // ,
            // _myIScroll = _this.myIScroll;

            if (!_options.isPullUp) {
                return;
            }

            if (_this._domUp && !_this._upLock) {
                _this.resetPullDown(); // 重置下拉刷新
                var _msgText = _this._getEl('.kid_text', _this._domUp);

                _msgText.innerHTML = '正在加载...';
                _this._addClassName(_msgText, 'kid_loading');
                _this.myIScroll.refresh();
                if (!isPullUp) {
                    _this._upLock = true;
                    if (_this._touchEnd) {
                        if (_options.pullUpCallback instanceof Function) {
                            _options.pullUpCallback();
                        }
                    }
                }
            }
        },
        /*
        *开始上拉
        */
        _slideUp: function (y) {
            var _this = this,
                _options = _this._options,
                _distance = _options.pullUpDistance;
            if (_this._domUp) {
                if (y > _distance) {
                    _this._startUpLoad();
                }
            }
        },
        /**
         *创建上拉节点
        *@returns {Dom} 节点
        */
        _createUpNode: function () {
            var _this = this,
                _childNodes = _this.el.childNodes,
                _res,
                _domContent;
            if (_childNodes && _childNodes.length > 0) {
                for (var i = 0; i < _childNodes.length; i++) {
                    if (_childNodes[i].nodeType == 1) {
                        _domContent = _childNodes[i];
                        break;
                    }
                }
            }

            var _domUp = _this._createNode('<div class="kids_pullUp">' +
                '<div class="kid_pullUp-msg-wrap">' +
                '<div class="kid_pullUp-msg">' +
                '<span class="kid_icon">&#xe640;</span>' +
                '<span class="kid_text">' +
                '上拉显示更多' +
                '</span>' +
                '</div>' +
                '</div>' +
                '</div>');

            _res = _domUp.querySelector('.kids_pullUp');
            _domContent.appendChild(_domUp);

            return _res;
        },
        /**
         * 下拉事件
         *
         * @param {any} y 下拉出来超出内容区域的位置
         */
        _slideDown: function (y) {
            var _this = this,
                _options = _this._options,
                _pullDownHeight = _options.pullDownHeight;

            if (!_options.isPullDown || !_options.pullDownAutoInit) {
                return;
            }

            _this._domDown = _this._domDown || _this._createDownNode();
            _this._stopFinish();
            if (_this._domDown) {
                var _textElWrap = _this._getEl(_options.pullDownTextEl, _this._domDown),
                    _TextEl = _this._getEl('.kid_pullDown-msg-text', _textElWrap);

                if (y >= _pullDownHeight / 2 - 6 && _this._touchEnd && !_this._downLock) {
                    _this._setNodeHeight(_this._domDown, _pullDownHeight, 100);
                    _this._downLock = true;
                    _TextEl.innerHTML = '正在刷新';
                    _this.pullDownfinishAuto();
                } else {
                    // _this._downLock = false;
                    if (!_this._downLock) {
                        _this._touchEnd = false;

                        if (_TextEl) {
                        if (y > _pullDownHeight / 2 - 2) {
                            _TextEl.innerHTML = '释放刷新';
                        } else {
                            _TextEl.innerHTML = '下拉刷新';
                        }
                        }

                        _this._setNodeHeight(_this._domDown, y, 0);
                    } else {
                        _this.pullDownfinishAuto();
                    }
                }
            }
        },
        /**
         *创建下拉节点
        *@returns {Dom} 节点
        */
        _createDownNode: function () {
            var _this = this,
                _childNodes = _this.el.childNodes,
                _res,
                _domContent;
            if (_childNodes && _childNodes.length > 0) {
                for (var i = 0; i < _childNodes.length; i++) {
                if (_childNodes[i].nodeType == 1) {
                    _domContent = _childNodes[i];
                    break;
                }
                }
            }

            var _domDown = _this._createNode('<div class="kids_pullDown">' +
                '<div class="kid_pullDown-msg-wrap">' +
                '<ul class="kid_pullDown-msg-list">' +
                '<li class="kid_pullDown-msg-item">' +
                '<span class="kid_pullDown-msg-text kid_pullDown-msg-left">正品保证</span>' +
                '</li>' +
                '<li class="kid_pullDown-msg-item">' +
                '<span class="kid_pullDown-msg-text kid_pullDown-msg-right">7天放心退</span>' +
                '</li>' +
                '<li class="kid_pullDown-msg-item">' +
                '<span class="kid_pullDown-msg-text kid_pullDown-msg-left">童年精选</span>' +
                '</li>' +
                '<li class="kid_pullDown-msg-item kid_pullDown-msg-active hook_text">' +
                '<span class="kid_pullDown-msg-text kid_pullDown-msg-right">下拉刷新</span>' +
                '</li>' +
                '</ul>' +
                '</div>' +
                '</div>');

            _res = _domDown.querySelector('.kids_pullDown');
            _domContent.insertBefore(_domDown, _domContent.firstChild);

            return _res;
        },
        /**
         *暂停下拉完成
        */
        _stopFinish: function () {
            var _this = this;
            _this._pullDownOut && clearTimeout(_this._pullDownOut);
        },
        /**
         * 初始化下拉刷新
         */
        pullDownInit: function () {
            var _this = this,
                _options = _this._options,
                _myIScroll = _this.myIScroll;

            if (!_options.isPullDown || !_options.pullDownAutoInit) {
                return;
            }

            // if (_this._domDown && _this._domDown.parentNode) {
            //     _this._domDown.parentNode.removeChild(_this._domDown);
            //     _this._domDown = undefined;
            // }
            _this.resetPullDown();
            _myIScroll.on('slideDown', function (y) {
                _this._slideDown(y);
            });
        },
        /**
         * 重置下拉刷新
         */
        resetPullDown: function () {
            var _this = this,
                _options = _this._options;
                // _myIScroll = _this.myIScroll;
            if (!_options.isPullDown || !_options.pullDownAutoInit) {
                return;
            }

            _this._stopFinish();
            if (_this._domDown && _this._domDown.parentNode) {
                _this._domDown.parentNode.removeChild(_this._domDown);
                _this._domDown = undefined;
            }
        },

        /**
         * 下拉自动完成
         */
        pullDownfinishAuto: function () {
            var _this = this,
                _options = _this._options,
                _time = 300, // 动画时间
                _sleep = _options.sleep || 0; // 睡眠时间

            if (_this._downLock) {
                _this._pullDownOut && clearTimeout(_this._pullDownOut);
                _this._pullDownOut = setTimeout(function () {
                    _this.pullDownfinish(_time);
                }, _sleep);
            }
        },
        /**
         * 下拉完成
         * @param {Number} _time 结束时隐藏节点的动画时间
         */
        pullDownfinish: function (_time) { // 下拉完成
            var _this = this;
            _this._setNodeHeight(_this._domDown, 0, _time);
            _this._downLock = false;
            setTimeout(function () {
                _this._setNodeHeight(_this._domDown, 0, 0);
            }, _time + 1);
        },

        /**
         * 绑定事件
         */
        _bind: function () {
            var _this = this,
                _options = _this._options,
                _myIScroll = this.myIScroll;

            var _scrollY = 0,
                _isScroll = false;

            _myIScroll.on('scrollStart', function () { // 开始滚动页面
                _this.myIScroll.refresh();
                if (!_this._downLock && !_this._upLock) {
                    _this._touchEnd = false;
                }
                _scrollY = _myIScroll.y;
                _isScroll = false;
            });

            _myIScroll.on('scroll', function () { // 页面滚动中
                // 当下拉，使得边界超出时，如果手指从屏幕移开，则会触发该事件
                // console.log(this.y);
                if (this.y > 1) {
                    if (this._execEvent) { // 下拉
                        this._execEvent('slideDown', this.y);
                    } else {
                        this.trigger('slideDown', this.y);
                    }
                }
                var _distance = _options.pullUpDistance;
                if (this.maxScrollY - this.y > 1 + Math.min(_distance, 0)) { // 上拉
                    if (this._execEvent) {
                        this._execEvent('slideUp', this.maxScrollY - this.y);
                    } else {
                        this.trigger('slideUp', this.maxScrollY - this.y);
                    }
                }
                if (!_isScroll) {
                    if (_scrollY - this.y > 5) { // 上拉
                        // _isScroll=true;
                        if (_options.scrollUpCallback && _options.scrollUpCallback instanceof Function) {
                            _options.scrollUpCallback(_scrollY - this.y);
                        }
                    } else if (_scrollY - this.y < -5) { // 下拉
                        // _isScroll=true;
                        if (_options.scrollDownCallback && _options.scrollDownCallback instanceof Function) {
                            _options.scrollDownCallback(_scrollY - this.y);
                        }
                    }
                }
            });

            _myIScroll.on('scrollEnd', function () { // 页面滚动结束
                if (!_this._downLock) {
                    _this._setNodeHeight(_this._domDown, 0);
                }
            });

            _this.el.addEventListener('touchend', function() { // 手指离开屏
                _setTouchEnd();
            });

            _this.el.addEventListener('mouseup', function() { // 鼠标抬起
                _setTouchEnd();
            });

            document.addEventListener('touchend', function() { // 手指离开屏
                _setTouchEnd();
            });

            /**
             * 手指离开屏
             *
             */
            function _setTouchEnd() {
                if (!_this._touchEnd && _this._upLock && !_this._pullUpFinish) {
                    if (_options.pullUpCallback instanceof Function) {
                        _options.pullUpCallback();
                    }
                }
                _this._touchEnd = true;
                _isScroll = true;

                _this._slideDown(_myIScroll.y); // 结束下拉
            }
        }
    };

    win.PullDown = _PullDown;

    return _PullDown;
})(window);

export var PullToRefresh = _PullToRefresh;
