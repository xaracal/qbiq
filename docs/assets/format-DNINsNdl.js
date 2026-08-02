import{d as e}from"./demo-BHHrK5_N.js";import{Ct as t,It as n,J as r,M as i,Qt as a,X as o,Y as s,Z as c,ct as l,d as u,ht as d,l as f,nt as p,pt as m,t as h,tt as g,vt as _}from"./vue-router-CgJAOi-1.js";import{t as v}from"./button-QI5MaJvK.js";var y=e(`circle-alert`,[[`circle`,{cx:`12`,cy:`12`,r:`10`,key:`1mglay`}],[`line`,{x1:`12`,x2:`12`,y1:`8`,y2:`12`,key:`1pkeuh`}],[`line`,{x1:`12`,x2:`12.01`,y1:`16`,y2:`16`,key:`4dfq90`}]]),b=u.extend({name:`card`,style:`
    .p-card {
        background: dt('card.background');
        color: dt('card.color');
        box-shadow: dt('card.shadow');
        border-radius: dt('card.border.radius');
        display: flex;
        flex-direction: column;
    }

    .p-card-caption {
        display: flex;
        flex-direction: column;
        gap: dt('card.caption.gap');
    }

    .p-card-body {
        padding: dt('card.body.padding');
        display: flex;
        flex-direction: column;
        gap: dt('card.body.gap');
    }

    .p-card-title {
        font-size: dt('card.title.font.size');
        font-weight: dt('card.title.font.weight');
    }

    .p-card-subtitle {
        color: dt('card.subtitle.color');
    }
`,classes:{root:`p-card p-component`,header:`p-card-header`,body:`p-card-body`,caption:`p-card-caption`,title:`p-card-title`,subtitle:`p-card-subtitle`,content:`p-card-content`,footer:`p-card-footer`}}),x={name:`Card`,extends:{name:`BaseCard`,extends:f,style:b,provide:function(){return{$pcCard:this,$parentInstance:this}}},inheritAttrs:!1};function S(e,t,n,i,a,s){return m(),c(`div`,l({class:e.cx(`root`)},e.ptmi(`root`)),[e.$slots.header?(m(),c(`div`,l({key:0,class:e.cx(`header`)},e.ptm(`header`)),[d(e.$slots,`header`)],16)):o(``,!0),r(`div`,l({class:e.cx(`body`)},e.ptm(`body`)),[e.$slots.title||e.$slots.subtitle?(m(),c(`div`,l({key:0,class:e.cx(`caption`)},e.ptm(`caption`)),[e.$slots.title?(m(),c(`div`,l({key:0,class:e.cx(`title`)},e.ptm(`title`)),[d(e.$slots,`title`)],16)):o(``,!0),e.$slots.subtitle?(m(),c(`div`,l({key:1,class:e.cx(`subtitle`)},e.ptm(`subtitle`)),[d(e.$slots,`subtitle`)],16)):o(``,!0)],16)):o(``,!0),r(`div`,l({class:e.cx(`content`)},e.ptm(`content`)),[d(e.$slots,`content`)],16),e.$slots.footer?(m(),c(`div`,l({key:1,class:e.cx(`footer`)},e.ptm(`footer`)),[d(e.$slots,`footer`)],16)):o(``,!0)],16)],16)}x.render=S;var C=u.extend({name:`skeleton`,style:`
    .p-skeleton {
        display: block;
        overflow: hidden;
        background: dt('skeleton.background');
        border-radius: dt('skeleton.border.radius');
    }

    .p-skeleton::after {
        content: '';
        animation: p-skeleton-animation 1.2s infinite;
        height: 100%;
        left: 0;
        position: absolute;
        right: 0;
        top: 0;
        transform: translateX(-100%);
        z-index: 1;
        background: linear-gradient(90deg, rgba(255, 255, 255, 0), dt('skeleton.animation.background'), rgba(255, 255, 255, 0));
    }

    [dir='rtl'] .p-skeleton::after {
        animation-name: p-skeleton-animation-rtl;
    }

    .p-skeleton-circle {
        border-radius: 50%;
    }

    .p-skeleton-animation-none::after {
        animation: none;
    }

    @keyframes p-skeleton-animation {
        from {
            transform: translateX(-100%);
        }
        to {
            transform: translateX(100%);
        }
    }

    @keyframes p-skeleton-animation-rtl {
        from {
            transform: translateX(100%);
        }
        to {
            transform: translateX(-100%);
        }
    }
`,classes:{root:function(e){var t=e.props;return[`p-skeleton p-component`,{"p-skeleton-circle":t.shape===`circle`,"p-skeleton-animation-none":t.animation===`none`}]}},inlineStyles:{root:{position:`relative`}}}),w={name:`BaseSkeleton`,extends:f,props:{shape:{type:String,default:`rectangle`},size:{type:String,default:null},width:{type:String,default:`100%`},height:{type:String,default:`1rem`},borderRadius:{type:String,default:null},animation:{type:String,default:`wave`}},style:C,provide:function(){return{$pcSkeleton:this,$parentInstance:this}}};function T(e){"@babel/helpers - typeof";return T=typeof Symbol==`function`&&typeof Symbol.iterator==`symbol`?function(e){return typeof e}:function(e){return e&&typeof Symbol==`function`&&e.constructor===Symbol&&e!==Symbol.prototype?`symbol`:typeof e},T(e)}function E(e,t,n){return(t=D(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function D(e){var t=O(e,`string`);return T(t)==`symbol`?t:t+``}function O(e,t){if(T(e)!=`object`||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t);if(T(r)!=`object`)return r;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(t===`string`?String:Number)(e)}var k={name:`Skeleton`,extends:w,inheritAttrs:!1,computed:{containerStyle:function(){return this.size?{width:this.size,height:this.size,borderRadius:this.borderRadius}:{width:this.width,height:this.height,borderRadius:this.borderRadius}},dataP:function(){return i(E({},this.shape,this.shape))}}},A=[`data-p`];function j(e,t,n,r,i,a){return m(),c(`div`,l({class:e.cx(`root`),style:[e.sx(`root`),a.containerStyle],"aria-hidden":`true`},e.ptmi(`root`),{"data-p":a.dataP}),null,16,A)}k.render=j;var M={class:`flex flex-col items-center justify-center gap-4 py-16 text-center`},N={class:`space-y-2`},P={class:`text-xl font-semibold tracking-tight`},F={class:`max-w-md text-sm text-muted-foreground`},I=p({__name:`EmptyState`,props:{title:{},description:{},icon:{},actionLabel:{},actionTo:{}},setup(e){return(i,l)=>(m(),c(`div`,M,[e.icon?(m(),s(_(e.icon),{key:0,class:`size-12 text-muted-foreground`,"aria-hidden":`true`})):o(``,!0),r(`div`,N,[r(`h2`,P,a(e.title),1),r(`p`,F,a(e.description),1)]),e.actionLabel&&e.actionTo?(m(),s(n(h),{key:1,to:e.actionTo},{default:t(()=>[g(n(v),{label:e.actionLabel},null,8,[`label`])]),_:1},8,[`to`])):o(``,!0)]))}}),L={class:`flex flex-col gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 sm:flex-row sm:items-center sm:justify-between`,role:`alert`},R={class:`flex items-start gap-3`},z={class:`text-sm text-foreground`},B=p({__name:`ErrorBanner`,props:{message:{}},emits:[`retry`],setup(e,{emit:t}){let i=t;return(t,o)=>(m(),c(`div`,L,[r(`div`,R,[g(n(y),{class:`mt-0.5 size-5 shrink-0 text-destructive`,"aria-hidden":`true`}),r(`p`,z,a(e.message),1)]),g(n(v),{label:`Try again`,severity:`secondary`,outlined:``,class:`shrink-0`,"aria-label":`Try loading again`,onClick:o[0]||=e=>i(`retry`)})]))}});function V(e){return new Intl.NumberFormat(`en-US`,{style:`currency`,currency:`USD`}).format(e)}function H(e){return new Intl.DateTimeFormat(`en-US`,{year:`numeric`,month:`short`,day:`numeric`}).format(new Date(e))}export{k as a,I as i,V as n,x as o,B as r,H as t};