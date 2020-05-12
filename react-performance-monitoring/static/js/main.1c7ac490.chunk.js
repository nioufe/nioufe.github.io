(this["webpackJsonpreact-performance-monitoring"]=this["webpackJsonpreact-performance-monitoring"]||[]).push([[0],{12:function(e,t,n){e.exports=n(22)},19:function(e,t,n){},22:function(e,t,n){"use strict";n.r(t);var r=n(0),a=n.n(r),o=n(9),c=n.n(o),i=(n(19),n(6)),u=n(7),s=n(1),l=n(11),m=n(10),d=function getPercentile(e,t){if(1===e.length)return e[0].value;var n=t/100*(e.length-1),r=Math.floor(n),a=n-r,o=e[r],c=e[r+1];return o.value+a*(c.value-o.value)},f=[],p=[{name:"PAGE_LOAD",timestamp:Date.now()}],g=new function MetricsAgent(){var e=this;Object(m.a)(this,MetricsAgent),this.start=function(){window.addEventListener("beforeunload",(function(){e.flushMetrics()}))},this.groupByContext=function(e){var t={};return e.forEach((function(e){var n="no-context";if(void 0!==e.context){var r=e.context;n=Object.keys(e.context).map((function(e){return"".concat(e,":").concat(r[e])})).join("|")}t[n]||(t[n]={});var a="".concat(e.metricName,".").concat(e.metricType);t[n][a]||(t[n][a]=[]),t[n][a].push(e)})),t},this.getTagsInLogsFormat=function(e){var t=e.map((function(e){var t=e.split(":");return{key:t[0],value:t.slice(1).join(":")}})),n={};return t.forEach((function(e){n[e.key]=e.value})),n},this.sendContext=function(t,n,r){var a={timestamp:t.timestamp,metrics:{}},o={},c="unknown";Object.keys(r).forEach((function(t,n){0===n&&(o=r[t][0].context||{},c=r[t][0].metricName),e.computeMetric(a,t,r[t])}));var i=t.actionContext?Object.keys(t.actionContext).map((function(e){return"".concat(e,":").concat(t.actionContext[e])})).join("|"):"";s.a.logger.info("ACTION: ".concat(t.name," ").concat(i," METRICS: ").concat(Object.keys(r).join("|")," CONTEXT: ").concat(n),Object(l.a)({action:t.name,metric:c,actionContext:t.actionContext,performanceEntryType:"stats-agent",timestamp:a.timestamp,metrics:a.metrics},o))},this.computeMetric=function(e,t,n){switch(n[0].metricType){case"count":e.metrics[t]=function computeCount(e){return e.reduce((function(e,t){return e+t.value}),0)}(n);break;case"gauge":e.metrics[t]=function computeGauge(e){return e.reduce((function(e,t){return"string"===typeof t.value?e+parseInt(t.value,10):t.value}),0)}(n);break;case"set":e.metrics[t]=function computeSet(e){return new Set(e.map((function(e){return e.value}))).size}(n);break;case"histogram":case"timing":e.metrics[t]=function computeHistogram(e){var t=e.sort((function(e,t){return e.value-t.value}));return{avg:t.reduce((function(e,t){return e+t.value}),0)/t.length,median:d(t,50),max:t[t.length-1].value,min:t[0].value,p95:d(t,95)}}(n)}},this.flushMetrics=function(){var t=p.shift(),n=Object(i.a)(f);f=[];var r=e.groupByContext(n);Object.keys(r).forEach((function(n){e.sendContext(t,n,r[n])}))}};g.start();var v=function addMetricPoint(e){f.push(e)},h=function markUserAction(e,t){g.flushMetrics(),p.push({name:e,actionContext:t,timestamp:Date.now()})},y=function onRenderChildren(e,t,n){console.log(e,t,n),s.a.logger.info("react profiler - component ".concat(e," rendered for ").concat(n," on ").concat(t),{performanceEntryType:"reactprofiler",duration:n,react:{component:e,phase:t}}),v({metricName:"react_render",metricType:"count",value:1,context:{"react.id":e,"react.phase":t}}),v({metricName:"react_render",metricType:"timing",value:n,context:{"react.id":e,"react.phase":t}})},b=function ReactProfilerProd(e){var t=e.id,n=e.children;return a.a.createElement(r.Profiler,{id:t,onRender:y},n)};function AddBar(e){var t=e.addTodo,n=Object(r.useState)(""),o=Object(u.a)(n,2),c=o[0],i=o[1];return a.a.createElement("input",{value:c,onChange:function onChange(e){return i(e.target.value)},onKeyPress:function onKeyPress(e){"Enter"===e.key&&(t(c),i(""))},placeholder:"add todo",className:"w-full appearance-none border border-gray-300 rounded-lg py-2 px-4"})}function TodoLine(e){var t=e.name;return a.a.createElement("li",{className:"w-full border border-gray-500 rounded-lg py-2 px-4 mt-2"},t)}var T=function App(){Object(r.useEffect)((function(){!function startLongTaskObserver(){new PerformanceObserver((function(e){for(var t=e.getEntries(),n=0;n<t.length;n++){var r=t[n];console.log(r),"longtask"===r.entryType&&s.a.logger.info("longtask detected",{duration:r.duration,performanceEntryType:r.entryType,startTime:r.startTime}),v({metricName:"long_task",metricType:"count",value:1}),v({metricName:"long_task",metricType:"timing",value:r.duration})}})).observe({entryTypes:["longtask"]})}()}),[]);var e=Object(r.useState)([]),t=Object(u.a)(e,2),n=t[0],o=t[1];return a.a.createElement("div",{className:"flex flex-row justify-center"},a.a.createElement("div",{className:"container flex flex-col"},a.a.createElement("h1",{className:"underline text-red"},"TODOLIST"),a.a.createElement(AddBar,{addTodo:function addTodo(e){o([].concat(Object(i.a)(n),[e])),h("add_todo",{total_todos:n.length+1})}}),a.a.createElement(b,{id:"TodoList"},a.a.createElement("ul",null,n.map((function(e,t){return a.a.createElement(b,{key:t,id:"TodoLine"},a.a.createElement(TodoLine,{name:e}))}))))))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));s.a.init({clientToken:"pubf7c8eec264a69c5aa69ad6fec1bb36b7",datacenter:"us",isCollectingError:!0,sampleRate:100}),s.a.addLoggerGlobalContext("is_a_robot",null!=window._DATADOG_SYNTHETICS_BROWSER),s.a.logger.info("Javascript loaded - React Performance Monitoring"),c.a.render(a.a.createElement(a.a.StrictMode,null,a.a.createElement(T,null)),document.getElementById("root")),function unregister(){"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}()}},[[12,1,2]]]);
//# sourceMappingURL=main.1c7ac490.chunk.js.map