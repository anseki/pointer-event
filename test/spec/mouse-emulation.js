describe('mouse-emulation', function() {
  'use strict';

  var pageDone, document, PointerEvent, traceLog, utils,
    elmTarget, pointerEvent,

    X1 = 1,
    Y1 = 2,
    X1a = 16,
    Y1a = 32,
    X2 = 4,
    Y2 = 8;

  function resetData() {
    pointerEvent.cancel();
    pointerEvent.lastTouchTime = 0;
    traceLog.length = 0;
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
          return true;
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

  it('start(touch) -> start(mouse) MOUSE_EMU_INTERVAL+', function(done) {
    resetData();
    utils.intervalExec([
      // ====================================
      function() {
        expect(pointerEvent.curPointerClass).toBeNull();

        utils.fireTouchEvent(elmTarget, 'touchstart', {clientX: X1, clientY: Y1});
      },
      // ====================================
      PointerEvent.MOUSE_EMU_INTERVAL + 100,
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
      done
    ]);
  });

  it('start(touch) -> start(mouse) MOUSE_EMU_INTERVAL-', function(done) {
    resetData();
    utils.intervalExec([
      // ====================================
      function() {
        expect(pointerEvent.curPointerClass).toBeNull();

        utils.fireTouchEvent(elmTarget, 'touchstart', {clientX: X1, clientY: Y1});
      },
      // ====================================
      PointerEvent.MOUSE_EMU_INTERVAL - 100,
      function() {
        expect(pointerEvent.curPointerClass).toBe('touch');

        utils.fireMouseEvent(elmTarget, 'mousedown', {clientX: X2, clientY: Y2});
      },
      // ====================================
      function() {
        expect(pointerEvent.curPointerClass).toBe('touch');
        expect(traceLog).toEqual([
          '<startListener>', 'type:touchstart', 'curPointerClass:null',
          '<startHandler>', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
          'curPointerClass:touch(#0)', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
          '</startListener>',

          '<startListener>', 'type:mousedown', 'curPointerClass:touch(#0)',
          'CANCEL',
          '</startListener>'
        ]);
      },
      // ====================================
      done
    ]);
  });

  it('move(touch) -> start(mouse) MOUSE_EMU_INTERVAL+', function(done) {
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

        utils.fireTouchEvent(document, 'touchmove', {clientX: X1a, clientY: Y1a});
      },
      // ====================================
      PointerEvent.MOUSE_EMU_INTERVAL + 100,
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

          '<moveListener>', 'type:touchmove', 'curPointerClass:touch(#0)',
          '<move>',
          'lastPointerXY:(' + X1a + ',' + Y1a + ')',
          '<moveHandler>', 'pointerXY:(' + X1a + ',' + Y1a + ')', '</moveHandler>',
          '</move>',
          '</moveListener>',

          '<startListener>', 'type:mousedown', 'curPointerClass:touch(#0)',
          // Cancel current
          '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
          '<startHandler>', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</startHandler>',
          'curPointerClass:mouse', 'lastPointerXY:(' + X2 + ',' + Y2 + ')',
          '</startListener>'
        ]);
      },
      // ====================================
      done
    ]);
  });

  it('move(touch) -> start(mouse) MOUSE_EMU_INTERVAL-', function(done) {
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

        utils.fireTouchEvent(document, 'touchmove', {clientX: X1a, clientY: Y1a});
      },
      // ====================================
      PointerEvent.MOUSE_EMU_INTERVAL - 100,
      function() {
        expect(pointerEvent.curPointerClass).toBe('touch');

        utils.fireMouseEvent(elmTarget, 'mousedown', {clientX: X2, clientY: Y2});
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
          'lastPointerXY:(' + X1a + ',' + Y1a + ')',
          '<moveHandler>', 'pointerXY:(' + X1a + ',' + Y1a + ')', '</moveHandler>',
          '</move>',
          '</moveListener>',

          '<startListener>', 'type:mousedown', 'curPointerClass:touch(#0)',
          'CANCEL',
          '</startListener>'
        ]);
      },
      // ====================================
      done
    ]);
  });

  it('end(touch) -> start(mouse) MOUSE_EMU_INTERVAL+', function(done) {
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

        utils.fireTouchEvent(document, 'touchend', {clientX: X1, clientY: Y1});
      },
      // ====================================
      PointerEvent.MOUSE_EMU_INTERVAL + 100,
      function() {
        expect(pointerEvent.curPointerClass).toBeNull();

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

          '<endListener>', 'type:touchend', 'curPointerClass:touch(#0)',
          '<end>',
          'lastPointerXY:(' + X1 + ',' + Y1 + ')',
          '<endHandler>', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</endHandler>',
          'curPointerClass:null',
          '</end>',
          '</endListener>',

          '<startListener>', 'type:mousedown', 'curPointerClass:null',
          '<startHandler>', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</startHandler>',
          'curPointerClass:mouse', 'lastPointerXY:(' + X2 + ',' + Y2 + ')',
          '</startListener>'
        ]);
      },
      // ====================================
      done
    ]);
  });

  it('end(touch) -> start(mouse) MOUSE_EMU_INTERVAL-', function(done) {
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

        utils.fireTouchEvent(document, 'touchend', {clientX: X1, clientY: Y1});
      },
      // ====================================
      PointerEvent.MOUSE_EMU_INTERVAL - 100,
      function() {
        expect(pointerEvent.curPointerClass).toBeNull();

        utils.fireMouseEvent(elmTarget, 'mousedown', {clientX: X2, clientY: Y2});
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
          'lastPointerXY:(' + X1 + ',' + Y1 + ')',
          '<endHandler>', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</endHandler>',
          'curPointerClass:null',
          '</end>',
          '</endListener>',

          '<startListener>', 'type:mousedown', 'curPointerClass:null',
          'CANCEL',
          '</startListener>'
        ]);
      },
      // ====================================
      done
    ]);
  });

  it('cancel(touch) -> start(mouse) MOUSE_EMU_INTERVAL+', function(done) {
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

        utils.fireTouchEvent(document, 'touchcancel', {clientX: X1, clientY: Y1});
      },
      // ====================================
      PointerEvent.MOUSE_EMU_INTERVAL + 100,
      function() {
        expect(pointerEvent.curPointerClass).toBeNull();

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

          '<cancelListener>', 'type:touchcancel', 'curPointerClass:touch(#0)',
          '<cancel>',
          '<cancelHandler>', '</cancelHandler>',
          'curPointerClass:null',
          '</cancel>',
          '</cancelListener>',

          '<startListener>', 'type:mousedown', 'curPointerClass:null',
          '<startHandler>', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</startHandler>',
          'curPointerClass:mouse', 'lastPointerXY:(' + X2 + ',' + Y2 + ')',
          '</startListener>'
        ]);
      },
      // ====================================
      done
    ]);
  });

  it('cancel(touch) -> start(mouse) MOUSE_EMU_INTERVAL-', function(done) {
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

        utils.fireTouchEvent(document, 'touchcancel', {clientX: X1, clientY: Y1});
      },
      // ====================================
      PointerEvent.MOUSE_EMU_INTERVAL - 100,
      function() {
        expect(pointerEvent.curPointerClass).toBeNull();

        utils.fireMouseEvent(elmTarget, 'mousedown', {clientX: X2, clientY: Y2});
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
          '</cancelListener>',

          '<startListener>', 'type:mousedown', 'curPointerClass:null',
          'CANCEL',
          '</startListener>'
        ]);
      },
      // ====================================
      done
    ]);
  });

});
