import BScroll, { BScrollStatic } from 'better-scroll';
import { Type } from '@angular/core/src/type';

export declare class PullToRefresh {

        public myIScroll:Type<BScroll>;

        constructor(el:Element|string, options, IScroll:BScrollStatic);
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