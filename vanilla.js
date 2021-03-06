/**
 * Vanilla Framework ;) (https://github.com/xylphid)
 * Version 1.0.8
 *
 * @author Anthony PERIQUET
 */
var vanilla = (function(window, document) {
    var events = []
    var listeners = {};
    var vanilla = function( query ){
        if (!(this instanceof vanilla))
            return new vanilla( query );

        this.selector = query;
        this.nodes = typeof query != 'undefined' ? selector( query ) : [];
    };

    vanilla.prototype = {

        // Add class to each elements in the set
        addClass: function( className ) {
            classNames = className.split(' ');
            for (var i = 0; i < this.nodes.length; i++) {
                for (var key in classNames) {
                    this.nodes[i].classList.add(classNames[key]);
                }
            }
            return this;
        },

        // Add each element in the set after element in parameter
        after: function( elm ) {
            if (!(elm instanceof vanilla)) elm = new vanilla( elm );
            for (var i = 0; i < this.nodes.length; i++) {
                for (var j = 0; j < elm.nodes.length; j++) {
                    this.nodes[i].after(elm.nodes[j]);
                }
            }
            return this;
        },

        // Add element in parameter to the end of each element in the set
        append: function( elm ) {
            nodes = elm instanceof vanilla ? elm.nodes : parseHtml(elm);
            for (var i = 0; i < this.nodes.length; i++) {
                for (var j = 0; j < nodes.length; j++) {
                    this.nodes[i].appendChild( nodes[j] );
                }
            }
            return this;
        },

        // Add the current set to the end of the element specified in parameter
        appendTo: function( elm ) {
            if (!(elm instanceof vanilla)) elm = new vanilla( elm );
            for (var i = 0; i < this.nodes.length; i++) {
                for (var j = 0; j < elm.nodes.length; j++) {
                    elm.nodes[j].appendChild( this.nodes[i] );
                }
            }
            return this;
        },

        // Attributes management
        attr: function( attr, value ) {
            if (typeof value != 'undefined') {
                for (var i = 0; i < this.nodes.length; i++) {
                    if (value == null) {
                        this.nodes[i].removeAttribute(attr);
                    } else {
                        this.nodes[i].setAttribute(attr, value);
                    }
                }
                return this;
            }
            else {
                value = this.nodes[0].getAttribute(attr);
                return value === null ? undefined : value;
            }
        },

        // Add each element in the set before element in parameter
        before: function( elm ) {
            if (!(elm instanceof vanilla)) elm = new vanilla( elm );
            for (var i = 0; i < this.nodes.length; i++) {
                for (var j = 0; j < elm.nodes.length; j++) {
                    this.nodes[i].before(elm.nodes[j]);
                }
            }
            return this;
        },

        // Get children collection
        children: function( query ) {
            var items = query ? this.nodes[0].querySelectorAll( query ) : this.nodes[0].children;
            var children = vanilla();
            for (var i=0; i< items.length; i++) {
                children.nodes[i] = items[i];
            }
            return children;
        },

        // Create a copy of the current set
        clone: function() {
            elm = vanilla();
            elm.selector = this.selector;
            for (var i = 0; i < this.nodes.length; i++) { elm.nodes.push(this.nodes[i].cloneNode(true)); }
            return elm;
        },

        // Define css property for each elements in the set or get the property value of the first element
        css: function( attr, value ) {
            if (typeof value != 'undefined') {
                for (var i = 0; i < this.nodes.length; i++) {
                    this.nodes[i].defaultStyle = typeof this.nodes[i].defaultStyle == typeof undefined ? {} : this.nodes[i].defaultStyle;
                    if (typeof this.nodes[i].defaultStyle[ camelCase(attr) ] == typeof undefined) {
                        this.nodes[i].defaultStyle[ camelCase(attr) ] =
                            this.nodes[i].style[ camelCase(attr) ] != '' ? this.nodes[i].style[ camelCase(attr) ] : value;
                    }
                    this.nodes[i].style[ camelCase(attr) ] = value;
                }
                return this;
                //} else { return this.nodes[0].style[camelCase(attr)]; }
            } else { return getComputedStyle(this.nodes[0])[camelCase(attr)]; }
        },

        // Execute handler specified in parameter to each element in the set
        each: function( handler ) {
            if (typeof handler != 'function') return this;
            var nodes = [];
            for (var i = 0; i < this.nodes.length; i++) {
                o = new vanilla();
                o.nodes = [this.nodes[i]];
                nodes.push(o);
            }
            [].forEach.call(nodes, handler);
            return this;
        },

        // Empty the content of each element in the set
        empty: function() {
            for (var i = 0; i < this.nodes.length; i++) {
                while (this.nodes[i].firstChild) { this.nodes[i].removeChild(this.nodes[i].firstChild); }
            }
        },

        // Fade each element in the set from opacity 0 to the defined opacity
        fadeIn: function( callback, duration ) {
            duration = typeof callback != 'function' ? callback : duration;
            duration = typeof duration == typeof undefined ? 500 : duration;
            callback = typeof callback != 'function' ? null : callback;
            for (var i = 0; i < this.nodes.length; i++) {
                var s = this.nodes[i].style;
                var opacity = this.nodes[i].defaultStyle && typeof this.nodes[i].defaultStyle['opacity'] != typeof undefined ? this.nodes[i].defaultStyle['opacity'] : 1;

                s.opacity = 0;
                s.display = s.display == 'none' ? "block" : s.display;
                (function unfade(){
                    var val=parseFloat(s.opacity);
                    if(!((val+=.01)>opacity)) {
                        s.opacity=val;
                        setTimeout(unfade,duration/100);
                    } else if(callback){
                        callback();
                    }
                })();
            }
            return this;
        },

        // Fade each element in the set to opacity 0
        fadeOut: function( callback, duration ) {
            duration = typeof callback != 'function' ? callback : duration;
            duration = typeof duration == typeof undefined ? 500 : duration;
            callback = typeof callback != 'function' ? null : callback;
            for (var i = 0; i < this.nodes.length; i++) {
                var s = this.nodes[i].style;
                s.opacity = s.opacity ? s.opacity : 1;
                (function fade(){
                    if ((s.opacity-=.01)<0) {
                        s.display="none"
                        if (callback) callback();
                    } else {
                        setTimeout(fade,(duration/100))
                    }
                })();
            }
            return this;
        },

        // Get the first child element of the first element
        firstChild: function() {
            first = this.nodes[0].firstChild;
            while (first !== null && (first.nodeType == 8 || (first.nodeType == 3 && !/\S/.test(first.nodeValue)))) {
                first = first.nextSibling;
            }
            return vanilla(first);
        },

        // Return true if each element in the set has the given class
        hasClass: function( className ) {
            hasClass = false;
            for (var i = 0; i < this.nodes.length; i++) {
                hasClass = hasClass || new RegExp(' ' + className + ' ').test(' ' + this.nodes[i].classList + ' ');
            }
            return hasClass;
        },

        // Set the content of each element in the set or get le content of the first element
        html: function( html ) {
            if (typeof html != typeof undefined) {
                for (var i = 0; i < this.nodes.length; i++) { this.nodes[i].innerHTML = html; }
                return this;
            }
            else
                return this.nodes[0].innerHTML;
        },

        // Get inner height of the first element in the set
        innerHeight: function() {
            if (this.nodes.length == 0) return null;
            return this.nodes[0].clientHeight;
        },

        // Get inner width of the first element in the set
        innerWidth: function() {
            if (this.nodes.length == 0) return null;
            return this.nodes[0].clientWidth;
        },

        // Check if the current set match the specified selector
        is: function( query ) {
            var all = document.querySelectorAll( query );
            for (var i = 0; i < all.length; i++) {
                if (all[i] === this.nodes[0]) {
                    return true;
                }
            }
            return false;
        },

        // Get the last child element of the first element
        lastChild: function() {
            last = this.nodes[0].lastChild;
            while (last !== null && (last.nodeType == 8 || (last.nodeType == 3 && !/\S/.test(last.nodeValue)))) {
                last = last.previousSibling;
            }
            return vanilla(last);
        },

        // Return the number to elements
        length: function() {
            return this.nodes.length;
        },

        // Add handler on load event
        load: function( handler ) {
            this.on('load', handler);
            return this;
        },

        // Get the next sibling of the first element
        next: function() {
            sibling = this.nodes[0].nextSibling;
            while (sibling !== null && (sibling.nodeType == 8 || (sibling.nodeType == 3 && !/\S/.test(sibling.nodeValue)))) {
                sibling = sibling.nextSibling;
            }

            if (sibling !== null) {
                o = new vanilla(sibling);
                o.selector = this.selector;
            }
            else o = sibling;
            return o;
        },

        // Remove event handler
        off: function(event) {
            var nListeners = Object.keys(listeners).length;
            for (var i in listeners) {
                var rm = false;
                var l = listeners[i];
                for (var n = 0; n < this.nodes.length; n++) {
                    if (l.event == event) {
                        this.nodes[n].removeEventListener(l.event, l.handler, l.capture);
                        rm = true;
                    }
                }
                if (rm === true) delete listeners[i];
            }
            return this;
        },

        // Add event handler to the selected element
        on: function(event, query, handler, capture) {
            if (typeof query == 'function') {
                capture = handler;
                handler = query;
                query = null;
            }
            var nListeners = Object.keys(listeners).length;
            capture = typeof capture === typeof undefined ? false : capture;
            // Define delegated event handler
            if (query !== null) {
                var delegatedHandler = function(event) {
                    event.value = vanilla(event.target);
                    while (event.value instanceof vanilla && !event.value.is(query)) {
                        event.value = event.value.parent();
                    }
                    if (event.value && event.value.is( query )) return handler(event);
                };
            }
            // Set event listeners
            for (var i = 0; i < this.nodes.length; i++) {
                this.nodes[i].addEventListener(event, !query ? handler : delegatedHandler, capture);
                listeners[nListeners + i] = {
                    element: this.nodes[i],
                    event: event,
                    handler: !query ? handler : delegatedHandler,
                    capture: capture
                };
            }
            return this;
        },

        // Get outer height (height + padding + border + margin) of the first element in the set
        outerHeight: function() {
            if (this.nodes.length == 0) return null;
            return this.nodes[0].offsetHeight;
        },

        // Return the current element
        outerHtml: function() {
            return this.nodes[0].outerHTML;
        },

        // Get outer width (width + padding + border + margin) of the first element in the set
        outerWidth: function() {
            if (this.nodes.length == 0) return null;
            return this.nodes[0].offsetWidth;
        },

        // Get the ancestor of the first element
        parent: function() {
            if (this.nodes[0].parentNode !== null) {
                o = new vanilla(this.nodes[0].parentNode);
            }
            else o = this.nodes[0].parentNode;
            return o;
        },

        // Add element in parameter to the beginning of each element in the set
        prepend: function( elm ) {
            nodes = elm instanceof vanilla ? elm.nodes : parseHtml(elm);
            for (var i = 0; i < this.nodes.length; i++) {
                first = this.nodes[i].hasChildNodes() ? this.nodes[i].firstChild : null;
                for (var j = 0; j < nodes.length; j++) {
                    first !== null ? this.nodes[i].insertBefore( nodes[j], first ) : this.nodes[i].appendChild( nodes[j] );
                }
            }
            return this;
        },

        // Add the current set to the beginning of the element specified in parameter
        prependTo: function( elm ) {
            if (!(elm instanceof vanilla)) elm = vanilla( elm );
            for (var i = 0; i < this.nodes.length; i++) {
                for (var j = 0; j < elm.nodes.length; j++) {
                    first = elm.nodes[i].hasChildNodes() ? elm.nodes[i].firstChild : null;
                    first !== null ? elm.nodes[i].insertBefore( this.nodes[j], first ) : elm.nodes[i].appendChild( this.nodes[j] );
                }
            }
            return this;
        },

        // Get the previous sibling of the first element
        prev: function() {
            sibling = this.nodes[0].previousSibling;
            while (sibling !== null && (sibling.nodeType == 8 || (sibling.nodeType == 3 && !/\S/.test(sibling.nodeValue)))) {
                sibling = sibling.previousSibling;
            }

            if (sibling !== null) {
                o = new vanilla(sibling);
                o.selector = this.selector;
            }
            else o = sibling;
            return o;
        },

        // Add event handler on content loaded event
        ready: function( callback ) {
            document.addEventListener('DOMContentLoaded', callback, false);
        },

        // Delete the current set
        remove: function() {
            for (var i = 0; i < this.nodes.length; i++) {
                var node = this.nodes[i];
                if (typeof node.remove != typeof undefined)
                    node.remove();
                else
                    (typeof node.parentNode != typeof undefined) ? node.parentNode.removeChild(node) : node.parent.removeChild(node);
            }
        },

        // Remove the given class to each elements in the set
        removeClass: function( className ) {
            classNames = className.split(' ');
            for (var i = 0; i < this.nodes.length; i++) {
                for (key in classNames) {
                    this.nodes[i].classList.remove(classNames[key]);
                }
            }
            return this;
        },

        // Replace the current set with element specified in parameter
        replaceWith: function( replacement ) {
            for (var i = 0; i < this.nodes.length; i++) {
                this.nodes[i].outerHTML = (replacement instanceof vanilla) ? replacement.nodes[0].outerHTML : replacement;
            }
            return this;
        },

        scrollTop: function() {
            if (this.nodes.length == 0) return null;
            return this.nodes[0].scrollTop;
        },

        scrollLeft: function() {
            if (this.nodes.length == 0) return null;
            return this.nodes[0].scrollLeft;
        },

        scrollHeight: function() {
            if (this.nodes.length == 0) return null;
            return this.nodes[0].scrollHeight;
        },

        scrollWidth: function() {
            if (this.nodes.length == 0) return null;
            return this.nodes[0].scrollWidth;
        },

        serialize: function() {
            var form = this.nodes[0];
            var serial = {};
            for (var i =0; i <form.length; i++) {
                if (form.elements[i].name && ['submit', 'reset', 'button'].indexOf(form.elements[i].type) == -1) {
                    if (form.elements[i].getAttribute('type') == 'file')
                        serial[form.elements[i].name] = form.elements[i].files;
                    else if (form.elements[i].type == 'select-multiple') {
                        // See : https://stackoverflow.com/a/39363742/5405687
                        serial[form.elements[i].name] = Array.from(form.elements[i].options)
                            .filter(option => option.selected)
                            .map(option => option.value || option.text);
                        if (!serial[form.elements[i].name].length){ delete serial[form.elements[i].name]; }
                    } else if (['checkbox', 'radio'].indexOf(form.elements[i].type) == -1 || field.checked) {
                        serial[form.elements[i].name] = form.elements[i].value;
                    }
                }
            }
            console.log("Serial :", serial);
            return serial;
        },

        // Add handler on touch event
        swipe: function( direction, callback ) {
            this.touch.load( this, direction, callback );
            return this;
        },

        // Toggle the given attribute to each elements in the set
        toggleAttr: function( attr, value ) {
            for (var i = 0; i < this.nodes.length; i++) {
                if (this.nodes[i].getAttribute( attr ) == null) {
                    this.nodes[i].setAttribute( attr, value);
                } else {
                    this.nodes[i].removeAttribute(attr);
                }
            }
            return this;
        },

        // Toggle the given class to each elements in the set
        toggleClass: function( className ) {
            for (var i = 0; i < this.nodes.length; i++) {
                this.nodes[i].classList.toggle( className );
            }
            return this;
        },

        // Touch devices extracted from konami-js (https://github.com/snaptortoise/konami-js)
        touch: {
            start_x:0,
            start_y:0,
            stop_x:0,
            stop_y:0,
            tap:false,
            capture:false,
            load: function( vanilla, direction, callback ) {
                vanilla.on('touchmove', function(e) {
                    if (e.touches.length == 1 && vanilla.touch.capture == true) {
                        var touch = e.touches[0];
                        vanilla.touch.stop_x = touch.pageX;
                        vanilla.touch.stop_y = touch.pageY;
                        vanilla.touch.tap = false;
                        vanilla.touch.capture = false;
                    }
                    e.preventDefault();
                });
                vanilla.on('touchend', function(e) {
                    vanilla.touch.checkDirection( direction, callback );
                    e.preventDefault();
                }, false);
                vanilla.on('touchstart', function(e) {
                    vanilla.touch.start_x = e.changedTouches[0].pageX;
                    vanilla.touch.start_y = e.changedTouches[0].pageY;
                    vanilla.touch.tap = true;
                    vanilla.touch.capture = true;
                    e.preventDefault();
                });
            },
            checkDirection: function( direction, callback ) {
                x_magnitude = Math.abs(this.start_x - this.stop_x);
                y_magnitude = Math.abs(this.start_y - this.stop_y);
                x = ((this.start_x - this.stop_x) < 0) ? 'right' : 'left';
                y = ((this.start_y - this.stop_y) < 0) ? 'down' : 'up';
                result = (x_magnitude > y_magnitude) ? x : y;
                result = (this.tap == true) ? 'tap' : result;

                if (result == direction) callback();
            }
        },

        value: function( value ) {
            if (typeof value != typeof undefined) {
                for (var i = 0; i < this.nodes.length; i++) {
                    this.nodes[i].value = value;
                }
                return this;
            }
            else return this.nodes[0].value;
        }

    };

    // Ajax module
    vanilla.ajax = function( url, options ) {
        options = typeof options != typeof undefined ? options : {};
        var request = new XMLHttpRequest();
        request.open(options.method ? options.method : 'GET', url, true);
        request.setRequestHeader("X-Requested-With", "XMLHttpRequest");

        request.onload = function() {
            // If success
            if (request.status >= 200 && request.status < 400) {
                if (typeof options.success != typeof undefined) {
                    options.success( request );

                    // Parse for script tags and evaluate
                    var s = parseScript( parseHtml( request.responseText ) );
                    for (var i=0; i<s.length; i++) {
                        window.eval(s[i].text);
                    }
                }
            } else if (typeof options.error != typeof undefined) {
                // We reached our target server, but it returned an error
                options.error( request );
            }
        }
        request.onerror = function() {
            // There was a connection error of some sort
            console.log( request.responseText );
        }

        if (options.method == 'POST')
            options.datas = options.datas ? convertToFormData(options.datas) : null;
        else
            options.datas = options.datas ? serialize(options.datas) : null;

        request.send(options.datas);
    };

    // Extend module
    vanilla.extend = function(out) {
        out = out || {};
        for (var i = 1; i < arguments.length; i++) {
            if (!arguments[i])
                continue;
            for (var key in arguments[i]) {
                if (arguments[i].hasOwnProperty(key))
                    out[key] = arguments[i][key];
            }
        }

        return out;
    };

    vanilla.is = function( el, query ) {
        return (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, query);
    };

    var selector = function( query ) {
        var elm = null;
        if (typeof query !== 'string') {
            // If it's not a string assume it's already an element
            elm = query instanceof vanilla ? query.nodes : [query];
        } else if ( isTag(query) ) {
            // check if it's a tag
            var tag = query.substring(1, query.length-1);
            elm = [document.createElement( tag )];
        } else if ( isId(query) ) {
            // check if it's an id
            var id = query.substring(1);
            elm = [document.getElementById( id )];
        } else {
            // run a basic query
            try {
                elm = document.querySelectorAll( query );
            } catch (e) {
                elm = parseHtml( query );
            }
        }

        return typeof elm === typeof undefined ? [] : elm;
    }

    // utils
    var camelCase = function( string ){
        return  string.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
    };

    var isTag = function( string ){
        return string.search(/^<\w+>$/) === 0;
    };

    var isId = function( string ){
        return string.search(/^#\w+$/) === 0;
    };

    // return one item from the _selected stack
    var getEl = function( i ){
        i = i || 0;
        // more sophisticated logic here?
        return _selected[i] || _selected;
    };

    var isHtml = function( string ){
        var t = document.createElement('div');
        t.innerHTML = string;
        for (var n = t.childNodes, i = n.length; n--;) {
            if (n[i].nodeType == 1) return true;
        }
        return false;
    };

    var parseHtml = function( string ){
        var parser = new DOMParser();
        var htmlDoc = parser.parseFromString( string, 'text/html' );
        return htmlDoc.body.childNodes;
    };

    var parseScript = function( nodeList ){
        var scripts = [];
        for (var i=0; i<nodeList.length; i++) {
            if (nodeList[i].tagName == 'SCRIPT') {
                scripts.push( nodeList[i] );
            } else if (nodeList[i].nodeType == 1) {
                scripts = vanilla.extend([], scripts, parseScript(nodeList[i].childNodes));
            }
        }
        return scripts;
    };

    var serialize = function(obj, prefix) {
        var str = [];
        for(var p in obj) {
            if (obj.hasOwnProperty(p)) {
                var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
                str.push(typeof v == "object" ? serialize(v, k) : encodeURIComponent(k) + "=" + encodeURIComponent(v));
            }
        }
        return str.join("&");
    }

    var convertToFormData = function(obj) {
        var formData = new FormData();
        for (var p in obj) {
            if (!(obj[p] instanceof FileList) && !(obj[p] instanceof Array))
                formData.append(p, obj[p]);
            else {
                for (var i = 0; i < obj[p].length; i++) {
                    if (obj[p] instanceof Array) { formData.append(p + '[]', obj[p][i]); }
                    else { formData.append(p + '[]', obj[p].files[i], obj[p].files[i].name); }
                }
            }
        }
        return formData;
    }

    window.vanilla = new vanilla();
    return vanilla;

}) (this.window, this.document);