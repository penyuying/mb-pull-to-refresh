
export declare class PullToRefresh<T,TB=any> {

        public myIScroll:T;

        constructor(el:Element|string, options:IPullToRefreshOptions<TB>, IScroll:any);
        /**
         *初始化上拉加载
        */
        pullUpInit():void;

        /**
         *重置上拉
        */
        resetPullUp():void;

        /**
         * 清除上拉加载
         */
        clearPullUp():void;
        /**
         *上拉完成加载
        *
        */
        pullUpFinish():void;
        /**
         * 上拉开始加载
         * @param {Boolean} isPullUp 是否执行回调（true是）
         */
        startUpLoad(isPullUp?:boolean):void;


        /**
         * 初始化下拉刷新
         */
        pullDownInit():void;
        /**
         * 重置下拉刷新
         */
        resetPullDown():void;

        /**
         * 下拉自动完成
         */
        pullDownfinishAuto():void;
        /**
         * 下拉完成
         * @param {Number} time 结束时隐藏节点的动画时间
         */
        pullDownfinish(time:number):void;
}

/**
 * 上拉加载下拉刷新
 *
 * @export
 * @interface IPullToRefreshOptions
 */
export interface IPullToRefreshOptions<T> {
    sleep?: Number; // 等待完成时间
    pullDownHeight?: Number;
    pullUpDistance?: Number; // 距离底部触发下拉的距离
    pullDownTextEl?: string; // 下拉显示文字的节点
    isPullDown?: Boolean; // 是否启用下拉刷新效果
    isPullUp?: Boolean; // 是否启用上拉加载效果
    pullUpAutoInit?: Boolean; // 自动初始化上拉加载效果
    pullDownAutoInit?: Boolean; // 自动初始化下拉刷新效果
    iScroll?: T; // IScroll参数
    pullUpCallback?: Function ; // 上拉回调
    scrollUpCallback?: Function ; // 滚动条向上滚动时的回调
    scrollDownCallback?: Function; // 滚动条向下滚动回调position：为当前移动位置
    isA?: boolean; // true使用AScroll;false使用BScroll
}
