'use strict';

const VERIFICATION_VALUES = new Set(['정상', '부정', '예외']);
const PLATFORM_VALUES = new Set(['PC', '모바일', 'PC/모바일']);
const ACTION_PATTERN = /(클릭|탭|입력|진입|사용|추가|삭제|변경|선택|표시|이동|열기|닫기|획득|소모)/;
const DUPLICATE_SETUP_PATTERN = /(HUD에서|화면 진입|탭에 진입|Tab을 클릭|화면에서 .* 화면|버튼을 눌러 .* 화면)/;

function normalizeInputRow(row) {
    if (!Array.isArray(row)) return null;
    if (row.length >= 10) {
        return {
            major: row[1] || '',
            minor: row[2] || '',
            sub: row[3] || '',
            verification: row[4] || '',
            step: row[5] || '',
            platform: row[6] || '',
            note: row[9] || '',
        };
    }
    return {
        major: row[0] || '',
        minor: row[1] || '',
        sub: row[2] || '',
        verification: row[3] || '',
        step: row[4] || '',
        platform: row[5] || '',
        note: row[6] || '',
    };
}

function isCategoryActionText(value) {
    if (!value) return false;
    return ACTION_PATTERN.test(value) && /(하면|되는지|후|클릭|입력|선택|사용|추가|삭제|변경)/.test(value);
}

function pushViolation(violations, severity, row, field, message, actual) {
    violations.push({ severity, row, field, message, actual });
}

function validatePreWrite(rows, options = {}) {
    const startRow = options.startRow || 1;
    const violations = [];
    const subToMinor = new Map();

    rows.forEach((row, index) => {
        const item = normalizeInputRow(row);
        const rowNumber = startRow + index;
        if (!item) {
            pushViolation(violations, 'CRITICAL', rowNumber, 'row', '행 데이터가 배열이 아닙니다.', row);
            return;
        }

        if (!VERIFICATION_VALUES.has(item.verification)) {
            pushViolation(violations, 'CRITICAL', rowNumber, 'verification', '검증단계 값이 올바르지 않습니다.', item.verification);
        }
        if (!PLATFORM_VALUES.has(item.platform)) {
            pushViolation(violations, 'CRITICAL', rowNumber, 'platform', '플랫폼 값이 올바르지 않습니다.', item.platform);
        }
        if (!item.step || !item.step.trim()) {
            pushViolation(violations, 'CRITICAL', rowNumber, 'step', '재현스탭(F열)은 비어 있을 수 없습니다.', item.step);
        }
        if (isCategoryActionText(item.major)) {
            pushViolation(violations, 'HIGH', rowNumber, 'major', '대분류에는 동작/행위 표현을 넣지 않아야 합니다.', item.major);
        }
        if (isCategoryActionText(item.minor)) {
            pushViolation(violations, 'HIGH', rowNumber, 'minor', '중분류에는 동작/행위 표현을 넣지 않아야 합니다.', item.minor);
        }
        if (isCategoryActionText(item.sub)) {
            pushViolation(violations, 'HIGH', rowNumber, 'sub', '소분류에는 현재 화면명만 두고 동작 표현을 피해야 합니다.', item.sub);
        }
        if (DUPLICATE_SETUP_PATTERN.test(item.step || '')) {
            pushViolation(violations, 'HIGH', rowNumber, 'step', '재현스탭에 진입 동작이 중복 기재되어 있습니다.', item.step);
        }

        const existingMinor = subToMinor.get(item.sub);
        if (item.sub && existingMinor && existingMinor !== item.minor) {
            pushViolation(violations, 'MEDIUM', rowNumber, 'sub', '같은 소분류가 서로 다른 중분류에 매핑되었습니다.', `${existingMinor} <> ${item.minor}`);
        } else if (item.sub && item.minor) {
            subToMinor.set(item.sub, item.minor);
        }
    });

    return { ok: violations.length === 0, violations };
}

async function validatePostWrite(sheets, spreadsheetId, tabName, startRow, expectedRows) {
    const normalizedExpected = expectedRows.map(normalizeInputRow);
    const endRow = startRow + normalizedExpected.length - 1;
    const range = `'${tabName}'!B${startRow}:G${endRow}`;
    const res = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
        valueRenderOption: 'FORMATTED_VALUE',
    });

    const actualRows = res.data.values || [];
    const violations = [];

    if (actualRows.length !== normalizedExpected.length) {
        pushViolation(violations, 'CRITICAL', startRow, 'rows', '시트 read-back 행 수가 예상과 다릅니다.', `${actualRows.length} !== ${normalizedExpected.length}`);
    }

    normalizedExpected.forEach((expected, index) => {
        const actual = actualRows[index] || [];
        const rowNumber = startRow + index;
        const actualNormalized = {
            major: actual[0] || '',
            minor: actual[1] || '',
            sub: actual[2] || '',
            verification: actual[3] || '',
            step: actual[4] || '',
            platform: actual[5] || '',
        };

        ['major', 'minor', 'sub', 'verification', 'step', 'platform'].forEach(field => {
            if ((expected[field] || '') !== (actualNormalized[field] || '')) {
                pushViolation(
                    violations,
                    'CRITICAL',
                    rowNumber,
                    field,
                    `시트 read-back 값이 예상과 다릅니다. (${field})`,
                    `${actualNormalized[field]} !== ${expected[field]}`
                );
            }
        });

        if (!PLATFORM_VALUES.has(actualNormalized.platform)) {
            pushViolation(violations, 'CRITICAL', rowNumber, 'platform', 'G열 플랫폼 값이 올바르지 않습니다. F→G 꼬임 가능성이 있습니다.', actualNormalized.platform);
        }
    });

    return { ok: violations.length === 0, violations };
}

function formatViolations(violations) {
    return violations.map(v => `[${v.severity}] row ${v.row} ${v.field}: ${v.message}${v.actual ? ` | actual=${v.actual}` : ''}`).join('\n');
}

module.exports = {
    validatePreWrite,
    validatePostWrite,
    formatViolations,
    normalizeInputRow,
};
