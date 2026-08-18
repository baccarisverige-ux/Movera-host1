# Phase 9 — Gesture Arbitration

Priority: pinch > vertical photo swipe > horizontal listing swipe > map drag outside carousel.

Implementation uses axis lock, thresholds, pointer capture, cancellation cleanup and no persistent lock after pointerup/cancel/lostcapture. CI stress repeats horizontal, vertical and pinch gestures at least 20 times each, checks map drag outside carousel and orientation change cleanup.
