describe('pointerXY', function() {
  'use strict';

  var pageDone, document, PointerEvent, traceLog, utils,
    elmTarget, pointerEvent,

    X1 = 1,
    Y1 = 2,
    X2 = 4,
    Y2 = 8,
    X3 = 16,
    Y3 = 32;

  function resetData() {
    pointerEvent.cancel();
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

  it('mousemove', function(done) {
    resetData();
    utils.intervalExec([
      // ====================================
      function() {
        utils.fireMouseEvent(elmTarget, 'mousedown', {clientX: X1, clientY: Y1});
      },
      // ====================================
      function() {
        utils.fireMouseEvent(document, 'mousemove', {clientX: X2, clientY: Y2});
      },
      // ====================================
      function() {
        utils.fireMouseEvent(document, 'mousemove', {clientX: X3, clientY: Y3});
      },
      // ====================================
      function() {
        utils.fireMouseEvent(document, 'mousemove', {clientX: X1, clientY: Y1});
      },
      // ====================================
      function() {
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
          '</moveListener>',

          '<moveListener>', 'type:mousemove', 'curPointerClass:mouse',
          '<move>',
          'lastPointerXY:(' + X3 + ',' + Y3 + ')',
          '<moveHandler>', 'pointerXY:(' + X3 + ',' + Y3 + ')', '</moveHandler>',
          '</move>',
          '</moveListener>',

          '<moveListener>', 'type:mousemove', 'curPointerClass:mouse',
          '<move>',
          'lastPointerXY:(' + X1 + ',' + Y1 + ')',
          '<moveHandler>', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</moveHandler>',
          '</move>',
          '</moveListener>'
        ]);
      },
      // ====================================
      0, done
    ]);
  });

  it('mousemove + move()', function(done) {
    resetData();
    utils.intervalExec([
      // ====================================
      function() {
        utils.fireMouseEvent(elmTarget, 'mousedown', {clientX: X1, clientY: Y1});
      },
      // ====================================
      function() {
        pointerEvent.move();
      },
      // ====================================
      function() {
        utils.fireMouseEvent(document, 'mousemove', {clientX: X2, clientY: Y2});
      },
      // ====================================
      function() {
        pointerEvent.move();
      },
      // ====================================
      function() {
        utils.fireMouseEvent(document, 'mousemove', {clientX: X3, clientY: Y3});
      },
      // ====================================
      function() {
        // Fire again
        utils.fireMouseEvent(document, 'mousemove', {clientX: X1, clientY: Y1});
      },
      // ====================================
      function() {
        pointerEvent.move();
      },
      // ====================================
      function() {
        expect(traceLog).toEqual([
          '<startListener>', 'type:mousedown', 'curPointerClass:null',
          '<startHandler>', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
          'curPointerClass:mouse', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
          '</startListener>',

          // Call move()
          '<move>', 'NO-pointerXY',
          '<moveHandler>', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</moveHandler>',
          '</move>',

          '<moveListener>', 'type:mousemove', 'curPointerClass:mouse',
          '<move>',
          'lastPointerXY:(' + X2 + ',' + Y2 + ')',
          '<moveHandler>', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</moveHandler>',
          '</move>',
          '</moveListener>',

          // Call move()
          '<move>', 'NO-pointerXY',
          '<moveHandler>', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</moveHandler>',
          '</move>',

          '<moveListener>', 'type:mousemove', 'curPointerClass:mouse',
          '<move>',
          'lastPointerXY:(' + X3 + ',' + Y3 + ')',
          '<moveHandler>', 'pointerXY:(' + X3 + ',' + Y3 + ')', '</moveHandler>',
          '</move>',
          '</moveListener>',

          // Fire again
          '<moveListener>', 'type:mousemove', 'curPointerClass:mouse',
          '<move>',
          'lastPointerXY:(' + X1 + ',' + Y1 + ')',
          '<moveHandler>', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</moveHandler>',
          '</move>',
          '</moveListener>',

          // Call move()
          '<move>', 'NO-pointerXY',
          '<moveHandler>', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</moveHandler>',
          '</move>'
        ]);
      },
      // ====================================
      0, done
    ]);
  });

  it('mousemove + move(XY)', function(done) {
    resetData();
    utils.intervalExec([
      // ====================================
      function() {
        utils.fireMouseEvent(elmTarget, 'mousedown', {clientX: X1, clientY: Y1});
      },
      // ====================================
      function() {
        pointerEvent.move();
        pointerEvent.move({clientX: X3, clientY: Y3});
        pointerEvent.move();
      },
      // ====================================
      function() {
        utils.fireMouseEvent(document, 'mousemove', {clientX: X2, clientY: Y2});
      },
      // ====================================
      function() {
        pointerEvent.move({clientX: X1, clientY: Y1});
        pointerEvent.move();
      },
      // ====================================
      function() {
        utils.fireMouseEvent(document, 'mousemove', {clientX: X3, clientY: Y3});
      },
      // ====================================
      function() {
        pointerEvent.move({clientX: X3, clientY: Y3});
        pointerEvent.move();

        pointerEvent.move({clientX: X1, clientY: Y1});
        pointerEvent.move({clientX: X2, clientY: Y2});
        pointerEvent.move();
      },
      // ====================================
      function() {
        expect(traceLog).toEqual([
          '<startListener>', 'type:mousedown', 'curPointerClass:null',
          '<startHandler>', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
          'curPointerClass:mouse', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
          '</startListener>',

          // Call move()
          '<move>', 'NO-pointerXY',
          '<moveHandler>', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</moveHandler>',
          '</move>',

          // Call move()
          '<move>',
          'lastPointerXY:(' + X3 + ',' + Y3 + ')',
          '<moveHandler>', 'pointerXY:(' + X3 + ',' + Y3 + ')', '</moveHandler>',
          '</move>',

          // Call move()
          '<move>', 'NO-pointerXY',
          '<moveHandler>', 'pointerXY:(' + X3 + ',' + Y3 + ')', '</moveHandler>',
          '</move>',

          '<moveListener>', 'type:mousemove', 'curPointerClass:mouse',
          '<move>',
          'lastPointerXY:(' + X2 + ',' + Y2 + ')',
          '<moveHandler>', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</moveHandler>',
          '</move>',
          '</moveListener>',

          // Call move()
          '<move>',
          'lastPointerXY:(' + X1 + ',' + Y1 + ')',
          '<moveHandler>', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</moveHandler>',
          '</move>',

          // Call move()
          '<move>', 'NO-pointerXY',
          '<moveHandler>', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</moveHandler>',
          '</move>',

          '<moveListener>', 'type:mousemove', 'curPointerClass:mouse',
          '<move>',
          'lastPointerXY:(' + X3 + ',' + Y3 + ')',
          '<moveHandler>', 'pointerXY:(' + X3 + ',' + Y3 + ')', '</moveHandler>',
          '</move>',
          '</moveListener>',

          // Call move()
          '<move>',
          'lastPointerXY:(' + X3 + ',' + Y3 + ')',
          '<moveHandler>', 'pointerXY:(' + X3 + ',' + Y3 + ')', '</moveHandler>',
          '</move>',

          // Call move()
          '<move>', 'NO-pointerXY',
          '<moveHandler>', 'pointerXY:(' + X3 + ',' + Y3 + ')', '</moveHandler>',
          '</move>',

          // Call move()
          '<move>',
          'lastPointerXY:(' + X1 + ',' + Y1 + ')',
          '<moveHandler>', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</moveHandler>',
          '</move>',

          // Call move()
          '<move>',
          'lastPointerXY:(' + X2 + ',' + Y2 + ')',
          '<moveHandler>', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</moveHandler>',
          '</move>',

          // Call move()
          '<move>', 'NO-pointerXY',
          '<moveHandler>', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</moveHandler>',
          '</move>'
        ]);
      },
      // ====================================
      0, done
    ]);
  });

  it('mouseup', function(done) {
    resetData();
    utils.intervalExec([
      // ====================================
      function() {
        utils.fireMouseEvent(elmTarget, 'mousedown', {clientX: X1, clientY: Y1});
      },
      // ====================================
      function() {
        utils.fireMouseEvent(document, 'mouseup', {clientX: X2, clientY: Y2});
      },
      // ====================================
      function() {
        utils.fireMouseEvent(elmTarget, 'mousedown', {clientX: X1, clientY: Y1});
      },
      // ====================================
      function() {
        utils.fireMouseEvent(document, 'mouseup', {clientX: X3, clientY: Y3});
      },
      // ====================================
      function() {
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
          '</endListener>',

          '<startListener>', 'type:mousedown', 'curPointerClass:null',
          '<startHandler>', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
          'curPointerClass:mouse', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
          '</startListener>',

          '<endListener>', 'type:mouseup', 'curPointerClass:mouse',
          '<end>',
          'lastPointerXY:(' + X3 + ',' + Y3 + ')',
          '<endHandler>', 'pointerXY:(' + X3 + ',' + Y3 + ')', '</endHandler>',
          'curPointerClass:null',
          '</end>',
          '</endListener>'
        ]);
      },
      // ====================================
      0, done
    ]);
  });

  it('mousemove/move(XY) + end()', function(done) {
    resetData();
    utils.intervalExec([
      // ====================================
      function() {
        utils.fireMouseEvent(elmTarget, 'mousedown', {clientX: X1, clientY: Y1});
      },
      // ====================================
      function() {
        pointerEvent.end();
      },
      // ====================================
      function() {
        utils.fireMouseEvent(elmTarget, 'mousedown', {clientX: X1, clientY: Y1});
      },
      // ====================================
      function() {
        utils.fireMouseEvent(document, 'mousemove', {clientX: X2, clientY: Y2});
      },
      // ====================================
      function() {
        pointerEvent.end();
      },
      // ====================================
      function() {
        utils.fireMouseEvent(elmTarget, 'mousedown', {clientX: X1, clientY: Y1});
      },
      // ====================================
      function() {
        utils.fireMouseEvent(document, 'mousemove', {clientX: X3, clientY: Y3});
      },
      // ====================================
      function() {
        // Fire again
        utils.fireMouseEvent(document, 'mousemove', {clientX: X1, clientY: Y1});
      },
      // ====================================
      function() {
        pointerEvent.end();
      },
      // ====================================
      function() {
        utils.fireMouseEvent(elmTarget, 'mousedown', {clientX: X1, clientY: Y1});
      },
      // ====================================
      function() {
        pointerEvent.move({clientX: X2, clientY: Y2});
        pointerEvent.end();
      },
      // ====================================
      function() {
        utils.fireMouseEvent(elmTarget, 'mousedown', {clientX: X1, clientY: Y1});
      },
      // ====================================
      function() {
        pointerEvent.move({clientX: X2, clientY: Y2});
        pointerEvent.move({clientX: X3, clientY: Y3});
        pointerEvent.end();
      },
      // ====================================
      function() {
        expect(traceLog).toEqual([
          '<startListener>', 'type:mousedown', 'curPointerClass:null',
          '<startHandler>', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
          'curPointerClass:mouse', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
          '</startListener>',

          // Call end()
          '<end>', 'NO-pointerXY',
          '<endHandler>', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</endHandler>',
          'curPointerClass:null',
          '</end>',

          '<startListener>', 'type:mousedown', 'curPointerClass:null',
          '<startHandler>', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
          'curPointerClass:mouse', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
          '</startListener>',

          '<moveListener>', 'type:mousemove', 'curPointerClass:mouse',
          '<move>',
          'lastPointerXY:(' + X2 + ',' + Y2 + ')',
          '<moveHandler>', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</moveHandler>',
          '</move>',
          '</moveListener>',

          // Call end()
          '<end>', 'NO-pointerXY',
          '<endHandler>', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</endHandler>',
          'curPointerClass:null',
          '</end>',

          '<startListener>', 'type:mousedown', 'curPointerClass:null',
          '<startHandler>', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
          'curPointerClass:mouse', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
          '</startListener>',

          '<moveListener>', 'type:mousemove', 'curPointerClass:mouse',
          '<move>',
          'lastPointerXY:(' + X3 + ',' + Y3 + ')',
          '<moveHandler>', 'pointerXY:(' + X3 + ',' + Y3 + ')', '</moveHandler>',
          '</move>',
          '</moveListener>',

          // Fire again
          '<moveListener>', 'type:mousemove', 'curPointerClass:mouse',
          '<move>',
          'lastPointerXY:(' + X1 + ',' + Y1 + ')',
          '<moveHandler>', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</moveHandler>',
          '</move>',
          '</moveListener>',

          // Call end()
          '<end>', 'NO-pointerXY',
          '<endHandler>', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</endHandler>',
          'curPointerClass:null',
          '</end>',

          '<startListener>', 'type:mousedown', 'curPointerClass:null',
          '<startHandler>', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
          'curPointerClass:mouse', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
          '</startListener>',

          // Call move()
          '<move>',
          'lastPointerXY:(' + X2 + ',' + Y2 + ')',
          '<moveHandler>', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</moveHandler>',
          '</move>',

          // Call end()
          '<end>', 'NO-pointerXY',
          '<endHandler>', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</endHandler>',
          'curPointerClass:null',
          '</end>',

          '<startListener>', 'type:mousedown', 'curPointerClass:null',
          '<startHandler>', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
          'curPointerClass:mouse', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
          '</startListener>',

          // Call move()
          '<move>',
          'lastPointerXY:(' + X2 + ',' + Y2 + ')',
          '<moveHandler>', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</moveHandler>',
          '</move>',

          // Call move()
          '<move>',
          'lastPointerXY:(' + X3 + ',' + Y3 + ')',
          '<moveHandler>', 'pointerXY:(' + X3 + ',' + Y3 + ')', '</moveHandler>',
          '</move>',

          // Call end()
          '<end>', 'NO-pointerXY',
          '<endHandler>', 'pointerXY:(' + X3 + ',' + Y3 + ')', '</endHandler>',
          'curPointerClass:null',
          '</end>'
        ]);
      },
      // ====================================
      0, done
    ]);
  });

  it('mousemove/move(XY) + end(XY)', function(done) {
    resetData();
    utils.intervalExec([
      // ====================================
      function() {
        utils.fireMouseEvent(elmTarget, 'mousedown', {clientX: X1, clientY: Y1});
      },
      // ====================================
      function() {
        pointerEvent.end({clientX: X3, clientY: Y3});
      },
      // ====================================
      function() {
        utils.fireMouseEvent(elmTarget, 'mousedown', {clientX: X1, clientY: Y1});
      },
      // ====================================
      function() {
        utils.fireMouseEvent(document, 'mousemove', {clientX: X2, clientY: Y2});
      },
      // ====================================
      function() {
        pointerEvent.end({clientX: X3, clientY: Y3});
      },
      // ====================================
      function() {
        utils.fireMouseEvent(elmTarget, 'mousedown', {clientX: X1, clientY: Y1});
      },
      // ====================================
      function() {
        pointerEvent.move({clientX: X2, clientY: Y2});
        pointerEvent.move({clientX: X3, clientY: Y3});
        pointerEvent.end({clientX: X1, clientY: Y1});
      },
      // ====================================
      function() {
        expect(traceLog).toEqual([
          '<startListener>', 'type:mousedown', 'curPointerClass:null',
          '<startHandler>', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
          'curPointerClass:mouse', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
          '</startListener>',

          // Call end()
          '<end>',
          'lastPointerXY:(' + X3 + ',' + Y3 + ')',
          '<endHandler>', 'pointerXY:(' + X3 + ',' + Y3 + ')', '</endHandler>',
          'curPointerClass:null',
          '</end>',

          '<startListener>', 'type:mousedown', 'curPointerClass:null',
          '<startHandler>', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
          'curPointerClass:mouse', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
          '</startListener>',

          '<moveListener>', 'type:mousemove', 'curPointerClass:mouse',
          '<move>',
          'lastPointerXY:(' + X2 + ',' + Y2 + ')',
          '<moveHandler>', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</moveHandler>',
          '</move>',
          '</moveListener>',

          // Call end()
          '<end>',
          'lastPointerXY:(' + X3 + ',' + Y3 + ')',
          '<endHandler>', 'pointerXY:(' + X3 + ',' + Y3 + ')', '</endHandler>',
          'curPointerClass:null',
          '</end>',

          '<startListener>', 'type:mousedown', 'curPointerClass:null',
          '<startHandler>', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</startHandler>',
          'curPointerClass:mouse', 'lastPointerXY:(' + X1 + ',' + Y1 + ')',
          '</startListener>',

          // Call move()
          '<move>',
          'lastPointerXY:(' + X2 + ',' + Y2 + ')',
          '<moveHandler>', 'pointerXY:(' + X2 + ',' + Y2 + ')', '</moveHandler>',
          '</move>',

          // Call move()
          '<move>',
          'lastPointerXY:(' + X3 + ',' + Y3 + ')',
          '<moveHandler>', 'pointerXY:(' + X3 + ',' + Y3 + ')', '</moveHandler>',
          '</move>',

          // Call end()
          '<end>',
          'lastPointerXY:(' + X1 + ',' + Y1 + ')',
          '<endHandler>', 'pointerXY:(' + X1 + ',' + Y1 + ')', '</endHandler>',
          'curPointerClass:null',
          '</end>'
        ]);
      },
      // ====================================
      0, done
    ]);
  });

});
