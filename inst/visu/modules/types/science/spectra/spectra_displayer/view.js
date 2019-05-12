"use strict";var _slicedToArray=function(){function a(b,c){var d=[],f=!0,g=!1,h;try{for(var n,m=b[Symbol.iterator]();!(f=(n=m.next()).done)&&(d.push(n.value),!(c&&d.length===c));f=!0);}catch(o){g=!0,h=o}finally{try{!f&&m["return"]&&m["return"]()}finally{if(g)throw h}}return d}return function(b,c){if(Array.isArray(b))return b;if(Symbol.iterator in Object(b))return a(b,c);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}();define(["jquery","modules/default/defaultview","jsgraph","json-chart","src/util/datatraversing","src/util/api","src/util/color","src/util/debug","src/util/util"],function(a,b,c,d,f,g,h,m,n){"use strict";function o(){}function p(u){if(Array.isArray(u)){var y,z,A,w=Infinity,x=-Infinity,B=20;if("number"==typeof u[0]){if(u.length<2*B-1)return"discrete";for(z=0,A=u.length-2;z<A;z+=2)y=u[z+2]-u[z],y>x&&(x=y),y<w&&(w=y)}else if(Array.isArray(u[0])&&2===u.length){if(u[0].length<B)return"discrete";for(z=0,A=u[0].length-1;z<A;z++)y=u[0][z+1]-u[0][z],y>x&&(x=y),y<w&&(w=y)}else{if(u.length<B)return"discrete";for(z=0,A=u.length-1;z<A;z++)y=u[z+1][0]-u[z][0],y>x&&(x=y),y<w&&(w=y)}return 0.9>Math.abs(w/x)?"discrete":"continuous"}}var q={shape:"circle",cx:0,cy:0,r:3,height:"5px",width:"5px",stroke:"transparent",fill:"black"},r={x:"xAxis",y:"yAxis",xy:"both"};return a.extend(!0,o.prototype,b,{init(){this.series={},this.seriesDrawn={},this.annotations={},this.dom=a("<div />"),this.module.getDomContent().html(this.dom),this.seriesActions=[],this.colorId=0,this.colors=["red","blue","green","black"],this.deferreds={},this.onchanges={},this.highlightOptions=Object.assign({fill:"black"},n.evalOptions(this.module.getConfiguration("highlightOptions"))),this.serieHiddenState=new Map},inDom(){var u=new Promise((w)=>{var x=this.module.getConfiguration,y=this.module.getConfigurationCheckbox,z=x("graphurl");if(z)a.getJSON(z,{},(Q)=>{Q.options.onMouseMoveData=(R,S)=>{this.module.controller.sendAction("mousetrack",S)},w(new c(this.dom.get(0),Q.options,Q.axis))});else{var A={close:{top:!1,right:!1,bottom:!1,left:!1},plugins:{},mouseActions:[]};A.plugins.drag={},A.mouseActions.push({plugin:"drag",shift:!0,ctrl:!1});var C,B=x("zoom");if(C="x"===B?"gradualX":"y"===B?"gradualY":"gradualXY",A.plugins.zoom={},A.mouseActions.push({plugin:"zoom",type:"dblclick",options:{mode:"total"}}),A.mouseActions.push({plugin:"zoom",type:"dblclick",shift:!0,options:{mode:C}}),A.plugins.peakPicking={},B&&"none"!==B){var D={};D.zoomMode="x"===B?"x":"y"===B?"y":"xy",y("independantYZoom","yes")&&(D.axes="serieSelected"),A.plugins.zoom=D,A.mouseActions.push({plugin:"zoom",shift:!1,ctrl:!1})}var E=x("wheelAction");if(E&&"none"!==E){var F={baseline:"zoomYMousePos"==E?"mousePosition":x("wheelbaseline",0)};F.direction="zoomX"===E?"x":"y",A.mouseActions.push({plugin:"zoom",type:"mousewheel",options:F})}var G=y("mouseTracking","track");G&&(A.onMouseMoveData=(Q,R)=>{this.module.model.trackData=R,this.module.controller.sendActionFromEvent("onTrackMouse","trackData",R),this.module.controller.sendActionFromEvent("onTrackMouse","mouseEvent",Q),this.module.controller.sendActionFromEvent("onTrackMouse","dataAndEvent",{data:R,event:Q}),this.module.controller.createDataFromEvent("onTrackMouse","trackData",R)});var H=y("selectScatter","yes");H&&(A.plugins.selectScatter={},A.mouseActions.push({plugin:"selectScatter",alt:!0}));var I={nbTicksPrimary:x("xnbTicksPrimary",5)};"timestamptotime"==x("xaxismodification")?I.type="time":"valtotime"==x("xaxismodification")?I.unitModification="time":"valtotime:min.sec"==x("xaxismodification")&&(I.unitModification="time:min.sec");var J=new c(this.dom.get(0),A,{bottom:[I]});this.graph=J;var K=J.getXAxis(0,I);this.xAxis=K,K.flip(x("flipX",!1)).setPrimaryGrid(x("vertGridMain",!1)).setSecondaryGrid(x("vertGridSec",!1)).setPrimaryGridColor("#DADADA").setSecondaryGridColor("#F0F0F0").setGridLinesStyle().setLabel(x("xLabel","")).forceMin(x("minX",!1)).forceMax(x("maxX",!1)).setAxisDataSpacing(x("xLeftSpacing",0),x("xRightSpacing",0)),x("displayXAxis",!0)||K.hide();var L=(Q)=>{var R=_slicedToArray(Q,2),S=R[0],T=R[1];this.module.model.setXBoundaries(S,T)};K.on("zoom",L).on("zoomOutFull",L),y("FitYToAxisOnFromTo","rescale")&&K.on("zoom",function(){M.scaleToFitAxis(this)}),this.numberOfYAxes=0;var M=this.getYAxis(0);this.yAxis=M;var N=x("legend","none");if("none"!==N){var O=J.makeLegend({backgroundColor:"rgba( 255, 255, 255, 0.8 )",frame:!0,frameWidth:"1",frameColor:"rgba( 100, 100, 100, 0.5 )",movable:y("legendOptions","movable"),isSerieHideable:y("legendOptions","isSerieHideable"),isSerieSelectable:y("legendOptions","isSerieSelectable")});O.setAutoPosition(N)}if(G&&J.on("click",(Q)=>{this.module.model.trackData&&(this.module.controller.sendActionFromEvent("onTrackClick","trackData",this.module.model.trackData),this.module.controller.sendActionFromEvent("onTrackClick","mouseEvent",Q[3]),this.module.controller.sendActionFromEvent("onTrackClick","dataAndEvent",{data:this.module.model.trackData,event:Q[3]}),this.module.controller.createDataFromEvent("onTrackClick","trackData",this.module.model.trackData))}),H){var P=J.getPlugin("selectScatter");P.on("selectionEnd",(Q)=>{var R=P.serie,S=[],T=R.infos;T&&(S=Q.map((U)=>T[U])),this.module.controller.onScatterSelection(S)})}J.draw(!0),w(J)}});u.then((w)=>{this.graph=w,this.xAxis=w.getXAxis(0),this.yAxis=w.getYAxis(0),w.on("shapeMouseOver",(x)=>{this.module.controller.createDataFromEvent("onMouseOverShape","shapeProperties",x.getProperties()),this.module.controller.createDataFromEvent("onMouseOverShape","shapeInfos",x.getData()),g.highlight(x.getData(),1)}),w.on("shapeMouseOut",(x)=>{g.highlight(x.getData(),0)}),w.on("shapeResized",(x)=>{this.module.model.dataTriggerChange(x.getData())}),w.on("shapeMoved",(x)=>{this.module.model.dataTriggerChange(x.getData())}),w.on("shapeClicked",(x)=>{this.module.controller.createDataFromEvent("onShapeClick","shapeProperties",x.getProperties()),this.module.controller.createDataFromEvent("onShapeClick","shapeInfos",x.getData()),this.module.controller.sendActionFromEvent("onShapeClick","shapeInfos",x.getData())}),w.on("shapeSelected",(x)=>{this.module.controller.sendActionFromEvent("onShapeSelect","selectedShape",x.getData())}),w.on("shapeUnselected",(x)=>{this.module.controller.sendActionFromEvent("onShapeUnselect","shapeInfos",x.getData())}),this.onResize(),this.resolveReady()}).catch((w)=>{m.error("Error loading the graph",w)})},getYAxis(u){if(this.numberOfYAxes>u)return this.graph.getYAxis(u);for(var x,z,w=this.module.getConfiguration,y=this.numberOfYAxes;y<=u;y++){if(z={nbTicksPrimary:w("ynbTicksPrimary",5)},x=this.graph.getYAxis(y,z),0===y){x.setPrimaryGrid(w("horGridMain",!1)).setSecondaryGrid(w("horGridSec",!1)).setPrimaryGridColor("#DADADA").setSecondaryGridColor("#F0F0F0").setGridLinesStyle().setLabel(w("yLabel","")),w("displayYAxis",!0)||x.hide();var A=(B)=>{var C=_slicedToArray(B,2),D=C[0],E=C[1];this.module.model.setYBoundaries(D,E)};x.on("zoom",A).on("zoomOutFull",A)}else x.setPrimaryGrid(!1).setSecondaryGrid(!1).setGridLinesStyle().hide();x.flip(w("flipY",!1)).forceMin(w("minY",!1)).forceMax(w("maxY",!1)).setAxisDataSpacing(w("yBottomSpacing",0),w("yTopSpacing",0)),this.numberOfYAxes++}return x},onResize(){this.graph&&this.graph.resize(this.width,this.height)},shouldAutoscale(u){return!this.seriesDrawn[u]&&(this.seriesDrawn[u]=!0,!0)},redraw(u,w){var x;u?x="both":(x=this.module.getConfiguration("fullOut"),w&&"once"===x&&(this.shouldAutoscale(w)?x="both":x="none")),this.fullOut(x)},fullOut(u){"both"===u?this.graph.autoscaleAxes():"xAxis"===u?this.xAxis.setMinMaxToFitSeries():"yAxis"===u?this.yAxis.setMinMaxToFitSeries():void 0,this.graph.draw(),this.graph.updateLegend();var w=this.xAxis.getCurrentMin(),x=this.xAxis.getCurrentMax(),y=this.yAxis.getCurrentMin(),z=this.yAxis.getCurrentMax();this.module.model.setXBoundaries(w,x),this.module.model.setYBoundaries(y,z)},getSerieOptions(u,w,x){var y=this.module.getConfiguration("plotinfos"),z={},A={trackMouse:!0};if(w=w||[],y)for(var B=0,C=y.length;B<C;B++)if(u==y[B].variable){var D=y[B].plotcontinuous;"auto"===D&&(D=p(x)),y[B].markers[0]&&(A.markersIndependent=!1),A.lineToZero="discrete"==D,A.strokeWidth=parseInt(y[B].strokewidth);var E=y[B].peakpicking[0];E&&(z.peakPicking=!0)}return A.onMouseOverMarker=(F,G,H)=>{g.highlightId(w[F],1),this.module.controller.onMouseOverMarker(H,G)},A.onMouseOutMarker=(F,G,H)=>{g.highlightId(w[F],0),this.module.controller.onMouseOutMarker(H,G)},A.onToggleMarker=(F,G,H)=>{this.module.controller.onClickMarker(F,G,H)},A.overflowY=this.module.getConfigurationCheckbox("overflow","overflowY"),A.overflowX=this.module.getConfigurationCheckbox("overflow","overflowX"),{options:A,others:z}},setSerieParameters(u,w,x,y){u.setXAxis(0);var z=this.module.getConfiguration("plotinfos"),A=this.module.getConfiguration("stackVerticalSpacing"),B=!1;if(u.hidden=!!this.serieHiddenState.get(w),z){var F,C=new Set,D=!0,E=!1;try{for(var H,I,G=z[Symbol.iterator]();!(D=(H=G.next()).done);D=!0)I=H.value,C.add(I.axis?+I.axis:0)}catch(U){E=!0,F=U}finally{try{!D&&G.return&&G.return()}finally{if(E)throw F}}for(var J=Math.min(...C),K=C.size||1,L=0,M=z.length;L<M;L++)if(w==z[L].variable){B=!0;var N=(z[L].axis?+z[L].axis:0)-J,O=this.getYAxis(N);if(O.setSpan(N*A||0,1-A*(K-1-N)),u.setYAxis(O),z[L].adaptTo&&"none"!==z[L].adaptTo+""){var R=this.getYAxis(+z[L].adaptTo);O.adaptTo(R,0,0)}var S=y?y:z[L].plotcolor;u.setLineColor(h.getColor(S),!1,!0);var T=parseFloat(z[L].strokewidth);isNaN(T)&&(T=1),u.setLineWidth(T),u.setLineStyle(parseInt(z[L].strokestyle)||1,!1,!0),z[L].markers[0]&&u.showMarkers&&(u.showMarkers(),u.setMarkers([{type:parseInt(z[L].markerShape),zoom:z[L].markerSize,strokeColor:h.getColor(S),fillColor:h.getColor(S),points:"all"}])),z[L].degrade&&u.degrade(z[L].degrade),z[L].tracking&&"yes"===z[L].tracking[0]&&u.allowTrackingLine({})}}B||u.setYAxis(this.getYAxis(0)),x&&g.listenHighlight({_highlight:x},(U,V)=>{for(var Y,W=0,X=V.length;W<X;W++){Y=V[W];for(var aa,Z=0,_=x.length;Z<_;Z++)if(aa=x[Z],Array.isArray(aa))for(var ba=0;ba<aa.length;ba++)aa[ba]==Y&&u.toggleMarker(Z,!!U,!0);else aa==Y&&u.toggleMarker(Z,!!U,!0)}},!1,this.module.getId())},registerSerieEvents(u,w){u.on("hide",()=>{this.serieHiddenState.set(w,!0)}),u.on("show",()=>{this.serieHiddenState.set(w,!1)})},blank:{xyArray(u){this.removeSerie(u)},xArray(u){this.removeSerie(u)},series_xy1d(u){this.removeSerie(u)},jcamp(u){this.removeSerie(u)},chart(u){this.removeSerie(u)},annotations(u){this.removeAnnotations(u)}},update:{chart(u,w){this.series[w]=this.series[w]||[],this.removeSerie(w),u=d.check(u.get());for(var A,x=new Set,y=u.data,z=0;z<y.length;z++){A=y[z],0===z&&u.axis&&(u.axis[A.xAxis]&&this.xAxis.setLabel(u.axis[A.xAxis].label),u.axis[A.yAxis]&&this.yAxis.setLabel(u.axis[A.yAxis].label));var B=A.defaultStyle||{},C=A.defaultStyles||{},D=w;x.has(D)&&(D+="-"+z),x.add(D);var E=A.label||D,F=[],G=[],H=[];switch(A.type+""){case"zone":if(A.yMin&&A.yMax)for(var I=0,J=A.yMax.length;I<J;I++)F.push(A.x?A.x[I]:I),F.push(A.yMin[I],A.yMax[I]);break;case"contour":F=A.contourLines;break;default:if(A.y)for(var I=0,J=A.y.length;I<J;I++)G.push(A.x?A.x[I]:I),H.push(A.y[I]);}var K=A.type;"color"==K&&(K="line.color");var L=!1;Array.isArray(A.color)&&(L=!0,K="line.color");var M=this.getSerieOptions(w,A._highlight,[G,H]),N=this.graph.newSerie(D,M.options,K);if(this.registerSerieEvents(N,D),M.others.peakPicking&&this.graph.getPlugin("peakPicking").setSerie(N),!N)throw console.log(K),new Error("The serie was not created !");if(N.setLabel(E),"line"==K||void 0==K||"scatter"==K||"line.color"==K){var O=c.newWaveform();O.setData(H,G),this.normalize(O,w),M.useSlots&&O.aggregate(),N.setWaveform(O)}else N.setData(F);if(L){var P=A.color;if(!Array.isArray(P))throw new Error("Serie colors must be an array");N.setColors(P)}if(A.info&&(N.infos=A.info),N.autoAxis(),"scatter"===A.type+""){var Q=[];Array.isArray(A.styles)?Q=A.styles:"object"==typeof A.styles&&(Q=A.styles);var R=new Set(Object.keys(C).concat(Object.keys(Q))),S=!0,T=!1,U=void 0;try{for(var W,X,V=R[Symbol.iterator]();!(S=(W=V.next()).done);S=!0)X=W.value,N.setStyle(Object.assign({},q,B,C[X]||{}),Q[X]||[],X)}catch(_){T=!0,U=_}finally{try{!S&&V.return&&V.return()}finally{if(T)throw U}}if(this.module.getConfigurationCheckbox("selectScatter","yes")){var Y=this.graph.getPlugin("selectScatter");Y.setSerie(N)}}else{var Z=B.lineColor||(1<y.length?h.getNextColorRGB(z,y.length):null);this.setSerieParameters(N,w,A._highlight,Z)}this.series[w].push(N)}this.redraw(!1,w)},xyArray(u,w){if(this.series[w]=this.series[w]||[],this.removeSerie(w),!!u){var x=u.get(),y=this.getSerieOptions(w,null,x),z=this.graph.newSerie(w,y.options);this.registerSerieEvents(z,w),y.others.peakPicking&&this.graph.getPlugin("peakPicking").setSerie(z);for(var A=[],B=[],C=c.newWaveform(),D=0,E=x.length;D<E;D+=2)A.push(x[D]),B.push(x[D+1]);C.setData(B,A),this.normalize(C,w),y.useSlots&&C.aggregate(),z.setWaveform(C),this.setSerieParameters(z,w),this.series[w].push(z),this.redraw(!1,w)}},xArray(u,w){var x=u.get();this.series[w]=this.series[w]||[],this.removeSerie(w);var y=this.module.getConfiguration("minX",0),z=this.module.getConfiguration("maxX",x.length-1),A=(z-y)/(x.length-1),B=c.newWaveform();B.setData(x),B.rescaleX(y,(z-y)/(x.length-1));var C=this.getSerieOptions(w,null,[null,[x]]),D=this.graph.newSerie(w,C.options);this.registerSerieEvents(D,w),C.others.peakPicking&&this.graph.getPlugin("peakPicking").setSerie(D),this.normalize(B,w),C.useSlots&&B.aggregate(),D.setWaveform(B),this.setSerieParameters(D,w),this.series[w].push(D),this.redraw(!1,w)},annotations(u,w){var x=this;this.annotations[w]=this.annotations[w]||[];for(var B,y=u.get(),z=function(D){var E=y[D];E.selectOnClick=!0;var F=x.graph.newShape(E.type+"",E,!1,E.properties);return F?void(x.annotations[w][D]=F,F.autoAxes(),g.listenHighlight(E,(G)=>{G?F.highlight(x.highlightOptions):F.unHighlight()},!1,x.module.getId()+w),x.module.model.dataListenChange(y.traceSync([D]),()=>{F.redraw()},"annotations"),F.draw(),F.redraw()):{v:void 0}},A=0;A<y.length;A++)if(B=z(A),"object"==typeof B)return B.v},jcamp(u,w){function x(E){if("rejected"!=A.state()){if(y.deferreds[w]=!1,y.series[w]=y.series[w]||[],y.series[w]=[],E.contourLines)z=y.graph.newSerie(w,y.getSerieOptions(w).options,"contour"),y.registerSerieEvents(z,w),z.setData(E.contourLines),y.setSerieParameters(z,w),y.series[w].push(z);else{E=E.spectra;for(var F=0,G=E.length;F<G;F++){var H=E[F].data[E[F].data.length-1],I=[],J=[];if(H.x&&H.y)I=H.x,J=H.y;else if(Array.isArray(H[0]))I=H[0],J=H[1];else for(var F=0;F<H.length;F+=2)I.push(H[F]),J.push(H[F+1]);var K=y.getSerieOptions(w,null,H);z=y.graph.newSerie(w,K.options),y.registerSerieEvents(z,w),K.others.peakPicking&&y.graph.getPlugin("peakPicking").setSerie(z);var L=c.newWaveform();L.setData(J,I),y.normalize(L,w),K.useSlots&&L.aggregate(),z.setWaveform(L),y.setSerieParameters(z,w),y.series[w].push(z);break}}y.redraw(!1,w)}}var z,y=this;if(this.graph){this.deferreds[w]&&this.deferreds[w].reject(),this.deferreds[w]=a.Deferred();var A=this.deferreds[w],B=u._options||{},C=u.get(),D=DataObject.getType(C);"string"===D?require(["jcampconverter"],(E)=>{E.convert(C+"",B,!0).then(x)}):x(C)}},series_xy1d(u,w){require(["src/util/color"],(x)=>{for(var y=x.getDistinctColors(u.length),z=0,A=u.length;z<A;z++){var B=this.getSerieOptions(w,null,u[z].data),C=this.graph.newSerie(u[z].name,B.options);this.graph.registerSerieEvents(C,u[z].name),C.autoAxis(),this.series[w].push(C),u[z].data&&C.setData(u[z].data),C.setLineWidth(u[z].lineWidth||B.strokeWidth||1),C.setLineColor(u[z].lineColor||"rgb("+y[z].join()+")",!1,!0),C.setLineWidth(3,"selected"),C.extendStyles()}this.redraw()})}},setOnChange(u,w,x){this.onchanges[w]&&this.onchanges[w].obj.unbindChange(this.onchanges[w].id),this.onchanges[w]={obj:x,id:u}},removeAnnotations(u){if(g.killHighlight(this.module.getId()+u),this.annotations[u])for(var w=0;w<this.annotations[u].length;w++)this.annotations[u][w]&&this.annotations[u][w].kill();this.annotations[u]=[]},removeSerie(u){if(this.series[u])for(var w=0;w<this.series[u].length;w++)this.series[u][w].kill(!0);this.series[u]=[]},makeSerie(u,w,x){var y=this.graph.newSerie(u.name);this.registerSerieEvents(y,u.name),u.onChange(()=>{y.setData(u.data),this.graph.draw()}),this.onActionReceive.removeSerieByName.call(this,u.name||{}),y.setData(u.data),this.seriesActions.push([w,y,u.name]),this.setSerieParameters(y,x),u.lineColor&&y.setLineColor(u.lineColor,!1,!0),u.lineWidth&&y.setLineWidth(u.lineWidth),this.redraw()},onActionReceive:{fromToX(u){this.xAxis.zoom(u.from,u.to),this.graph.draw()},fromToY(u){this.yAxis.zoom(u.from,u.to),this.graph.draw()},addSerie(u){if(this.colorId++,u.name)this.makeSerie(u,u,u.name);else for(var w in u)this.makeSerie(u[w],u)},removeSerie(u){for(var w=0,x=this.seriesActions.length;w<x;w++)this.seriesActions[w][0]==u&&(this.seriesActions[w][1].kill(),this.seriesActions.splice(w,1))},removeSerieByName(u){for(var w=0;w<this.seriesActions.length;w++)this.seriesActions[w][2]==u&&(this.seriesActions[w][1].kill(),this.seriesActions.splice(w,1),w--)},selectSerie(u){var w=this.graph.getSerie(u.valueOf());w&&w.select("selected")},unselectSerie(u){var w=this.graph.getSerie(u.valueOf());w&&w.unselect()},toggleGrid(){var w=!this.xAxis.options.primaryGrid;this.xAxis.setPrimaryGrid(w),this.xAxis.setSecondaryGrid(w),this.yAxis.setPrimaryGrid(w),this.yAxis.setSecondaryGrid(w),this.graph.redraw()},fullOut(u){this.fullOut(r[u+""])},exportSVG(){this.doSVGExport()}},doSVGExport(){var u=this.getSVGString();u&&this.module.controller.exportSVG(u)},getSVGElement(){var u=this.dom.find("svg");return u[0]},getSVGString(){var u=new XMLSerializer,w=this.getSVGElement();return w?"<?xml version=\"1.0\" standalone=\"no\"?><!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">"+u.serializeToString(w):void 0},normalize(u,w){var C,D,x=this.module.getConfiguration("plotinfos");if(x){var E="";for(C=0,D=x.length;C<D;C++)w==x[C].variable&&(E=x[C].normalize);E&&u.normalize(E)}}}),o});