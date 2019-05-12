/*!
 * jsNMR JavaScript Graphing Library v0.0.14
 * http://github.com/NPellet/jsNMR
 *
 * Copyright 2014 Norman Pellet and other authors
 * http://github.com/NPellet/jsNMR/authors.txt
 *
 * Released under the MIT license
 *
 * Date: 2016-07-01T13:01Z
 */

define(['jquery', 'jsgraph', 'jcampconverter', 'eventEmitter'], function($, Graph, JcampConverter, EventEmitter) {

/**
 * @license almond 0.3.2 Copyright jQuery Foundation and other contributors.
 * Released under MIT license, http://github.com/requirejs/almond/LICENSE
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
    var main, req, makeMap, handlers,
        defined = {},
        waiting = {},
        config = {},
        defining = {},
        hasOwn = Object.prototype.hasOwnProperty,
        aps = [].slice,
        jsSuffixRegExp = /\.js$/;

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        var nameParts, nameSegment, mapValue, foundMap, lastIndex,
            foundI, foundStarMap, starI, i, j, part, normalizedBaseParts,
            baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {};

        //Adjust any relative paths.
        if (name) {
            name = name.split('/');
            lastIndex = name.length - 1;

            // If wanting node ID compatibility, strip .js from end
            // of IDs. Have to do this here, and not in nameToUrl
            // because node allows either .js or non .js to map
            // to same file.
            if (config.nodeIdCompat && jsSuffixRegExp.test(name[lastIndex])) {
                name[lastIndex] = name[lastIndex].replace(jsSuffixRegExp, '');
            }

            // Starts with a '.' so need the baseName
            if (name[0].charAt(0) === '.' && baseParts) {
                //Convert baseName to array, and lop off the last part,
                //so that . matches that 'directory' and not name of the baseName's
                //module. For instance, baseName of 'one/two/three', maps to
                //'one/two/three.js', but we want the directory, 'one/two' for
                //this normalization.
                normalizedBaseParts = baseParts.slice(0, baseParts.length - 1);
                name = normalizedBaseParts.concat(name);
            }

            //start trimDots
            for (i = 0; i < name.length; i++) {
                part = name[i];
                if (part === '.') {
                    name.splice(i, 1);
                    i -= 1;
                } else if (part === '..') {
                    // If at the start, or previous value is still ..,
                    // keep them so that when converted to a path it may
                    // still work when converted to a path, even though
                    // as an ID it is less than ideal. In larger point
                    // releases, may be better to just kick out an error.
                    if (i === 0 || (i === 1 && name[2] === '..') || name[i - 1] === '..') {
                        continue;
                    } else if (i > 0) {
                        name.splice(i - 1, 2);
                        i -= 2;
                    }
                }
            }
            //end trimDots

            name = name.join('/');
        }

        //Apply map config if available.
        if ((baseParts || starMap) && map) {
            nameParts = name.split('/');

            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                    //Find the longest baseName segment match in the config.
                    //So, do joins on the biggest to smallest lengths of baseParts.
                    for (j = baseParts.length; j > 0; j -= 1) {
                        mapValue = map[baseParts.slice(0, j).join('/')];

                        //baseName segment has  config, find if it has one for
                        //this name.
                        if (mapValue) {
                            mapValue = mapValue[nameSegment];
                            if (mapValue) {
                                //Match, update name to the new value.
                                foundMap = mapValue;
                                foundI = i;
                                break;
                            }
                        }
                    }
                }

                if (foundMap) {
                    break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                    foundStarMap = starMap[nameSegment];
                    starI = i;
                }
            }

            if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
            }

            if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join('/');
            }
        }

        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            var args = aps.call(arguments, 0);

            //If first arg is not require('string'), and there is only
            //one arg, it is the array form without a callback. Insert
            //a null so that the following concat is correct.
            if (typeof args[0] !== 'string' && args.length === 1) {
                args.push(null);
            }
            return req.apply(undef, args.concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (hasProp(waiting, name)) {
            var args = waiting[name];
            delete waiting[name];
            defining[name] = true;
            main.apply(undef, args);
        }

        if (!hasProp(defined, name) && !hasProp(defining, name)) {
            throw new Error('No ' + name);
        }
        return defined[name];
    }

    //Turns a plugin!resource to [plugin, resource]
    //with the plugin being undefined if the name
    //did not have a plugin prefix.
    function splitPrefix(name) {
        var prefix,
            index = name ? name.indexOf('!') : -1;
        if (index > -1) {
            prefix = name.substring(0, index);
            name = name.substring(index + 1, name.length);
        }
        return [prefix, name];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    makeMap = function (name, relName) {
        var plugin,
            parts = splitPrefix(name),
            prefix = parts[0];

        name = parts[1];

        if (prefix) {
            prefix = normalize(prefix, relName);
            plugin = callDep(prefix);
        }

        //Normalize according
        if (prefix) {
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relName));
            } else {
                name = normalize(name, relName);
            }
        } else {
            name = normalize(name, relName);
            parts = splitPrefix(name);
            prefix = parts[0];
            name = parts[1];
            if (prefix) {
                plugin = callDep(prefix);
            }
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            pr: prefix,
            p: plugin
        };
    };

    function makeConfig(name) {
        return function () {
            return (config && config.config && config.config[name]) || {};
        };
    }

    handlers = {
        require: function (name) {
            return makeRequire(name);
        },
        exports: function (name) {
            var e = defined[name];
            if (typeof e !== 'undefined') {
                return e;
            } else {
                return (defined[name] = {});
            }
        },
        module: function (name) {
            return {
                id: name,
                uri: '',
                exports: defined[name],
                config: makeConfig(name)
            };
        }
    };

    main = function (name, deps, callback, relName) {
        var cjsModule, depName, ret, map, i,
            args = [],
            callbackType = typeof callback,
            usingExports;

        //Use name if no relName
        relName = relName || name;

        //Call the callback to define the module, if necessary.
        if (callbackType === 'undefined' || callbackType === 'function') {
            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i += 1) {
                map = makeMap(deps[i], relName);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = handlers.require(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = handlers.exports(name);
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = handlers.module(name);
                } else if (hasProp(defined, depName) ||
                           hasProp(waiting, depName) ||
                           hasProp(defining, depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else {
                    throw new Error(name + ' missing ' + depName);
                }
            }

            ret = callback ? callback.apply(defined[name], args) : undefined;

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef &&
                        cjsModule.exports !== defined[name]) {
                    defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
        if (typeof deps === "string") {
            if (handlers[deps]) {
                //callback in this case is really relName
                return handlers[deps](callback);
            }
            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, callback).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            config = deps;
            if (config.deps) {
                req(config.deps, config.callback);
            }
            if (!callback) {
                return;
            }

            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
            } else {
                deps = undef;
            }
        }

        //Support require(['a'])
        callback = callback || function () {};

        //If relName is a function, it is an errback handler,
        //so remove it.
        if (typeof relName === 'function') {
            relName = forceSync;
            forceSync = alt;
        }

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            //Using a non-zero value because of concern for what old browsers
            //do, and latest browsers "upgrade" to 4 if lower value is used:
            //http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#dom-windowtimers-settimeout:
            //If want a value immediately, use require('id') instead -- something
            //that works in almond on the global level, but not guaranteed and
            //unlikely to work in other AMD implementations.
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 4);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function (cfg) {
        return req(cfg);
    };

    /**
     * Expose module registry for debugging and tooling
     */
    requirejs._defined = defined;

    define = function (name, deps, callback) {
        if (typeof name !== 'string') {
            throw new Error('See almond README: incorrect module build, no module name');
        }

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        if (!hasProp(defined, name) && !hasProp(waiting, name)) {
            waiting[name] = [name, deps, callback];
        }
    };

    define.amd = {
        jQuery: true
    };
}());
define("build_utils/almond", function(){});


