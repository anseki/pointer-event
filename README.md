# PointerEvent

Event Controller for mouse and touch interfaces

*It is not documented yet.*

## Usage

```js
var pointerEvent = new PointerEvent(),

  // handlerId which is used for adding/removing to element is returned.
  handlerId = pointerEvent.regStartHandler(function(pointerXY) {
    console.log('[START]');
    return true; // If it returns `false`, the starting is canceled.
  });

// When `mousedown` or `touchstart` is fired on this element, the registered start-handler is called.
pointerEvent.addStartHandler(document.getElementById('trigger'), handlerId);

// When `mousemove` or `touchmove` is fired on this element, this move-handler is called.
pointerEvent.addMoveHandler(document, function(pointerXY) {
  console.log('[MOVE]');
});

// When `mouseup`, `touchend` or `touchcancel` is fired on this element, this end-handler is called.
pointerEvent.addEndHandler(document, function() {
  console.log('[END]');
});

document.getElementById('move-button').addEventListener('click', function() {
  pointerEvent.callMoveHandler(); // Call the move-handler.
}, false);

// ============================================================================

// Remove the added start-handler from this element.
pointerEvent.removeStartHandler(document.getElementById('trigger'), handlerId);

// Unregister the registered start-handler.
pointerEvent.unregStartHandler(handlerId);
```
