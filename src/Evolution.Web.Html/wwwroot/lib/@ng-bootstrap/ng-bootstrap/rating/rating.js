import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, TemplateRef, ContentChild } from '@angular/core';
import { NgbRatingConfig } from './rating-config';
import { toString, getValueInRange } from '../util/util';
var Key;
(function (Key) {
    Key[Key["End"] = 35] = "End";
    Key[Key["Home"] = 36] = "Home";
    Key[Key["ArrowLeft"] = 37] = "ArrowLeft";
    Key[Key["ArrowUp"] = 38] = "ArrowUp";
    Key[Key["ArrowRight"] = 39] = "ArrowRight";
    Key[Key["ArrowDown"] = 40] = "ArrowDown";
})(Key || (Key = {}));
/**
 * Rating directive that will take care of visualising a star rating bar.
 */
export var NgbRating = (function () {
    function NgbRating(config) {
        this.range = [];
        /**
         * An event fired when a user is hovering over a given rating.
         * Event's payload equals to the rating being hovered over.
         */
        this.hover = new EventEmitter();
        /**
         * An event fired when a user stops hovering over a given rating.
         * Event's payload equals to the rating of the last item being hovered over.
         */
        this.leave = new EventEmitter();
        /**
         * An event fired when a user selects a new rating.
         * Event's payload equals to the newly selected rating.
         */
        this.rateChange = new EventEmitter();
        this.max = config.max;
        this.readonly = config.readonly;
    }
    NgbRating.prototype.ariaValueText = function () { return this.rate + " out of " + this.max; };
    NgbRating.prototype.enter = function (value) {
        if (!this.readonly) {
            this.rate = value;
        }
        this.hover.emit(value);
    };
    NgbRating.prototype.handleKeyDown = function (event) {
        if (Key[toString(event.which)]) {
            event.preventDefault();
            switch (event.which) {
                case Key.ArrowDown:
                case Key.ArrowLeft:
                    this.update(this.rate - 1);
                    break;
                case Key.ArrowUp:
                case Key.ArrowRight:
                    this.update(this.rate + 1);
                    break;
                case Key.Home:
                    this.update(0);
                    break;
                case Key.End:
                    this.update(this.max);
                    break;
            }
        }
    };
    NgbRating.prototype.getFillValue = function (index) {
        var diff = this.rate - index;
        if (diff >= 1) {
            return 100;
        }
        if (diff < 1 && diff > 0) {
            return Number.parseInt((diff * 100).toFixed(2));
        }
        return 0;
    };
    NgbRating.prototype.ngOnChanges = function (changes) {
        if (changes['rate']) {
            this._oldRate = this.rate;
        }
    };
    NgbRating.prototype.ngOnInit = function () { this.range = Array.from({ length: this.max }, function (v, k) { return k + 1; }); };
    NgbRating.prototype.reset = function () {
        this.leave.emit(this.rate);
        this.rate = this._oldRate;
    };
    NgbRating.prototype.update = function (value) {
        if (!this.readonly) {
            var newRate = getValueInRange(value, this.max, 0);
            if (this.rate !== newRate) {
                this._oldRate = newRate;
                this.rate = newRate;
                this.rateChange.emit(newRate);
            }
        }
    };
    NgbRating.decorators = [
        { type: Component, args: [{
                    selector: 'ngb-rating',
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    host: { '(keydown)': 'handleKeyDown($event)' },
                    template: "\n    <template #t let-fill=\"fill\">{{ fill === 100 ? '&#9733;' : '&#9734;' }}</template>\n    <span tabindex=\"0\" (mouseleave)=\"reset()\" role=\"slider\" aria-valuemin=\"0\"\n      [attr.aria-valuemax]=\"max\" [attr.aria-valuenow]=\"rate\" [attr.aria-valuetext]=\"ariaValueText()\">\n      <template ngFor [ngForOf]=\"range\" let-index=\"index\">\n        <span class=\"sr-only\">({{ index < rate ? '*' : ' ' }})</span>\n        <span (mouseenter)=\"enter(index + 1)\" (click)=\"update(index + 1)\" \n        [style.cursor]=\"readonly ? 'default' : 'pointer'\">\n          <template [ngTemplateOutlet]=\"starTemplate || t\" [ngOutletContext]=\"{fill: getFillValue(index)}\"></template>\n        </span>\n      </template>\n    </span>\n  "
                },] },
    ];
    /** @nocollapse */
    NgbRating.ctorParameters = [
        { type: NgbRatingConfig, },
    ];
    NgbRating.propDecorators = {
        'max': [{ type: Input },],
        'rate': [{ type: Input },],
        'readonly': [{ type: Input },],
        'starTemplate': [{ type: Input }, { type: ContentChild, args: [TemplateRef,] },],
        'hover': [{ type: Output },],
        'leave': [{ type: Output },],
        'rateChange': [{ type: Output },],
    };
    return NgbRating;
}());
//# sourceMappingURL=rating.js.map