define( 'shape.1dnmr',[ 'jquery', 'jsgraph' ], function( $, Graph ) {

	"use strict";
	var lineHeight = 5;
	var GraphLine = Graph.getConstructor( 'graph.shape.line' );

	function GraphNmrSignal1D( graph, options ) {

		this.options = options || 2;
		
	}

	$.extend(GraphNmrSignal1D.prototype, GraphLine.prototype, {
		
		createDom: function() {
			

	      this._createHandles( 2, 'rect', {
	        transform: "translate(-3 -3)",
	        width: 6,
	        height: 6,
	        stroke: "black",
	        fill: "white",
	        cursor: 'nwse-resize'
	      } );

			this._dom = document.createElementNS(this.graph.ns, 'line');
			this.maxLines = 64;
			this.nbLines = 0;

			this.maxLines = 0;


			this.lines = new Array(this.maxLines);
			

			/*this._createHandles( this.nbHandles, 'rect', { 
				transform: "translate(-3 -3)", 
				width: 6, 
				height: 6, 
				stroke: "black", 
				fill: "white",
				cursor: 'nwse-resize'
			} );*/


			//I dont know how to remove the previous lines, so, I'll create an array of
			//empty lines that can be filled up by the system.
			for(var i=this.maxLines-1;i>=0;i--){
				this.lines[i] = document.createElementNS( this.graph.ns, 'line');
				this.group.appendChild( this.lines[i]);
				this.lines[i].setAttribute('stroke', 'green');
			}
			
			// calculate a "hard"-threshold as in
			// IEEE Transactions on biomedical engineering, vol. 52, no. 1, january
			// 2005, p. 76-
			// keep the number of standard deviations variable
			//nbStandardDeviations=1;
			var j,mean=0,std=0,max = 0;
			var serie = this.graph.series[0].data[0];
			//console.log(serie.length);
			for(j=0;j<serie.length;j+=2){
				if(Math.abs(serie[ j + 1 ])>max)
					max = Math.abs(serie[ j + 1 ]);
			}
			for(j=0;j<serie.length;j+=2){
				mean+=serie[ j + 1 ]/max;
			}
			for(j=0;j<serie.length;j+=2)
				std+=Math.pow(mean-serie[ j + 1 ]/max,2);
			std=Math.sqrt(max)*Math.sqrt(std*2/serie.length);
			this.noiseLevel = std*3;//3 is the given number of std for nucleus 1H. For 13C it is 1.
			//console.log("noiseLevel "+this.noiseLevel);
			//this.noiseLevel = 4e6;
			
			this._dom.element = this;
		},


		redrawImpl: function() {

			this.setHandles();
			this.redrawLines( lineHeight );
			//this.setBindableToDom( this._dom );
		},


		redrawLines: function( height ) {

			if( this.maxLines == 0 ) {
				return;
			}

			var peaks = this.findxs();
			//this.lines = [];
			for(var i=peaks.length-1;i>=0;i--){
			    //TODO How to know the base of the spectrum?????
			    var baseLine = this._getPosition( { x: 10 } );
				var x1 = this._getPosition( { x: peaks[i][0] } );
				if( this.lines[i] && x1.x && this.currentPos2y && this.currentPos1y && i<this.maxLines ) {
					this.lines[i].setAttribute('stroke', 'green');
					this.lines[i].setAttribute('x1', x1.x );
					this.lines[i].setAttribute('x2', x1.x );
					this.lines[i].setAttribute('y1', x1.y);
					this.lines[i].setAttribute('y2', baseLine.y  );
					this.lines[i].setAttribute('on', true );

				}
			}
			for(var i=peaks.length;i<this.nbLines;i++){

				if( this.lines[i] ) {
				    this.lines[i].setAttribute('y1', parseFloat(this.lines[i].getAttribute('y2')));
				    this.lines[i].setAttribute('x1', -1000000 );
					this.lines[i].setAttribute('x2', -1000000 );
					this.lines[i].setAttribute('on', false );
				}
			}

			this.nbLines = peaks.length;

		},

		highLigthLinesY: function( height ) {
			for(var i=this.lines.length-1;i>=0;i--){
				if(this.lines[i].getAttribute('on')=="true")
					this.lines[i].setAttribute('y1', parseFloat(this.lines[i].getAttribute('y1'))-height);
			}
		},


		findxs: function() {
			var v1 = this.serie.searchClosestValue( this.getFromData( 'pos' ).x ),
				v2 = this.serie.searchClosestValue( this.getFromData( 'pos2' ).x ),
				v3,
				init,
				max,
				x=[],
				y=[];
				
			if(! v1 || ! v2) {
				return false;
			}
		    
			for(var i = v1.dataIndex; i <= v2.dataIndex ; i++) {

				init = i == v1.dataIndex ? v1.xBeforeIndexArr : 0;
				max = i == v2.dataIndex ? v2.xBeforeIndexArr : this.serie.data[i].length;
				k = 0;
				
				for(j = init; j <= max; j+=2) {
					x.push(this.serie.data[ i ][ j + 0 ]);
					y.push(this.serie.data[ i ][ j + 1 ]);
					
				}
			}
			
			
			
			for(var i=y.length-1;i>=0;i--)
  				if(Math.abs(y[i])<this.noiseLevel)
    				y[i]=0;
			
			var dx = x[1]-x[0];
			// fill convolution frecuency axis
			var X = []//x[2:(x.length-2)];
	
			// fill Savitzky-Golay polynomes
			var Y = [];
			var dY = [];
			var ddY = [];
			for (var j = 2; j < x.length -2; j++){
				Y.push((1/35.0)*(-3*y[j-2] + 12*y[j-1] + 17*y[j] + 12*y[j+1] - 3*y[j+2]));
				X.push(x[j]);
				dY.push((1/(12*dx))*(y[j-2] - 8*y[j-1] + 8*y[j+1] - y[j+2]));
				ddY.push((1/(7*Math.abs(dx*2)))*(2*y[j-2] - y[j-1] - 2*y[j] - y[j+1] + 2*y[j+2]));
			}
		
			// pushs max and min points in convolution functions
			var maxY = [];
			var stackInt = [];
			var intervals = [];
			var minddY = [];
			for (var i = 1; i < Y.length -1 ; i++)
			{
				if ((Y[i] > Y[i-1]) && (Y[i] > Y[i+1]))
				{
					maxY.push(X[i]);
				}
				if ((dY[i] < dY[i-1]) && (dY[i] < dY[i+1]))
				{
					stackInt.push(X[i]);
				}
				if ((dY[i] > dY[i-1]) && (dY[i] > dY[i+1]))
				{
					try{
						intervals.push( [X[i] , stackInt.pop()] );
					}
					catch(e){
						console.log("Error I don't know why");
					}
				}
				if ((ddY[i] < ddY[i-1]) && (ddY[i] < ddY[i+1]))
				{
					minddY.push( [X[i], Y[i]] );
				}
			}
		    //console.log(intervals.length);
			// creates a list with (frecuency, linewith, height)
			var signals = new Array();
			for (var j = 0; j < minddY.length; j++)
			{
				var f = minddY[j];
				var frecuency = f[0];
				var possible = new Array();
				for (var k=0;k<intervals.length;k++){
				    var i = intervals[k];
					if (frecuency > i[0] && frecuency < i[1])
						possible.push(i);
				}
				//console.log("possible "+possible.length);
				if (possible.length > 0)
					if (possible.length == 1)
					{
						var inter = possible[0];
						var linewith = inter[1] - inter[0];
						var height = f[1];
						var points = Y;
						//console.log(frecuency);
						points.sort(function(a, b){return a-b});
						if ((linewith > 2*dx) && (height > 0.0001*points[0]))
							signals.push( [frecuency, linewith, height] );
					}
					else
					{
						//TODO: nested peaks
					//	console.log(possible);
					}
			}
			//console.log(signals);
			return signals;
		}
	});

	return GraphNmrSignal1D;
});

