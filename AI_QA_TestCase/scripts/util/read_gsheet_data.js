/**
 * 구글 스프레드시트 데이터 읽기
 *
 * 사용법:
 *   node read_gsheet_data.js <spreadsheetId> <sheetName>
 *   node read_gsheet_data.js <spreadsheetId> <sheetName> --range A1:J10
 *   node read_gsheet_data.js <spreadsheetId> --list           ← 시트 목록만 출력
 *
 * 출력: JSON (stdout)
 *   { sheetName, totalRows, headers, rows: [[...], ...] }
 */
const { google } = require('googleapis');
const { getAuthClient } = require('./google_auth');

function isPlaceholder(value) {
    return !value || /^your_/i.test(value) || /_here$/i.test(value);
}

function colToIndex(col) {
    return col.toUpperCase().split('').reduce((n, ch) => (n * 26) + (ch.charCodeAt(0) - 64), 0) - 1;
}

function projectColumns(values, columns) {
    const indices = columns.map(colToIndex);
    return values.map(row => indices.map(idx => row[idx] || ''));
}

async function listSheets(spreadsheetId) {
    const auth = await getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth });

    const res = await sheets.spreadsheets.get({
        spreadsheetId,
        fields: 'sheets.properties(title,sheetId,gridProperties)',
    });

    const result = (res.data.sheets || []).map(s => ({
        title: s.properties.title,
        sheetId: s.properties.sheetId,
        rowCount: s.properties.gridProperties?.rowCount,
        columnCount: s.properties.gridProperties?.columnCount,
    }));

    process.stdout.write(JSON.stringify(result, null, 2));
}

async function readSheet(spreadsheetId, sheetName, range, columns, minify = false) {
    const auth = await getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth });

    const rangeParam = range ? `'${sheetName}'!${range}` : `'${sheetName}'`;

    const res = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: rangeParam,
        valueRenderOption: 'FORMATTED_VALUE',
    });

    let values = res.data.values || [];
    if (columns && columns.length > 0) {
        values = projectColumns(values, columns);
    }

    const useHeaderRow = !range;
    const headers = useHeaderRow ? (values[0] || []) : [];
    const rows = useHeaderRow ? values.slice(1) : values;

    const result = {
        sheetName,
        range: res.data.range,
        totalRows: rows.length,
        headers,
        rows,
    };

    if (columns && columns.length > 0) {
        result.columnsApplied = columns;
    }

    process.stdout.write(JSON.stringify(result, null, minify ? 0 : 2));
}

// CLI 파싱
if (require.main !== module) return;

const args = process.argv.slice(2);
const spreadsheetId = args[0];

if (!spreadsheetId) {
    process.stderr.write('사용법:\n');
    process.stderr.write('  node read_gsheet_data.js <spreadsheetId> <sheetName>\n');
    process.stderr.write('  node read_gsheet_data.js <spreadsheetId> <sheetName> --range A1:J10\n');
    process.stderr.write('  node read_gsheet_data.js <spreadsheetId> <sheetName> --columns A,B,C --minify\n');
    process.stderr.write('  node read_gsheet_data.js <spreadsheetId> --list\n');
    process.exit(1);
}

if (isPlaceholder(spreadsheetId)) {
    process.stderr.write('유효한 스프레드시트 ID가 필요합니다.\n');
    process.exit(1);
}

if (args[1] === '--list') {
    listSheets(spreadsheetId).catch(err => {
        process.stderr.write('에러: ' + (err.message || err) + '\n');
        process.exit(1);
    });
} else {
    const sheetName = args[1];
    if (!sheetName) {
        process.stderr.write('시트명을 입력하세요.\n');
        process.exit(1);
    }
    const rangeIdx = args.indexOf('--range');
    const range = rangeIdx !== -1 ? args[rangeIdx + 1] : null;
    const columnsIdx = args.indexOf('--columns');
    const columns = columnsIdx !== -1 ? (args[columnsIdx + 1] || '').split(',').map(v => v.trim()).filter(Boolean) : null;
    const minify = args.includes('--minify');

    readSheet(spreadsheetId, sheetName, range, columns, minify).catch(err => {
        process.stderr.write('에러: ' + (err.message || err) + '\n');
        process.exit(1);
    });
}

module.exports = { listSheets, readSheet };
