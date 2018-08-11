describe('stopPropagation', function() {
  'use strict';

  var pageDone, PointerEvent, traceLog, utils,
    elmChild, elmParent, pointerEvent,
    nestStartHandler, nestMoveHandler, nestEndHandler, nestCancelHandler,

    X1 = 1,
    Y1 = 2,
    X2 = 4,
    Y2 = 8;

  function resetData() {
    pointerEvent.cancel();
    traceLog.length = 0;
  }

  function parentListener(event) { traceLog.push('<parent:' + event.type + '/>'); }

  beforeAll(function(beforeDone) {
    loadPage('spec/common.html', function(pageWindow, pageDocument, pageBody, done) {
      PointerEvent = pageWindow.PointerEvent;
      traceLog = PointerEvent.traceLog;
      utils = pageWindow.utils;

      elmChild = pageDocument.getElementById('child');

      pointerEvent = new PointerEvent();
      pointerEvent.addStartHandler(elmChild,
        pointerEvent.regStartHandler(function() {
          if (nestStartHandler) { nestStartHandler(this); } // eslint-disable-line no-invalid-this
          return true;
        }));
      pointerEvent.addMoveHandler(elmChild, function() {
        if (nestMoveHandler) { nestMoveHandler(this); } // eslint-disable-line no-invalid-this
      });
      pointerEvent.addEndHandler(elmChild, function() {
        if (nestEndHandler) { nestEndHandler(this); } // eslint-disable-line no-invalid-this
      });
      pointerEvent.addCancelHandler(elmChild, function() {
        if (nestCancelHandler) { nestCancelHandler(this); } // eslint-disable-line no-invalid-this
      });

      elmParent = pageDocument.getElementById('parent');
      ['mousedown', 'mousemove', 'mouseup'].forEach(function(type) {
        elmParent.addEventListener(type, parentListener, false);
      });

      pageDone = done;
      beforeDone();
    });
  });

  afterAll(function() {
    pageDone();
  });

  it('start(stopPropagation:OFF)', function(done) {
    resetData();
    utils.intervalExec([
      // ====================================
      function() {
        pointerEvent.options.stopPropagation = false;
        utils.fireMouseEvent(elmChild, 'mousedown', {clientX: X1, clientY: Y1, bubbles: true});
      },
      // ====================================
      function() {
        expect(traceLog).toEqual([
          '<startListener>', 'type:mousedown', 'curPointerClass:null',
          'curPointerClass:mouse', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
          '</startListener>',

          '<parent:mousedown/>'
        ]);
      },
      // ====================================
      done
    ]);
  });

  it('move(stopPropagation:OFF)', function(done) {
    resetData();
    utils.intervalExec([
      // ====================================
      function() {
        pointerEvent.options.stopPropagation = false;
        utils.fireMouseEvent(elmChild, 'mousedown', {clientX: X1, clientY: Y1, bubbles: true});
      },
      // ====================================
      function() {
        utils.fireMouseEvent(elmChild, 'mousemove', {clientX: X2, clientY: Y2, bubbles: true});
      },
      // ====================================
      function() {
        expect(traceLog).toEqual([
          '<startListener>', 'type:mousedown', 'curPointerClass:null',
          'curPointerClass:mouse', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
          '</startListener>',

          '<parent:mousedown/>',

          '<moveListener>', 'type:mousemove', 'curPointerClass:mouse',
          '<move>',
          'lastPointerXY:(' + X2 + ',' + Y2 + ')',
          '</move>',
          '</moveListener>',

          '<parent:mousemove/>'
        ]);
      },
      // ====================================
      done
    ]);
  });

  it('end(stopPropagation:OFF)', function(done) {
    resetData();
    utils.intervalExec([
      // ====================================
      function() {
        pointerEvent.options.stopPropagation = false;
        utils.fireMouseEvent(elmChild, 'mousedown', {clientX: X1, clientY: Y1, bubbles: true});
      },
      // ====================================
      function() {
        utils.fireMouseEvent(elmChild, 'mouseup', {clientX: X2, clientY: Y2, bubbles: true});
      },
      // ====================================
      function() {
        expect(traceLog).toEqual([
          '<startListener>', 'type:mousedown', 'curPointerClass:null',
          'curPointerClass:mouse', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
          '</startListener>',

          '<parent:mousedown/>',

          '<endListener>', 'type:mouseup', 'curPointerClass:mouse',
          '<end>',
          'lastPointerXY:(' + X2 + ',' + Y2 + ')',
          'curPointerClass:null',
          '</end>',
          '</endListener>',

          '<parent:mouseup/>'
        ]);
      },
      // ====================================
      done
    ]);
  });

  it('start(stopPropagation:ON)', function(done) {
    resetData();
    utils.intervalExec([
      // ====================================
      function() {
        pointerEvent.options.stopPropagation = true;
        utils.fireMouseEvent(elmChild, 'mousedown', {clientX: X1, clientY: Y1, bubbles: true});
      },
      // ====================================
      function() {
        expect(traceLog).toEqual([
          '<startListener>', 'type:mousedown', 'curPointerClass:null',
          'curPointerClass:mouse', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
          '</startListener>'
        ]);
      },
      // ====================================
      done
    ]);
  });

  it('move(stopPropagation:ON)', function(done) {
    resetData();
    utils.intervalExec([
      // ====================================
      function() {
        pointerEvent.options.stopPropagation = true;
        utils.fireMouseEvent(elmChild, 'mousedown', {clientX: X1, clientY: Y1, bubbles: true});
      },
      // ====================================
      function() {
        utils.fireMouseEvent(elmChild, 'mousemove', {clientX: X2, clientY: Y2, bubbles: true});
      },
      // ====================================
      function() {
        expect(traceLog).toEqual([
          '<startListener>', 'type:mousedown', 'curPointerClass:null',
          'curPointerClass:mouse', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
          '</startListener>',

          '<moveListener>', 'type:mousemove', 'curPointerClass:mouse',
          '<move>',
          'lastPointerXY:(' + X2 + ',' + Y2 + ')',
          '</move>',
          '</moveListener>'
        ]);
      },
      // ====================================
      done
    ]);
  });

  it('end(stopPropagation:ON)', function(done) {
    resetData();
    utils.intervalExec([
      // ====================================
      function() {
        pointerEvent.options.stopPropagation = true;
        utils.fireMouseEvent(elmChild, 'mousedown', {clientX: X1, clientY: Y1, bubbles: true});
      },
      // ====================================
      function() {
        utils.fireMouseEvent(elmChild, 'mouseup', {clientX: X2, clientY: Y2, bubbles: true});
      },
      // ====================================
      function() {
        expect(traceLog).toEqual([
          '<startListener>', 'type:mousedown', 'curPointerClass:null',
          'curPointerClass:mouse', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
          '</startListener>',

          '<endListener>', 'type:mouseup', 'curPointerClass:mouse',
          '<end>',
          'lastPointerXY:(' + X2 + ',' + Y2 + ')',
          'curPointerClass:null',
          '</end>',
          '</endListener>'
        ]);
      },
      // ====================================
      done
    ]);
  });

  it('start(stopPropagation:OFF -> ON in handler)', function(done) {
    nestStartHandler = function(that) {
      expect(that).toBe(pointerEvent);
      traceLog.push('CHANGE:options.stopPropagation');
      that.options.stopPropagation = true;
    };

    resetData();
    utils.intervalExec([
      // ====================================
      function() {
        pointerEvent.options.stopPropagation = false;
        utils.fireMouseEvent(elmChild, 'mousedown', {clientX: X1, clientY: Y1, bubbles: true});
      },
      // ====================================
      function() {
        expect(traceLog).toEqual([
          '<startListener>', 'type:mousedown', 'curPointerClass:null',

          'CHANGE:options.stopPropagation',

          'curPointerClass:mouse', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
          '</startListener>'
        ]);

        nestStartHandler = null;
      },
      // ====================================
      done
    ]);
  });

  it('move(stopPropagation:OFF -> ON in handler)', function(done) {
    nestMoveHandler = function(that) {
      expect(that).toBe(pointerEvent);
      traceLog.push('CHANGE:options.stopPropagation');
      that.options.stopPropagation = true;
    };

    resetData();
    utils.intervalExec([
      // ====================================
      function() {
        pointerEvent.options.stopPropagation = false;
        utils.fireMouseEvent(elmChild, 'mousedown', {clientX: X1, clientY: Y1, bubbles: true});
      },
      // ====================================
      function() {
        utils.fireMouseEvent(elmChild, 'mousemove', {clientX: X2, clientY: Y2, bubbles: true});
      },
      // ====================================
      function() {
        expect(traceLog).toEqual([
          '<startListener>', 'type:mousedown', 'curPointerClass:null',
          'curPointerClass:mouse', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
          '</startListener>',

          '<parent:mousedown/>',

          '<moveListener>', 'type:mousemove', 'curPointerClass:mouse',
          '<move>',
          'lastPointerXY:(' + X2 + ',' + Y2 + ')',

          'CHANGE:options.stopPropagation',

          '</move>',
          '</moveListener>'
        ]);

        nestMoveHandler = null;
      },
      // ====================================
      done
    ]);
  });

  it('end(stopPropagation:OFF -> ON in handler)', function(done) {
    nestEndHandler = function(that) {
      expect(that).toBe(pointerEvent);
      traceLog.push('CHANGE:options.stopPropagation');
      that.options.stopPropagation = true;
    };

    resetData();
    utils.intervalExec([
      // ====================================
      function() {
        pointerEvent.options.stopPropagation = false;
        utils.fireMouseEvent(elmChild, 'mousedown', {clientX: X1, clientY: Y1, bubbles: true});
      },
      // ====================================
      function() {
        utils.fireMouseEvent(elmChild, 'mouseup', {clientX: X2, clientY: Y2, bubbles: true});
      },
      // ====================================
      function() {
        expect(traceLog).toEqual([
          '<startListener>', 'type:mousedown', 'curPointerClass:null',
          'curPointerClass:mouse', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
          '</startListener>',

          '<parent:mousedown/>',

          '<endListener>', 'type:mouseup', 'curPointerClass:mouse',
          '<end>',
          'lastPointerXY:(' + X2 + ',' + Y2 + ')',

          'CHANGE:options.stopPropagation',

          'curPointerClass:null',
          '</end>',
          '</endListener>'
        ]);

        nestEndHandler = null;
      },
      // ====================================
      done
    ]);
  });

  it('start(stopPropagation:ON -> OFF in handler)', function(done) {
    nestStartHandler = function(that) {
      expect(that).toBe(pointerEvent);
      traceLog.push('CHANGE:options.stopPropagation');
      that.options.stopPropagation = false;
    };

    resetData();
    utils.intervalExec([
      // ====================================
      function() {
        pointerEvent.options.stopPropagation = true;
        utils.fireMouseEvent(elmChild, 'mousedown', {clientX: X1, clientY: Y1, bubbles: true});
      },
      // ====================================
      function() {
        expect(traceLog).toEqual([
          '<startListener>', 'type:mousedown', 'curPointerClass:null',

          'CHANGE:options.stopPropagation',

          'curPointerClass:mouse', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
          '</startListener>',

          '<parent:mousedown/>'
        ]);

        nestStartHandler = null;
      },
      // ====================================
      done
    ]);
  });

  it('move(stopPropagation:ON -> OFF in handler)', function(done) {
    nestMoveHandler = function(that) {
      expect(that).toBe(pointerEvent);
      traceLog.push('CHANGE:options.stopPropagation');
      that.options.stopPropagation = false;
    };

    resetData();
    utils.intervalExec([
      // ====================================
      function() {
        pointerEvent.options.stopPropagation = true;
        utils.fireMouseEvent(elmChild, 'mousedown', {clientX: X1, clientY: Y1, bubbles: true});
      },
      // ====================================
      function() {
        utils.fireMouseEvent(elmChild, 'mousemove', {clientX: X2, clientY: Y2, bubbles: true});
      },
      // ====================================
      function() {
        expect(traceLog).toEqual([
          '<startListener>', 'type:mousedown', 'curPointerClass:null',
          'curPointerClass:mouse', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
          '</startListener>',

          '<moveListener>', 'type:mousemove', 'curPointerClass:mouse',
          '<move>',
          'lastPointerXY:(' + X2 + ',' + Y2 + ')',

          'CHANGE:options.stopPropagation',

          '</move>',
          '</moveListener>',

          '<parent:mousemove/>'
        ]);

        nestMoveHandler = null;
      },
      // ====================================
      done
    ]);
  });

  it('end(stopPropagation:ON -> OFF in handler)', function(done) {
    nestEndHandler = function(that) {
      expect(that).toBe(pointerEvent);
      traceLog.push('CHANGE:options.stopPropagation');
      that.options.stopPropagation = false;
    };

    resetData();
    utils.intervalExec([
      // ====================================
      function() {
        pointerEvent.options.stopPropagation = true;
        utils.fireMouseEvent(elmChild, 'mousedown', {clientX: X1, clientY: Y1, bubbles: true});
      },
      // ====================================
      function() {
        utils.fireMouseEvent(elmChild, 'mouseup', {clientX: X2, clientY: Y2, bubbles: true});
      },
      // ====================================
      function() {
        expect(traceLog).toEqual([
          '<startListener>', 'type:mousedown', 'curPointerClass:null',
          'curPointerClass:mouse', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
          '</startListener>',

          '<endListener>', 'type:mouseup', 'curPointerClass:mouse',
          '<end>',
          'lastPointerXY:(' + X2 + ',' + Y2 + ')',

          'CHANGE:options.stopPropagation',

          'curPointerClass:null',
          '</end>',
          '</endListener>',

          '<parent:mouseup/>'
        ]);

        nestEndHandler = null;
      },
      // ====================================
      done
    ]);
  });

  it('`this` in cancel()', function(done) {
    nestCancelHandler = function(that) {
      expect(that).toBe(pointerEvent);
      traceLog.push('nestCancelHandler');
    };

    resetData();
    utils.intervalExec([
      // ====================================
      function() {
        pointerEvent.options.stopPropagation = false;
        utils.fireMouseEvent(elmChild, 'mousedown', {clientX: X1, clientY: Y1, bubbles: true});
      },
      // ====================================
      function() {
        pointerEvent.cancel();
      },
      // ====================================
      function() {
        expect(traceLog).toEqual([
          '<startListener>', 'type:mousedown', 'curPointerClass:null',
          'curPointerClass:mouse', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
          '</startListener>',

          '<parent:mousedown/>',

          '<cancel>',

          'nestCancelHandler',

          'curPointerClass:null',
          '</cancel>'
        ]);

        nestCancelHandler = null;
      },
      // ====================================
      done
    ]);
  });

});
