import { Request, Response, NextFunction } from 'express';
import { getItems, createItem } from '../src/controllers/itemController';
import { items } from '../src/models/items';

describe('Item Controller', () => {
    it('should return an empty array when no items exist', () => {
        // Create mock objects for Request, Response, and NextFunction
        const req = {} as Request;
        const res = {
            json: jest.fn(),
        } as unknown as Response;

        // Ensure that our in-memory store is empty
        items.length = 0;

        // Execute our controller function
        getItems(req, res, jest.fn());

        // Expect that res.json was called with an empty array
        expect(res.json).toHaveBeenCalledWith([]);
    });

    it("should create item with deterministic id", () => {
        items.length = 0;

        const nowSpy = jest.spyOn(Date, "now").mockReturnValue(123);

        const req = { body: { name: "X" } } as Request;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
        const next = jest.fn() as NextFunction;

        createItem(req, res, next);

        expect(res.json).toHaveBeenCalledWith({ id: 123, name: "X" });
        expect(items).toEqual([{ id: 123, name: "X" }]);

        nowSpy.mockRestore();
    });
});