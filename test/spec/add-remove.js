describe('add/remove', function() {
  'use strict';

  var pageDone, PointerEvent, utils,
    elmTarget, pointerEvent,
    startHandlerCalled,

    X1 = 1,
    Y1 = 2;

  function resetData() {
    pointerEvent.cancel();
  }

  function startHandler() {
    startHandlerCalled = true;
    return true;
  }

  beforeAll(function(beforeDone) {
    loadPage('spec/common.html', function(pageWindow, pageDocument, pageBody, done) {
      PointerEvent = pageWindow.PointerEvent;
      utils = pageWindow.utils;

      elmTarget = pageDocument.getElementById('parent');
      pointerEvent = new PointerEvent();

      pageDone = done;
      beforeDone();
    });
  });

  afterAll(function() {
    pageDone();
  });

  it('add/remove startHandler', function(done) {
    var handlerId;

    resetData();
    utils.intervalExec([
      // ====================================
      function() {
        startHandlerCalled = false;
        utils.fireMouseEvent(elmTarget, 'mousedown', {clientX: X1, clientY: Y1});
      },
      // ====================================
      function() {
        expect(startHandlerCalled).toBe(false); // Not called

        handlerId = pointerEvent.regStartHandler(startHandler);
        pointerEvent.addStartHandler(elmTarget, handlerId);

        startHandlerCalled = false;
        utils.fireMouseEvent(elmTarget, 'mousedown', {clientX: X1, clientY: Y1});
      },
      // ====================================
      function() {
        expect(startHandlerCalled).toBe(true); // Called

        pointerEvent.removeStartHandler(elmTarget, handlerId);

        startHandlerCalled = false;
        utils.fireMouseEvent(elmTarget, 'mousedown', {clientX: X1, clientY: Y1});
      },
      // ====================================
      function() {
        expect(startHandlerCalled).toBe(false); // Not called
      },
      // ====================================
      done
    ]);
  });

  it('checks handlerId', function() {
    var handlerId = pointerEvent.regStartHandler(startHandler);

    resetData();

    // addStartHandler: invalid handlerId
    expect(function() {
      pointerEvent.addStartHandler(elmTarget, handlerId * 10);
    }).toThrowError('Invalid handlerId: ' + (handlerId * 10));
    // addStartHandler: valid handlerId
    expect(pointerEvent.addStartHandler(elmTarget, handlerId)).toBe(handlerId);

    // removeStartHandler: invalid handlerId
    expect(function() {
      pointerEvent.removeStartHandler(elmTarget, handlerId * 10);
    }).toThrowError('Invalid handlerId: ' + (handlerId * 10));
    // removeStartHandler: valid handlerId
    expect(pointerEvent.removeStartHandler(elmTarget, handlerId)).toBe(handlerId);

    var cntHandlers = Object.keys(pointerEvent.startHandlers).length;
    expect(pointerEvent.startHandlers[handlerId]).toBeDefined();

    // unregStartHandler: invalid handlerId
    pointerEvent.unregStartHandler(handlerId * 10);
    expect(Object.keys(pointerEvent.startHandlers).length).toBe(cntHandlers); // Not changed
    expect(pointerEvent.startHandlers[handlerId]).toBeDefined();

    // unregStartHandler: valid handlerId
    pointerEvent.unregStartHandler(handlerId);
    expect(Object.keys(pointerEvent.startHandlers).length).toBe(cntHandlers - 1);
    expect(pointerEvent.startHandlers[handlerId]).not.toBeDefined();
  });

});
