# Vanilla framework

Vanilla framework is a light library for DOM manipulation using Vanilla-JS

## Installation

Include `vanilla.min.js` script :
```html
<script src="vanilla.min.js" type="text/javascript" charset="utf-8" />
```

## Usage

The framework use the `vanilla` namespace.<br />
Examples below can be found in the [example page](./example/vanilla.html).

### Create node and add content

```html
<div class="example"></div>
```

```js
vanilla('<a>').attr('href', 'image1.jpg')
    .append( vanilla('<img>').attr('src', 'thumbs/image1.jpg') )
    .appendTo('.example:first-of-type');
```

### Adding overlay on item click

```js
// Define overlay
overlay = vanilla('<div>')
    .css('background', '#000')
    .css('bottom', 0)
    .css('display', 'none')
    .css('height', '100%')
    .css('left', 0)
    .css('opacity', 0.75)
    .css('position', 'fixed')
    .css('right', 0)
    .css('top', 0)
    .css('width', '100%')
    .css('z-index', 1)
    .prependTo('body')
    .on('click', function() {
        overlay.fadeOut();
    });

// Add event handler
vanilla('.example > a').on('click', function(event){
    event.preventDefault();
    overlay.fadeIn();
});
```

## Available methods

These are the currently supported methods:
* attr
* addClass
* hasClass
* removeClass
* toggleClass
* css
* fadeIn
* fadeOut
* append
* appendTo
* prepend
* prependTo
* remove
* empty
* html
* prev
* next
* parent
* each
* ready
* on
* off

# License (MIT)

jQuery Modal is distributed under the [MIT License](Learn more at http://opensource.org/licenses/mit-license.php):

    Copyright (c) 2015 Anthony PERIQUET

    Permission is hereby granted, free of charge, to any person obtaining
    a copy of this software and associated documentation files (the
    "Software"), to deal in the Software without restriction, including
    without limitation the rights to use, copy, modify, merge, publish,
    distribute, sublicense, and/or sell copies of the Software, and to
    permit persons to whom the Software is furnished to do so, subject to
    the following conditions:

    The above copyright notice and this permission notice shall be
    included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
    NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
    LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
    OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
    WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.