describe('touchId', function() {
  'use strict';

  var pageDone, document, PointerEvent, traceLog, utils,
    div1, div2, div3, divAnother, pointerEvent,

    X1 = 1,
    Y1 = 2,
    X2 = 4,
    Y2 = 8,
    X3 = 16,
    Y3 = 32,
    X4 = 64,
    Y4 = 128,
    X5 = 256,
    Y5 = 512,
    X6 = 1024,
    Y6 = 2048;

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

      div1 = pageDocument.getElementById('parent');
      div2 = document.getElementById('div2');
      div3 = document.getElementById('div3');
      divAnother = document.getElementById('another');

      pointerEvent = new PointerEvent();
      pointerEvent.addStartHandler(div1,
        pointerEvent.regStartHandler(function(pointerXY) {
          traceLog.push('<startHandler>', 'div1', utils.logPointerXY(pointerXY), '</startHandler>');
          return true;
        }));
      pointerEvent.addStartHandler(div2,
        pointerEvent.regStartHandler(function(pointerXY) {
          traceLog.push('<startHandler>', 'div2', utils.logPointerXY(pointerXY), '</startHandler>');
          return true;
        }));
      pointerEvent.addStartHandler(div3,
        pointerEvent.regStartHandler(function(pointerXY) {
          traceLog.push('<startHandler>', 'div3', utils.logPointerXY(pointerXY), '</startHandler>');
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

  describe('Single touch', function() {

    it('start(#0) -> move(#0)', function(done) {
      var touch1;
      resetData();
      utils.intervalExec([
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X1,
            clientY: Y1
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X2,
            clientY: Y2
          });
          utils.fireTouchEvent(div1, 'touchmove', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);
          expect(traceLog).toEqual([
            '<startListener>', 'type:touchstart', 'curPointerClass:null',
            '<startHandler>', 'div1', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
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
        done
      ]);
    });

    it('start(#0) -> end(#0)', function(done) {
      var touch1;
      resetData();
      utils.intervalExec([
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X1,
            clientY: Y1
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          utils.fireTouchEvent(div1, 'touchend', {
            changedTouches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();
          expect(traceLog).toEqual([
            '<startListener>', 'type:touchstart', 'curPointerClass:null',
            '<startHandler>', 'div1', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
            '</startListener>',

            '<endListener>', 'type:touchend', 'curPointerClass:touch(#0)',
            '<end>',
            'lastPointerXY:(' + X1 + ',' + Y1 + ')',
            '<endHandler>', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</endHandler>',
            'curPointerClass:null',
            '</end>',
            '</endListener>'
          ]);
        },
        // ====================================
        done
      ]);
    });

    it('start(#0) -> cancel(#0)', function(done) {
      var touch1;
      resetData();
      utils.intervalExec([
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X1,
            clientY: Y1
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          utils.fireTouchEvent(div1, 'touchcancel', {
            changedTouches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();
          expect(traceLog).toEqual([
            '<startListener>', 'type:touchstart', 'curPointerClass:null',
            '<startHandler>', 'div1', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
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
        done
      ]);
    });

  });

  describe('Ignore ID that has no listener', function() {

    it('start(#0) -> start(NO-LISTENER #1) -> move(#0) -> move(#1)', function(done) {
      var touch1, touch2;
      resetData();
      utils.intervalExec([
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X1,
            clientY: Y1
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch2 = new Touch({
            identifier: 1,
            target: divAnother,
            clientX: X2,
            clientY: Y2
          });
          utils.fireTouchEvent(divAnother, 'touchstart', {
            changedTouches: [touch2],
            targetTouches: [touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X3,
            clientY: Y3
          });
          utils.fireTouchEvent(div1, 'touchmove', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch2 = new Touch({
            identifier: 1,
            target: divAnother,
            clientX: X4,
            clientY: Y4
          });
          utils.fireTouchEvent(divAnother, 'touchmove', {
            changedTouches: [touch2],
            targetTouches: [touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);
          expect(traceLog).toEqual([
            '<startListener>', 'type:touchstart', 'curPointerClass:null',
            '<startHandler>', 'div1', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
            '</startListener>',

            '<moveListener>', 'type:touchmove', 'curPointerClass:touch(#0)',
            '<move>',
            'lastPointerXY:(' + X3 + ',' + Y3 + ')',
            '<moveHandler>', 'pointerXY:(' + X3 + ',' + Y3 + ')', '</moveHandler>',
            '</move>',
            '</moveListener>',

            '<moveListener>', 'type:touchmove', 'curPointerClass:touch(#0)',
            'NOT-FOUND-TOUCH(#0)',
            '</moveListener>'
          ]);
        },
        // ====================================
        done
      ]);
    });

    it('start(#0) -> start(NO-LISTENER #1) -> move(#1) -> move(#0)', function(done) {
      var touch1, touch2;
      resetData();
      utils.intervalExec([
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X1,
            clientY: Y1
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch2 = new Touch({
            identifier: 1,
            target: divAnother,
            clientX: X2,
            clientY: Y2
          });
          utils.fireTouchEvent(divAnother, 'touchstart', {
            changedTouches: [touch2],
            targetTouches: [touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch2 = new Touch({
            identifier: 1,
            target: divAnother,
            clientX: X3,
            clientY: Y3
          });
          utils.fireTouchEvent(divAnother, 'touchmove', {
            changedTouches: [touch2],
            targetTouches: [touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X4,
            clientY: Y4
          });
          utils.fireTouchEvent(div1, 'touchmove', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);
          expect(traceLog).toEqual([
            '<startListener>', 'type:touchstart', 'curPointerClass:null',
            '<startHandler>', 'div1', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
            '</startListener>',

            '<moveListener>', 'type:touchmove', 'curPointerClass:touch(#0)',
            'NOT-FOUND-TOUCH(#0)',
            '</moveListener>',

            '<moveListener>', 'type:touchmove', 'curPointerClass:touch(#0)',
            '<move>',
            'lastPointerXY:(' + X4 + ',' + Y4 + ')',
            '<moveHandler>', 'pointerXY:(' + X4 + ',' + Y4 + ')', '</moveHandler>',
            '</move>',
            '</moveListener>'
          ]);
        },
        // ====================================
        done
      ]);
    });

    it('start(NO-LISTENER #0) -> start(#1) -> move(#0) -> move(#1)', function(done) {
      var touch1, touch2;
      resetData();
      utils.intervalExec([
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch1 = new Touch({
            identifier: 0,
            target: divAnother,
            clientX: X1,
            clientY: Y1
          });
          utils.fireTouchEvent(divAnother, 'touchstart', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch2 = new Touch({
            identifier: 1,
            target: div1,
            clientX: X2,
            clientY: Y2
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch2],
            targetTouches: [touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          touch1 = new Touch({
            identifier: 0,
            target: divAnother,
            clientX: X3,
            clientY: Y3
          });
          utils.fireTouchEvent(divAnother, 'touchmove', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          touch2 = new Touch({
            identifier: 1,
            target: div1,
            clientX: X4,
            clientY: Y4
          });
          utils.fireTouchEvent(div1, 'touchmove', {
            changedTouches: [touch2],
            targetTouches: [touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);
          expect(traceLog).toEqual([
            '<startListener>', 'type:touchstart', 'curPointerClass:null',
            '<startHandler>', 'div1', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</startHandler>',
            'curPointerClass:touch(#1)', 'lastPointerXY:(' + X2 + ',' + Y2 + ')',
            '</startListener>',

            '<moveListener>', 'type:touchmove', 'curPointerClass:touch(#1)',
            'NOT-FOUND-TOUCH(#1)',
            '</moveListener>',

            '<moveListener>', 'type:touchmove', 'curPointerClass:touch(#1)',
            '<move>',
            'lastPointerXY:(' + X4 + ',' + Y4 + ')',
            '<moveHandler>', 'pointerXY:(' + X4 + ',' + Y4 + ')', '</moveHandler>',
            '</move>',
            '</moveListener>'
          ]);
        },
        // ====================================
        done
      ]);
    });

    it('start(NO-LISTENER #0) -> start(#1) -> move(#1) -> move(#0)', function(done) {
      var touch1, touch2;
      resetData();
      utils.intervalExec([
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch1 = new Touch({
            identifier: 0,
            target: divAnother,
            clientX: X1,
            clientY: Y1
          });
          utils.fireTouchEvent(divAnother, 'touchstart', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch2 = new Touch({
            identifier: 1,
            target: div1,
            clientX: X2,
            clientY: Y2
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch2],
            targetTouches: [touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          touch2 = new Touch({
            identifier: 1,
            target: div1,
            clientX: X3,
            clientY: Y3
          });
          utils.fireTouchEvent(div1, 'touchmove', {
            changedTouches: [touch2],
            targetTouches: [touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          touch1 = new Touch({
            identifier: 0,
            target: divAnother,
            clientX: X4,
            clientY: Y4
          });
          utils.fireTouchEvent(divAnother, 'touchmove', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);
          expect(traceLog).toEqual([
            '<startListener>', 'type:touchstart', 'curPointerClass:null',
            '<startHandler>', 'div1', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</startHandler>',
            'curPointerClass:touch(#1)', 'lastPointerXY:(' + X2 + ',' + Y2 + ')',
            '</startListener>',

            '<moveListener>', 'type:touchmove', 'curPointerClass:touch(#1)',
            '<move>',
            'lastPointerXY:(' + X3 + ',' + Y3 + ')',
            '<moveHandler>', 'pointerXY:(' + X3 + ',' + Y3 + ')', '</moveHandler>',
            '</move>',
            '</moveListener>',

            '<moveListener>', 'type:touchmove', 'curPointerClass:touch(#1)',
            'NOT-FOUND-TOUCH(#1)',
            '</moveListener>'
          ]);
        },
        // ====================================
        done
      ]);
    });

    it('start(#0) -> start(NO-LISTENER #1) -> end(#0) -> end(#1)', function(done) {
      var touch1, touch2;
      resetData();
      utils.intervalExec([
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X1,
            clientY: Y1
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch2 = new Touch({
            identifier: 1,
            target: divAnother,
            clientX: X2,
            clientY: Y2
          });
          utils.fireTouchEvent(divAnother, 'touchstart', {
            changedTouches: [touch2],
            targetTouches: [touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          utils.fireTouchEvent(div1, 'touchend', {
            changedTouches: [touch1],
            touches: [touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          utils.fireTouchEvent(divAnother, 'touchend', {
            changedTouches: [touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();
          expect(traceLog).toEqual([
            '<startListener>', 'type:touchstart', 'curPointerClass:null',
            '<startHandler>', 'div1', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
            '</startListener>',

            '<endListener>', 'type:touchend', 'curPointerClass:touch(#0)',
            '<end>',
            'lastPointerXY:(' + X1 + ',' + Y1 + ')',
            '<endHandler>', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</endHandler>',
            'curPointerClass:null',
            '</end>',
            '</endListener>',

            '<endListener>', 'type:touchend', 'curPointerClass:null', '</endListener>'
          ]);
        },
        // ====================================
        done
      ]);
    });

    it('start(#0) -> start(NO-LISTENER #1) -> end(#1) -> end(#0)', function(done) {
      var touch1, touch2;
      resetData();
      utils.intervalExec([
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X1,
            clientY: Y1
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch2 = new Touch({
            identifier: 1,
            target: divAnother,
            clientX: X2,
            clientY: Y2
          });
          utils.fireTouchEvent(divAnother, 'touchstart', {
            changedTouches: [touch2],
            targetTouches: [touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          utils.fireTouchEvent(divAnother, 'touchend', {
            changedTouches: [touch2],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          utils.fireTouchEvent(div1, 'touchend', {
            changedTouches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();
          expect(traceLog).toEqual([
            '<startListener>', 'type:touchstart', 'curPointerClass:null',
            '<startHandler>', 'div1', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
            '</startListener>',

            '<endListener>', 'type:touchend', 'curPointerClass:touch(#0)',
            'CHECKED:event.touches', 'NOT-FOUND-TOUCH(#0)',
            '</endListener>',

            '<endListener>', 'type:touchend', 'curPointerClass:touch(#0)',
            '<end>',
            'lastPointerXY:(' + X1 + ',' + Y1 + ')',
            '<endHandler>', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</endHandler>',
            'curPointerClass:null',
            '</end>',
            '</endListener>'
          ]);
        },
        // ====================================
        done
      ]);
    });

    it('start(NO-LISTENER #0) -> start(#1) -> end(#0) -> end(#1)', function(done) {
      var touch1, touch2;
      resetData();
      utils.intervalExec([
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch1 = new Touch({
            identifier: 0,
            target: divAnother,
            clientX: X1,
            clientY: Y1
          });
          utils.fireTouchEvent(divAnother, 'touchstart', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch2 = new Touch({
            identifier: 1,
            target: div1,
            clientX: X2,
            clientY: Y2
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch2],
            targetTouches: [touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          utils.fireTouchEvent(divAnother, 'touchend', {
            changedTouches: [touch1],
            touches: [touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          utils.fireTouchEvent(div1, 'touchend', {
            changedTouches: [touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();
          expect(traceLog).toEqual([
            '<startListener>', 'type:touchstart', 'curPointerClass:null',
            '<startHandler>', 'div1', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</startHandler>',
            'curPointerClass:touch(#1)', 'lastPointerXY:(' + X2 + ',' + Y2 + ')',
            '</startListener>',

            '<endListener>', 'type:touchend', 'curPointerClass:touch(#1)',
            'CHECKED:event.touches', 'NOT-FOUND-TOUCH(#1)',
            '</endListener>',

            '<endListener>', 'type:touchend', 'curPointerClass:touch(#1)',
            '<end>',
            'lastPointerXY:(' + X2 + ',' + Y2 + ')',
            '<endHandler>', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</endHandler>',
            'curPointerClass:null',
            '</end>',
            '</endListener>'
          ]);
        },
        // ====================================
        done
      ]);
    });

    it('start(NO-LISTENER #0) -> start(#1) -> end(#1) -> end(#0)', function(done) {
      var touch1, touch2;
      resetData();
      utils.intervalExec([
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch1 = new Touch({
            identifier: 0,
            target: divAnother,
            clientX: X1,
            clientY: Y1
          });
          utils.fireTouchEvent(divAnother, 'touchstart', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch2 = new Touch({
            identifier: 1,
            target: div1,
            clientX: X2,
            clientY: Y2
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch2],
            targetTouches: [touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          utils.fireTouchEvent(div1, 'touchend', {
            changedTouches: [touch2],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          utils.fireTouchEvent(divAnother, 'touchend', {
            changedTouches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();
          expect(traceLog).toEqual([
            '<startListener>', 'type:touchstart', 'curPointerClass:null',
            '<startHandler>', 'div1', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</startHandler>',
            'curPointerClass:touch(#1)', 'lastPointerXY:(' + X2 + ',' + Y2 + ')',
            '</startListener>',

            '<endListener>', 'type:touchend', 'curPointerClass:touch(#1)',
            '<end>',
            'lastPointerXY:(' + X2 + ',' + Y2 + ')',
            '<endHandler>', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</endHandler>',
            'curPointerClass:null',
            '</end>',
            '</endListener>',

            '<endListener>', 'type:touchend', 'curPointerClass:null', '</endListener>'
          ]);
        },
        // ====================================
        done
      ]);
    });

    it('start(#0) -> start(NO-LISTENER #1) -> cancel(ALL)', function(done) {
      var touch1, touch2;
      resetData();
      utils.intervalExec([
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X1,
            clientY: Y1
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch2 = new Touch({
            identifier: 1,
            target: divAnother,
            clientX: X2,
            clientY: Y2
          });
          utils.fireTouchEvent(divAnother, 'touchstart', {
            changedTouches: [touch2],
            targetTouches: [touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          // Only #0
          utils.fireTouchEvent(div1, 'touchcancel', {
            changedTouches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();
          expect(traceLog).toEqual([
            '<startListener>', 'type:touchstart', 'curPointerClass:null',
            '<startHandler>', 'div1', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
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
        done
      ]);
    });

    it('start(#0) -> start(NO-LISTENER #1) -> cancel(#0) -> cancel(#1)', function(done) {
      var touch1, touch2;
      resetData();
      utils.intervalExec([
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X1,
            clientY: Y1
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch2 = new Touch({
            identifier: 1,
            target: divAnother,
            clientX: X2,
            clientY: Y2
          });
          utils.fireTouchEvent(divAnother, 'touchstart', {
            changedTouches: [touch2],
            targetTouches: [touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          utils.fireTouchEvent(div1, 'touchcancel', {
            changedTouches: [touch1],
            touches: [touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          utils.fireTouchEvent(divAnother, 'touchcancel', {
            changedTouches: [touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();
          expect(traceLog).toEqual([
            '<startListener>', 'type:touchstart', 'curPointerClass:null',
            '<startHandler>', 'div1', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
            '</startListener>',

            '<cancelListener>', 'type:touchcancel', 'curPointerClass:touch(#0)',
            '<cancel>',
            '<cancelHandler>', '</cancelHandler>',
            'curPointerClass:null',
            '</cancel>',
            '</cancelListener>',

            '<cancelListener>', 'type:touchcancel', 'curPointerClass:null', '</cancelListener>'
          ]);
        },
        // ====================================
        done
      ]);
    });

    it('start(#0) -> start(NO-LISTENER #1) -> cancel(#1) -> cancel(#0)', function(done) {
      var touch1, touch2;
      resetData();
      utils.intervalExec([
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X1,
            clientY: Y1
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch2 = new Touch({
            identifier: 1,
            target: divAnother,
            clientX: X2,
            clientY: Y2
          });
          utils.fireTouchEvent(divAnother, 'touchstart', {
            changedTouches: [touch2],
            targetTouches: [touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          utils.fireTouchEvent(divAnother, 'touchcancel', {
            changedTouches: [touch2],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          utils.fireTouchEvent(div1, 'touchcancel', {
            changedTouches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();
          expect(traceLog).toEqual([
            '<startListener>', 'type:touchstart', 'curPointerClass:null',
            '<startHandler>', 'div1', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
            '</startListener>',

            '<cancelListener>', 'type:touchcancel', 'curPointerClass:touch(#0)',
            'CHECKED:event.touches', 'NOT-FOUND-TOUCH(#0)',
            '</cancelListener>',

            '<cancelListener>', 'type:touchcancel', 'curPointerClass:touch(#0)',
            '<cancel>',
            '<cancelHandler>', '</cancelHandler>',
            'curPointerClass:null',
            '</cancel>',
            '</cancelListener>'
          ]);
        },
        // ====================================
        done
      ]);
    });

    it('start(NO-LISTENER #0) -> start(#1) -> cancel(ALL)', function(done) {
      var touch1, touch2;
      resetData();
      utils.intervalExec([
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch1 = new Touch({
            identifier: 0,
            target: divAnother,
            clientX: X1,
            clientY: Y1
          });
          utils.fireTouchEvent(divAnother, 'touchstart', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch2 = new Touch({
            identifier: 1,
            target: div1,
            clientX: X2,
            clientY: Y2
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch2],
            targetTouches: [touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          // Only #0
          utils.fireTouchEvent(divAnother, 'touchcancel', {
            changedTouches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();
          expect(traceLog).toEqual([
            '<startListener>', 'type:touchstart', 'curPointerClass:null',
            '<startHandler>', 'div1', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</startHandler>',
            'curPointerClass:touch(#1)', 'lastPointerXY:(' + X2 + ',' + Y2 + ')',
            '</startListener>',

            '<cancelListener>', 'type:touchcancel', 'curPointerClass:touch(#1)',
            'CHECKED:event.touches',
            '<cancel>',
            '<cancelHandler>', '</cancelHandler>',
            'curPointerClass:null',
            '</cancel>',
            '</cancelListener>'
          ]);
        },
        // ====================================
        done
      ]);
    });

    it('start(NO-LISTENER #0) -> start(#1) -> cancel(#0) -> cancel(#1)', function(done) {
      var touch1, touch2;
      resetData();
      utils.intervalExec([
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch1 = new Touch({
            identifier: 0,
            target: divAnother,
            clientX: X1,
            clientY: Y1
          });
          utils.fireTouchEvent(divAnother, 'touchstart', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch2 = new Touch({
            identifier: 1,
            target: div1,
            clientX: X2,
            clientY: Y2
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch2],
            targetTouches: [touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          utils.fireTouchEvent(divAnother, 'touchcancel', {
            changedTouches: [touch1],
            touches: [touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          utils.fireTouchEvent(div1, 'touchcancel', {
            changedTouches: [touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();
          expect(traceLog).toEqual([
            '<startListener>', 'type:touchstart', 'curPointerClass:null',
            '<startHandler>', 'div1', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</startHandler>',
            'curPointerClass:touch(#1)', 'lastPointerXY:(' + X2 + ',' + Y2 + ')',
            '</startListener>',

            '<cancelListener>', 'type:touchcancel', 'curPointerClass:touch(#1)',
            'CHECKED:event.touches', 'NOT-FOUND-TOUCH(#1)',
            '</cancelListener>',

            '<cancelListener>', 'type:touchcancel', 'curPointerClass:touch(#1)',
            '<cancel>',
            '<cancelHandler>', '</cancelHandler>',
            'curPointerClass:null',
            '</cancel>',
            '</cancelListener>'
          ]);
        },
        // ====================================
        done
      ]);
    });

    it('start(NO-LISTENER #0) -> start(#1) -> cancel(#1) -> cancel(#0)', function(done) {
      var touch1, touch2;
      resetData();
      utils.intervalExec([
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch1 = new Touch({
            identifier: 0,
            target: divAnother,
            clientX: X1,
            clientY: Y1
          });
          utils.fireTouchEvent(divAnother, 'touchstart', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch2 = new Touch({
            identifier: 1,
            target: div1,
            clientX: X2,
            clientY: Y2
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch2],
            targetTouches: [touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          utils.fireTouchEvent(div1, 'touchcancel', {
            changedTouches: [touch2],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          utils.fireTouchEvent(divAnother, 'touchcancel', {
            changedTouches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();
          expect(traceLog).toEqual([
            '<startListener>', 'type:touchstart', 'curPointerClass:null',
            '<startHandler>', 'div1', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</startHandler>',
            'curPointerClass:touch(#1)', 'lastPointerXY:(' + X2 + ',' + Y2 + ')',
            '</startListener>',

            '<cancelListener>', 'type:touchcancel', 'curPointerClass:touch(#1)',
            '<cancel>',
            '<cancelHandler>', '</cancelHandler>',
            'curPointerClass:null',
            '</cancel>',
            '</cancelListener>',

            '<cancelListener>', 'type:touchcancel', 'curPointerClass:null', '</cancelListener>'
          ]);
        },
        // ====================================
        done
      ]);
    });

  });

  describe('Change target touch', function() {

    it('start(#0) -> start(#1) -> move(#0) -> move(#1)', function(done) {
      var touch1, touch2;
      resetData();
      utils.intervalExec([
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X1,
            clientY: Y1
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch2 = new Touch({
            identifier: 1,
            target: div2,
            clientX: X2,
            clientY: Y2
          });
          utils.fireTouchEvent(div2, 'touchstart', {
            changedTouches: [touch2],
            targetTouches: [touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X3,
            clientY: Y3
          });
          utils.fireTouchEvent(div1, 'touchmove', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          touch2 = new Touch({
            identifier: 1,
            target: div2,
            clientX: X4,
            clientY: Y4
          });
          utils.fireTouchEvent(div2, 'touchmove', {
            changedTouches: [touch2],
            targetTouches: [touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);
          expect(traceLog).toEqual([
            '<startListener>', 'type:touchstart', 'curPointerClass:null',
            '<startHandler>', 'div1', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
            '</startListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#0)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div2', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</startHandler>',
            'curPointerClass:touch(#1)', 'lastPointerXY:(' + X2 + ',' + Y2 + ')',
            '</startListener>',

            '<moveListener>', 'type:touchmove', 'curPointerClass:touch(#1)',
            'NOT-FOUND-TOUCH(#1)',
            '</moveListener>',

            '<moveListener>', 'type:touchmove', 'curPointerClass:touch(#1)',
            '<move>',
            'lastPointerXY:(' + X4 + ',' + Y4 + ')',
            '<moveHandler>', 'pointerXY:(' + X4 + ',' + Y4 + ')', '</moveHandler>',
            '</move>',
            '</moveListener>'
          ]);
        },
        // ====================================
        done
      ]);
    });

    it('start(#0) -> start(#1) -> move(#1) -> move(#0)', function(done) {
      var touch1, touch2;
      resetData();
      utils.intervalExec([
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X1,
            clientY: Y1
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch2 = new Touch({
            identifier: 1,
            target: div2,
            clientX: X2,
            clientY: Y2
          });
          utils.fireTouchEvent(div2, 'touchstart', {
            changedTouches: [touch2],
            targetTouches: [touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          touch2 = new Touch({
            identifier: 1,
            target: div2,
            clientX: X3,
            clientY: Y3
          });
          utils.fireTouchEvent(div2, 'touchmove', {
            changedTouches: [touch2],
            targetTouches: [touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X4,
            clientY: Y4
          });
          utils.fireTouchEvent(div1, 'touchmove', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);
          expect(traceLog).toEqual([
            '<startListener>', 'type:touchstart', 'curPointerClass:null',
            '<startHandler>', 'div1', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
            '</startListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#0)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div2', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</startHandler>',
            'curPointerClass:touch(#1)', 'lastPointerXY:(' + X2 + ',' + Y2 + ')',
            '</startListener>',

            '<moveListener>', 'type:touchmove', 'curPointerClass:touch(#1)',
            '<move>',
            'lastPointerXY:(' + X3 + ',' + Y3 + ')',
            '<moveHandler>', 'pointerXY:(' + X3 + ',' + Y3 + ')', '</moveHandler>',
            '</move>',
            '</moveListener>',

            '<moveListener>', 'type:touchmove', 'curPointerClass:touch(#1)',
            'NOT-FOUND-TOUCH(#1)',
            '</moveListener>'
          ]);
        },
        // ====================================
        done
      ]);
    });

    it('start(#0) -> start(#1) -> move(ALL)', function(done) {
      var touch1, touch2;
      resetData();
      utils.intervalExec([
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X1,
            clientY: Y1
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch2 = new Touch({
            identifier: 1,
            target: div2,
            clientX: X2,
            clientY: Y2
          });
          utils.fireTouchEvent(div2, 'touchstart', {
            changedTouches: [touch2],
            targetTouches: [touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X3,
            clientY: Y3
          });
          touch2 = new Touch({
            identifier: 1,
            target: div2,
            clientX: X4,
            clientY: Y4
          });
          utils.fireTouchEvent(div1, 'touchmove', {
            changedTouches: [touch1, touch2],
            targetTouches: [touch1],
            touches: [touch1, touch2]
          });
          utils.fireTouchEvent(div2, 'touchmove', {
            changedTouches: [touch1, touch2],
            targetTouches: [touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);
          expect(traceLog).toEqual([
            '<startListener>', 'type:touchstart', 'curPointerClass:null',
            '<startHandler>', 'div1', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
            '</startListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#0)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div2', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</startHandler>',
            'curPointerClass:touch(#1)', 'lastPointerXY:(' + X2 + ',' + Y2 + ')',
            '</startListener>',

            '<moveListener>', 'type:touchmove', 'curPointerClass:touch(#1)',
            '<move>',
            'lastPointerXY:(' + X4 + ',' + Y4 + ')',
            '<moveHandler>', 'pointerXY:(' + X4 + ',' + Y4 + ')', '</moveHandler>',
            '</move>',
            '</moveListener>',

            '<moveListener>', 'type:touchmove', 'curPointerClass:touch(#1)',
            'NOT-CHANGED',
            '</moveListener>'
          ]);
        },
        // ====================================
        done
      ]);
    });

    it('start(#0) -> start(#1) -> end(#0) -> end(#1)', function(done) {
      var touch1, touch2;
      resetData();
      utils.intervalExec([
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X1,
            clientY: Y1
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch2 = new Touch({
            identifier: 1,
            target: div2,
            clientX: X2,
            clientY: Y2
          });
          utils.fireTouchEvent(div2, 'touchstart', {
            changedTouches: [touch2],
            targetTouches: [touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          utils.fireTouchEvent(div1, 'touchend', {
            changedTouches: [touch1],
            touches: [touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          utils.fireTouchEvent(div2, 'touchend', {
            changedTouches: [touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();
          expect(traceLog).toEqual([
            '<startListener>', 'type:touchstart', 'curPointerClass:null',
            '<startHandler>', 'div1', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
            '</startListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#0)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div2', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</startHandler>',
            'curPointerClass:touch(#1)', 'lastPointerXY:(' + X2 + ',' + Y2 + ')',
            '</startListener>',

            '<endListener>', 'type:touchend', 'curPointerClass:touch(#1)',
            'CHECKED:event.touches', 'NOT-FOUND-TOUCH(#1)',
            '</endListener>',

            '<endListener>', 'type:touchend', 'curPointerClass:touch(#1)',
            '<end>',
            'lastPointerXY:(' + X2 + ',' + Y2 + ')',
            '<endHandler>', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</endHandler>',
            'curPointerClass:null',
            '</end>',
            '</endListener>'
          ]);
        },
        // ====================================
        done
      ]);
    });

    it('start(#0) -> start(#1) -> end(#1) -> end(#0)', function(done) {
      var touch1, touch2;
      resetData();
      utils.intervalExec([
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X1,
            clientY: Y1
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch2 = new Touch({
            identifier: 1,
            target: div2,
            clientX: X2,
            clientY: Y2
          });
          utils.fireTouchEvent(div2, 'touchstart', {
            changedTouches: [touch2],
            targetTouches: [touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          utils.fireTouchEvent(div2, 'touchend', {
            changedTouches: [touch2],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          utils.fireTouchEvent(div1, 'touchend', {
            changedTouches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();
          expect(traceLog).toEqual([
            '<startListener>', 'type:touchstart', 'curPointerClass:null',
            '<startHandler>', 'div1', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
            '</startListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#0)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div2', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</startHandler>',
            'curPointerClass:touch(#1)', 'lastPointerXY:(' + X2 + ',' + Y2 + ')',
            '</startListener>',

            '<endListener>', 'type:touchend', 'curPointerClass:touch(#1)',
            '<end>',
            'lastPointerXY:(' + X2 + ',' + Y2 + ')',
            '<endHandler>', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</endHandler>',
            'curPointerClass:null',
            '</end>',
            '</endListener>',

            '<endListener>', 'type:touchend', 'curPointerClass:null', '</endListener>'
          ]);
        },
        // ====================================
        done
      ]);
    });

    it('start(#0) -> start(#1) -> end(ALL)', function(done) {
      var touch1, touch2;
      resetData();
      utils.intervalExec([
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X1,
            clientY: Y1
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch2 = new Touch({
            identifier: 1,
            target: div2,
            clientX: X2,
            clientY: Y2
          });
          utils.fireTouchEvent(div2, 'touchstart', {
            changedTouches: [touch2],
            targetTouches: [touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          utils.fireTouchEvent(div1, 'touchend', {
            changedTouches: [touch1, touch2]
          });
          utils.fireTouchEvent(div2, 'touchend', {
            changedTouches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();
          expect(traceLog).toEqual([
            '<startListener>', 'type:touchstart', 'curPointerClass:null',
            '<startHandler>', 'div1', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
            '</startListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#0)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div2', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</startHandler>',
            'curPointerClass:touch(#1)', 'lastPointerXY:(' + X2 + ',' + Y2 + ')',
            '</startListener>',

            '<endListener>', 'type:touchend', 'curPointerClass:touch(#1)',
            '<end>',
            'lastPointerXY:(' + X2 + ',' + Y2 + ')',
            '<endHandler>', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</endHandler>',
            'curPointerClass:null',
            '</end>',
            '</endListener>',

            '<endListener>', 'type:touchend', 'curPointerClass:null', '</endListener>'
          ]);
        },
        // ====================================
        done
      ]);
    });

    it('start(#0) -> start(#1) -> cancel(ALL)', function(done) {
      var touch1, touch2;
      resetData();
      utils.intervalExec([
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X1,
            clientY: Y1
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch2 = new Touch({
            identifier: 1,
            target: div2,
            clientX: X2,
            clientY: Y2
          });
          utils.fireTouchEvent(div2, 'touchstart', {
            changedTouches: [touch2],
            targetTouches: [touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          // Only #0
          utils.fireTouchEvent(div1, 'touchcancel', {
            changedTouches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();
          expect(traceLog).toEqual([
            '<startListener>', 'type:touchstart', 'curPointerClass:null',
            '<startHandler>', 'div1', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
            '</startListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#0)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div2', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</startHandler>',
            'curPointerClass:touch(#1)', 'lastPointerXY:(' + X2 + ',' + Y2 + ')',
            '</startListener>',

            '<cancelListener>', 'type:touchcancel', 'curPointerClass:touch(#1)',
            'CHECKED:event.touches',
            '<cancel>',
            '<cancelHandler>', '</cancelHandler>',
            'curPointerClass:null',
            '</cancel>',
            '</cancelListener>'
          ]);
        },
        // ====================================
        done
      ]);
    });

    it('start(#0) -> start(#1) -> cancel(#0) -> cancel(#1)', function(done) {
      var touch1, touch2;
      resetData();
      utils.intervalExec([
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X1,
            clientY: Y1
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch2 = new Touch({
            identifier: 1,
            target: div2,
            clientX: X2,
            clientY: Y2
          });
          utils.fireTouchEvent(div2, 'touchstart', {
            changedTouches: [touch2],
            targetTouches: [touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          utils.fireTouchEvent(div1, 'touchcancel', {
            changedTouches: [touch1],
            touches: [touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          utils.fireTouchEvent(div2, 'touchcancel', {
            changedTouches: [touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();
          expect(traceLog).toEqual([
            '<startListener>', 'type:touchstart', 'curPointerClass:null',
            '<startHandler>', 'div1', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
            '</startListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#0)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div2', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</startHandler>',
            'curPointerClass:touch(#1)', 'lastPointerXY:(' + X2 + ',' + Y2 + ')',
            '</startListener>',

            '<cancelListener>', 'type:touchcancel', 'curPointerClass:touch(#1)',
            'CHECKED:event.touches', 'NOT-FOUND-TOUCH(#1)',
            '</cancelListener>',

            '<cancelListener>', 'type:touchcancel', 'curPointerClass:touch(#1)',
            '<cancel>',
            '<cancelHandler>', '</cancelHandler>',
            'curPointerClass:null',
            '</cancel>',
            '</cancelListener>'
          ]);
        },
        // ====================================
        done
      ]);
    });

    it('start(#0) -> start(#1) -> cancel(#1) -> cancel(#0)', function(done) {
      var touch1, touch2;
      resetData();
      utils.intervalExec([
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X1,
            clientY: Y1
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch2 = new Touch({
            identifier: 1,
            target: div2,
            clientX: X2,
            clientY: Y2
          });
          utils.fireTouchEvent(div2, 'touchstart', {
            changedTouches: [touch2],
            targetTouches: [touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          utils.fireTouchEvent(div2, 'touchcancel', {
            changedTouches: [touch2],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          utils.fireTouchEvent(div1, 'touchcancel', {
            changedTouches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();
          expect(traceLog).toEqual([
            '<startListener>', 'type:touchstart', 'curPointerClass:null',
            '<startHandler>', 'div1', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
            '</startListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#0)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div2', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</startHandler>',
            'curPointerClass:touch(#1)', 'lastPointerXY:(' + X2 + ',' + Y2 + ')',
            '</startListener>',

            '<cancelListener>', 'type:touchcancel', 'curPointerClass:touch(#1)',
            '<cancel>',
            '<cancelHandler>', '</cancelHandler>',
            'curPointerClass:null',
            '</cancel>',
            '</cancelListener>',

            '<cancelListener>', 'type:touchcancel', 'curPointerClass:null', '</cancelListener>'
          ]);
        },
        // ====================================
        done
      ]);
    });

  });

  describe('Change target touch in same element', function() {

    it('start(#0) -> start(SAME-ELEMENT #1) -> move(#0) -> move(#1)', function(done) {
      var touch1, touch2;
      resetData();
      utils.intervalExec([
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X1,
            clientY: Y1
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch2 = new Touch({
            identifier: 1,
            target: div1,
            clientX: X2,
            clientY: Y2
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch2],
            targetTouches: [touch1, touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X3,
            clientY: Y3
          });
          utils.fireTouchEvent(div1, 'touchmove', {
            changedTouches: [touch1],
            targetTouches: [touch1, touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          touch2 = new Touch({
            identifier: 1,
            target: div1,
            clientX: X4,
            clientY: Y4
          });
          utils.fireTouchEvent(div1, 'touchmove', {
            changedTouches: [touch2],
            targetTouches: [touch1, touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);
          expect(traceLog).toEqual([
            '<startListener>', 'type:touchstart', 'curPointerClass:null',
            '<startHandler>', 'div1', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
            '</startListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#0)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div1', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</startHandler>',
            'curPointerClass:touch(#1)', 'lastPointerXY:(' + X2 + ',' + Y2 + ')',
            '</startListener>',

            '<moveListener>', 'type:touchmove', 'curPointerClass:touch(#1)',
            'NOT-FOUND-TOUCH(#1)',
            '</moveListener>',

            '<moveListener>', 'type:touchmove', 'curPointerClass:touch(#1)',
            '<move>',
            'lastPointerXY:(' + X4 + ',' + Y4 + ')',
            '<moveHandler>', 'pointerXY:(' + X4 + ',' + Y4 + ')', '</moveHandler>',
            '</move>',
            '</moveListener>'
          ]);
        },
        // ====================================
        done
      ]);
    });

    it('start(#0) -> start(SAME-ELEMENT #1) -> move(#1) -> move(#0)', function(done) {
      var touch1, touch2;
      resetData();
      utils.intervalExec([
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X1,
            clientY: Y1
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch2 = new Touch({
            identifier: 1,
            target: div1,
            clientX: X2,
            clientY: Y2
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch2],
            targetTouches: [touch1, touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          touch2 = new Touch({
            identifier: 1,
            target: div1,
            clientX: X3,
            clientY: Y3
          });
          utils.fireTouchEvent(div1, 'touchmove', {
            changedTouches: [touch2],
            targetTouches: [touch1, touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X4,
            clientY: Y4
          });
          utils.fireTouchEvent(div1, 'touchmove', {
            changedTouches: [touch1],
            targetTouches: [touch1, touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);
          expect(traceLog).toEqual([
            '<startListener>', 'type:touchstart', 'curPointerClass:null',
            '<startHandler>', 'div1', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
            '</startListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#0)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div1', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</startHandler>',
            'curPointerClass:touch(#1)', 'lastPointerXY:(' + X2 + ',' + Y2 + ')',
            '</startListener>',

            '<moveListener>', 'type:touchmove', 'curPointerClass:touch(#1)',
            '<move>',
            'lastPointerXY:(' + X3 + ',' + Y3 + ')',
            '<moveHandler>', 'pointerXY:(' + X3 + ',' + Y3 + ')', '</moveHandler>',
            '</move>',
            '</moveListener>',

            '<moveListener>', 'type:touchmove', 'curPointerClass:touch(#1)',
            'NOT-FOUND-TOUCH(#1)',
            '</moveListener>'
          ]);
        },
        // ====================================
        done
      ]);
    });

    it('start(#0) -> start(SAME-ELEMENT #1) -> move(ALL)', function(done) {
      var touch1, touch2;
      resetData();
      utils.intervalExec([
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X1,
            clientY: Y1
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch2 = new Touch({
            identifier: 1,
            target: div1,
            clientX: X2,
            clientY: Y2
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch2],
            targetTouches: [touch1, touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X3,
            clientY: Y3
          });
          touch2 = new Touch({
            identifier: 1,
            target: div1,
            clientX: X4,
            clientY: Y4
          });
          utils.fireTouchEvent(div1, 'touchmove', {
            changedTouches: [touch1, touch2],
            targetTouches: [touch1, touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);
          expect(traceLog).toEqual([
            '<startListener>', 'type:touchstart', 'curPointerClass:null',
            '<startHandler>', 'div1', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
            '</startListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#0)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div1', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</startHandler>',
            'curPointerClass:touch(#1)', 'lastPointerXY:(' + X2 + ',' + Y2 + ')',
            '</startListener>',

            '<moveListener>', 'type:touchmove', 'curPointerClass:touch(#1)',
            '<move>',
            'lastPointerXY:(' + X4 + ',' + Y4 + ')',
            '<moveHandler>', 'pointerXY:(' + X4 + ',' + Y4 + ')', '</moveHandler>',
            '</move>',
            '</moveListener>'
          ]);
        },
        // ====================================
        done
      ]);
    });

    it('start(#0) -> start(SAME-ELEMENT #1) -> end(#0) -> end(#1)', function(done) {
      var touch1, touch2;
      resetData();
      utils.intervalExec([
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X1,
            clientY: Y1
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch2 = new Touch({
            identifier: 1,
            target: div1,
            clientX: X2,
            clientY: Y2
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch2],
            targetTouches: [touch1, touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          utils.fireTouchEvent(div1, 'touchend', {
            changedTouches: [touch1],
            targetTouches: [touch2],
            touches: [touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          utils.fireTouchEvent(div1, 'touchend', {
            changedTouches: [touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();
          expect(traceLog).toEqual([
            '<startListener>', 'type:touchstart', 'curPointerClass:null',
            '<startHandler>', 'div1', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
            '</startListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#0)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div1', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</startHandler>',
            'curPointerClass:touch(#1)', 'lastPointerXY:(' + X2 + ',' + Y2 + ')',
            '</startListener>',

            '<endListener>', 'type:touchend', 'curPointerClass:touch(#1)',
            'CHECKED:event.touches', 'NOT-FOUND-TOUCH(#1)',
            '</endListener>',

            '<endListener>', 'type:touchend', 'curPointerClass:touch(#1)',
            '<end>',
            'lastPointerXY:(' + X2 + ',' + Y2 + ')',
            '<endHandler>', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</endHandler>',
            'curPointerClass:null',
            '</end>',
            '</endListener>'
          ]);
        },
        // ====================================
        done
      ]);
    });

    it('start(#0) -> start(SAME-ELEMENT #1) -> end(#1) -> end(#0)', function(done) {
      var touch1, touch2;
      resetData();
      utils.intervalExec([
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X1,
            clientY: Y1
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch2 = new Touch({
            identifier: 1,
            target: div1,
            clientX: X2,
            clientY: Y2
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch2],
            targetTouches: [touch1, touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          utils.fireTouchEvent(div1, 'touchend', {
            changedTouches: [touch2],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          utils.fireTouchEvent(div1, 'touchend', {
            changedTouches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();
          expect(traceLog).toEqual([
            '<startListener>', 'type:touchstart', 'curPointerClass:null',
            '<startHandler>', 'div1', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
            '</startListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#0)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div1', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</startHandler>',
            'curPointerClass:touch(#1)', 'lastPointerXY:(' + X2 + ',' + Y2 + ')',
            '</startListener>',

            '<endListener>', 'type:touchend', 'curPointerClass:touch(#1)',
            '<end>',
            'lastPointerXY:(' + X2 + ',' + Y2 + ')',
            '<endHandler>', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</endHandler>',
            'curPointerClass:null',
            '</end>',
            '</endListener>',

            '<endListener>', 'type:touchend', 'curPointerClass:null', '</endListener>'
          ]);
        },
        // ====================================
        done
      ]);
    });

    it('start(#0) -> start(SAME-ELEMENT #1) -> end(ALL)', function(done) {
      var touch1, touch2;
      resetData();
      utils.intervalExec([
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X1,
            clientY: Y1
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch2 = new Touch({
            identifier: 1,
            target: div1,
            clientX: X2,
            clientY: Y2
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch2],
            targetTouches: [touch1, touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          utils.fireTouchEvent(div1, 'touchend', {
            changedTouches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();
          expect(traceLog).toEqual([
            '<startListener>', 'type:touchstart', 'curPointerClass:null',
            '<startHandler>', 'div1', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
            '</startListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#0)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div1', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</startHandler>',
            'curPointerClass:touch(#1)', 'lastPointerXY:(' + X2 + ',' + Y2 + ')',
            '</startListener>',

            '<endListener>', 'type:touchend', 'curPointerClass:touch(#1)',
            '<end>',
            'lastPointerXY:(' + X2 + ',' + Y2 + ')',
            '<endHandler>', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</endHandler>',
            'curPointerClass:null',
            '</end>',
            '</endListener>'
          ]);
        },
        // ====================================
        done
      ]);
    });

    it('start(#0) -> start(SAME-ELEMENT #1) -> cancel(ALL)', function(done) {
      var touch1, touch2;
      resetData();
      utils.intervalExec([
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X1,
            clientY: Y1
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch2 = new Touch({
            identifier: 1,
            target: div1,
            clientX: X2,
            clientY: Y2
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch2],
            targetTouches: [touch1, touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          // Only #0
          utils.fireTouchEvent(div1, 'touchcancel', {
            changedTouches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();
          expect(traceLog).toEqual([
            '<startListener>', 'type:touchstart', 'curPointerClass:null',
            '<startHandler>', 'div1', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
            '</startListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#0)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div1', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</startHandler>',
            'curPointerClass:touch(#1)', 'lastPointerXY:(' + X2 + ',' + Y2 + ')',
            '</startListener>',

            '<cancelListener>', 'type:touchcancel', 'curPointerClass:touch(#1)',
            'CHECKED:event.touches',
            '<cancel>',
            '<cancelHandler>', '</cancelHandler>',
            'curPointerClass:null',
            '</cancel>',
            '</cancelListener>'
          ]);
        },
        // ====================================
        done
      ]);
    });

    it('start(#0) -> start(SAME-ELEMENT #1) -> cancel(#0) -> cancel(#1)', function(done) {
      var touch1, touch2;
      resetData();
      utils.intervalExec([
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X1,
            clientY: Y1
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch2 = new Touch({
            identifier: 1,
            target: div1,
            clientX: X2,
            clientY: Y2
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch2],
            targetTouches: [touch1, touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          utils.fireTouchEvent(div1, 'touchcancel', {
            changedTouches: [touch1],
            targetTouches: [touch2],
            touches: [touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          utils.fireTouchEvent(div1, 'touchcancel', {
            changedTouches: [touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();
          expect(traceLog).toEqual([
            '<startListener>', 'type:touchstart', 'curPointerClass:null',
            '<startHandler>', 'div1', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
            '</startListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#0)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div1', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</startHandler>',
            'curPointerClass:touch(#1)', 'lastPointerXY:(' + X2 + ',' + Y2 + ')',
            '</startListener>',

            '<cancelListener>', 'type:touchcancel', 'curPointerClass:touch(#1)',
            'CHECKED:event.touches', 'NOT-FOUND-TOUCH(#1)',
            '</cancelListener>',

            '<cancelListener>', 'type:touchcancel', 'curPointerClass:touch(#1)',
            '<cancel>',
            '<cancelHandler>', '</cancelHandler>',
            'curPointerClass:null',
            '</cancel>',
            '</cancelListener>'
          ]);
        },
        // ====================================
        done
      ]);
    });

    it('start(#0) -> start(SAME-ELEMENT #1) -> cancel(#1) -> cancel(#0)', function(done) {
      var touch1, touch2;
      resetData();
      utils.intervalExec([
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X1,
            clientY: Y1
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch2 = new Touch({
            identifier: 1,
            target: div1,
            clientX: X2,
            clientY: Y2
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch2],
            targetTouches: [touch1, touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          utils.fireTouchEvent(div1, 'touchcancel', {
            changedTouches: [touch2],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          utils.fireTouchEvent(div1, 'touchcancel', {
            changedTouches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();
          expect(traceLog).toEqual([
            '<startListener>', 'type:touchstart', 'curPointerClass:null',
            '<startHandler>', 'div1', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
            '</startListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#0)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div1', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</startHandler>',
            'curPointerClass:touch(#1)', 'lastPointerXY:(' + X2 + ',' + Y2 + ')',
            '</startListener>',

            '<cancelListener>', 'type:touchcancel', 'curPointerClass:touch(#1)',
            '<cancel>',
            '<cancelHandler>', '</cancelHandler>',
            'curPointerClass:null',
            '</cancel>',
            '</cancelListener>',

            '<cancelListener>', 'type:touchcancel', 'curPointerClass:null', '</cancelListener>'
          ]);
        },
        // ====================================
        done
      ]);
    });

  });

  describe('Change target touch twice', function() {

    it('start(#0) -> start(#1) -> start(#2) -> move(#0) -> move(#1) -> move(#2)', function(done) {
      var touch1, touch2, touch3;
      resetData();
      utils.intervalExec([
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X1,
            clientY: Y1
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch2 = new Touch({
            identifier: 1,
            target: div2,
            clientX: X2,
            clientY: Y2
          });
          utils.fireTouchEvent(div2, 'touchstart', {
            changedTouches: [touch2],
            targetTouches: [touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          touch3 = new Touch({
            identifier: 2,
            target: div3,
            clientX: X3,
            clientY: Y3
          });
          utils.fireTouchEvent(div3, 'touchstart', {
            changedTouches: [touch3],
            targetTouches: [touch3],
            touches: [touch1, touch2, touch3]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(2);

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X4,
            clientY: Y4
          });
          utils.fireTouchEvent(div1, 'touchmove', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1, touch2, touch3]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(2);

          touch2 = new Touch({
            identifier: 1,
            target: div2,
            clientX: X5,
            clientY: Y5
          });
          utils.fireTouchEvent(div2, 'touchmove', {
            changedTouches: [touch2],
            targetTouches: [touch2],
            touches: [touch1, touch2, touch3]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(2);

          touch3 = new Touch({
            identifier: 2,
            target: div3,
            clientX: X6,
            clientY: Y6
          });
          utils.fireTouchEvent(div3, 'touchmove', {
            changedTouches: [touch3],
            targetTouches: [touch3],
            touches: [touch1, touch2, touch3]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(2);
          expect(traceLog).toEqual([
            '<startListener>', 'type:touchstart', 'curPointerClass:null',
            '<startHandler>', 'div1', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
            '</startListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#0)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div2', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</startHandler>',
            'curPointerClass:touch(#1)', 'lastPointerXY:(' + X2 + ',' + Y2 + ')',
            '</startListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#1)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div3', 'pointerXY:(' + X3 + ',' + Y3 + ')', '</startHandler>',
            'curPointerClass:touch(#2)', 'lastPointerXY:(' + X3 + ',' + Y3 + ')',
            '</startListener>',

            '<moveListener>', 'type:touchmove', 'curPointerClass:touch(#2)',
            'NOT-FOUND-TOUCH(#2)',
            '</moveListener>',

            '<moveListener>', 'type:touchmove', 'curPointerClass:touch(#2)',
            'NOT-FOUND-TOUCH(#2)',
            '</moveListener>',

            '<moveListener>', 'type:touchmove', 'curPointerClass:touch(#2)',
            '<move>',
            'lastPointerXY:(' + X6 + ',' + Y6 + ')',
            '<moveHandler>', 'pointerXY:(' + X6 + ',' + Y6 + ')', '</moveHandler>',
            '</move>',
            '</moveListener>'
          ]);
        },
        // ====================================
        done
      ]);
    });

    it('start(#0) -> start(#1) -> start(#2) -> move(#2) -> move(#1) -> move(#0)', function(done) {
      var touch1, touch2, touch3;
      resetData();
      utils.intervalExec([
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X1,
            clientY: Y1
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch2 = new Touch({
            identifier: 1,
            target: div2,
            clientX: X2,
            clientY: Y2
          });
          utils.fireTouchEvent(div2, 'touchstart', {
            changedTouches: [touch2],
            targetTouches: [touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          touch3 = new Touch({
            identifier: 2,
            target: div3,
            clientX: X3,
            clientY: Y3
          });
          utils.fireTouchEvent(div3, 'touchstart', {
            changedTouches: [touch3],
            targetTouches: [touch3],
            touches: [touch1, touch2, touch3]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(2);

          touch3 = new Touch({
            identifier: 2,
            target: div3,
            clientX: X4,
            clientY: Y4
          });
          utils.fireTouchEvent(div3, 'touchmove', {
            changedTouches: [touch3],
            targetTouches: [touch3],
            touches: [touch1, touch2, touch3]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(2);

          touch2 = new Touch({
            identifier: 1,
            target: div2,
            clientX: X5,
            clientY: Y5
          });
          utils.fireTouchEvent(div2, 'touchmove', {
            changedTouches: [touch2],
            targetTouches: [touch2],
            touches: [touch1, touch2, touch3]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(2);

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X6,
            clientY: Y6
          });
          utils.fireTouchEvent(div1, 'touchmove', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1, touch2, touch3]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(2);
          expect(traceLog).toEqual([
            '<startListener>', 'type:touchstart', 'curPointerClass:null',
            '<startHandler>', 'div1', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
            '</startListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#0)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div2', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</startHandler>',
            'curPointerClass:touch(#1)', 'lastPointerXY:(' + X2 + ',' + Y2 + ')',
            '</startListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#1)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div3', 'pointerXY:(' + X3 + ',' + Y3 + ')', '</startHandler>',
            'curPointerClass:touch(#2)', 'lastPointerXY:(' + X3 + ',' + Y3 + ')',
            '</startListener>',

            '<moveListener>', 'type:touchmove', 'curPointerClass:touch(#2)',
            '<move>',
            'lastPointerXY:(' + X4 + ',' + Y4 + ')',
            '<moveHandler>', 'pointerXY:(' + X4 + ',' + Y4 + ')', '</moveHandler>',
            '</move>',
            '</moveListener>',

            '<moveListener>', 'type:touchmove', 'curPointerClass:touch(#2)',
            'NOT-FOUND-TOUCH(#2)',
            '</moveListener>',

            '<moveListener>', 'type:touchmove', 'curPointerClass:touch(#2)',
            'NOT-FOUND-TOUCH(#2)',
            '</moveListener>'
          ]);
        },
        // ====================================
        done
      ]);
    });

    it('start(#0) -> start(#1) -> start(#2) -> move(ALL)', function(done) {
      var touch1, touch2, touch3;
      resetData();
      utils.intervalExec([
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X1,
            clientY: Y1
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch2 = new Touch({
            identifier: 1,
            target: div2,
            clientX: X2,
            clientY: Y2
          });
          utils.fireTouchEvent(div2, 'touchstart', {
            changedTouches: [touch2],
            targetTouches: [touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          touch3 = new Touch({
            identifier: 2,
            target: div3,
            clientX: X3,
            clientY: Y3
          });
          utils.fireTouchEvent(div3, 'touchstart', {
            changedTouches: [touch3],
            targetTouches: [touch3],
            touches: [touch1, touch2, touch3]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(2);

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X4,
            clientY: Y4
          });
          touch2 = new Touch({
            identifier: 1,
            target: div2,
            clientX: X5,
            clientY: Y5
          });
          touch3 = new Touch({
            identifier: 2,
            target: div3,
            clientX: X6,
            clientY: Y6
          });
          utils.fireTouchEvent(div1, 'touchmove', {
            changedTouches: [touch1, touch2, touch3],
            targetTouches: [touch1],
            touches: [touch1, touch2, touch3]
          });
          utils.fireTouchEvent(div2, 'touchmove', {
            changedTouches: [touch1, touch2, touch3],
            targetTouches: [touch2],
            touches: [touch1, touch2, touch3]
          });
          utils.fireTouchEvent(div3, 'touchmove', {
            changedTouches: [touch1, touch2, touch3],
            targetTouches: [touch3],
            touches: [touch1, touch2, touch3]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(2);
          expect(traceLog).toEqual([
            '<startListener>', 'type:touchstart', 'curPointerClass:null',
            '<startHandler>', 'div1', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
            '</startListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#0)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div2', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</startHandler>',
            'curPointerClass:touch(#1)', 'lastPointerXY:(' + X2 + ',' + Y2 + ')',
            '</startListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#1)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div3', 'pointerXY:(' + X3 + ',' + Y3 + ')', '</startHandler>',
            'curPointerClass:touch(#2)', 'lastPointerXY:(' + X3 + ',' + Y3 + ')',
            '</startListener>',

            '<moveListener>', 'type:touchmove', 'curPointerClass:touch(#2)',
            '<move>',
            'lastPointerXY:(' + X6 + ',' + Y6 + ')',
            '<moveHandler>', 'pointerXY:(' + X6 + ',' + Y6 + ')', '</moveHandler>',
            '</move>',
            '</moveListener>',

            '<moveListener>', 'type:touchmove', 'curPointerClass:touch(#2)',
            'NOT-CHANGED',
            '</moveListener>',

            '<moveListener>', 'type:touchmove', 'curPointerClass:touch(#2)',
            'NOT-CHANGED',
            '</moveListener>'
          ]);
        },
        // ====================================
        done
      ]);
    });

    it('start(#0) -> start(#1) -> start(#2) -> end(#0) -> end(#1) -> end(#2)', function(done) {
      var touch1, touch2, touch3;
      resetData();
      utils.intervalExec([
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X1,
            clientY: Y1
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch2 = new Touch({
            identifier: 1,
            target: div2,
            clientX: X2,
            clientY: Y2
          });
          utils.fireTouchEvent(div2, 'touchstart', {
            changedTouches: [touch2],
            targetTouches: [touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          touch3 = new Touch({
            identifier: 2,
            target: div3,
            clientX: X3,
            clientY: Y3
          });
          utils.fireTouchEvent(div3, 'touchstart', {
            changedTouches: [touch3],
            targetTouches: [touch3],
            touches: [touch1, touch2, touch3]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(2);

          utils.fireTouchEvent(div1, 'touchend', {
            changedTouches: [touch1],
            touches: [touch2, touch3]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(2);

          utils.fireTouchEvent(div2, 'touchend', {
            changedTouches: [touch2],
            touches: [touch3]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(2);

          utils.fireTouchEvent(div3, 'touchend', {
            changedTouches: [touch3]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();
          expect(traceLog).toEqual([
            '<startListener>', 'type:touchstart', 'curPointerClass:null',
            '<startHandler>', 'div1', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
            '</startListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#0)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div2', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</startHandler>',
            'curPointerClass:touch(#1)', 'lastPointerXY:(' + X2 + ',' + Y2 + ')',
            '</startListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#1)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div3', 'pointerXY:(' + X3 + ',' + Y3 + ')', '</startHandler>',
            'curPointerClass:touch(#2)', 'lastPointerXY:(' + X3 + ',' + Y3 + ')',
            '</startListener>',

            '<endListener>', 'type:touchend', 'curPointerClass:touch(#2)',
            'CHECKED:event.touches', 'NOT-FOUND-TOUCH(#2)',
            '</endListener>',

            '<endListener>', 'type:touchend', 'curPointerClass:touch(#2)',
            'CHECKED:event.touches', 'NOT-FOUND-TOUCH(#2)',
            '</endListener>',

            '<endListener>', 'type:touchend', 'curPointerClass:touch(#2)',
            '<end>',
            'lastPointerXY:(' + X3 + ',' + Y3 + ')',
            '<endHandler>', 'pointerXY:(' + X3 + ',' + Y3 + ')', '</endHandler>',
            'curPointerClass:null',
            '</end>',
            '</endListener>'
          ]);
        },
        // ====================================
        done
      ]);
    });

    it('start(#0) -> start(#1) -> start(#2) -> end(#2) -> end(#1) -> end(#0)', function(done) {
      var touch1, touch2, touch3;
      resetData();
      utils.intervalExec([
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X1,
            clientY: Y1
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch2 = new Touch({
            identifier: 1,
            target: div2,
            clientX: X2,
            clientY: Y2
          });
          utils.fireTouchEvent(div2, 'touchstart', {
            changedTouches: [touch2],
            targetTouches: [touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          touch3 = new Touch({
            identifier: 2,
            target: div3,
            clientX: X3,
            clientY: Y3
          });
          utils.fireTouchEvent(div3, 'touchstart', {
            changedTouches: [touch3],
            targetTouches: [touch3],
            touches: [touch1, touch2, touch3]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(2);

          utils.fireTouchEvent(div3, 'touchend', {
            changedTouches: [touch3],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          utils.fireTouchEvent(div2, 'touchend', {
            changedTouches: [touch2],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          utils.fireTouchEvent(div1, 'touchend', {
            changedTouches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();
          expect(traceLog).toEqual([
            '<startListener>', 'type:touchstart', 'curPointerClass:null',
            '<startHandler>', 'div1', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
            '</startListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#0)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div2', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</startHandler>',
            'curPointerClass:touch(#1)', 'lastPointerXY:(' + X2 + ',' + Y2 + ')',
            '</startListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#1)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div3', 'pointerXY:(' + X3 + ',' + Y3 + ')', '</startHandler>',
            'curPointerClass:touch(#2)', 'lastPointerXY:(' + X3 + ',' + Y3 + ')',
            '</startListener>',

            '<endListener>', 'type:touchend', 'curPointerClass:touch(#2)',
            '<end>',
            'lastPointerXY:(' + X3 + ',' + Y3 + ')',
            '<endHandler>', 'pointerXY:(' + X3 + ',' + Y3 + ')', '</endHandler>',
            'curPointerClass:null',
            '</end>',
            '</endListener>',

            '<endListener>', 'type:touchend', 'curPointerClass:null', '</endListener>',

            '<endListener>', 'type:touchend', 'curPointerClass:null', '</endListener>'
          ]);
        },
        // ====================================
        done
      ]);
    });

    it('start(#0) -> start(#1) -> start(#2) -> end(ALL)', function(done) {
      var touch1, touch2, touch3;
      resetData();
      utils.intervalExec([
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X1,
            clientY: Y1
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch2 = new Touch({
            identifier: 1,
            target: div2,
            clientX: X2,
            clientY: Y2
          });
          utils.fireTouchEvent(div2, 'touchstart', {
            changedTouches: [touch2],
            targetTouches: [touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          touch3 = new Touch({
            identifier: 2,
            target: div3,
            clientX: X3,
            clientY: Y3
          });
          utils.fireTouchEvent(div3, 'touchstart', {
            changedTouches: [touch3],
            targetTouches: [touch3],
            touches: [touch1, touch2, touch3]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(2);

          utils.fireTouchEvent(div1, 'touchend', {
            changedTouches: [touch1, touch2, touch3]
          });
          utils.fireTouchEvent(div2, 'touchend', {
            changedTouches: [touch1, touch2, touch3]
          });
          utils.fireTouchEvent(div3, 'touchend', {
            changedTouches: [touch1, touch2, touch3]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();
          expect(traceLog).toEqual([
            '<startListener>', 'type:touchstart', 'curPointerClass:null',
            '<startHandler>', 'div1', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
            '</startListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#0)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div2', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</startHandler>',
            'curPointerClass:touch(#1)', 'lastPointerXY:(' + X2 + ',' + Y2 + ')',
            '</startListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#1)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div3', 'pointerXY:(' + X3 + ',' + Y3 + ')', '</startHandler>',
            'curPointerClass:touch(#2)', 'lastPointerXY:(' + X3 + ',' + Y3 + ')',
            '</startListener>',

            '<endListener>', 'type:touchend', 'curPointerClass:touch(#2)',
            '<end>',
            'lastPointerXY:(' + X3 + ',' + Y3 + ')',
            '<endHandler>', 'pointerXY:(' + X3 + ',' + Y3 + ')', '</endHandler>',
            'curPointerClass:null',
            '</end>',
            '</endListener>',

            '<endListener>', 'type:touchend', 'curPointerClass:null', '</endListener>',

            '<endListener>', 'type:touchend', 'curPointerClass:null', '</endListener>'
          ]);
        },
        // ====================================
        done
      ]);
    });

    it('start(#0) -> start(#1) -> start(#2) -> cancel(ALL)', function(done) {
      var touch1, touch2, touch3;
      resetData();
      utils.intervalExec([
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X1,
            clientY: Y1
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch2 = new Touch({
            identifier: 1,
            target: div2,
            clientX: X2,
            clientY: Y2
          });
          utils.fireTouchEvent(div2, 'touchstart', {
            changedTouches: [touch2],
            targetTouches: [touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          touch3 = new Touch({
            identifier: 2,
            target: div3,
            clientX: X3,
            clientY: Y3
          });
          utils.fireTouchEvent(div3, 'touchstart', {
            changedTouches: [touch3],
            targetTouches: [touch3],
            touches: [touch1, touch2, touch3]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(2);

          // Only #0
          utils.fireTouchEvent(div1, 'touchcancel', {
            changedTouches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();
          expect(traceLog).toEqual([
            '<startListener>', 'type:touchstart', 'curPointerClass:null',
            '<startHandler>', 'div1', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
            '</startListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#0)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div2', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</startHandler>',
            'curPointerClass:touch(#1)', 'lastPointerXY:(' + X2 + ',' + Y2 + ')',
            '</startListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#1)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div3', 'pointerXY:(' + X3 + ',' + Y3 + ')', '</startHandler>',
            'curPointerClass:touch(#2)', 'lastPointerXY:(' + X3 + ',' + Y3 + ')',
            '</startListener>',

            '<cancelListener>', 'type:touchcancel', 'curPointerClass:touch(#2)',
            'CHECKED:event.touches',
            '<cancel>',
            '<cancelHandler>', '</cancelHandler>',
            'curPointerClass:null',
            '</cancel>',
            '</cancelListener>'
          ]);
        },
        // ====================================
        done
      ]);
    });

    it('start(#0) -> start(#1) -> start(#2) -> cancel(#0) -> cancel(#1) -> cancel(#2)', function(done) {
      var touch1, touch2, touch3;
      resetData();
      utils.intervalExec([
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X1,
            clientY: Y1
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch2 = new Touch({
            identifier: 1,
            target: div2,
            clientX: X2,
            clientY: Y2
          });
          utils.fireTouchEvent(div2, 'touchstart', {
            changedTouches: [touch2],
            targetTouches: [touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          touch3 = new Touch({
            identifier: 2,
            target: div3,
            clientX: X3,
            clientY: Y3
          });
          utils.fireTouchEvent(div3, 'touchstart', {
            changedTouches: [touch3],
            targetTouches: [touch3],
            touches: [touch1, touch2, touch3]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(2);

          utils.fireTouchEvent(div1, 'touchcancel', {
            changedTouches: [touch1],
            touches: [touch2, touch3]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(2);

          utils.fireTouchEvent(div2, 'touchcancel', {
            changedTouches: [touch2],
            touches: [touch3]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(2);

          utils.fireTouchEvent(div3, 'touchcancel', {
            changedTouches: [touch3]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();
          expect(traceLog).toEqual([
            '<startListener>', 'type:touchstart', 'curPointerClass:null',
            '<startHandler>', 'div1', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
            '</startListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#0)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div2', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</startHandler>',
            'curPointerClass:touch(#1)', 'lastPointerXY:(' + X2 + ',' + Y2 + ')',
            '</startListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#1)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div3', 'pointerXY:(' + X3 + ',' + Y3 + ')', '</startHandler>',
            'curPointerClass:touch(#2)', 'lastPointerXY:(' + X3 + ',' + Y3 + ')',
            '</startListener>',

            '<cancelListener>', 'type:touchcancel', 'curPointerClass:touch(#2)',
            'CHECKED:event.touches', 'NOT-FOUND-TOUCH(#2)',
            '</cancelListener>',

            '<cancelListener>', 'type:touchcancel', 'curPointerClass:touch(#2)',
            'CHECKED:event.touches', 'NOT-FOUND-TOUCH(#2)',
            '</cancelListener>',

            '<cancelListener>', 'type:touchcancel', 'curPointerClass:touch(#2)',
            '<cancel>',
            '<cancelHandler>', '</cancelHandler>',
            'curPointerClass:null',
            '</cancel>',
            '</cancelListener>'
          ]);
        },
        // ====================================
        done
      ]);
    });

    it('start(#0) -> start(#1) -> start(#2) -> cancel(#2) -> cancel(#1) -> cancel(#0)', function(done) {
      var touch1, touch2, touch3;
      resetData();
      utils.intervalExec([
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X1,
            clientY: Y1
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch2 = new Touch({
            identifier: 1,
            target: div2,
            clientX: X2,
            clientY: Y2
          });
          utils.fireTouchEvent(div2, 'touchstart', {
            changedTouches: [touch2],
            targetTouches: [touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          touch3 = new Touch({
            identifier: 2,
            target: div3,
            clientX: X3,
            clientY: Y3
          });
          utils.fireTouchEvent(div3, 'touchstart', {
            changedTouches: [touch3],
            targetTouches: [touch3],
            touches: [touch1, touch2, touch3]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(2);

          utils.fireTouchEvent(div3, 'touchcancel', {
            changedTouches: [touch3],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          utils.fireTouchEvent(div2, 'touchcancel', {
            changedTouches: [touch2],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          utils.fireTouchEvent(div1, 'touchcancel', {
            changedTouches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();
          expect(traceLog).toEqual([
            '<startListener>', 'type:touchstart', 'curPointerClass:null',
            '<startHandler>', 'div1', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
            '</startListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#0)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div2', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</startHandler>',
            'curPointerClass:touch(#1)', 'lastPointerXY:(' + X2 + ',' + Y2 + ')',
            '</startListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#1)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div3', 'pointerXY:(' + X3 + ',' + Y3 + ')', '</startHandler>',
            'curPointerClass:touch(#2)', 'lastPointerXY:(' + X3 + ',' + Y3 + ')',
            '</startListener>',

            '<cancelListener>', 'type:touchcancel', 'curPointerClass:touch(#2)',
            '<cancel>',
            '<cancelHandler>', '</cancelHandler>',
            'curPointerClass:null',
            '</cancel>',
            '</cancelListener>',

            '<cancelListener>', 'type:touchcancel', 'curPointerClass:null', '</cancelListener>',

            '<cancelListener>', 'type:touchcancel', 'curPointerClass:null', '</cancelListener>'
          ]);
        },
        // ====================================
        done
      ]);
    });

  });

  describe('Change target touch twice in same element', function() {

    it('start(#0) -> start(SAME-ELEMENT #1) -> start(#2) -> move(#0) -> move(#1) -> move(#2)', function(done) {
      var touch1, touch2, touch3;
      resetData();
      utils.intervalExec([
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X1,
            clientY: Y1
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch2 = new Touch({
            identifier: 1,
            target: div1,
            clientX: X2,
            clientY: Y2
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch2],
            targetTouches: [touch1, touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          touch3 = new Touch({
            identifier: 2,
            target: div2,
            clientX: X3,
            clientY: Y3
          });
          utils.fireTouchEvent(div2, 'touchstart', {
            changedTouches: [touch3],
            targetTouches: [touch3],
            touches: [touch1, touch2, touch3]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(2);

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X4,
            clientY: Y4
          });
          utils.fireTouchEvent(div1, 'touchmove', {
            changedTouches: [touch1],
            targetTouches: [touch1, touch2],
            touches: [touch1, touch2, touch3]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(2);

          touch2 = new Touch({
            identifier: 1,
            target: div1,
            clientX: X5,
            clientY: Y5
          });
          utils.fireTouchEvent(div1, 'touchmove', {
            changedTouches: [touch2],
            targetTouches: [touch1, touch2],
            touches: [touch1, touch2, touch3]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(2);

          touch3 = new Touch({
            identifier: 2,
            target: div2,
            clientX: X6,
            clientY: Y6
          });
          utils.fireTouchEvent(div2, 'touchmove', {
            changedTouches: [touch3],
            targetTouches: [touch3],
            touches: [touch1, touch2, touch3]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(2);
          expect(traceLog).toEqual([
            '<startListener>', 'type:touchstart', 'curPointerClass:null',
            '<startHandler>', 'div1', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
            '</startListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#0)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div1', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</startHandler>',
            'curPointerClass:touch(#1)', 'lastPointerXY:(' + X2 + ',' + Y2 + ')',
            '</startListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#1)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div2', 'pointerXY:(' + X3 + ',' + Y3 + ')', '</startHandler>',
            'curPointerClass:touch(#2)', 'lastPointerXY:(' + X3 + ',' + Y3 + ')',
            '</startListener>',

            '<moveListener>', 'type:touchmove', 'curPointerClass:touch(#2)',
            'NOT-FOUND-TOUCH(#2)',
            '</moveListener>',

            '<moveListener>', 'type:touchmove', 'curPointerClass:touch(#2)',
            'NOT-FOUND-TOUCH(#2)',
            '</moveListener>',

            '<moveListener>', 'type:touchmove', 'curPointerClass:touch(#2)',
            '<move>',
            'lastPointerXY:(' + X6 + ',' + Y6 + ')',
            '<moveHandler>', 'pointerXY:(' + X6 + ',' + Y6 + ')', '</moveHandler>',
            '</move>',
            '</moveListener>'
          ]);
        },
        // ====================================
        done
      ]);
    });

    it('start(#0) -> start(SAME-ELEMENT #1) -> start(#2) -> move(#2) -> move(#1) -> move(#0)', function(done) {
      var touch1, touch2, touch3;
      resetData();
      utils.intervalExec([
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X1,
            clientY: Y1
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch2 = new Touch({
            identifier: 1,
            target: div1,
            clientX: X2,
            clientY: Y2
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch2],
            targetTouches: [touch1, touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          touch3 = new Touch({
            identifier: 2,
            target: div2,
            clientX: X3,
            clientY: Y3
          });
          utils.fireTouchEvent(div2, 'touchstart', {
            changedTouches: [touch3],
            targetTouches: [touch3],
            touches: [touch1, touch2, touch3]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(2);

          touch3 = new Touch({
            identifier: 2,
            target: div2,
            clientX: X4,
            clientY: Y4
          });
          utils.fireTouchEvent(div2, 'touchmove', {
            changedTouches: [touch3],
            targetTouches: [touch3],
            touches: [touch1, touch2, touch3]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(2);

          touch2 = new Touch({
            identifier: 1,
            target: div1,
            clientX: X5,
            clientY: Y5
          });
          utils.fireTouchEvent(div1, 'touchmove', {
            changedTouches: [touch2],
            targetTouches: [touch1, touch2],
            touches: [touch1, touch2, touch3]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(2);

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X6,
            clientY: Y6
          });
          utils.fireTouchEvent(div1, 'touchmove', {
            changedTouches: [touch1],
            targetTouches: [touch1, touch2],
            touches: [touch1, touch2, touch3]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(2);
          expect(traceLog).toEqual([
            '<startListener>', 'type:touchstart', 'curPointerClass:null',
            '<startHandler>', 'div1', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
            '</startListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#0)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div1', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</startHandler>',
            'curPointerClass:touch(#1)', 'lastPointerXY:(' + X2 + ',' + Y2 + ')',
            '</startListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#1)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div2', 'pointerXY:(' + X3 + ',' + Y3 + ')', '</startHandler>',
            'curPointerClass:touch(#2)', 'lastPointerXY:(' + X3 + ',' + Y3 + ')',
            '</startListener>',

            '<moveListener>', 'type:touchmove', 'curPointerClass:touch(#2)',
            '<move>',
            'lastPointerXY:(' + X4 + ',' + Y4 + ')',
            '<moveHandler>', 'pointerXY:(' + X4 + ',' + Y4 + ')', '</moveHandler>',
            '</move>',
            '</moveListener>',

            '<moveListener>', 'type:touchmove', 'curPointerClass:touch(#2)',
            'NOT-FOUND-TOUCH(#2)',
            '</moveListener>',

            '<moveListener>', 'type:touchmove', 'curPointerClass:touch(#2)',
            'NOT-FOUND-TOUCH(#2)',
            '</moveListener>'
          ]);
        },
        // ====================================
        done
      ]);
    });

    it('start(#0) -> start(SAME-ELEMENT #1) -> start(#2) -> move(ALL)', function(done) {
      var touch1, touch2, touch3;
      resetData();
      utils.intervalExec([
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X1,
            clientY: Y1
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch2 = new Touch({
            identifier: 1,
            target: div1,
            clientX: X2,
            clientY: Y2
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch2],
            targetTouches: [touch1, touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          touch3 = new Touch({
            identifier: 2,
            target: div2,
            clientX: X3,
            clientY: Y3
          });
          utils.fireTouchEvent(div2, 'touchstart', {
            changedTouches: [touch3],
            targetTouches: [touch3],
            touches: [touch1, touch2, touch3]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(2);

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X4,
            clientY: Y4
          });
          touch2 = new Touch({
            identifier: 1,
            target: div1,
            clientX: X5,
            clientY: Y5
          });
          touch3 = new Touch({
            identifier: 2,
            target: div2,
            clientX: X6,
            clientY: Y6
          });
          utils.fireTouchEvent(div1, 'touchmove', {
            changedTouches: [touch1, touch2, touch3],
            targetTouches: [touch1, touch2],
            touches: [touch1, touch2, touch3]
          });
          utils.fireTouchEvent(div2, 'touchmove', {
            changedTouches: [touch1, touch2, touch3],
            targetTouches: [touch3],
            touches: [touch1, touch2, touch3]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(2);
          expect(traceLog).toEqual([
            '<startListener>', 'type:touchstart', 'curPointerClass:null',
            '<startHandler>', 'div1', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
            '</startListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#0)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div1', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</startHandler>',
            'curPointerClass:touch(#1)', 'lastPointerXY:(' + X2 + ',' + Y2 + ')',
            '</startListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#1)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div2', 'pointerXY:(' + X3 + ',' + Y3 + ')', '</startHandler>',
            'curPointerClass:touch(#2)', 'lastPointerXY:(' + X3 + ',' + Y3 + ')',
            '</startListener>',

            '<moveListener>', 'type:touchmove', 'curPointerClass:touch(#2)',
            '<move>',
            'lastPointerXY:(' + X6 + ',' + Y6 + ')',
            '<moveHandler>', 'pointerXY:(' + X6 + ',' + Y6 + ')', '</moveHandler>',
            '</move>',
            '</moveListener>',

            '<moveListener>', 'type:touchmove', 'curPointerClass:touch(#2)',
            'NOT-CHANGED',
            '</moveListener>'
          ]);
        },
        // ====================================
        done
      ]);
    });

    it('start(#0) -> start(SAME-ELEMENT #1) -> start(#2) -> end(#0) -> end(#1) -> end(#2)', function(done) {
      var touch1, touch2, touch3;
      resetData();
      utils.intervalExec([
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X1,
            clientY: Y1
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch2 = new Touch({
            identifier: 1,
            target: div1,
            clientX: X2,
            clientY: Y2
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch2],
            targetTouches: [touch1, touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          touch3 = new Touch({
            identifier: 2,
            target: div2,
            clientX: X3,
            clientY: Y3
          });
          utils.fireTouchEvent(div2, 'touchstart', {
            changedTouches: [touch3],
            targetTouches: [touch3],
            touches: [touch1, touch2, touch3]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(2);

          utils.fireTouchEvent(div1, 'touchend', {
            changedTouches: [touch1],
            targetTouches: [touch2],
            touches: [touch2, touch3]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(2);

          utils.fireTouchEvent(div1, 'touchend', {
            changedTouches: [touch2],
            touches: [touch3]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(2);

          utils.fireTouchEvent(div2, 'touchend', {
            changedTouches: [touch3]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();
          expect(traceLog).toEqual([
            '<startListener>', 'type:touchstart', 'curPointerClass:null',
            '<startHandler>', 'div1', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
            '</startListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#0)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div1', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</startHandler>',
            'curPointerClass:touch(#1)', 'lastPointerXY:(' + X2 + ',' + Y2 + ')',
            '</startListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#1)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div2', 'pointerXY:(' + X3 + ',' + Y3 + ')', '</startHandler>',
            'curPointerClass:touch(#2)', 'lastPointerXY:(' + X3 + ',' + Y3 + ')',
            '</startListener>',

            '<endListener>', 'type:touchend', 'curPointerClass:touch(#2)',
            'CHECKED:event.touches', 'NOT-FOUND-TOUCH(#2)',
            '</endListener>',

            '<endListener>', 'type:touchend', 'curPointerClass:touch(#2)',
            'CHECKED:event.touches', 'NOT-FOUND-TOUCH(#2)',
            '</endListener>',

            '<endListener>', 'type:touchend', 'curPointerClass:touch(#2)',
            '<end>',
            'lastPointerXY:(' + X3 + ',' + Y3 + ')',
            '<endHandler>', 'pointerXY:(' + X3 + ',' + Y3 + ')', '</endHandler>',
            'curPointerClass:null',
            '</end>',
            '</endListener>'
          ]);
        },
        // ====================================
        done
      ]);
    });

    it('start(#0) -> start(SAME-ELEMENT #1) -> start(#2) -> end(#2) -> end(#1) -> end(#0)', function(done) {
      var touch1, touch2, touch3;
      resetData();
      utils.intervalExec([
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X1,
            clientY: Y1
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch2 = new Touch({
            identifier: 1,
            target: div1,
            clientX: X2,
            clientY: Y2
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch2],
            targetTouches: [touch1, touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          touch3 = new Touch({
            identifier: 2,
            target: div2,
            clientX: X3,
            clientY: Y3
          });
          utils.fireTouchEvent(div2, 'touchstart', {
            changedTouches: [touch3],
            targetTouches: [touch3],
            touches: [touch1, touch2, touch3]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(2);

          utils.fireTouchEvent(div2, 'touchend', {
            changedTouches: [touch3],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          utils.fireTouchEvent(div1, 'touchend', {
            changedTouches: [touch2],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          utils.fireTouchEvent(div1, 'touchend', {
            changedTouches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();
          expect(traceLog).toEqual([
            '<startListener>', 'type:touchstart', 'curPointerClass:null',
            '<startHandler>', 'div1', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
            '</startListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#0)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div1', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</startHandler>',
            'curPointerClass:touch(#1)', 'lastPointerXY:(' + X2 + ',' + Y2 + ')',
            '</startListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#1)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div2', 'pointerXY:(' + X3 + ',' + Y3 + ')', '</startHandler>',
            'curPointerClass:touch(#2)', 'lastPointerXY:(' + X3 + ',' + Y3 + ')',
            '</startListener>',

            '<endListener>', 'type:touchend', 'curPointerClass:touch(#2)',
            '<end>',
            'lastPointerXY:(' + X3 + ',' + Y3 + ')',
            '<endHandler>', 'pointerXY:(' + X3 + ',' + Y3 + ')', '</endHandler>',
            'curPointerClass:null',
            '</end>',
            '</endListener>',

            '<endListener>', 'type:touchend', 'curPointerClass:null', '</endListener>',

            '<endListener>', 'type:touchend', 'curPointerClass:null', '</endListener>'
          ]);
        },
        // ====================================
        done
      ]);
    });

    it('start(#0) -> start(SAME-ELEMENT #1) -> start(#2) -> end(ALL)', function(done) {
      var touch1, touch2, touch3;
      resetData();
      utils.intervalExec([
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X1,
            clientY: Y1
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch2 = new Touch({
            identifier: 1,
            target: div1,
            clientX: X2,
            clientY: Y2
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch2],
            targetTouches: [touch1, touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          touch3 = new Touch({
            identifier: 2,
            target: div2,
            clientX: X3,
            clientY: Y3
          });
          utils.fireTouchEvent(div2, 'touchstart', {
            changedTouches: [touch3],
            targetTouches: [touch3],
            touches: [touch1, touch2, touch3]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(2);

          utils.fireTouchEvent(div1, 'touchend', {
            changedTouches: [touch1, touch2, touch3]
          });
          utils.fireTouchEvent(div2, 'touchend', {
            changedTouches: [touch1, touch2, touch3]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();
          expect(traceLog).toEqual([
            '<startListener>', 'type:touchstart', 'curPointerClass:null',
            '<startHandler>', 'div1', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
            '</startListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#0)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div1', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</startHandler>',
            'curPointerClass:touch(#1)', 'lastPointerXY:(' + X2 + ',' + Y2 + ')',
            '</startListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#1)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div2', 'pointerXY:(' + X3 + ',' + Y3 + ')', '</startHandler>',
            'curPointerClass:touch(#2)', 'lastPointerXY:(' + X3 + ',' + Y3 + ')',
            '</startListener>',

            '<endListener>', 'type:touchend', 'curPointerClass:touch(#2)',
            '<end>',
            'lastPointerXY:(' + X3 + ',' + Y3 + ')',
            '<endHandler>', 'pointerXY:(' + X3 + ',' + Y3 + ')', '</endHandler>',
            'curPointerClass:null',
            '</end>',
            '</endListener>',

            '<endListener>', 'type:touchend', 'curPointerClass:null', '</endListener>'
          ]);
        },
        // ====================================
        done
      ]);
    });

    it('start(#0) -> start(SAME-ELEMENT #1) -> start(#2) -> cancel(ALL)', function(done) {
      var touch1, touch2, touch3;
      resetData();
      utils.intervalExec([
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X1,
            clientY: Y1
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch2 = new Touch({
            identifier: 1,
            target: div1,
            clientX: X2,
            clientY: Y2
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch2],
            targetTouches: [touch1, touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          touch3 = new Touch({
            identifier: 2,
            target: div2,
            clientX: X3,
            clientY: Y3
          });
          utils.fireTouchEvent(div2, 'touchstart', {
            changedTouches: [touch3],
            targetTouches: [touch3],
            touches: [touch1, touch2, touch3]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(2);

          // Only #0
          utils.fireTouchEvent(div1, 'touchcancel', {
            changedTouches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();
          expect(traceLog).toEqual([
            '<startListener>', 'type:touchstart', 'curPointerClass:null',
            '<startHandler>', 'div1', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
            '</startListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#0)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div1', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</startHandler>',
            'curPointerClass:touch(#1)', 'lastPointerXY:(' + X2 + ',' + Y2 + ')',
            '</startListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#1)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div2', 'pointerXY:(' + X3 + ',' + Y3 + ')', '</startHandler>',
            'curPointerClass:touch(#2)', 'lastPointerXY:(' + X3 + ',' + Y3 + ')',
            '</startListener>',

            '<cancelListener>', 'type:touchcancel', 'curPointerClass:touch(#2)',
            'CHECKED:event.touches',
            '<cancel>',
            '<cancelHandler>', '</cancelHandler>',
            'curPointerClass:null',
            '</cancel>',
            '</cancelListener>'
          ]);
        },
        // ====================================
        done
      ]);
    });

    it('start(#0) -> start(SAME-ELEMENT #1) -> start(#2) -> cancel(#0) -> cancel(#1) -> cancel(#2)', function(done) {
      var touch1, touch2, touch3;
      resetData();
      utils.intervalExec([
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X1,
            clientY: Y1
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch2 = new Touch({
            identifier: 1,
            target: div1,
            clientX: X2,
            clientY: Y2
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch2],
            targetTouches: [touch1, touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          touch3 = new Touch({
            identifier: 2,
            target: div2,
            clientX: X3,
            clientY: Y3
          });
          utils.fireTouchEvent(div2, 'touchstart', {
            changedTouches: [touch3],
            targetTouches: [touch3],
            touches: [touch1, touch2, touch3]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(2);

          utils.fireTouchEvent(div1, 'touchcancel', {
            changedTouches: [touch1],
            targetTouches: [touch2],
            touches: [touch2, touch3]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(2);

          utils.fireTouchEvent(div1, 'touchcancel', {
            changedTouches: [touch2],
            touches: [touch3]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(2);

          utils.fireTouchEvent(div2, 'touchcancel', {
            changedTouches: [touch3]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();
          expect(traceLog).toEqual([
            '<startListener>', 'type:touchstart', 'curPointerClass:null',
            '<startHandler>', 'div1', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
            '</startListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#0)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div1', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</startHandler>',
            'curPointerClass:touch(#1)', 'lastPointerXY:(' + X2 + ',' + Y2 + ')',
            '</startListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#1)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div2', 'pointerXY:(' + X3 + ',' + Y3 + ')', '</startHandler>',
            'curPointerClass:touch(#2)', 'lastPointerXY:(' + X3 + ',' + Y3 + ')',
            '</startListener>',

            '<cancelListener>', 'type:touchcancel', 'curPointerClass:touch(#2)',
            'CHECKED:event.touches', 'NOT-FOUND-TOUCH(#2)',
            '</cancelListener>',

            '<cancelListener>', 'type:touchcancel', 'curPointerClass:touch(#2)',
            'CHECKED:event.touches', 'NOT-FOUND-TOUCH(#2)',
            '</cancelListener>',

            '<cancelListener>', 'type:touchcancel', 'curPointerClass:touch(#2)',
            '<cancel>',
            '<cancelHandler>', '</cancelHandler>',
            'curPointerClass:null',
            '</cancel>',
            '</cancelListener>'
          ]);
        },
        // ====================================
        done
      ]);
    });

    it('start(#0) -> start(SAME-ELEMENT #1) -> start(#2) -> cancel(#2) -> cancel(#1) -> cancel(#0)', function(done) {
      var touch1, touch2, touch3;
      resetData();
      utils.intervalExec([
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X1,
            clientY: Y1
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch2 = new Touch({
            identifier: 1,
            target: div1,
            clientX: X2,
            clientY: Y2
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch2],
            targetTouches: [touch1, touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          touch3 = new Touch({
            identifier: 2,
            target: div2,
            clientX: X3,
            clientY: Y3
          });
          utils.fireTouchEvent(div2, 'touchstart', {
            changedTouches: [touch3],
            targetTouches: [touch3],
            touches: [touch1, touch2, touch3]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(2);

          utils.fireTouchEvent(div2, 'touchcancel', {
            changedTouches: [touch3],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          utils.fireTouchEvent(div1, 'touchcancel', {
            changedTouches: [touch2],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          utils.fireTouchEvent(div1, 'touchcancel', {
            changedTouches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();
          expect(traceLog).toEqual([
            '<startListener>', 'type:touchstart', 'curPointerClass:null',
            '<startHandler>', 'div1', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
            '</startListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#0)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div1', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</startHandler>',
            'curPointerClass:touch(#1)', 'lastPointerXY:(' + X2 + ',' + Y2 + ')',
            '</startListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#1)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div2', 'pointerXY:(' + X3 + ',' + Y3 + ')', '</startHandler>',
            'curPointerClass:touch(#2)', 'lastPointerXY:(' + X3 + ',' + Y3 + ')',
            '</startListener>',

            '<cancelListener>', 'type:touchcancel', 'curPointerClass:touch(#2)',
            '<cancel>',
            '<cancelHandler>', '</cancelHandler>',
            'curPointerClass:null',
            '</cancel>',
            '</cancelListener>',

            '<cancelListener>', 'type:touchcancel', 'curPointerClass:null', '</cancelListener>',

            '<cancelListener>', 'type:touchcancel', 'curPointerClass:null', '</cancelListener>'
          ]);
        },
        // ====================================
        done
      ]);
    });

  });

  describe('Re-used ID', function() {

    it('start(#0) -> start(#1) -> end(#0) -> start(#0\') -> move(#1) -> move(#0\')', function(done) {
      var touch1, touch2, touch3;
      resetData();
      utils.intervalExec([
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X1,
            clientY: Y1
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch2 = new Touch({
            identifier: 1,
            target: div2,
            clientX: X2,
            clientY: Y2
          });
          utils.fireTouchEvent(div2, 'touchstart', {
            changedTouches: [touch2],
            targetTouches: [touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          utils.fireTouchEvent(div1, 'touchend', {
            changedTouches: [touch1],
            touches: [touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          touch3 = new Touch({
            identifier: 0,
            target: div3,
            clientX: X3,
            clientY: Y3
          });
          utils.fireTouchEvent(div3, 'touchstart', {
            changedTouches: [touch3],
            targetTouches: [touch3],
            touches: [touch3, touch2] // #0 first
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch2 = new Touch({
            identifier: 1,
            target: div2,
            clientX: X4,
            clientY: Y4
          });
          utils.fireTouchEvent(div2, 'touchmove', {
            changedTouches: [touch2],
            targetTouches: [touch2],
            touches: [touch3, touch2] // #0 first
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch3 = new Touch({
            identifier: 0,
            target: div3,
            clientX: X5,
            clientY: Y5
          });
          utils.fireTouchEvent(div3, 'touchmove', {
            changedTouches: [touch3],
            targetTouches: [touch3],
            touches: [touch3, touch2] // #0 first
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);
          expect(traceLog).toEqual([
            '<startListener>', 'type:touchstart', 'curPointerClass:null',
            '<startHandler>', 'div1', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
            '</startListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#0)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div2', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</startHandler>',
            'curPointerClass:touch(#1)', 'lastPointerXY:(' + X2 + ',' + Y2 + ')',
            '</startListener>',

            '<endListener>', 'type:touchend', 'curPointerClass:touch(#1)',
            'CHECKED:event.touches', 'NOT-FOUND-TOUCH(#1)',
            '</endListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#1)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div3', 'pointerXY:(' + X3 + ',' + Y3 + ')', '</startHandler>',
            // Re-used ID
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X3 + ',' + Y3 + ')',
            '</startListener>',

            '<moveListener>', 'type:touchmove', 'curPointerClass:touch(#0)',
            'NOT-FOUND-TOUCH(#0)',
            '</moveListener>',

            '<moveListener>', 'type:touchmove', 'curPointerClass:touch(#0)',
            '<move>',
            'lastPointerXY:(' + X5 + ',' + Y5 + ')',
            '<moveHandler>', 'pointerXY:(' + X5 + ',' + Y5 + ')', '</moveHandler>',
            '</move>',
            '</moveListener>'
          ]);
        },
        // ====================================
        done
      ]);
    });

    it('start(#0) -> start(#1) -> end(#0) -> start(#0\') -> move(#0\') -> move(#1)', function(done) {
      var touch1, touch2, touch3;
      resetData();
      utils.intervalExec([
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X1,
            clientY: Y1
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch2 = new Touch({
            identifier: 1,
            target: div2,
            clientX: X2,
            clientY: Y2
          });
          utils.fireTouchEvent(div2, 'touchstart', {
            changedTouches: [touch2],
            targetTouches: [touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          utils.fireTouchEvent(div1, 'touchend', {
            changedTouches: [touch1],
            touches: [touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          touch3 = new Touch({
            identifier: 0,
            target: div3,
            clientX: X3,
            clientY: Y3
          });
          utils.fireTouchEvent(div3, 'touchstart', {
            changedTouches: [touch3],
            targetTouches: [touch3],
            touches: [touch3, touch2] // #0 first
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch3 = new Touch({
            identifier: 0,
            target: div3,
            clientX: X4,
            clientY: Y4
          });
          utils.fireTouchEvent(div3, 'touchmove', {
            changedTouches: [touch3],
            targetTouches: [touch3],
            touches: [touch3, touch2] // #0 first
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch2 = new Touch({
            identifier: 1,
            target: div2,
            clientX: X5,
            clientY: Y5
          });
          utils.fireTouchEvent(div2, 'touchmove', {
            changedTouches: [touch2],
            targetTouches: [touch2],
            touches: [touch3, touch2] // #0 first
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);
          expect(traceLog).toEqual([
            '<startListener>', 'type:touchstart', 'curPointerClass:null',
            '<startHandler>', 'div1', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
            '</startListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#0)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div2', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</startHandler>',
            'curPointerClass:touch(#1)', 'lastPointerXY:(' + X2 + ',' + Y2 + ')',
            '</startListener>',

            '<endListener>', 'type:touchend', 'curPointerClass:touch(#1)',
            'CHECKED:event.touches', 'NOT-FOUND-TOUCH(#1)',
            '</endListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#1)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div3', 'pointerXY:(' + X3 + ',' + Y3 + ')', '</startHandler>',
            // Re-used ID
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X3 + ',' + Y3 + ')',
            '</startListener>',

            '<moveListener>', 'type:touchmove', 'curPointerClass:touch(#0)',
            '<move>',
            'lastPointerXY:(' + X4 + ',' + Y4 + ')',
            '<moveHandler>', 'pointerXY:(' + X4 + ',' + Y4 + ')', '</moveHandler>',
            '</move>',
            '</moveListener>',

            '<moveListener>', 'type:touchmove', 'curPointerClass:touch(#0)',
            'NOT-FOUND-TOUCH(#0)',
            '</moveListener>'
          ]);
        },
        // ====================================
        done
      ]);
    });

    it('start(#0) -> start(#1) -> end(#0) -> start(#0\') -> move(ALL)', function(done) {
      var touch1, touch2, touch3;
      resetData();
      utils.intervalExec([
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X1,
            clientY: Y1
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch2 = new Touch({
            identifier: 1,
            target: div2,
            clientX: X2,
            clientY: Y2
          });
          utils.fireTouchEvent(div2, 'touchstart', {
            changedTouches: [touch2],
            targetTouches: [touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          utils.fireTouchEvent(div1, 'touchend', {
            changedTouches: [touch1],
            touches: [touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          touch3 = new Touch({
            identifier: 0,
            target: div3,
            clientX: X3,
            clientY: Y3
          });
          utils.fireTouchEvent(div3, 'touchstart', {
            changedTouches: [touch3],
            targetTouches: [touch3],
            touches: [touch3, touch2] // #0 first
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch3 = new Touch({
            identifier: 0,
            target: div3,
            clientX: X4,
            clientY: Y4
          });
          touch2 = new Touch({
            identifier: 1,
            target: div2,
            clientX: X5,
            clientY: Y5
          });
          utils.fireTouchEvent(div3, 'touchmove', { // element of #0 first
            changedTouches: [touch3, touch2], // #0 first
            targetTouches: [touch3],
            touches: [touch3, touch2] // #0 first
          });
          utils.fireTouchEvent(div2, 'touchmove', {
            changedTouches: [touch3, touch2], // #0 first
            targetTouches: [touch2],
            touches: [touch3, touch2] // #0 first
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);
          expect(traceLog).toEqual([
            '<startListener>', 'type:touchstart', 'curPointerClass:null',
            '<startHandler>', 'div1', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
            '</startListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#0)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div2', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</startHandler>',
            'curPointerClass:touch(#1)', 'lastPointerXY:(' + X2 + ',' + Y2 + ')',
            '</startListener>',

            '<endListener>', 'type:touchend', 'curPointerClass:touch(#1)',
            'CHECKED:event.touches', 'NOT-FOUND-TOUCH(#1)',
            '</endListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#1)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div3', 'pointerXY:(' + X3 + ',' + Y3 + ')', '</startHandler>',
            // Re-used ID
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X3 + ',' + Y3 + ')',
            '</startListener>',

            '<moveListener>', 'type:touchmove', 'curPointerClass:touch(#0)',
            '<move>',
            'lastPointerXY:(' + X4 + ',' + Y4 + ')',
            '<moveHandler>', 'pointerXY:(' + X4 + ',' + Y4 + ')', '</moveHandler>',
            '</move>',
            '</moveListener>',

            '<moveListener>', 'type:touchmove', 'curPointerClass:touch(#0)',
            'NOT-CHANGED',
            '</moveListener>'
          ]);
        },
        // ====================================
        done
      ]);
    });

    it('start(#0) -> start(#1) -> end(#0) -> start(#0\') -> end(#1) -> end(#0\')', function(done) {
      var touch1, touch2, touch3;
      resetData();
      utils.intervalExec([
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X1,
            clientY: Y1
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch2 = new Touch({
            identifier: 1,
            target: div2,
            clientX: X2,
            clientY: Y2
          });
          utils.fireTouchEvent(div2, 'touchstart', {
            changedTouches: [touch2],
            targetTouches: [touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          utils.fireTouchEvent(div1, 'touchend', {
            changedTouches: [touch1],
            touches: [touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          touch3 = new Touch({
            identifier: 0,
            target: div3,
            clientX: X3,
            clientY: Y3
          });
          utils.fireTouchEvent(div3, 'touchstart', {
            changedTouches: [touch3],
            targetTouches: [touch3],
            touches: [touch3, touch2] // #0 first
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          utils.fireTouchEvent(div2, 'touchend', {
            changedTouches: [touch2],
            touches: [touch3]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          utils.fireTouchEvent(div3, 'touchend', {
            changedTouches: [touch3]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();
          expect(traceLog).toEqual([
            '<startListener>', 'type:touchstart', 'curPointerClass:null',
            '<startHandler>', 'div1', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
            '</startListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#0)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div2', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</startHandler>',
            'curPointerClass:touch(#1)', 'lastPointerXY:(' + X2 + ',' + Y2 + ')',
            '</startListener>',

            '<endListener>', 'type:touchend', 'curPointerClass:touch(#1)',
            'CHECKED:event.touches', 'NOT-FOUND-TOUCH(#1)',
            '</endListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#1)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div3', 'pointerXY:(' + X3 + ',' + Y3 + ')', '</startHandler>',
            // Re-used ID
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X3 + ',' + Y3 + ')',
            '</startListener>',

            '<endListener>', 'type:touchend', 'curPointerClass:touch(#0)',
            'CHECKED:event.touches', 'NOT-FOUND-TOUCH(#0)',
            '</endListener>',

            '<endListener>', 'type:touchend', 'curPointerClass:touch(#0)',
            '<end>',
            'lastPointerXY:(' + X3 + ',' + Y3 + ')',
            '<endHandler>', 'pointerXY:(' + X3 + ',' + Y3 + ')', '</endHandler>',
            'curPointerClass:null',
            '</end>',
            '</endListener>'
          ]);
        },
        // ====================================
        done
      ]);
    });

    it('start(#0) -> start(#1) -> end(#0) -> start(#0\') -> end(#0\') -> end(#1)', function(done) {
      var touch1, touch2, touch3;
      resetData();
      utils.intervalExec([
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X1,
            clientY: Y1
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch2 = new Touch({
            identifier: 1,
            target: div2,
            clientX: X2,
            clientY: Y2
          });
          utils.fireTouchEvent(div2, 'touchstart', {
            changedTouches: [touch2],
            targetTouches: [touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          utils.fireTouchEvent(div1, 'touchend', {
            changedTouches: [touch1],
            touches: [touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          touch3 = new Touch({
            identifier: 0,
            target: div3,
            clientX: X3,
            clientY: Y3
          });
          utils.fireTouchEvent(div3, 'touchstart', {
            changedTouches: [touch3],
            targetTouches: [touch3],
            touches: [touch3, touch2] // #0 first
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          utils.fireTouchEvent(div3, 'touchend', {
            changedTouches: [touch3],
            touches: [touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          utils.fireTouchEvent(div2, 'touchend', {
            changedTouches: [touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();
          expect(traceLog).toEqual([
            '<startListener>', 'type:touchstart', 'curPointerClass:null',
            '<startHandler>', 'div1', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
            '</startListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#0)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div2', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</startHandler>',
            'curPointerClass:touch(#1)', 'lastPointerXY:(' + X2 + ',' + Y2 + ')',
            '</startListener>',

            '<endListener>', 'type:touchend', 'curPointerClass:touch(#1)',
            'CHECKED:event.touches', 'NOT-FOUND-TOUCH(#1)',
            '</endListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#1)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div3', 'pointerXY:(' + X3 + ',' + Y3 + ')', '</startHandler>',
            // Re-used ID
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X3 + ',' + Y3 + ')',
            '</startListener>',

            '<endListener>', 'type:touchend', 'curPointerClass:touch(#0)',
            '<end>',
            'lastPointerXY:(' + X3 + ',' + Y3 + ')',
            '<endHandler>', 'pointerXY:(' + X3 + ',' + Y3 + ')', '</endHandler>',
            'curPointerClass:null',
            '</end>',
            '</endListener>',

            '<endListener>', 'type:touchend', 'curPointerClass:null', '</endListener>'
          ]);
        },
        // ====================================
        done
      ]);
    });

    it('start(#0) -> start(#1) -> end(#0) -> start(#0\') -> end(ALL)', function(done) {
      var touch1, touch2, touch3;
      resetData();
      utils.intervalExec([
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X1,
            clientY: Y1
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch2 = new Touch({
            identifier: 1,
            target: div2,
            clientX: X2,
            clientY: Y2
          });
          utils.fireTouchEvent(div2, 'touchstart', {
            changedTouches: [touch2],
            targetTouches: [touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          utils.fireTouchEvent(div1, 'touchend', {
            changedTouches: [touch1],
            touches: [touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          touch3 = new Touch({
            identifier: 0,
            target: div3,
            clientX: X3,
            clientY: Y3
          });
          utils.fireTouchEvent(div3, 'touchstart', {
            changedTouches: [touch3],
            targetTouches: [touch3],
            touches: [touch3, touch2] // #0 first
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          utils.fireTouchEvent(div3, 'touchend', { // element of #0 first
            changedTouches: [touch3, touch2] // #0 first
          });
          utils.fireTouchEvent(div2, 'touchend', {
            changedTouches: [touch3, touch2] // #0 first
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();
          expect(traceLog).toEqual([
            '<startListener>', 'type:touchstart', 'curPointerClass:null',
            '<startHandler>', 'div1', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
            '</startListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#0)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div2', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</startHandler>',
            'curPointerClass:touch(#1)', 'lastPointerXY:(' + X2 + ',' + Y2 + ')',
            '</startListener>',

            '<endListener>', 'type:touchend', 'curPointerClass:touch(#1)',
            'CHECKED:event.touches', 'NOT-FOUND-TOUCH(#1)',
            '</endListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#1)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div3', 'pointerXY:(' + X3 + ',' + Y3 + ')', '</startHandler>',
            // Re-used ID
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X3 + ',' + Y3 + ')',
            '</startListener>',

            '<endListener>', 'type:touchend', 'curPointerClass:touch(#0)',
            '<end>',
            'lastPointerXY:(' + X3 + ',' + Y3 + ')',
            '<endHandler>', 'pointerXY:(' + X3 + ',' + Y3 + ')', '</endHandler>',
            'curPointerClass:null',
            '</end>',
            '</endListener>',

            '<endListener>', 'type:touchend', 'curPointerClass:null', '</endListener>'
          ]);
        },
        // ====================================
        done
      ]);
    });

    it('start(#0) -> start(#1) -> end(#0) -> start(#0\') -> cancel(ALL)', function(done) {
      var touch1, touch2, touch3;
      resetData();
      utils.intervalExec([
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X1,
            clientY: Y1
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch2 = new Touch({
            identifier: 1,
            target: div2,
            clientX: X2,
            clientY: Y2
          });
          utils.fireTouchEvent(div2, 'touchstart', {
            changedTouches: [touch2],
            targetTouches: [touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          utils.fireTouchEvent(div1, 'touchend', {
            changedTouches: [touch1],
            touches: [touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          touch3 = new Touch({
            identifier: 0,
            target: div3,
            clientX: X3,
            clientY: Y3
          });
          utils.fireTouchEvent(div3, 'touchstart', {
            changedTouches: [touch3],
            targetTouches: [touch3],
            touches: [touch3, touch2] // #0 first
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          // Only #0
          utils.fireTouchEvent(div3, 'touchcancel', { // element of #0
            changedTouches: [touch3]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();
          expect(traceLog).toEqual([
            '<startListener>', 'type:touchstart', 'curPointerClass:null',
            '<startHandler>', 'div1', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
            '</startListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#0)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div2', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</startHandler>',
            'curPointerClass:touch(#1)', 'lastPointerXY:(' + X2 + ',' + Y2 + ')',
            '</startListener>',

            '<endListener>', 'type:touchend', 'curPointerClass:touch(#1)',
            'CHECKED:event.touches', 'NOT-FOUND-TOUCH(#1)',
            '</endListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#1)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div3', 'pointerXY:(' + X3 + ',' + Y3 + ')', '</startHandler>',
            // Re-used ID
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X3 + ',' + Y3 + ')',
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
        done
      ]);
    });

    it('start(#0) -> start(#1) -> end(#0) -> start(#0\') -> cancel(#1) -> cancel(#0\')', function(done) {
      var touch1, touch2, touch3;
      resetData();
      utils.intervalExec([
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X1,
            clientY: Y1
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch2 = new Touch({
            identifier: 1,
            target: div2,
            clientX: X2,
            clientY: Y2
          });
          utils.fireTouchEvent(div2, 'touchstart', {
            changedTouches: [touch2],
            targetTouches: [touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          utils.fireTouchEvent(div1, 'touchend', {
            changedTouches: [touch1],
            touches: [touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          touch3 = new Touch({
            identifier: 0,
            target: div3,
            clientX: X3,
            clientY: Y3
          });
          utils.fireTouchEvent(div3, 'touchstart', {
            changedTouches: [touch3],
            targetTouches: [touch3],
            touches: [touch3, touch2] // #0 first
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          utils.fireTouchEvent(div2, 'touchcancel', {
            changedTouches: [touch2],
            touches: [touch3]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          utils.fireTouchEvent(div3, 'touchcancel', {
            changedTouches: [touch3]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();
          expect(traceLog).toEqual([
            '<startListener>', 'type:touchstart', 'curPointerClass:null',
            '<startHandler>', 'div1', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
            '</startListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#0)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div2', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</startHandler>',
            'curPointerClass:touch(#1)', 'lastPointerXY:(' + X2 + ',' + Y2 + ')',
            '</startListener>',

            '<endListener>', 'type:touchend', 'curPointerClass:touch(#1)',
            'CHECKED:event.touches', 'NOT-FOUND-TOUCH(#1)',
            '</endListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#1)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div3', 'pointerXY:(' + X3 + ',' + Y3 + ')', '</startHandler>',
            // Re-used ID
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X3 + ',' + Y3 + ')',
            '</startListener>',

            '<cancelListener>', 'type:touchcancel', 'curPointerClass:touch(#0)',
            'CHECKED:event.touches', 'NOT-FOUND-TOUCH(#0)',
            '</cancelListener>',

            '<cancelListener>', 'type:touchcancel', 'curPointerClass:touch(#0)',
            '<cancel>',
            '<cancelHandler>', '</cancelHandler>',
            'curPointerClass:null',
            '</cancel>',
            '</cancelListener>'
          ]);
        },
        // ====================================
        done
      ]);
    });

    it('start(#0) -> start(#1) -> end(#0) -> start(#0\') -> cancel(#0\') -> cancel(#1)', function(done) {
      var touch1, touch2, touch3;
      resetData();
      utils.intervalExec([
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X1,
            clientY: Y1
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch2 = new Touch({
            identifier: 1,
            target: div2,
            clientX: X2,
            clientY: Y2
          });
          utils.fireTouchEvent(div2, 'touchstart', {
            changedTouches: [touch2],
            targetTouches: [touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          utils.fireTouchEvent(div1, 'touchend', {
            changedTouches: [touch1],
            touches: [touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          touch3 = new Touch({
            identifier: 0,
            target: div3,
            clientX: X3,
            clientY: Y3
          });
          utils.fireTouchEvent(div3, 'touchstart', {
            changedTouches: [touch3],
            targetTouches: [touch3],
            touches: [touch3, touch2] // #0 first
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          utils.fireTouchEvent(div3, 'touchcancel', {
            changedTouches: [touch3],
            touches: [touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          utils.fireTouchEvent(div2, 'touchcancel', {
            changedTouches: [touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();
          expect(traceLog).toEqual([
            '<startListener>', 'type:touchstart', 'curPointerClass:null',
            '<startHandler>', 'div1', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
            '</startListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#0)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div2', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</startHandler>',
            'curPointerClass:touch(#1)', 'lastPointerXY:(' + X2 + ',' + Y2 + ')',
            '</startListener>',

            '<endListener>', 'type:touchend', 'curPointerClass:touch(#1)',
            'CHECKED:event.touches', 'NOT-FOUND-TOUCH(#1)',
            '</endListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#1)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div3', 'pointerXY:(' + X3 + ',' + Y3 + ')', '</startHandler>',
            // Re-used ID
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X3 + ',' + Y3 + ')',
            '</startListener>',

            '<cancelListener>', 'type:touchcancel', 'curPointerClass:touch(#0)',
            '<cancel>',
            '<cancelHandler>', '</cancelHandler>',
            'curPointerClass:null',
            '</cancel>',
            '</cancelListener>',

            '<cancelListener>', 'type:touchcancel', 'curPointerClass:null', '</cancelListener>'
          ]);
        },
        // ====================================
        done
      ]);
    });

  });

  describe('Re-used ID in same element', function() {

    it('start(#0) -> start(SAME-ELEMENT #1) -> end(#0) -> start(#0\') -> move(#1) -> move(#0\')', function(done) {
      var touch1, touch2, touch3;
      resetData();
      utils.intervalExec([
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X1,
            clientY: Y1
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch2 = new Touch({
            identifier: 1,
            target: div1,
            clientX: X2,
            clientY: Y2
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch2],
            targetTouches: [touch1, touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          utils.fireTouchEvent(div1, 'touchend', {
            changedTouches: [touch1],
            targetTouches: [touch2],
            touches: [touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          touch3 = new Touch({
            identifier: 0,
            target: div2,
            clientX: X3,
            clientY: Y3
          });
          utils.fireTouchEvent(div2, 'touchstart', {
            changedTouches: [touch3],
            targetTouches: [touch3],
            touches: [touch3, touch2] // #0 first
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch2 = new Touch({
            identifier: 1,
            target: div1,
            clientX: X4,
            clientY: Y4
          });
          utils.fireTouchEvent(div1, 'touchmove', {
            changedTouches: [touch2],
            targetTouches: [touch2],
            touches: [touch3, touch2] // #0 first
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch3 = new Touch({
            identifier: 0,
            target: div2,
            clientX: X5,
            clientY: Y5
          });
          utils.fireTouchEvent(div2, 'touchmove', {
            changedTouches: [touch3],
            targetTouches: [touch3],
            touches: [touch3, touch2] // #0 first
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);
          expect(traceLog).toEqual([
            '<startListener>', 'type:touchstart', 'curPointerClass:null',
            '<startHandler>', 'div1', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
            '</startListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#0)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div1', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</startHandler>',
            'curPointerClass:touch(#1)', 'lastPointerXY:(' + X2 + ',' + Y2 + ')',
            '</startListener>',

            '<endListener>', 'type:touchend', 'curPointerClass:touch(#1)',
            'CHECKED:event.touches', 'NOT-FOUND-TOUCH(#1)',
            '</endListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#1)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div2', 'pointerXY:(' + X3 + ',' + Y3 + ')', '</startHandler>',
            // Re-used ID
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X3 + ',' + Y3 + ')',
            '</startListener>',

            '<moveListener>', 'type:touchmove', 'curPointerClass:touch(#0)',
            'NOT-FOUND-TOUCH(#0)',
            '</moveListener>',

            '<moveListener>', 'type:touchmove', 'curPointerClass:touch(#0)',
            '<move>',
            'lastPointerXY:(' + X5 + ',' + Y5 + ')',
            '<moveHandler>', 'pointerXY:(' + X5 + ',' + Y5 + ')', '</moveHandler>',
            '</move>',
            '</moveListener>'
          ]);
        },
        // ====================================
        done
      ]);
    });

    it('start(#0) -> start(SAME-ELEMENT #1) -> end(#0) -> start(#0\') -> move(#0\') -> move(#1)', function(done) {
      var touch1, touch2, touch3;
      resetData();
      utils.intervalExec([
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X1,
            clientY: Y1
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch2 = new Touch({
            identifier: 1,
            target: div1,
            clientX: X2,
            clientY: Y2
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch2],
            targetTouches: [touch1, touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          utils.fireTouchEvent(div1, 'touchend', {
            changedTouches: [touch1],
            targetTouches: [touch2],
            touches: [touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          touch3 = new Touch({
            identifier: 0,
            target: div2,
            clientX: X3,
            clientY: Y3
          });
          utils.fireTouchEvent(div2, 'touchstart', {
            changedTouches: [touch3],
            targetTouches: [touch3],
            touches: [touch3, touch2] // #0 first
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch3 = new Touch({
            identifier: 0,
            target: div2,
            clientX: X4,
            clientY: Y4
          });
          utils.fireTouchEvent(div2, 'touchmove', {
            changedTouches: [touch3],
            targetTouches: [touch3],
            touches: [touch3, touch2] // #0 first
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch2 = new Touch({
            identifier: 1,
            target: div1,
            clientX: X5,
            clientY: Y5
          });
          utils.fireTouchEvent(div1, 'touchmove', {
            changedTouches: [touch2],
            targetTouches: [touch2],
            touches: [touch3, touch2] // #0 first
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);
          expect(traceLog).toEqual([
            '<startListener>', 'type:touchstart', 'curPointerClass:null',
            '<startHandler>', 'div1', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
            '</startListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#0)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div1', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</startHandler>',
            'curPointerClass:touch(#1)', 'lastPointerXY:(' + X2 + ',' + Y2 + ')',
            '</startListener>',

            '<endListener>', 'type:touchend', 'curPointerClass:touch(#1)',
            'CHECKED:event.touches', 'NOT-FOUND-TOUCH(#1)',
            '</endListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#1)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div2', 'pointerXY:(' + X3 + ',' + Y3 + ')', '</startHandler>',
            // Re-used ID
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X3 + ',' + Y3 + ')',
            '</startListener>',

            '<moveListener>', 'type:touchmove', 'curPointerClass:touch(#0)',
            '<move>',
            'lastPointerXY:(' + X4 + ',' + Y4 + ')',
            '<moveHandler>', 'pointerXY:(' + X4 + ',' + Y4 + ')', '</moveHandler>',
            '</move>',
            '</moveListener>',

            '<moveListener>', 'type:touchmove', 'curPointerClass:touch(#0)',
            'NOT-FOUND-TOUCH(#0)',
            '</moveListener>'
          ]);
        },
        // ====================================
        done
      ]);
    });

    it('start(#0) -> start(SAME-ELEMENT #1) -> end(#0) -> start(#0\') -> move(ALL)', function(done) {
      var touch1, touch2, touch3;
      resetData();
      utils.intervalExec([
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X1,
            clientY: Y1
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch2 = new Touch({
            identifier: 1,
            target: div1,
            clientX: X2,
            clientY: Y2
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch2],
            targetTouches: [touch1, touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          utils.fireTouchEvent(div1, 'touchend', {
            changedTouches: [touch1],
            targetTouches: [touch2],
            touches: [touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          touch3 = new Touch({
            identifier: 0,
            target: div2,
            clientX: X3,
            clientY: Y3
          });
          utils.fireTouchEvent(div2, 'touchstart', {
            changedTouches: [touch3],
            targetTouches: [touch3],
            touches: [touch3, touch2] // #0 first
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch3 = new Touch({
            identifier: 0,
            target: div2,
            clientX: X4,
            clientY: Y4
          });
          touch2 = new Touch({
            identifier: 1,
            target: div1,
            clientX: X5,
            clientY: Y5
          });
          utils.fireTouchEvent(div2, 'touchmove', { // element of #0 first
            changedTouches: [touch3, touch2], // #0 first
            targetTouches: [touch3],
            touches: [touch3, touch2] // #0 first
          });
          utils.fireTouchEvent(div1, 'touchmove', {
            changedTouches: [touch3, touch2], // #0 first
            targetTouches: [touch2],
            touches: [touch3, touch2] // #0 first
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);
          expect(traceLog).toEqual([
            '<startListener>', 'type:touchstart', 'curPointerClass:null',
            '<startHandler>', 'div1', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
            '</startListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#0)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div1', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</startHandler>',
            'curPointerClass:touch(#1)', 'lastPointerXY:(' + X2 + ',' + Y2 + ')',
            '</startListener>',

            '<endListener>', 'type:touchend', 'curPointerClass:touch(#1)',
            'CHECKED:event.touches', 'NOT-FOUND-TOUCH(#1)',
            '</endListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#1)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div2', 'pointerXY:(' + X3 + ',' + Y3 + ')', '</startHandler>',
            // Re-used ID
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X3 + ',' + Y3 + ')',
            '</startListener>',

            '<moveListener>', 'type:touchmove', 'curPointerClass:touch(#0)',
            '<move>',
            'lastPointerXY:(' + X4 + ',' + Y4 + ')',
            '<moveHandler>', 'pointerXY:(' + X4 + ',' + Y4 + ')', '</moveHandler>',
            '</move>',
            '</moveListener>',

            '<moveListener>', 'type:touchmove', 'curPointerClass:touch(#0)',
            'NOT-CHANGED',
            '</moveListener>'
          ]);
        },
        // ====================================
        done
      ]);
    });

    it('start(#0) -> start(SAME-ELEMENT #1) -> end(#0) -> start(#0\') -> end(#1) -> end(#0\')', function(done) {
      var touch1, touch2, touch3;
      resetData();
      utils.intervalExec([
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X1,
            clientY: Y1
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch2 = new Touch({
            identifier: 1,
            target: div1,
            clientX: X2,
            clientY: Y2
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch2],
            targetTouches: [touch1, touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          utils.fireTouchEvent(div1, 'touchend', {
            changedTouches: [touch1],
            targetTouches: [touch2],
            touches: [touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          touch3 = new Touch({
            identifier: 0,
            target: div2,
            clientX: X3,
            clientY: Y3
          });
          utils.fireTouchEvent(div2, 'touchstart', {
            changedTouches: [touch3],
            targetTouches: [touch3],
            touches: [touch3, touch2] // #0 first
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          utils.fireTouchEvent(div1, 'touchend', {
            changedTouches: [touch2],
            touches: [touch3]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          utils.fireTouchEvent(div2, 'touchend', {
            changedTouches: [touch3]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();
          expect(traceLog).toEqual([
            '<startListener>', 'type:touchstart', 'curPointerClass:null',
            '<startHandler>', 'div1', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
            '</startListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#0)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div1', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</startHandler>',
            'curPointerClass:touch(#1)', 'lastPointerXY:(' + X2 + ',' + Y2 + ')',
            '</startListener>',

            '<endListener>', 'type:touchend', 'curPointerClass:touch(#1)',
            'CHECKED:event.touches', 'NOT-FOUND-TOUCH(#1)',
            '</endListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#1)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div2', 'pointerXY:(' + X3 + ',' + Y3 + ')', '</startHandler>',
            // Re-used ID
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X3 + ',' + Y3 + ')',
            '</startListener>',

            '<endListener>', 'type:touchend', 'curPointerClass:touch(#0)',
            'CHECKED:event.touches', 'NOT-FOUND-TOUCH(#0)',
            '</endListener>',

            '<endListener>', 'type:touchend', 'curPointerClass:touch(#0)',
            '<end>',
            'lastPointerXY:(' + X3 + ',' + Y3 + ')',
            '<endHandler>', 'pointerXY:(' + X3 + ',' + Y3 + ')', '</endHandler>',
            'curPointerClass:null',
            '</end>',
            '</endListener>'
          ]);
        },
        // ====================================
        done
      ]);
    });

    it('start(#0) -> start(SAME-ELEMENT #1) -> end(#0) -> start(#0\') -> end(#0\') -> end(#1)', function(done) {
      var touch1, touch2, touch3;
      resetData();
      utils.intervalExec([
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X1,
            clientY: Y1
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch2 = new Touch({
            identifier: 1,
            target: div1,
            clientX: X2,
            clientY: Y2
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch2],
            targetTouches: [touch1, touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          utils.fireTouchEvent(div1, 'touchend', {
            changedTouches: [touch1],
            targetTouches: [touch2],
            touches: [touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          touch3 = new Touch({
            identifier: 0,
            target: div2,
            clientX: X3,
            clientY: Y3
          });
          utils.fireTouchEvent(div2, 'touchstart', {
            changedTouches: [touch3],
            targetTouches: [touch3],
            touches: [touch3, touch2] // #0 first
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          utils.fireTouchEvent(div2, 'touchend', {
            changedTouches: [touch3],
            touches: [touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          utils.fireTouchEvent(div1, 'touchend', {
            changedTouches: [touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();
          expect(traceLog).toEqual([
            '<startListener>', 'type:touchstart', 'curPointerClass:null',
            '<startHandler>', 'div1', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
            '</startListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#0)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div1', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</startHandler>',
            'curPointerClass:touch(#1)', 'lastPointerXY:(' + X2 + ',' + Y2 + ')',
            '</startListener>',

            '<endListener>', 'type:touchend', 'curPointerClass:touch(#1)',
            'CHECKED:event.touches', 'NOT-FOUND-TOUCH(#1)',
            '</endListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#1)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div2', 'pointerXY:(' + X3 + ',' + Y3 + ')', '</startHandler>',
            // Re-used ID
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X3 + ',' + Y3 + ')',
            '</startListener>',

            '<endListener>', 'type:touchend', 'curPointerClass:touch(#0)',
            '<end>',
            'lastPointerXY:(' + X3 + ',' + Y3 + ')',
            '<endHandler>', 'pointerXY:(' + X3 + ',' + Y3 + ')', '</endHandler>',
            'curPointerClass:null',
            '</end>',
            '</endListener>',

            '<endListener>', 'type:touchend', 'curPointerClass:null', '</endListener>'
          ]);
        },
        // ====================================
        done
      ]);
    });

    it('start(#0) -> start(SAME-ELEMENT #1) -> end(#0) -> start(#0\') -> end(ALL)', function(done) {
      var touch1, touch2, touch3;
      resetData();
      utils.intervalExec([
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X1,
            clientY: Y1
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch2 = new Touch({
            identifier: 1,
            target: div1,
            clientX: X2,
            clientY: Y2
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch2],
            targetTouches: [touch1, touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          utils.fireTouchEvent(div1, 'touchend', {
            changedTouches: [touch1],
            targetTouches: [touch2],
            touches: [touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          touch3 = new Touch({
            identifier: 0,
            target: div2,
            clientX: X3,
            clientY: Y3
          });
          utils.fireTouchEvent(div2, 'touchstart', {
            changedTouches: [touch3],
            targetTouches: [touch3],
            touches: [touch3, touch2] // #0 first
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          utils.fireTouchEvent(div2, 'touchend', { // element of #0 first
            changedTouches: [touch3, touch2] // #0 first
          });
          utils.fireTouchEvent(div1, 'touchend', {
            changedTouches: [touch3, touch2] // #0 first
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();
          expect(traceLog).toEqual([
            '<startListener>', 'type:touchstart', 'curPointerClass:null',
            '<startHandler>', 'div1', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
            '</startListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#0)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div1', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</startHandler>',
            'curPointerClass:touch(#1)', 'lastPointerXY:(' + X2 + ',' + Y2 + ')',
            '</startListener>',

            '<endListener>', 'type:touchend', 'curPointerClass:touch(#1)',
            'CHECKED:event.touches', 'NOT-FOUND-TOUCH(#1)',
            '</endListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#1)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div2', 'pointerXY:(' + X3 + ',' + Y3 + ')', '</startHandler>',
            // Re-used ID
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X3 + ',' + Y3 + ')',
            '</startListener>',

            '<endListener>', 'type:touchend', 'curPointerClass:touch(#0)',
            '<end>',
            'lastPointerXY:(' + X3 + ',' + Y3 + ')',
            '<endHandler>', 'pointerXY:(' + X3 + ',' + Y3 + ')', '</endHandler>',
            'curPointerClass:null',
            '</end>',
            '</endListener>',

            '<endListener>', 'type:touchend', 'curPointerClass:null', '</endListener>'
          ]);
        },
        // ====================================
        done
      ]);
    });

    it('start(#0) -> start(SAME-ELEMENT #1) -> end(#0) -> start(#0\') -> cancel(ALL)', function(done) {
      var touch1, touch2, touch3;
      resetData();
      utils.intervalExec([
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X1,
            clientY: Y1
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch2 = new Touch({
            identifier: 1,
            target: div1,
            clientX: X2,
            clientY: Y2
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch2],
            targetTouches: [touch1, touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          utils.fireTouchEvent(div1, 'touchend', {
            changedTouches: [touch1],
            targetTouches: [touch2],
            touches: [touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          touch3 = new Touch({
            identifier: 0,
            target: div2,
            clientX: X3,
            clientY: Y3
          });
          utils.fireTouchEvent(div2, 'touchstart', {
            changedTouches: [touch3],
            targetTouches: [touch3],
            touches: [touch3, touch2] // #0 first
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          // Only #0
          utils.fireTouchEvent(div2, 'touchcancel', { // element of #0
            changedTouches: [touch3]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();
          expect(traceLog).toEqual([
            '<startListener>', 'type:touchstart', 'curPointerClass:null',
            '<startHandler>', 'div1', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
            '</startListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#0)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div1', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</startHandler>',
            'curPointerClass:touch(#1)', 'lastPointerXY:(' + X2 + ',' + Y2 + ')',
            '</startListener>',

            '<endListener>', 'type:touchend', 'curPointerClass:touch(#1)',
            'CHECKED:event.touches', 'NOT-FOUND-TOUCH(#1)',
            '</endListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#1)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div2', 'pointerXY:(' + X3 + ',' + Y3 + ')', '</startHandler>',
            // Re-used ID
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X3 + ',' + Y3 + ')',
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
        done
      ]);
    });

    it('start(#0) -> start(SAME-ELEMENT #1) -> end(#0) -> start(#0\') -> cancel(#1) -> cancel(#0\')', function(done) {
      var touch1, touch2, touch3;
      resetData();
      utils.intervalExec([
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X1,
            clientY: Y1
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch2 = new Touch({
            identifier: 1,
            target: div1,
            clientX: X2,
            clientY: Y2
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch2],
            targetTouches: [touch1, touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          utils.fireTouchEvent(div1, 'touchend', {
            changedTouches: [touch1],
            targetTouches: [touch2],
            touches: [touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          touch3 = new Touch({
            identifier: 0,
            target: div2,
            clientX: X3,
            clientY: Y3
          });
          utils.fireTouchEvent(div2, 'touchstart', {
            changedTouches: [touch3],
            targetTouches: [touch3],
            touches: [touch3, touch2] // #0 first
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          utils.fireTouchEvent(div1, 'touchcancel', {
            changedTouches: [touch2],
            touches: [touch3]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          utils.fireTouchEvent(div2, 'touchcancel', {
            changedTouches: [touch3]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();
          expect(traceLog).toEqual([
            '<startListener>', 'type:touchstart', 'curPointerClass:null',
            '<startHandler>', 'div1', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
            '</startListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#0)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div1', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</startHandler>',
            'curPointerClass:touch(#1)', 'lastPointerXY:(' + X2 + ',' + Y2 + ')',
            '</startListener>',

            '<endListener>', 'type:touchend', 'curPointerClass:touch(#1)',
            'CHECKED:event.touches', 'NOT-FOUND-TOUCH(#1)',
            '</endListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#1)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div2', 'pointerXY:(' + X3 + ',' + Y3 + ')', '</startHandler>',
            // Re-used ID
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X3 + ',' + Y3 + ')',
            '</startListener>',

            '<cancelListener>', 'type:touchcancel', 'curPointerClass:touch(#0)',
            'CHECKED:event.touches', 'NOT-FOUND-TOUCH(#0)',
            '</cancelListener>',

            '<cancelListener>', 'type:touchcancel', 'curPointerClass:touch(#0)',
            '<cancel>',
            '<cancelHandler>', '</cancelHandler>',
            'curPointerClass:null',
            '</cancel>',
            '</cancelListener>'
          ]);
        },
        // ====================================
        done
      ]);
    });

    it('start(#0) -> start(SAME-ELEMENT #1) -> end(#0) -> start(#0\') -> cancel(#0\') -> cancel(#1)', function(done) {
      var touch1, touch2, touch3;
      resetData();
      utils.intervalExec([
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          touch1 = new Touch({
            identifier: 0,
            target: div1,
            clientX: X1,
            clientY: Y1
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch1],
            targetTouches: [touch1],
            touches: [touch1]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          touch2 = new Touch({
            identifier: 1,
            target: div1,
            clientX: X2,
            clientY: Y2
          });
          utils.fireTouchEvent(div1, 'touchstart', {
            changedTouches: [touch2],
            targetTouches: [touch1, touch2],
            touches: [touch1, touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          utils.fireTouchEvent(div1, 'touchend', {
            changedTouches: [touch1],
            targetTouches: [touch2],
            touches: [touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(1);

          touch3 = new Touch({
            identifier: 0,
            target: div2,
            clientX: X3,
            clientY: Y3
          });
          utils.fireTouchEvent(div2, 'touchstart', {
            changedTouches: [touch3],
            targetTouches: [touch3],
            touches: [touch3, touch2] // #0 first
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBe('touch');
          expect(pointerEvent.curTouchId).toBe(0);

          utils.fireTouchEvent(div2, 'touchcancel', {
            changedTouches: [touch3],
            touches: [touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();

          utils.fireTouchEvent(div1, 'touchcancel', {
            changedTouches: [touch2]
          });
        },
        // ====================================
        function() {
          expect(pointerEvent.curPointerClass).toBeNull();
          expect(pointerEvent.curTouchId).toBeNull();
          expect(traceLog).toEqual([
            '<startListener>', 'type:touchstart', 'curPointerClass:null',
            '<startHandler>', 'div1', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
            '</startListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#0)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div1', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</startHandler>',
            'curPointerClass:touch(#1)', 'lastPointerXY:(' + X2 + ',' + Y2 + ')',
            '</startListener>',

            '<endListener>', 'type:touchend', 'curPointerClass:touch(#1)',
            'CHECKED:event.touches', 'NOT-FOUND-TOUCH(#1)',
            '</endListener>',

            '<startListener>', 'type:touchstart', 'curPointerClass:touch(#1)',
            // Cancel current
            '<cancel>', '<cancelHandler>', '</cancelHandler>', 'curPointerClass:null', '</cancel>',
            '<startHandler>', 'div2', 'pointerXY:(' + X3 + ',' + Y3 + ')', '</startHandler>',
            // Re-used ID
            'curPointerClass:touch(#0)', 'lastPointerXY:(' + X3 + ',' + Y3 + ')',
            '</startListener>',

            '<cancelListener>', 'type:touchcancel', 'curPointerClass:touch(#0)',
            '<cancel>',
            '<cancelHandler>', '</cancelHandler>',
            'curPointerClass:null',
            '</cancel>',
            '</cancelListener>',

            '<cancelListener>', 'type:touchcancel', 'curPointerClass:null', '</cancelListener>'
          ]);
        },
        // ====================================
        done
      ]);
    });

  });

});