define( 'assignment',[ 'jquery' ], function( $ ) {

	"use strict";

	var ns = 'http://www.w3.org/2000/svg';

		var Assignment = function( options ) {

		//	domMolecule, domGraphs, domGlobal, moleculeFilter, graphs
			var self = this;

			this.options = options;
			this.bindingPairs = [];

			this.stashedLines = [];
			this.currentLines = [];


			var binding = false,
			bindingA = false,
			bindingB = false,
			bindingLine,
			highlighted = {},
			targetting,
			
			mousedown = function( el, event, element ) {

				checkBindingPairs();

				if( event.shiftKey ) {

					for( var i in options.graphs ) { // We need to lock all graphs to prevent actions on the shapes.
						options.graphs[ i ].lockShapes();	
					}
					
					binding = true;
					self[ element ] = el;

					event.preventDefault();
					event.stopPropagation();
				}

				// Try to be smart and determine where to put the line ?

				var bb = el.getBBox();
				var pos = $( el ).position(),

				x = pos.left + bb.width / 2,
				y = pos.top + bb.height / 2;

				bindingLine.setAttribute('display', 'block');

				bindingLine.setAttribute('x1', x );
				bindingLine.setAttribute('x2', x );

				bindingLine.setAttribute('y1', y );
				bindingLine.setAttribute('y2', y );



				targetting = otherTarget( element ); 
				if( options[ otherTarget( element ) ].targettable ) {

					var targetEls = findTargettableElements( otherTarget( element ) );

					targetEls.each( function( ) {

						if( this.jsGraphIsShape ) {

							this.jsGraphIsShape.highlight( options[ otherTarget( element ) ].targettable, "binding" );

						} else {

							storeAttributes( options[ otherTarget( element ) ].targettable, $( this ) );
							$( this ).attr( options[ otherTarget( element ) ].targettable );

						}
					} );
				}

			},

			otherTarget = function( target ) {

				if( target == "jsGraphShape") {
					return "targetB";
				}

				return "jsGraphShape";
			},

			findTargettableElements = function( target ) {

				return $( options[ target ].dom ).find( options[ target ].bindableFilter );
			},


			mouseup = function( el, event, target ) {

				checkBindingPairs();
				

				if( targetting ) {

					if( options[ targetting ].targettable ) {

						var targetEls = findTargettableElements( targetting );

						targetEls.each( function( ) {

							if( this.jsGraphIsShape ) {

								this.jsGraphIsShape.unHighlight( "binding" );

							} else {

								restoreAttributes( options[ targetting ].targettable, $( this ) );
							}
						} );
					}
				

				}

				targetting = false;
				
				if( binding && ! target ) {
					bindingLine.setAttribute('display', 'none');
					binding = false;
					return;
				}

				if( ! binding ) {
					return;
				}

				var domTarget = event.target;
				bindingLine.setAttribute('display', 'none');

				if( ! $( domTarget ).is( options[ target ].bindableFilter ) && ! $( domTarget ).get( 0 ).classList.contains( options[ target ].bindableFilterClass ) > -1 ) {

					binding = false;

				} else {

					self[ target ] = event.target;
					binding = false;
					bindSave();
				}

				for( var i in options.graphs ) { // We can now unlock everything
					options.graphs[ i ].unlockShapes();	
				}			
			},

			mousemove = function( e ) {

				checkBindingPairs();
				

				if( ! binding ) {
					return;
				}

				bindingLine.setAttribute('x2', e.clientX + window.scrollX );
				bindingLine.setAttribute('y2', e.clientY + window.scrollY );
			},

			highlight = function( element, target ) {
				
				checkBindingPairs();
				
				var elements = [ element ];
				if( options[ target ].highlighted ) {
					elements = getEquivalents( target, element );
					highlightEquivalents( target, elements );
				}
				
				//getEquivalents( target, selector );


				var eqs = [];
				
//				unhighlight( element, target );
				for( var i = 0, l = elements.length; i < l; i ++ ) {
			
					allPairs( highlightPair, elements[ i ], function( pair ) {
						eqs = eqs.concat( $.makeArray( getEquivalents( otherTarget( target ), pair[ otherTarget( target ) ] ) ) );
					} );
				}

				
				eqs = $( eqs );
				
				if( options[ otherTarget( target ) ].highlighted ) {
					highlightEquivalents( otherTarget( target ), eqs );
				}
				
			},

			unhighlight = function( element, target, force ) {

			/*	if( binding && ! force) {
					return;
				}
*/
				checkBindingPairs();
				var elements = getEquivalents( target, element );
				
				var eqs = [];

				for( var i = 0; i < elements.length; i ++ ) {

					allPairs( self.unhighlightPair, elements[ i ], function( pair ) {
						eqs = eqs.concat( $.makeArray( getEquivalents( otherTarget( target ), pair[ otherTarget( target ) ] ) ) );
					} );
				}


				highlighted.jsGraphShape.map( function( el ) {
					this.jsGraphIsShape.unHighlight( "assignmentHighlighted");
				} );

				restoreAttributes( options.targetB.highlighted, highlighted.targetB );
				
			},

			highlightEquivalents = function( target, elementsToHighlight ) {

				var highlightedAttributes = options[ target ].highlighted;

				if( elementsToHighlight[ 0 ] && elementsToHighlight[ 0 ].jsGraphIsShape ) {

					elementsToHighlight.map( function( el ) {

						this.jsGraphIsShape.highlight( highlightedAttributes, "assignmentHighlighted");
					} );

				} else {

					storeAttributes( highlightedAttributes, elementsToHighlight );
					elementsToHighlight.attr( highlightedAttributes );

				}

				highlighted[ target ] = elementsToHighlight;

			},

			getEquivalents = function( target, element ) {
				var selector = element.getAttribute( options[ target ].attributeEquivalents );
			
				return $( options[ target ].dom ).find( "[" + options[ target ].attributeEquivalents + "=\"" + selector + "\"]");
			},

			storeAttributes = function( attr, els ) {

				for( var i in attr ) {
					
					for( var j = 0, l = els.length; j < l; j ++ )  {
							
						if( ! $( els[ j ]  ).data( "backup-" + i ) ) {	
							$( els[ j ]  ).data( "backup-" + i, $( els[ j ]  ).attr( i ) );
						}
					}
				}
			},

			restoreAttributes = function( attr, els ) {

				for( var i in attr ) {

					for( var j = 0, l = els.length; j < l; j ++ )  {

						$( els[ j ] ).attr( i, $( els[ j ]  ).data('backup-' + i ) );
					}
				}
			},

			allPairs = function( fct, element, callback ) {

				for( var i = 0, l = self.bindingPairs.length ; i < l ; i ++ ) {

					if( self.bindingPairs[ i ].jsGraphShape == element || self.bindingPairs[ i ].targetB == element ) {

						fct.call( self, self.bindingPairs[ i ] );

						if( callback ) {
							callback.call( self, self.bindingPairs[ i ] );
						}
					}
				}
			},

			highlightPair = function( pair ) {


				var posA = $( pair.jsGraphShape ).offset();
				var posB = $( pair.targetB ).offset();

				var bbA = $( pair.jsGraphShape )[ 0 ].getBBox();
				var bbB = $( pair.targetB )[ 0 ].getBBox();

				var posMain = options.domGlobal.offset();

				var line;

				if( self.stashedLines.length > 0 ) {
					line = self.stashedLines.pop();
					line.setAttribute('display', 'block');
				} else {
					line = document.createElementNS( ns, 'line');	
				}

				
				line.setAttribute('stroke', 'black');
				line.setAttribute('x1', posA.left - posMain.left + bbA.width / 2 );
				line.setAttribute('y1', posA.top - posMain.top + bbA.height / 2  );
				line.setAttribute('x2', posB.left - posMain.left + bbB.width / 2 );
				line.setAttribute('y2', posB.top - posMain.top + bbB.height / 2 );

				pair.line = line;
				self.currentLines.push( line );

				topSVG.appendChild( line );
			},


			

			bindSave = function() {

				var pair;

				if( pair = lookForPair( self.jsGraphShape, self.targetB ) ) {
					removePair( pair );
					self.unhighlightPair( pair );
					return false;
				}

				unhighlight( self.jsGraphShape, "jsGraphShape", true );

				self.bindingPairs.push( { jsGraphShape: self.jsGraphShape, targetB: self.targetB } );

				self.jsGraphShape.jsGraphIsShape.setStrokeDasharray("5,5");
				self.jsGraphShape.jsGraphIsShape.applyStyle();
			
				bindingA = null;
				bindingB = null;

			},


			lookForPair = function( A, B ) {

				for( var i = 0; i < self.bindingPairs.length; i++ ) {

					if( self.bindingPairs[ i ].jsGraphShape == A || self.bindingPairs[ i ].targetB == B ) {
						return self.bindingPairs[ i ];
					}
				}
				return false;
			},




			checkBindingPairs = function() {

				for( var i = 0, l = self.bindingPairs.length ; i < l ; i ++ ) {

					if( $( options.jsGraphShape.dom ).get( 0 ).contains( self.bindingPairs[ i ].jsGraphShape ) && $( options.targetB.dom ).get( 0 ).contains( self.bindingPairs[ i ].targetB ) ) {
						continue;
					} else {

						self.bindingPairs[ i ] = false;
					}
				}
			},

			setEvents = function( ) {

				options.jsGraphShape.dom.on('mousedown', options.jsGraphShape.bindableFilter, function( e ) {
					
					mousedown( this, e, "jsGraphShape" );
				});

				options.jsGraphShape.dom.on('mouseover', options.jsGraphShape.bindableFilter, function( e ) {
					
					highlight( this, "jsGraphShape" );
				});

				options.jsGraphShape.dom.on('mouseout', options.jsGraphShape.bindableFilter, function( e ) {
					unhighlight( this, "jsGraphShape" );
				});

				options.targetB.dom.on('mousedown', options.targetB.bindableFilter, function( e ) {
					mousedown( this, e, "targetB" );
				});

				options.targetB.dom.on('mouseover', options.targetB.bindableFilter, function( e ) {
					highlight( this, "targetB" );
				});

				options.targetB.dom.on('mouseout', options.targetB.bindableFilter, function( e ) {
					unhighlight( this, "targetB" );
				});

				options.jsGraphShape.dom.on('mouseup', function( e ) {
					mouseup( this, e, "jsGraphShape" );
				});

				options.targetB.dom.on('mouseup', function( e ) {
					mouseup( this, e, "targetB" );
				});

				options.domGlobal.on('mouseup', function( e ) {
					mouseup( this, e, false );
				})

				options.domGlobal.on('mousemove', function( e ) {
					mousemove( e );
				})
			};


			var topSVG = document.createElementNS( ns, 'svg' );
			topSVG.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
			topSVG.setAttribute('xmlns', ns );
		
			topSVG.setAttribute('style', 'position: absolute');
			topSVG.setAttribute('width', options.domGlobal.width( ) )
			topSVG.setAttribute('height', options.domGlobal.height( ) )
			topSVG.setAttribute('pointer-events', 'none');

			bindingLine = document.createElementNS( ns, 'line');
			bindingLine.setAttribute('stroke', 'black');

			topSVG.appendChild( bindingLine );

			options.domGlobal.prepend( topSVG );
			setEvents( );	
	};


	Assignment.prototype.removePair = function( pair ) {

		this.bindingPairs.splice( this.bindingPairs.indexOf( pair ), 1 );
		this.unhighlightPair( pair );
	};

	Assignment.prototype.unhighlightPair = function( pair ) {

		pair.line = false;

		this.currentLines.map( function( line ) {
			line.setAttribute('display', 'none');
		} );

		this.stashedLines = this.stashedLines.concat( this.currentLines );
		this.currentLines = [];
	};


	Assignment.prototype.getAssignment = function() {

		var self = this;

		return this.bindingPairs.map( function( pair ) {

			if( ! pair ) {
				return undefined;
			}

			var attrA = pair.jsGraphShape.getAttribute( self.options.jsGraphShape.attributeEquivalents );
			var attrB = pair.targetB.getAttribute( self.options.targetB.attributeEquivalents );

			return [ attrA, attrB ];
		} );
	}

	Assignment.prototype.removePairsWithShape = function( shape ) {

		var self = this;
		var pairs = this.lookForPairsByShape( shape ).map( function( pair ) {

			self.removePair( pair );

		});
	}

	Assignment.prototype.lookForPairsByShape = function( A ) {

		var pairs = [];
		for( var i = 0; i < this.bindingPairs.length; i++ ) {

			if( this.bindingPairs[ i ].jsGraphShape == A ) {
				pairs.push( this.bindingPairs[ i ] );
			}
		}

		return pairs;
	};

	Assignment.prototype.findElement = function( target, selector ) {

		return $( this.options[ target ].dom ).find( "[" + this.options[ target ].attributeEquivalents + "=\"" + selector + "\"]");	
	};


	Assignment.prototype.setAssignment = function( pairs ) {

		var self = this;
		self.bindingPairs = [];

		pairs.forEach( function( pair ) {

			self.bindingPairs.push( { jsGraphShape: self.findElement( 'jsGraphShape', pair[ 0 ] ), targetB: self.findElement( 'targetB', pair[ 1 ] ) } );
		} );
	}

	return Assignment;

});

