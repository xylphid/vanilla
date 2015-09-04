/**
 * Vanilla Framework ;) (https://github.com/xylphid)
 * Version 0.1.1
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
        this.nodes = selector( query );
    };

    vanilla.prototype = {

        // Attributes management
        attr: function( attr, value ) {
            if (typeof value != 'undefined') {
                for (var i = 0; i < this.nodes.length; i++) {
                    this.nodes[i].setAttribute(attr, value);
                }
                return this;
            }
            else {
                value = this.nodes[0].getAttribute(attr);
                return value === null ? undefined : value;
            }
        },
        // Class management
        addClass: function( className ) {
            classNames = className.split(' ');
            for (var i = 0; i < this.nodes.length; i++) {
                for (var key in classNames) {
                    this.nodes[i].classList.add(classNames[key]);
                }
            }
            return this;
        },
        
        hasClass: function( className ) {
            hasClass = false;
            for (var i = 0; i < this.nodes.length; i++) {
                hasClass = hasClass || new RegExp(' ' + className + ' ').test(' ' + this.nodes[i].classList + ' ');
            }
            return hasClass;
        },
        
        removeClass: function( className ) {
            classNames = className.split(' ');
            for (var i = 0; i < this.nodes.length; i++) {
                for (key in classNames) {
                    this.nodes[i].classList.remove(classNames[key]);
                }
            }
            return this;
        },
        
        toggleClass: function( className ) {
            for (var i = 0; i < this.nodes.length; i++) {
                this.nodes[i].classList.toggle( className );
            }
            return this;
        },

        // Style management
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
            } else { return this.nodes[0].style[camelCase(attr)]; }
        },

        fadeIn: function( duration ) {
            duration = typeof duration == typeof undefined ? 500 : duration;
            for (var i = 0; i < this.nodes.length; i++) {
                var s = this.nodes[i].style;
                var opacity = typeof this.nodes[i].defaultStyle['opacity'] != typeof undefined ? this.nodes[i].defaultStyle['opacity'] : 1;
                
                s.opacity = 0;
                s.display = "block";
                (function unfade(){var val=parseFloat(s.opacity);if(!((val+=.01)>opacity)){s.opacity=val;setTimeout(unfade,duration/100);}})();
            }
        },

        fadeOut: function( duration ) {
            duration = typeof duration == typeof undefined ? 500 : duration;
            for (var i = 0; i < this.nodes.length; i++) {
                var s = this.nodes[i].style;
                s.opacity = s.opacity != null ? s.opacity : 1;
                (function fade(){(s.opacity-=.1)<0?s.display="none":setTimeout(fade,duration/100)})();
            }
        },

        // Interactions
        append: function( elm ) {
            for (var i = 0; i < this.nodes.length; i++) {
                for (var j = 0; j < elm.nodes.length; j++) {
                    this.nodes[i].appendChild( elm.nodes[j] );
                }
            }
            return this;
        },
        appendTo: function( elm ) {
            if (!(elm instanceof vanilla)) elm = new vanilla( elm );
            for (var i = 0; i < this.nodes.length; i++) {
                for (var j = 0; j < elm.nodes.length; j++) {
                    elm.nodes[j].appendChild( this.nodes[i] );
                }
            }
            return this;
        },
        prepend: function( elm ) {
            for (var i = 0; i < this.nodes.length; i++) {
                first = this.nodes[i].hasChildNodes() ? this.nodes[i].firstChild : null;
                for (var j = 0; j < elm.nodes.length; j++) {
                    first !== null ? this.nodes[i].insertBefore( elm.nodes[j], first ) : this.nodes[i].appendChild( elm.nodes[j] );
                }
            }
            return this;
        },
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

        clone: function() {
            elm = vanilla();
            elm.selector = this.selector;
            for (var i = 0; i < this.nodes.length; i++) { elm.nodes.push(this.nodes[i].cloneNode(true)); }
            return elm;
        },

        remove: function() {
            for (var i = 0; i < this.nodes.length; i++) { this.nodes[i].remove(); }
        },

        empty: function() {
            for (var i = 0; i < this.nodes.length; i++) {
                while (this.nodes[i].firstChild) { this.nodes[i].removeChild(this.nodes[i].firstChild); }
            }
        },

        html: function( html ) {
            if (typeof html != typeof undefined) {
                for (var i = 0; i < this.nodes.length; i++) { this.nodes[i].innerHTML = html; }
                return this;
            }
            else
                return this.nodes[0].innerHTML;
        },

        // Traversing
        prev: function() {
            sibling = this.nodes[0].previousSibling;
            while (sibling !== null && (sibling.nodeType == 8 || (sibling.nodeType == 3 && !/\S/.test(sibling.nodeValue)))) {
                sibling = sibling.previousSibling;
            }

            if (sibling !== null) {
                o = new vanilla();
                o.nodes = [sibling];
            }
            else o = sibling;
            return o;
        },

        next: function() {
            sibling = this.nodes[0].nextSibling;
            while (sibling !== null && (sibling.nodeType == 8 || (sibling.nodeType == 3 && !/\S/.test(sibling.nodeValue)))) {
                sibling = sibling.nextSibling;
            }

            if (sibling !== null) {
                o = new vanilla();
                o.nodes = [sibling];
            }
            else o = sibling;
            return o;
        },

        parent: function() {
            if (this.nodes[0].parentNode !== null) {
                o = new vanilla();
                o.nodes = [this.nodes[0].parentNode];
            }
            else o = this.nodes[0].parentNode;
            return o;
        },

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

        // Events
        ready: function( callback ) {
            document.addEventListener('DOMContentLoaded', callback, false);
        },

        on: function(event, handler, capture) {
            var nListeners = Object.keys(listeners).length
            capture = typeof capture === typeof undefined ? false : capture;
            // Add event listener
            for (var i = 0; i < this.nodes.length; i++) {
                this.nodes[i].addEventListener(event, handler, capture);
                listeners[nListeners + i] = {
                    element: this.nodes[i],
                    event: event,
                    handler: handler,
                    capture: capture
                };
            }
            return this;
        },

        off: function(event) {
            var nListeners = Object.keys(listeners).length;
            for (var i = 0; i < nListeners; i++) {
                var rm = false;
                for (var n = 0; n < this.nodes.length; n++) {
                    var l = listeners[i];
                    if (l.event = event) {
                        this.nodes[n].removeEventListener(l.event, l.handler, l.capture);
                        rm = true;
                    }
                }
                if (rm === true) delete listeners[i];
            }
            return this;
        }
    };

    var selector = function( query ) {
        var elm = null;
        if (typeof query !== 'string') {
            // If it's not a string assume it's already an element 
            elm = query;
        } else if ( isTag(query) ) {
            // check if it's a tag
            var tag = query.substring(1, query.length-1);
            elm = [document.createElement( tag )];
        } else if ( isId(query) ) {
            // check if it's an id
            var id = query.substring(1);
            elm = document.getElementById( id );
        } else {
            // run a basic query
            elm = document.querySelectorAll( query );
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

    window.vanilla = new vanilla();
    return vanilla;
    
}) (this.window, this.document);