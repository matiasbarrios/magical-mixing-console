// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useStableIds } from '@magical-mixing/mixers-react/helpers/stableIds.jsx';

describe('useStableIds', () => {
    it('keeps the same array reference when ids are unchanged', () => {
        const { result, rerender } = renderHook(
            ({ ids }) => useStableIds(ids),
            { initialProps: { ids: [1, 2] } },
        );
        const first = result.current;
        rerender({ ids: [1, 2] });
        expect(result.current).toBe(first);
    });

    it('returns a new reference when ids change', () => {
        const { result, rerender } = renderHook(
            ({ ids }) => useStableIds(ids),
            { initialProps: { ids: [1, 2] } },
        );
        const first = result.current;
        rerender({ ids: [1, 3] });
        expect(result.current).not.toBe(first);
        expect(result.current).toEqual([1, 3]);
    });
});