define('nmr',[ 'jquery', 'jsgraph', './shape.1dnmr', './assignment', 'jcampconverter', 'eventEmitter' ], function( $, Graph, Shape1DNMR, Assignment, JcampConverter, EE ) {

	// Root here
	var defaults = {
		mode: '1d',
		molecule: false,
		urls: {

		}
	};

	function fetchUrls( nmr, urls ) {

		var fetching = [];
		for( var i in urls ) {
			fetching.push( $.get( urls[ i ] ).then( function( data ) { return JcampConverter.convert( data, {keepSpectra:true} ) } ) );
		}

		if( ! nmr.divLoading ) {

			nmr.divLoading = $("<div />").css( {

				width: nmr.getDom().width(),
				height: nmr.getDom().height(),
				position: 'absolute',
				backgroundColor: 'rgba(200, 200, 200, 0.5)',
				textAlign: 'center',
				lineHeight: nmr.getDom().height() + "px",
				fontSize: '2em',
				border: "1px solid #c0c0c0"

			} ).html("Loading...");

			nmr.getDom().prepend( nmr.divLoading );
		}

		nmr.loading = nmr.loading || 0
		nmr.loading++;

		$.when.apply( $, fetching ).then( function() {

			var j = 0;
			for( i in urls ) {

				urls[ i ] = arguments[ j ];
				j++;
			}

			nmr.loading--;
			if( nmr.loading == 0 ) {
				nmr.divLoading.remove();
				nmr.divLoading = false;
			}

			nmr.series.push( urls );
			nmr.loaded( urls, "a" + Math.random() );
		} );
	}

	function makeNMRIntegral( nmr, mode, integral ) {
		// External call
		var shape = nmr.graphs.newShape( { 
				type: 'nmrintegral', 
				fillColor: 'transparent', 
				strokeColor: '#AF002A', 
				strokeWidth: '2px',
				selectOnClick: true,
				handles: true,
				label: {
					position: { },
					text: 1,
					color: 'red',
					anchor: 'middle'
				},

				shapeOptions: {
					locked: true
				}
			 } );
		
		shape.setSerie( nmr.getGraphX().getSerie( 0 ) );
		shape.setLabelText( "NMRVal" );
		shape.draw();
		shape.redraw();



		return shape;
	}
	
	function removeSerie( nmr, name ) {


		var serie;
		if( ( serie = nmr.graphs.getSerie( name ) ) ) {
			serie.kill();
		}

		nmr.graphs.redraw();
		nmr.graphs.drawSeries();
	}

		
	Graph.registerConstructor("graph.shape.1dnmr", Shape1DNMR);

	function NMR( options ) {

		var nmr = this;

		this.options = $.extend( true, {}, defaults, options );
		this.series = [];
		this.integrals = [];

		nmr.options.dom.append('<div />');
		nmr.makeGraph();

		switch( this.options.mode ) {
			case '2d':
				
			break;

			case '1d':
				this.legend = this.graphs.makeLegend( { frame: true, frameWidth: 2, frameColor: 'grey', movable: true, backgroundColor: 'white' } );
				this.legend.setPosition( { x: "300px", y: "40px" }, 'right' );

			break;
		}

		if( this.options.assignment ) {
			this.assignement = new Assignment( $.extend( this.options.assignment, { graphs: { 'x': this.graphs }, domGraphs: this.options.dom } ) );	
		}


		this.heightIntegral1 = 150;
	}


	var loadDefaults = {
		urls: {}
	};

	NMR.prototype = new EE();

	NMR.prototype.load = function( load ) {

		var load = $.extend( true, {}, loadDefaults, load );
		var urls = {};
		switch( this.options.mode ) {


			case '1d':
				
				load.urls.oneD = load.url || load.urls.oneD || load.urls.x;
				urls.x = load.urls.oneD;	


			break;
		}


		fetchUrls( this, urls, load );
	};

	NMR.prototype.loadJcamp = function (jcamp, name) {
	    removeSerie(this, name);
        const data = JcampConverter.convert( jcamp, {keepSpectra:true} );
        this.loaded( {x: data}, name );
    };

	NMR.prototype.integralCreated = function( integral ) {

		if( this.graphs.selectedSerie ) {
			integral.setSerie( this.graphs.selectedSerie );
		} else {
			integral.setSerie( this.graphs.getSerie( 0 ) );
		}
		
		integral.addClass('bindable');
		this.integrals.push( integral );

		this.emit( "integralCreated" );
	}

	NMR.prototype.integralChanged = function( integral ) {
		this.recalculateIntegrals( );

		this.emit( "integralChanged" );
	}

	NMR.prototype.integralRemoved = function( integral ) {

		this.integrals.splice( this.integrals.indexOf( integral ), 1 );
		this.recalculateIntegrals( );
		this.assignement.removePairsWithShape( integral._dom );
		this.emit( "integralRemoved" );
	}


	NMR.prototype.recalculateIntegrals = function( ) {

		var nmr = this,
			numberOfIntegrals = nmr.integrals.length;

		if( numberOfIntegrals == 1 ) {
			nmr.ratio = nmr.heightIntegral1 / nmr.integrals[ 0 ].sum;
			nmr.ratioSum = nmr.integrals[ 0 ].sum;
		}

		
		for( var i = 0; i < numberOfIntegrals ; i ++ ) {

			nmr.integrals[ i ].ratio = nmr.ratio;

			var text = Math.round( nmr.integrals[ i ].sum / nmr.ratioSum * 100 ) / 100;
			if( ! isNaN( text ) ) {
				nmr.integrals[ i ].setLabelText( text );
			}

			nmr.integrals[ i ].updateLabels();
		}
	}

	NMR.prototype.redrawIntegrals = function() {

		var l = this.integrals.length;
		for( var i = 0; i < l; i++ ) {
			this.integrals[ i ].redraw();
		}
	}

	NMR.prototype.integralValueChanged = function( integral ) {

		var fl = parseFloat( integral.getLabelText( 0 ) );
		this.ratioSum = integral.sum / fl;
		this.recalculateIntegrals( );
		this.emit( "integralValueChanged" );
	}

	NMR.prototype.getDom = function() {
		return this.options.dom;
	};

	NMR.prototype.getGraph = function() {
		return this.graphs;
	};

	NMR.prototype.resizeTo = function( w, h ) {
		this.graphs.resize( w, h );
	};

	NMR.prototype.setSerieX = function( name, data, options ) {

		if( this.graphs.getSerie( name ) ) {

			this.graphs.getSerie( name ).kill();
			this.graphs.removeShapes();
			this.integralBasis = false;

		}

		var serie_x = this.graphs.newSerie( name, $.extend( { useSlots: true }, options ) )
			.setLabel( "My serie" )
			.autoAxis()
			.setData( data )
			.XIsMonotoneous();

		if( options.lineColor ) {
			serie_x.setLineColor( options.lineColor );
		}

		if( options.lineWidth ) {
			serie_x.setLineWidth( options.lineWidth );
		}

		if( options.setLineStyle ) {
			serie_x.setLineStyle( options.lineStyle );
		}

		serie_x.XIsMonotoneous();
		serie_x.getXAxis().setAxisDataSpacingMax(0);
		serie_x.getXAxis().setAxisDataSpacingMin(0);

		serie_x.getYAxis().setDisplay( false ).primaryGridOff( false ).secondaryGridOff( false );
		serie_x.getXAxis().flip(true).setLabel('ppm').primaryGridOff( false ).secondaryGridOff( false ).setTickPosition( 'outside' )

		this.graphs.autoscaleAxes();
		this.graphs.draw();
	};


	NMR.prototype.loaded = function( series, name ) {

	
		this.setSerieX( name, series.x.spectra[ 0 ].data[ 0 ], { label: name } );

	};


	NMR.prototype.makeGraph = function() {

		var self = this;

		this.graphs = new Graph( this.getDom().children().get(0), {

			close: { left: false, top: false, right: false },
			paddingBottom: 0,
			paddingTop: 0,
			paddingLeft: 0,
			paddingRight: 0,

			plugins: {
				'zoom': { 
					zoomMode: 'x'

				},

				'shape': { 
					type: 'nmrintegral',
					strokeColor: '#AF002A', 
					fillColor: "transparent",
					strokeWidth: 2,

					locked: false,
					movable: true,
					resizable: true,
					selectable: true,
					selectOnMouseDown: true,
					handles: true,
					labelEditable: true,

					horizontal: true, 
					forcedCoords: { y: function( shape ) { return ( 20 + shape.serie.getIndex() * 5 ) + "px"; } },
					bindable: true,
					axis: 'x',

					labels: [ { text: "Something", color: 'red' } ] ,



					attributes: { 'data-bindable': function() { return Math.random(); }, 'id': function() { return Math.random(); } },

					onCreatedShape: function( shape ) {

						shape.addAttribute( 'id', Math.random() );
						self.integralCreated( shape );
					},

					onBeforeNewShape: function( shape, event ) {

						if( event.target.classList.contains( 'bindable' ) > 0 ) {
							this.graph.prevent( true );
						}
						
					},


					highlightOnMouseOver: true
				},
			},

			mouseActions: [
				{ plugin: 'zoom', shift: false, ctrl: false },
				{ plugin: 'shape', shift: true, ctrl: false },
				{ plugin: 'zoom', shift: false, type: 'mousewheel', options: { baseline: 0, direction: 'y' } },
				{ shift: true, type: 'mousewheel', callback: function( delta ) {

					var change = delta / 300;
					self.heightIntegral1 += change;
					self.ratio = self.heightIntegral1 / self.integrals[ 0 ].sum;
					self.recalculateIntegrals();
					self.redrawIntegrals();
				} },
				{ plugin: 'zoom', shift: false, type: 'dblclick', options: { mode: 'total' } }

			],

			onBeforeNewShape: function() {

				if( ! this.selectedSerie && this.series.length > 1 ) {
					return false;
				}
			}

		} );


		this.graphs.setHeight(300);


		this.graphs.on("shapeRemoved", function( shape ) {

			if( shape.getType() == 'nmrintegral' ) {
				self.integralRemoved( shape );
			}
		});

		this.graphs.on("shapeChanged", function( shape ) {

			if( shape.getType() == "nmrintegral" ) {

				self.integralChanged( shape );
			}
		});

		this.graphs.on("shapeLabelChanged", function( shape ) {

			if( shape.getType() == "nmrintegral" ) {

				self.integralValueChanged( shape );
			}
		} );

		this.graphs.draw( );	
		
	};

	NMR.prototype.getIntegrals = function() {
		return this.integrals.map(shape => shape.getProperties());
	};

	NMR.prototype.setIntegrals = function(integrals) {
		integrals.forEach(integral => {
			const shape = this.graphs.newShape('nmrintegral', null, false, integral);
			this.integralCreated(shape);
		});
		this.redrawIntegrals();
	};

	return NMR;
	

});

	define('jquery', function() { return $; });
	define('jsgraph', function() { return Graph; });
	define('jcampconverter', function() { return JcampConverter; });
	define('eventEmitter', function() { return EventEmitter; });
	return require('nmr');

});
