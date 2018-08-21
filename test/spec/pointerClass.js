describe('pointerClass', function() {
  'use strict';

  var pageDone, document, PointerEvent, traceLog, utils,
    elmTarget, pointerEvent,
    startHandlerReturn,

    X1 = 1,
    Y1 = 2,
    X2 = 4,
    Y2 = 8;

  function resetData() {
    pointerEvent.cancel();
    pointerEvent.lastTouchTime = 0;
    traceLog.length = 0;
    startHandlerReturn = true;
  }

  beforeAll(function(beforeDone) {
    loadPage('spec/common.html', function(pageWindow, pageDocument, pageBody, done) {
      document = pageDocument;
      PointerEvent = pageWindow.PointerEvent;
      traceLog = PointerEvent.traceLog;
      utils = pageWindow.utils;

      elmTarget = pageDocument.getElementById('parent');

      pointerEvent = new PointerEvent();
      pointerEvent.addStartHandler(elmTarget,
        pointerEvent.regStartHandler(function(pointerXY) {
          traceLog.push('<startHandler>', utils.logPointerXY(pointerXY), '</startHandler>');
          return startHandlerReturn;
        }));

      pointerEvent.addMoveHandler(document, function(pointerXY) {
        traceLog.push('<moveHandler>', utils.logPointerXY(pointerXY), '</moveHandler>');
      });

      pointerEvent.addEndHandler(document, function(pointerXY) {
        traceLog.push('<endHandler>', utils.logPointerXY(pointerXY), '</endHandler>');
      });

      pointerEvent.addCancelHandler(document, function() {
        traceLog.push('<cancelHandler>', '</cancelHandler>');
      });

      pageDone = done;
      beforeDone();
    });
  });

  afterAll(function() {
    pageDone();
  });

  it('start(mouse) -> move(mouse)', function(done) {
    resetData();
    utils.intervalExec([
      // ====================================
      function() {
        expect(pointerEvent.curPointerClass).toBeNull();

        utils.fireMouseEvent(elmTarget, 'mousedown', {clientX: X1, clientY: Y1});
      },
      // ====================================
      function() {
        expect(pointerEvent.curPointerClass).toBe('mouse');

        utils.fireMouseEvent(document, 'mousemove', {clientX: X2, clientY: Y2});
      },
      // ====================================
      function() {
        expect(pointerEvent.curPointerClass).toBe('mouse');
        expect(traceLog).toEqual([
          '<startListener>', 'type:mousedown', 'curPointerClass:null',
          '<startHandler>', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
          'curPointerClass:mouse', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
          '</startListener>',

          '<moveListener>', 'type:mousemove', 'curPointerClass:mouse',
          '<move>',
          'lastPointerXY:(' + X2 + ',' + Y2 + ')',
          '<moveHandler>', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</moveHandler>',
          '</move>',
          '</moveListener>'
        ]);
      },
      // ====================================
      0, done
    ]);
  });

  it('start(mouse) -> move(touch)', function(done) {
    resetData();
    utils.intervalExec([
      // ====================================
      function() {
        expect(pointerEvent.curPointerClass).toBeNull();

        utils.fireMouseEvent(elmTarget, 'mousedown', {clientX: X1, clientY: Y1});
      },
      // ====================================
      function() {
        expect(pointerEvent.curPointerClass).toBe('mouse');

        utils.fireTouchEvent(document, 'touchmove', {clientX: X2, clientY: Y2});
      },
      // ====================================
      function() {
        expect(pointerEvent.curPointerClass).toBe('mouse');
        expect(traceLog).toEqual([
          '<startListener>', 'type:mousedown', 'curPointerClass:null',
          '<startHandler>', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
          'curPointerClass:mouse', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
          '</startListener>',

          '<moveListener>', 'type:touchmove', 'curPointerClass:mouse', '</moveListener>'
        ]);
      },
      // ====================================
      0, done
    ]);
  });

  it('start(mouse) -> end(mouse)', function(done) {
    resetData();
    utils.intervalExec([
      // ====================================
      function() {
        expect(pointerEvent.curPointerClass).toBeNull();

        utils.fireMouseEvent(elmTarget, 'mousedown', {clientX: X1, clientY: Y1});
      },
      // ====================================
      function() {
        expect(pointerEvent.curPointerClass).toBe('mouse');

        utils.fireMouseEvent(document, 'mouseup', {clientX: X2, clientY: Y2});
      },
      // ====================================
      function() {
        expect(pointerEvent.curPointerClass).toBeNull();
        expect(traceLog).toEqual([
          '<startListener>', 'type:mousedown', 'curPointerClass:null',
          '<startHandler>', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
          'curPointerClass:mouse', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
          '</startListener>',

          '<endListener>', 'type:mouseup', 'curPointerClass:mouse',
          '<end>',
          'lastPointerXY:(' + X2 + ',' + Y2 + ')',
          '<endHandler>', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</endHandler>',
          'curPointerClass:null',
          '</end>',
          '</endListener>'
        ]);
      },
      // ====================================
      0, done
    ]);
  });

  it('start(mouse) -> end(touch)', function(done) {
    resetData();
    utils.intervalExec([
      // ====================================
      function() {
        expect(pointerEvent.curPointerClass).toBeNull();

        utils.fireMouseEvent(elmTarget, 'mousedown', {clientX: X1, clientY: Y1});
      },
      // ====================================
      function() {
        expect(pointerEvent.curPointerClass).toBe('mouse');

        utils.fireTouchEvent(document, 'touchend', {clientX: X2, clientY: Y2});
      },
      // ====================================
      function() {
        expect(pointerEvent.curPointerClass).toBe('mouse');
        expect(traceLog).toEqual([
          '<startListener>', 'type:mousedown', 'curPointerClass:null',
          '<startHandler>', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
          'curPointerClass:mouse', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
          '</startListener>',

          '<endListener>', 'type:touchend', 'curPointerClass:mouse', '</endListener>'
        ]);
      },
      // ====================================
      0, done
    ]);
  });

  it('start(mouse) -> cancel(touch)', function(done) {
    resetData();
    utils.intervalExec([
      // ====================================
      function() {
        expect(pointerEvent.curPointerClass).toBeNull();

        utils.fireMouseEvent(elmTarget, 'mousedown', {clientX: X1, clientY: Y1});
      },
      // ====================================
      function() {
        expect(pointerEvent.curPointerClass).toBe('mouse');

        utils.fireTouchEvent(document, 'touchcancel', {clientX: X2, clientY: Y2});
      },
      // ====================================
      function() {
        expect(pointerEvent.curPointerClass).toBeNull();
        expect(traceLog).toEqual([
          '<startListener>', 'type:mousedown', 'curPointerClass:null',
          '<startHandler>', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
          'curPointerClass:mouse', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
          '</startListener>',

          '<cancelListener>', 'type:touchcancel', 'curPointerClass:mouse',
          'CHECKED:event.touches',
          '<cancel>',
          '<cancelHandler>', '</cancelHandler>',
          'curPointerClass:null',
          '</cancel>',
          '</cancelListener>'
        ]);
      },
      // ====================================
      0, done
    ]);
  });

  it('start(touch) -> move(mouse)', function(done) {
    resetData();
    utils.intervalExec([
      // ====================================
      function() {
        expect(pointerEvent.curPointerClass).toBeNull();

        utils.fireTouchEvent(elmTarget, 'touchstart', {clientX: X1, clientY: Y1});
      },
      // ====================================
      function() {
        expect(pointerEvent.curPointerClass).toBe('touch');

        utils.fireMouseEvent(document, 'mousemove', {clientX: X2, clientY: Y2});
      },
      // ====================================
      function() {
        expect(pointerEvent.curPointerClass).toBe('touch');
        expect(traceLog).toEqual([
          '<startListener>', 'type:touchstart', 'curPointerClass:null',
          '<startHandler>', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
          'curPointerClass:touch(#0)', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
          '</startListener>',

          '<moveListener>', 'type:mousemove', 'curPointerClass:touch(#0)', '</moveListener>'
        ]);
      },
      // ====================================
      0, done
    ]);
  });

  it('start(touch) -> move(touch)', function(done) {
    resetData();
    utils.intervalExec([
      // ====================================
      function() {
        expect(pointerEvent.curPointerClass).toBeNull();

        utils.fireTouchEvent(elmTarget, 'touchstart', {clientX: X1, clientY: Y1});
      },
      // ====================================
      function() {
        expect(pointerEvent.curPointerClass).toBe('touch');

        utils.fireTouchEvent(document, 'touchmove', {clientX: X2, clientY: Y2});
      },
      // ====================================
      function() {
        expect(pointerEvent.curPointerClass).toBe('touch');
        expect(traceLog).toEqual([
          '<startListener>', 'type:touchstart', 'curPointerClass:null',
          '<startHandler>', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
          'curPointerClass:touch(#0)', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
          '</startListener>',

          '<moveListener>', 'type:touchmove', 'curPointerClass:touch(#0)',
          '<move>',
          'lastPointerXY:(' + X2 + ',' + Y2 + ')',
          '<moveHandler>', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</moveHandler>',
          '</move>',
          '</moveListener>'
        ]);
      },
      // ====================================
      0, done
    ]);
  });

  it('start(touch) -> end(mouse)', function(done) {
    resetData();
    utils.intervalExec([
      // ====================================
      function() {
        expect(pointerEvent.curPointerClass).toBeNull();

        utils.fireTouchEvent(elmTarget, 'touchstart', {clientX: X1, clientY: Y1});
      },
      // ====================================
      function() {
        expect(pointerEvent.curPointerClass).toBe('touch');

        utils.fireMouseEvent(document, 'mouseup', {clientX: X2, clientY: Y2});
      },
      // ====================================
      function() {
        expect(pointerEvent.curPointerClass).toBe('touch');
        expect(traceLog).toEqual([
          '<startListener>', 'type:touchstart', 'curPointerClass:null',
          '<startHandler>', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
          'curPointerClass:touch(#0)', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
          '</startListener>',

          '<endListener>', 'type:mouseup', 'curPointerClass:touch(#0)', '</endListener>'
        ]);
      },
      // ====================================
      0, done
    ]);
  });

  it('start(touch) -> end(touch)', function(done) {
    resetData();
    utils.intervalExec([
      // ====================================
      function() {
        expect(pointerEvent.curPointerClass).toBeNull();

        utils.fireTouchEvent(elmTarget, 'touchstart', {clientX: X1, clientY: Y1});
      },
      // ====================================
      function() {
        expect(pointerEvent.curPointerClass).toBe('touch');

        utils.fireTouchEvent(document, 'touchend', {clientX: X2, clientY: Y2});
      },
      // ====================================
      function() {
        expect(pointerEvent.curPointerClass).toBeNull();
        expect(traceLog).toEqual([
          '<startListener>', 'type:touchstart', 'curPointerClass:null',
          '<startHandler>', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
          'curPointerClass:touch(#0)', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
          '</startListener>',

          '<endListener>', 'type:touchend', 'curPointerClass:touch(#0)',
          '<end>',
          'lastPointerXY:(' + X2 + ',' + Y2 + ')',
          '<endHandler>', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</endHandler>',
          'curPointerClass:null',
          '</end>',
          '</endListener>'
        ]);
      },
      // ====================================
      0, done
    ]);
  });

  it('start(touch) -> cancel(touch)', function(done) {
    resetData();
    utils.intervalExec([
      // ====================================
      function() {
        expect(pointerEvent.curPointerClass).toBeNull();

        utils.fireTouchEvent(elmTarget, 'touchstart', {clientX: X1, clientY: Y1});
      },
      // ====================================
      function() {
        expect(pointerEvent.curPointerClass).toBe('touch');

        utils.fireTouchEvent(document, 'touchcancel', {clientX: X2, clientY: Y2});
      },
      // ====================================
      function() {
        expect(pointerEvent.curPointerClass).toBeNull();
        expect(traceLog).toEqual([
          '<startListener>', 'type:touchstart', 'curPointerClass:null',
          '<startHandler>', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
          'curPointerClass:touch(#0)', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
          '</startListener>',

          '<cancelListener>', 'type:touchcancel', 'curPointerClass:touch(#0)',
          '<cancel>',
          '<cancelHandler>', '</cancelHandler>',
          'curPointerClass:null',
          '</cancel>',
          '</cancelListener>'
        ]);
      },
      // ====================================
      0, done
    ]);
  });

  it('start(CANCEL) -> move(mouse)', function(done) {
    resetData();
    utils.intervalExec([
      // ====================================
      function() {
        startHandlerReturn = false;
        expect(pointerEvent.curPointerClass).toBeNull();

        utils.fireMouseEvent(elmTarget, 'mousedown', {clientX: X1, clientY: Y1});
      },
      // ====================================
      function() {
        expect(pointerEvent.curPointerClass).toBeNull();

        utils.fireMouseEvent(document, 'mousemove', {clientX: X2, clientY: Y2});
      },
      // ====================================
      function() {
        expect(pointerEvent.curPointerClass).toBeNull();
        expect(traceLog).toEqual([
          '<startListener>', 'type:mousedown', 'curPointerClass:null',
          '<startHandler>', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
          // Cancel
          '</startListener>',

          '<moveListener>', 'type:mousemove', 'curPointerClass:null', '</moveListener>'
        ]);
      },
      // ====================================
      0, done
    ]);
  });

  it('start(CANCEL) -> move(touch)', function(done) {
    resetData();
    utils.intervalExec([
      // ====================================
      function() {
        startHandlerReturn = false;
        expect(pointerEvent.curPointerClass).toBeNull();

        utils.fireMouseEvent(elmTarget, 'mousedown', {clientX: X1, clientY: Y1});
      },
      // ====================================
      function() {
        expect(pointerEvent.curPointerClass).toBeNull();

        utils.fireTouchEvent(document, 'touchmove', {clientX: X2, clientY: Y2});
      },
      // ====================================
      function() {
        expect(pointerEvent.curPointerClass).toBeNull();
        expect(traceLog).toEqual([
          '<startListener>', 'type:mousedown', 'curPointerClass:null',
          '<startHandler>', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
          // Cancel
          '</startListener>',

          '<moveListener>', 'type:touchmove', 'curPointerClass:null', '</moveListener>'
        ]);
      },
      // ====================================
      0, done
    ]);
  });

  it('start(CANCEL) -> end(mouse)', function(done) {
    resetData();
    utils.intervalExec([
      // ====================================
      function() {
        startHandlerReturn = false;
        expect(pointerEvent.curPointerClass).toBeNull();

        utils.fireMouseEvent(elmTarget, 'mousedown', {clientX: X1, clientY: Y1});
      },
      // ====================================
      function() {
        expect(pointerEvent.curPointerClass).toBeNull();

        utils.fireMouseEvent(document, 'mouseup', {clientX: X2, clientY: Y2});
      },
      // ====================================
      function() {
        expect(pointerEvent.curPointerClass).toBeNull();
        expect(traceLog).toEqual([
          '<startListener>', 'type:mousedown', 'curPointerClass:null',
          '<startHandler>', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
          // Cancel
          '</startListener>',

          '<endListener>', 'type:mouseup', 'curPointerClass:null', '</endListener>'
        ]);
      },
      // ====================================
      0, done
    ]);
  });

  it('start(CANCEL) -> end(touch)', function(done) {
    resetData();
    utils.intervalExec([
      // ====================================
      function() {
        startHandlerReturn = false;
        expect(pointerEvent.curPointerClass).toBeNull();

        utils.fireMouseEvent(elmTarget, 'mousedown', {clientX: X1, clientY: Y1});
      },
      // ====================================
      function() {
        expect(pointerEvent.curPointerClass).toBeNull();

        utils.fireTouchEvent(document, 'touchend', {clientX: X2, clientY: Y2});
      },
      // ====================================
      function() {
        expect(pointerEvent.curPointerClass).toBeNull();
        expect(traceLog).toEqual([
          '<startListener>', 'type:mousedown', 'curPointerClass:null',
          '<startHandler>', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
          // Cancel
          '</startListener>',

          '<endListener>', 'type:touchend', 'curPointerClass:null', '</endListener>'
        ]);
      },
      // ====================================
      0, done
    ]);
  });

  it('start(CANCEL) -> cancel(touch)', function(done) {
    resetData();
    utils.intervalExec([
      // ====================================
      function() {
        startHandlerReturn = false;
        expect(pointerEvent.curPointerClass).toBeNull();

        utils.fireMouseEvent(elmTarget, 'mousedown', {clientX: X1, clientY: Y1});
      },
      // ====================================
      function() {
        expect(pointerEvent.curPointerClass).toBeNull();

        utils.fireTouchEvent(document, 'touchcancel', {clientX: X2, clientY: Y2});
      },
      // ====================================
      function() {
        expect(pointerEvent.curPointerClass).toBeNull();
        expect(traceLog).toEqual([
          '<startListener>', 'type:mousedown', 'curPointerClass:null',
          '<startHandler>', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
          // Cancel
          '</startListener>',

          '<cancelListener>', 'type:touchcancel', 'curPointerClass:null', '</cancelListener>'
        ]);
      },
      // ====================================
      0, done
    ]);
  });

  it('start(mouse) -> end(mouse) -> move(mouse)', function(done) {
    resetData();
    utils.intervalExec([
      // ====================================
      function() {
        expect(pointerEvent.curPointerClass).toBeNull();

        utils.fireMouseEvent(elmTarget, 'mousedown', {clientX: X1, clientY: Y1});
      },
      // ====================================
      function() {
        expect(pointerEvent.curPointerClass).toBe('mouse');

        utils.fireMouseEvent(document, 'mouseup', {clientX: X1, clientY: Y1});
      },
      // ====================================
      function() {
        expect(pointerEvent.curPointerClass).toBeNull();

        utils.fireMouseEvent(document, 'mousemove', {clientX: X2, clientY: Y2});
      },
      // ====================================
      function() {
        expect(pointerEvent.curPointerClass).toBeNull();
        expect(traceLog).toEqual([
          '<startListener>', 'type:mousedown', 'curPointerClass:null',
          '<startHandler>', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
          'curPointerClass:mouse', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
          '</startListener>',

          '<endListener>', 'type:mouseup', 'curPointerClass:mouse',
          '<end>',
          'lastPointerXY:(' + X1 + ',' + Y1 + ')',
          '<endHandler>', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</endHandler>',
          'curPointerClass:null',
          '</end>',
          '</endListener>',

          '<moveListener>', 'type:mousemove', 'curPointerClass:null', '</moveListener>'
        ]);
      },
      // ====================================
      0, done
    ]);
  });

  it('start(mouse) -> cancel(touch) -> move(mouse)', function(done) {
    resetData();
    utils.intervalExec([
      // ====================================
      function() {
        expect(pointerEvent.curPointerClass).toBeNull();

        utils.fireMouseEvent(elmTarget, 'mousedown', {clientX: X1, clientY: Y1});
      },
      // ====================================
      function() {
        expect(pointerEvent.curPointerClass).toBe('mouse');

        utils.fireTouchEvent(document, 'touchcancel', {clientX: X1, clientY: Y1});
      },
      // ====================================
      function() {
        expect(pointerEvent.curPointerClass).toBeNull();

        utils.fireMouseEvent(document, 'mousemove', {clientX: X2, clientY: Y2});
      },
      // ====================================
      function() {
        expect(pointerEvent.curPointerClass).toBeNull();
        expect(traceLog).toEqual([
          '<startListener>', 'type:mousedown', 'curPointerClass:null',
          '<startHandler>', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
          'curPointerClass:mouse', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
          '</startListener>',

          '<cancelListener>', 'type:touchcancel', 'curPointerClass:mouse',
          'CHECKED:event.touches',
          '<cancel>',
          '<cancelHandler>', '</cancelHandler>',
          'curPointerClass:null',
          '</cancel>',
          '</cancelListener>',

          '<moveListener>', 'type:mousemove', 'curPointerClass:null', '</moveListener>'
        ]);
      },
      // ====================================
      0, done
    ]);
  });

  it('start(mouse) -> CALL end() -> move(mouse)', function(done) {
    resetData();
    utils.intervalExec([
      // ====================================
      function() {
        expect(pointerEvent.curPointerClass).toBeNull();

        utils.fireMouseEvent(elmTarget, 'mousedown', {clientX: X1, clientY: Y1});
      },
      // ====================================
      function() {
        expect(pointerEvent.curPointerClass).toBe('mouse');

        pointerEvent.end();
      },
      // ====================================
      function() {
        expect(pointerEvent.curPointerClass).toBeNull();

        utils.fireMouseEvent(document, 'mousemove', {clientX: X2, clientY: Y2});
      },
      // ====================================
      function() {
        expect(pointerEvent.curPointerClass).toBeNull();
        expect(traceLog).toEqual([
          '<startListener>', 'type:mousedown', 'curPointerClass:null',
          '<startHandler>', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
          'curPointerClass:mouse', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
          '</startListener>',

          '<end>', 'NO-pointerXY',
          '<endHandler>', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</endHandler>',
          'curPointerClass:null',
          '</end>',

          '<moveListener>', 'type:mousemove', 'curPointerClass:null', '</moveListener>'
        ]);
      },
      // ====================================
      0, done
    ]);
  });

  it('start(mouse) -> CALL cancel() -> move(mouse)', function(done) {
    resetData();
    utils.intervalExec([
      // ====================================
      function() {
        expect(pointerEvent.curPointerClass).toBeNull();

        utils.fireMouseEvent(elmTarget, 'mousedown', {clientX: X1, clientY: Y1});
      },
      // ====================================
      function() {
        expect(pointerEvent.curPointerClass).toBe('mouse');

        pointerEvent.cancel();
      },
      // ====================================
      function() {
        expect(pointerEvent.curPointerClass).toBeNull();

        utils.fireMouseEvent(document, 'mousemove', {clientX: X2, clientY: Y2});
      },
      // ====================================
      function() {
        expect(pointerEvent.curPointerClass).toBeNull();
        expect(traceLog).toEqual([
          '<startListener>', 'type:mousedown', 'curPointerClass:null',
          '<startHandler>', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
          'curPointerClass:mouse', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
          '</startListener>',

          '<cancel>',
          '<cancelHandler>', '</cancelHandler>',
          'curPointerClass:null',
          '</cancel>',

          '<moveListener>', 'type:mousemove', 'curPointerClass:null', '</moveListener>'
        ]);
      },
      // ====================================
      0, done
    ]);
  });

  it('start(mouse) -> start(mouse)', function(done) {
    resetData();
    utils.intervalExec([
      // ====================================
      function() {
        expect(pointerEvent.curPointerClass).toBeNull();

        utils.fireMouseEvent(elmTarget, 'mousedown', {clientX: X1, clientY: Y1});
      },
      // ====================================
      function() {
        expect(pointerEvent.curPointerClass).toBe('mouse');

        utils.fireMouseEvent(elmTarget, 'mousedown', {clientX: X2, clientY: Y2});
      },
      // ====================================
      function() {
        expect(pointerEvent.curPointerClass).toBe('mouse');
        expect(traceLog).toEqual([
          '<startListener>', 'type:mousedown', 'curPointerClass:null',
          '<startHandler>', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
          'curPointerClass:mouse', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
          '</startListener>',

          '<startListener>', 'type:mousedown', 'curPointerClass:mouse',
          // Cancel current
          '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
          '<startHandler>', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</startHandler>',
          'curPointerClass:mouse', 'lastPointerXY:(' + X2 + ',' + Y2 + ')',
          '</startListener>'
        ]);
      },
      // ====================================
      0, done
    ]);
  });

  it('start(mouse) -> start(touch)', function(done) {
    resetData();
    utils.intervalExec([
      // ====================================
      function() {
        expect(pointerEvent.curPointerClass).toBeNull();

        utils.fireMouseEvent(elmTarget, 'mousedown', {clientX: X1, clientY: Y1});
      },
      // ====================================
      function() {
        expect(pointerEvent.curPointerClass).toBe('mouse');

        utils.fireTouchEvent(elmTarget, 'touchstart', {clientX: X2, clientY: Y2});
      },
      // ====================================
      function() {
        expect(pointerEvent.curPointerClass).toBe('touch');
        expect(traceLog).toEqual([
          '<startListener>', 'type:mousedown', 'curPointerClass:null',
          '<startHandler>', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
          'curPointerClass:mouse', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
          '</startListener>',

          '<startListener>', 'type:touchstart', 'curPointerClass:mouse',
          // Cancel current
          '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
          '<startHandler>', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</startHandler>',
          'curPointerClass:touch(#0)', 'lastPointerXY:(' + X2 + ',' + Y2 + ')',
          '</startListener>'
        ]);
      },
      // ====================================
      0, done
    ]);
  });

  it('start(touch) -> start(mouse)', function(done) {
    resetData();
    utils.intervalExec([
      // ====================================
      function() {
        expect(pointerEvent.curPointerClass).toBeNull();

        utils.fireTouchEvent(elmTarget, 'touchstart', {clientX: X1, clientY: Y1});
      },
      // ====================================
      PointerEvent.MOUSE_EMU_INTERVAL + 100, // To avoid mouse events emulation
      function() {
        expect(pointerEvent.curPointerClass).toBe('touch');

        utils.fireMouseEvent(elmTarget, 'mousedown', {clientX: X2, clientY: Y2});
      },
      // ====================================
      function() {
        expect(pointerEvent.curPointerClass).toBe('mouse');
        expect(traceLog).toEqual([
          '<startListener>', 'type:touchstart', 'curPointerClass:null',
          '<startHandler>', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
          'curPointerClass:touch(#0)', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
          '</startListener>',

          '<startListener>', 'type:mousedown', 'curPointerClass:touch(#0)',
          // Cancel current
          '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
          '<startHandler>', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</startHandler>',
          'curPointerClass:mouse', 'lastPointerXY:(' + X2 + ',' + Y2 + ')',
          '</startListener>'
        ]);
      },
      // ====================================
      0, done
    ]);
  });

  it('start(touch) -> start(touch)', function(done) {
    resetData();
    utils.intervalExec([
      // ====================================
      function() {
        expect(pointerEvent.curPointerClass).toBeNull();

        utils.fireTouchEvent(elmTarget, 'touchstart', {clientX: X1, clientY: Y1});
      },
      // ====================================
      function() {
        expect(pointerEvent.curPointerClass).toBe('touch');

        utils.fireTouchEvent(elmTarget, 'touchstart', {clientX: X2, clientY: Y2});
      },
      // ====================================
      function() {
        expect(pointerEvent.curPointerClass).toBe('touch');
        expect(traceLog).toEqual([
          '<startListener>', 'type:touchstart', 'curPointerClass:null',
          '<startHandler>', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
          'curPointerClass:touch(#0)', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
          '</startListener>',

          '<startListener>', 'type:touchstart', 'curPointerClass:touch(#0)',
          // Cancel current
          '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
          '<startHandler>', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</startHandler>',
          'curPointerClass:touch(#0)', 'lastPointerXY:(' + X2 + ',' + Y2 + ')',
          '</startListener>'
        ]);
      },
      // ====================================
      0, done
    ]);
  });

});
