import { describe, it, expect, vi } from 'vitest';
import { sendQueueNew } from '../../../../src/mixers/controllers/udpOSC/sendQueue.js';

describe('sendQueue', () => {
    it('reports outstanding work while draining', async () => {
        vi.useFakeTimers();

        const sent = [];
        const queue = sendQueueNew(5);
        const canSend = () => true;
        const doSend = (address, ...args) => {
            sent.push({ address, args });
        };

        queue.enqueue(canSend, doSend, '/test', 1);
        queue.enqueue(canSend, doSend, '/test', 2);

        expect(queue.pending).toBe(2);
        expect(queue.outstanding).toBe(3);

        await vi.advanceTimersByTimeAsync(5);
        expect(queue.outstanding).toBeGreaterThanOrEqual(1);

        await vi.advanceTimersByTimeAsync(5);
        await vi.advanceTimersByTimeAsync(5);

        expect(sent).toHaveLength(2);
        expect(queue.pending).toBe(0);
        expect(queue.outstanding).toBe(0);

        vi.useRealTimers();
    });
});
