"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = __importDefault(require("node:test"));
const strict_1 = __importDefault(require("node:assert/strict"));
const history_api_1 = require("./history-api");
(0, node_test_1.default)('parseHistoryRequest accepts valid product and date range', () => {
    const result = (0, history_api_1.parseHistoryRequest)(new URLSearchParams({
        goldProductOptions: 'vang-mieng-1l',
        fromDate: '2026-04-01',
        toDate: '2026-04-21',
    }));
    strict_1.default.deepEqual(result, {
        ok: true,
        value: {
            goldProductOptions: 'vang-mieng-1l',
            fromDate: '2026-04-01',
            toDate: '2026-04-21',
        },
    });
});
(0, node_test_1.default)('parseHistoryRequest rejects invalid date range order', () => {
    const result = (0, history_api_1.parseHistoryRequest)(new URLSearchParams({
        goldProductOptions: 'vang-nhan-1l',
        fromDate: '2026-04-21',
        toDate: '2026-04-01',
    }));
    strict_1.default.deepEqual(result, {
        ok: false,
        error: 'fromDate must be less than or equal to toDate.',
    });
});
(0, node_test_1.default)('buildSjcHistoryResponse keeps only vang-mieng-1l rows for Ho Chi Minh', () => {
    const response = (0, history_api_1.buildSjcHistoryResponse)([
        {
            latest_day: '2026-04-20',
            data: {
                success: true,
                latestDate: '10:09 21/04/2026',
                data: [
                    {
                        Id: 1,
                        Buy: '168,500',
                        Sell: '171,500',
                        BuyValue: 168500000,
                        TypeName: 'Vàng SJC 1L, 10L, 1KG',
                        BuyDiffer: null,
                        GroupDate: '/Date(1776729600000)/',
                        SellValue: 171500000,
                        BranchName: 'Hồ Chí Minh',
                        SellDiffer: null,
                        BuyDifferValue: 0,
                        SellDifferValue: 0,
                    },
                    {
                        Id: 2,
                        Buy: '168,000',
                        Sell: '171,000',
                        BuyValue: 168000000,
                        TypeName: 'Vàng SJC 1L, 10L, 1KG',
                        BuyDiffer: null,
                        GroupDate: '/Date(1776729600000)/',
                        SellValue: 171000000,
                        BranchName: 'Hà Nội',
                        SellDiffer: null,
                        BuyDifferValue: 0,
                        SellDifferValue: 0,
                    },
                ],
            },
        },
        {
            latest_day: '2026-04-21',
            data: JSON.stringify({
                success: true,
                latestDate: '11:30 21/04/2026',
                data: [
                    {
                        Id: 3,
                        Buy: '169,000',
                        Sell: '172,000',
                        BuyValue: 169000000,
                        TypeName: 'Vàng nhẫn SJC 99,99% 1 chỉ, 2 chỉ, 5 chỉ',
                        BuyDiffer: null,
                        GroupDate: '/Date(1776816000000)/',
                        SellValue: 172000000,
                        BranchName: 'Hồ Chí Minh',
                        SellDiffer: null,
                        BuyDifferValue: 0,
                        SellDifferValue: 0,
                    },
                    {
                        Id: 4,
                        Buy: '170,000',
                        Sell: '173,000',
                        BuyValue: 170000000,
                        TypeName: 'Vàng SJC 1L, 10L, 1KG',
                        BuyDiffer: null,
                        GroupDate: '/Date(1776816000000)/',
                        SellValue: 173000000,
                        BranchName: 'Hồ Chí Minh',
                        SellDiffer: null,
                        BuyDifferValue: 0,
                        SellDifferValue: 0,
                    },
                ],
            }),
        },
    ], 'vang-mieng-1l');
    strict_1.default.equal(response.success, true);
    strict_1.default.equal(response.latestDate, '10:09 21/04/2026');
    strict_1.default.deepEqual(response.data.map((item) => item.Id), [1, 4]);
});
