"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseHistoryRequest = parseHistoryRequest;
exports.buildSjcHistoryResponse = buildSjcHistoryResponse;
const PRODUCT_MAPPINGS = {
    'vang-mieng-1l': {
        typeName: 'Vàng SJC 1L, 10L, 1KG',
        branchName: 'Hồ Chí Minh',
    },
    'vang-nhan-1l': {
        typeName: 'Vàng nhẫn SJC 99,99% 1 chỉ, 2 chỉ, 5 chỉ',
        branchName: 'Hồ Chí Minh',
    },
};
function isValidDateString(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return false;
    }
    const date = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
function parsePayload(raw) {
    return typeof raw === 'string' ? JSON.parse(raw) : raw;
}
function parseHistoryRequest(searchParams) {
    const goldProductOptions = searchParams.get('goldProductOptions');
    const fromDate = searchParams.get('fromDate');
    const toDate = searchParams.get('toDate');
    if (!goldProductOptions || !(goldProductOptions in PRODUCT_MAPPINGS)) {
        return {
            ok: false,
            error: 'goldProductOptions is required and must be one of: vang-mieng-1l, vang-nhan-1l.',
        };
    }
    if (!fromDate || !toDate) {
        return {
            ok: false,
            error: 'fromDate and toDate are required in YYYY-MM-DD format.',
        };
    }
    if (!isValidDateString(fromDate) || !isValidDateString(toDate)) {
        return {
            ok: false,
            error: 'fromDate and toDate must be valid dates in YYYY-MM-DD format.',
        };
    }
    if (fromDate > toDate) {
        return {
            ok: false,
            error: 'fromDate must be less than or equal to toDate.',
        };
    }
    return {
        ok: true,
        value: {
            goldProductOptions: goldProductOptions,
            fromDate,
            toDate,
        },
    };
}
function buildSjcHistoryResponse(rows, goldProductOptions) {
    const mapping = PRODUCT_MAPPINGS[goldProductOptions];
    const data = [];
    let latestDate = null;
    for (const row of rows) {
        const payload = parsePayload(row.data);
        if (!latestDate && payload.latestDate) {
            latestDate = payload.latestDate;
        }
        for (const item of payload.data) {
            if (item.TypeName === mapping.typeName && item.BranchName === mapping.branchName) {
                data.push(item);
            }
        }
    }
    return {
        success: true,
        data,
        latestDate,
    };
}
