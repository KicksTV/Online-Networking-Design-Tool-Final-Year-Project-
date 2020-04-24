//

(function() {

  // list of guis
  var guis = [];

  // default slider params
  var sliderMin = 0;
  var sliderMax = 100;
  var sliderStep = 1;

  // default gui provider
  var guiProvider = 'QuickSettings';

  const defaultLabel = 'p5.gui';

  // Create a GUI using QuickSettings (or DAT.GUI or ...)
  // You only need to pass a reference to the sketch in instance mode

  // Usually you will call createGui(this, 'label');
  p5.prototype.createGui = function(sketch, label, provider) {

    // createGui(label) signature
    if ((typeof sketch) === 'string') {
      return this.createGui(label, sketch, provider);
    }

    // normally the sketch will just be embedded below the body
    let parent = document.body;

    if(sketch === undefined) {
      // p5js global mode
      sketch = window;
      label = label || document.title || defaultLabel;
    } else {
      // p5js instance mode
      parent = sketch.canvas.parentElement;
      label = label || parent.id || defaultLabel;
    }

    if(!('color' in sketch)) {
      console.error(`${parent.id}: You need to pass the p5 sketch to createGui in instance mode!`);
    }

    // default gui provider
    provider = provider || guiProvider;

    var gui;

    // create a gui using the provider
    if(provider === 'QuickSettings') {
      if(QuickSettings) {
        console.log('Creating p5.gui powered by QuickSettings.');
        gui = new QSGui(label, parent, sketch);
      } else {
        console.log('QuickSettings not found. Is the script included in your HTML?');
        gui = new DummyGui(label, parent, sketch);
      }
    } else {
      console.log('Unknown GUI provider ' + provider);
      gui = new DummyGui(label, parent, sketch);
    }



    // Add listener for when guis are dragged over each other.
    print(gui);
    // gui.prototype._controls.forEach(c => {
    //   // c.addEventListener("change", applyGUIValuesToComp);
    // });

    gui.prototype._titleBar.addEventListener("mousedown", () => {
      print("panel clicked");
      if (gui.prototype._draggable) {
        document.addEventListener("mousemove", checkPanelCombine);
        document.addEventListener("mouseup", endDrag);
      }
    });

    // add it to the list of guis
    guis.push(gui);

    // return it
    return gui;

  };


  p5.prototype.removeGui = function(gui) {
    // TODO: implement this
  };

  // update defaults used for creation of sliders
  p5.prototype.sliderRange = function(vmin, vmax, vstep) {
    sliderMin = vmin;
    sliderMax = vmax;
    sliderStep = vstep;
  };

  // extend default behaviour of noLoop()
  p5.prototype.noLoop = function() {
    this._loop = false;
    for(var i = 0; i < guis.length; i++) {
      guis[i].noLoop();
    }
  };

  // extend default behaviour of loop()
  p5.prototype.loop = function() {
    for(var i = 0; i < guis.length; i++) {
      guis[i].loop();
    }
    this._loop = true;
    this._draw();
  };


  // interface for quicksettings
  function QSGui(label, parent, sketch) {

    // hard code the position, it can be changed later
    let x = 200;
    let y = 200;

    var guiParams;

    var qs = QuickSettings.create(x, y, label, parent);

    // proxy all functions of quicksettings
    this.prototype = qs;

    // addGlobals(global1, global2, ...) to add the selected globals
    this.addGlobals = function() {
      qs.bindGlobals(arguments);
    };

    // addObject(object) to add all params of the object
    // addObject(object, param1, param2, ...) to add selected params
    this.addObject = function() {
      // get object
      object = arguments[0];

      // convert arguments object to array
      var params = [];
      if(arguments.length > 1) {
        params = Array.prototype.slice.call(arguments)
        params = params.slice(1);
      }
      // if no arguments are provided take all keys of the object
      if(params.length === 0) {
        // won't work in Internet Explorer < 9 (use a polyfill)
        params = Object.keys(object);
      }

      guiParams = params;

      qs.bindParams(object, params);
    };

    this.getGuiParams = function () {
      return guiParams;
    },
    this.setGuiParams = function (g) {
      guiParams = g;
    },


    // noLoop() to call draw every time the gui changes when we are not looping
    this.noLoop = function() {
      qs.setGlobalChangeHandler(sketch._draw);
    };

    this.loop = function() {
      qs.setGlobalChangeHandler(null);
    };

    this.setTitle = function(title) { qs.setTitle(title); };
    this.getTitle = function() { return qs.getTitle(); };

    this.lock = function(lock) { 
      qs.setDraggable(!lock); 
      return this;
    };
    this.setPositionLeft = function(value) { 
      qs.setPositionLeft(value);
      return this;
    };
    this.setPositionRight = function(value) { 
      qs.setPositionRight(value);
      return this;
    };
    this.setPositionTop = function(value) { 
      qs.setPositionTop(value); 
      return this;
    };
    this.setPositionBottom = function(value) { 
      qs.setPositionBottom(value);
      return this; 
    };
    this.disablePin = function(value) { 
      qs.disablePin(value); 
      return this;
    };

    // pass through ...
    this.show = function() { 
      qs.show(); 
      return this;
    };
    this.hide = function() { 
      qs.hide(); 
      return this;
    };
    this.toggleVisibility = function() { qs.toggleVisibility(); };
    this.setValue = function(title, value) { qs.setValue(title, value); };
    this.setPosition  = function(x, y) {
      qs.setPosition(x, y);
      return this;
    };
    this.getPosition = function() { return qs.getPosition(); };
    this.getHeight = function () { return qs.getHeight(); };
    this.getWidth = function () { return qs.getWidth(); };


    // Extend Quicksettings
    // so it can magically create a GUI for parameters passed by name
    qs.bindParams = function(object, params) {

      // iterate over all the arguments
      for(var i = 0; i < params.length; i++) {

        var arg = params[i];
        var val = object[arg];
        var typ = typeof val;

        //console.log(typ, arg, val);

        // don't need to show the sliders for range min, max and step of a property
        var sliderConfigRegEx = /^(.*min|.*max|.*step)$/i;
        if( sliderConfigRegEx.test(arg)){
          continue;
        }
        switch(typ) {

          case 'object':


            // color triple ?
            if(val instanceof Array && val.length === 3 && typeof val[0] === 'number') {
              // create color according to the current color mode of the current sketch
              var c = sketch.color(val[0], val[1], val[2]);
              // get decimal RGB values
              var c2 = c.levels.slice(0,3);
              // create HTML color code
              var vcolor = '#' + c2.map(function(value) {
                return ('0' + value.toString(16)).slice(-2);
              }).join('');
              this.bindColor(arg, vcolor, object);
            }
            else if (arg === "Connections") {
              //console.log("is connection", object);
              this.bindConnections(arg, val, object);
            }
            else {
              // multiple choice drop down list
              this.bindDropDown(arg, val, object);
              object[arg] = val[0];
            }
            break;

          case 'number':

            // values as defined by magic variables or gui.sliderRange()
            var vmin = object[arg + 'Min'] || object[arg + 'min'] || sliderMin;
            var vmax = object[arg + 'Max'] || object[arg + 'max'] || sliderMax;
            var vstep = object[arg + 'Step'] || object[arg + 'step'] || sliderStep;

            // the actual values can still overrule the limits set by magic
            var vmin = Math.min(val, vmin);
            var vmax = Math.max(val, vmax);

            // set the range
            this.bindRange(arg, vmin, vmax, val, vstep, object);

            break;

          case 'string':

            var HEX6 = /^#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i;
            if(HEX6.test(val)) {
              // HTML color value (such as #ff0000)
              this.bindColor(arg, val, object);
            } else {
              // String value
              this.bindText(arg, val, object);
            }
            break;

          case 'boolean':

            this.bindBoolean(arg, object[arg], object);
            break;

        }
      }
    };

    // bind params that are defined globally
    qs.bindGlobals = function(params) {
      this.bindParams(window, params);
    };

  }

  // Just a Dummy object that provides the GUI interface
  function DummyGui() {
    var f = function() {};
    this.addGlobals = f;
    this.noLoop = f;
    this.addObject = f;
    this.show = f;
  }


  function checkPanelCombine(e) {
    let sourceGUI;  
    print("panel dragged");

    // Retrieving GUI being dragged
    guis.forEach((g) => {
      if (g.prototype._panel == e.path[1]) {
        sourceGUI = g;
      }
    });

    guis.forEach((g) => {
      if (sourceGUI && sourceGUI != g) {
        let sourceXY = sourceGUI.getPosition();
        let targetXY = g.getPosition();
        let targetHeight = g.getHeight();
        let targetWidth = g.getWidth();

        print("-------");
        print("sourceXY: " + sourceXY, "targetXY: " + targetXY, "height: " + targetHeight, "width: " + targetWidth);


        if (sourceXY[0] > targetXY[0] && 
            sourceXY[1] > targetXY[1] && 
            sourceXY[0] < (targetXY[0] + targetWidth) &&
            sourceXY[1] < (targetXY[1] + targetHeight)) {

              print("Combine Panels");
        }
      }
    });

  }
  function endDrag(e) {
    document.removeEventListener("mousemove", checkPanelCombine);
    document.removeEventListener("mouseup", endDrag);
    e.preventDefault();
  }


})();
