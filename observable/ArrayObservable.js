import { Observable } from '../Observable';
import { ScalarObservable } from './ScalarObservable';
import { EmptyObservable } from './EmptyObservable';
import { isScheduler } from '../util/isScheduler';
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
export class ArrayObservable extends Observable {
    constructor(array, scheduler) {
        super();
        this.array = array;
        this.scheduler = scheduler;
        if (!scheduler && array.length === 1) {
            this._isScalar = true;
            this.value = array[0];
        }
    }
    /**
     * @param array
     * @param scheduler
     * @return {Observable}
     * @static true
     * @name fromArray
     * @owner Observable
     */
    static create(array, scheduler) {
        return new ArrayObservable(array, scheduler);
    }
    /**
     * @param array
     * @return {any}
     * @static true
     * @name of
     * @owner Observable
     */
    static of(...array) {
        let scheduler = array[array.length - 1];
        if (isScheduler(scheduler)) {
            array.pop();
        }
        else {
            scheduler = null;
        }
        const len = array.length;
        if (len > 1) {
            return new ArrayObservable(array, scheduler);
        }
        else if (len === 1) {
            return new ScalarObservable(array[0], scheduler);
        }
        else {
            return new EmptyObservable(scheduler);
        }
    }
    static dispatch(state) {
        const { array, index, count, subscriber } = state;
        if (index >= count) {
            subscriber.complete();
            return;
        }
        subscriber.next(array[index]);
        if (subscriber.isUnsubscribed) {
            return;
        }
        state.index = index + 1;
        this.schedule(state);
    }
    _subscribe(subscriber) {
        let index = 0;
        const array = this.array;
        const count = array.length;
        const scheduler = this.scheduler;
        if (scheduler) {
            return scheduler.schedule(ArrayObservable.dispatch, 0, {
                array, index, count, subscriber
            });
        }
        else {
            for (let i = 0; i < count && !subscriber.isUnsubscribed; i++) {
                subscriber.next(array[i]);
            }
            subscriber.complete();
        }
    }
}
//# sourceMappingURL=ArrayObservable.js.map