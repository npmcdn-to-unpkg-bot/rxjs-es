import { Subscriber } from '../Subscriber';
/**
 * Returns an Observable that skips all items emitted by the source Observable as long as a specified condition holds
 * true, but emits all further source items as soon as the condition becomes false.
 *
 * <img src="./img/skipWhile.png" width="100%">
 *
 * @param {Function} predicate - a function to test each item emitted from the source Observable.
 * @returns {Observable<T>} an Observable that begins emitting items emitted by the source Observable when the
 * specified predicate becomes false.
 */
export function skipWhile(predicate) {
    return this.lift(new SkipWhileOperator(predicate));
}
class SkipWhileOperator {
    constructor(predicate) {
        this.predicate = predicate;
    }
    call(subscriber) {
        return new SkipWhileSubscriber(subscriber, this.predicate);
    }
}
class SkipWhileSubscriber extends Subscriber {
    constructor(destination, predicate) {
        super(destination);
        this.predicate = predicate;
        this.skipping = true;
        this.index = 0;
    }
    _next(value) {
        const destination = this.destination;
        if (this.skipping) {
            this.tryCallPredicate(value);
        }
        if (!this.skipping) {
            destination.next(value);
        }
    }
    tryCallPredicate(value) {
        try {
            const result = this.predicate(value, this.index++);
            this.skipping = Boolean(result);
        }
        catch (err) {
            this.destination.error(err);
        }
    }
}
//# sourceMappingURL=skipWhile.js.map